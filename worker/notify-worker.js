// 禁書庫が開かれたときの Discord 通知の中継 (Cloudflare Workers に置く)
//
//   ルールのページ (src/app.js の NOTIFY_URL) → この Worker → Discord の Webhook
//
//   - Discord の Webhook の URL は Cloudflare の「シークレット」DISCORD_WEBHOOK に入れる (ここには書かない)
//   - 読者の記録は KV (変数名 READERS) に残す。同じ読者・同じ書架の通知は 1 回だけ
//   - 読者の印は、ページがブラウザごとに作る無作為な番号。名前などの個人情報は受け取らない
//   - 同じ回線から短い間に何人分も届いたら、それ以上は通知しない (荒らし対策。回線は伏せた形でだけ 1 日覚える)
//
// 置き方は README の「禁書庫の通知」を参照。

const SHELVES = {
    archive: "禁書庫",
    second: "第二の書架",
    night: "夜の書架",
    final: "最後の書架"
};
const ALLOWED_ORIGINS = ["https://aether-city.github.io"];
const PER_LINE_PER_DAY = 3; // 同じ回線から、1 日に 1 つの書架で通知する読者の数の上限
const COLOR = 0xc9a45c; // 通知の左の線の色 (くすんだ金)

export default {
    async fetch(req, env) {
        const origin = req.headers.get("Origin") || "";
        const allowed = ALLOWED_ORIGINS.includes(origin);
        const cors = {
            "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Vary": "Origin"
        };
        const reply = (status, data) => new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });

        if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
        if (req.method !== "POST" || !allowed) return reply(403, { ok: false });
        if (!env.READERS || !env.DISCORD_WEBHOOK) return reply(500, { ok: false, error: "not configured" });

        let body;
        try { body = JSON.parse(await req.text()); } catch (e) { return reply(400, { ok: false }); }
        const id = String(body.id || "");
        const shelf = String(body.shelf || "");
        const lang = body.lang === "en" ? "en" : "ja";
        if (!/^[0-9a-f]{12}$/.test(id) || !SHELVES[shelf]) return reply(400, { ok: false });

        // 同じ読者・同じ書架は 1 回だけ
        const seenKey = "seen:" + shelf + ":" + id;
        if (await env.READERS.get(seenKey)) return reply(200, { ok: true, dup: true });

        // 同じ回線からの連投を抑える (回線はハッシュにして 1 日だけ覚える)
        const line = await sha256((req.headers.get("CF-Connecting-IP") || "?") + ":" + shelf);
        const lineKey = "line:" + line;
        const lineCount = Number(await env.READERS.get(lineKey)) || 0;
        if (lineCount >= PER_LINE_PER_DAY) return reply(200, { ok: true, limited: true });

        const countKey = "count:" + shelf;
        const n = (Number(await env.READERS.get(countKey)) || 0) + 1;

        const res = await fetch(env.DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "禁書庫の番人",
                embeds: [{
                    title: SHELVES[shelf] + "が開かれた",
                    description: "**" + n + " 人目**の読者です。\n読者の印: `" + id.slice(0, 6) + "`　(" + (lang === "en" ? "英語版" : "日本語版") + ")",
                    color: COLOR,
                    timestamp: new Date().toISOString()
                }]
            })
        });
        if (!res.ok) return reply(502, { ok: false }); // Discord に届かなかったら記録せず、次に開いたときにもう一度送る

        await env.READERS.put(seenKey, "1");
        await env.READERS.put(countKey, String(n));
        await env.READERS.put(lineKey, String(lineCount + 1), { expirationTtl: 86400 });
        return reply(200, { ok: true, n });
    }
};

async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
