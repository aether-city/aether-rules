// index.html の改訂履歴のいちばん上の記録を読み取り、Discord のウェブフックへ投稿する。
// 前回のプッシュと同じ記録なら投稿しない (FORCE=true のときは必ず投稿する)。
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
const BEFORE = process.env.BEFORE_SHA || "";
const FORCE = process.env.FORCE === "true";
const PAGE_URL = process.env.PAGE_URL || "https://aether-city.github.io/aether-rules/";
const COLOR = 0xa8894f; // ページと同じ控えめな金

// 改訂履歴 (<ol class="chronicle">) のいちばん上の <li> を取り出す
function topEntry(html) {
    const start = html.indexOf('<ol class="chronicle">');
    if (start === -1) return null;
    const re = /<(\/?)li\b[^>]*>/g;
    re.lastIndex = start;
    let depth = 0, from = -1, m;
    while ((m = re.exec(html))) {
        if (!m[1]) {
            if (depth === 0) from = re.lastIndex;
            depth++;
        } else {
            depth--;
            if (depth === 0 && from !== -1) return parse(html.slice(from, m.index));
        }
    }
    return null;
}

function decode(s) {
    return s.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

// <a href="#rule-2">第二条</a> → [第二条](ページのURL#rule-2)、その他のタグは外す
function toText(s) {
    return decode(
        s.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => {
            const url = href.startsWith("#") ? PAGE_URL + href : href;
            return `[${text.replace(/<[^>]+>/g, "").trim()}](${url})`;
        }).replace(/<[^>]+>/g, "")
    ).replace(/\s+/g, " ").trim();
}

function parse(li) {
    const date = (li.match(/<time[^>]*datetime="([^"]+)"/) || [])[1] || "";
    const title = toText((li.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1] || "");
    const items = [...li.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => toText(m[1])).filter(Boolean);
    return { date, title, items };
}

function previousHtml() {
    if (!BEFORE || /^0+$/.test(BEFORE)) return null; // 最初のプッシュ
    try {
        return execFileSync("git", ["show", `${BEFORE}:index.html`], { encoding: "utf8" });
    } catch {
        return null;
    }
}

const now = topEntry(readFileSync("index.html", "utf8"));
if (!now) {
    console.log("改訂履歴が見つからないため、投稿しません。");
    process.exit(0);
}

const before = previousHtml();
const prev = before ? topEntry(before) : null;
if (!FORCE && prev && JSON.stringify(prev) === JSON.stringify(now)) {
    console.log("改訂履歴に変化がないため、投稿しません。");
    process.exit(0);
}

if (!WEBHOOK) {
    console.log("DISCORD_WEBHOOK_URL が設定されていないため、投稿しません。");
    console.log("投稿する予定だった内容:", JSON.stringify(now, null, 2));
    process.exit(0);
}

const body = {
    username: "AETHER CITY RULES",
    embeds: [{
        title: "規則の書が改訂されました",
        url: PAGE_URL + "#chronicle",
        description: [
            `**${now.title}**`,
            "",
            ...now.items.map((i) => "・" + i),
            "",
            `[規則の書を開く](${PAGE_URL})`,
        ].join("\n").slice(0, 4000),
        color: COLOR,
        footer: { text: now.date ? `改訂日 ${now.date.replace(/-/g, ".")}` : "AETHER CITY" },
    }],
};

const res = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
});
if (!res.ok) {
    console.error("Discord への投稿に失敗しました:", res.status, await res.text());
    process.exit(1);
}
console.log("Discord に告知しました:", now.title);
