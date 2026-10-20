// AETHER CITY RULES の動き (日本語版 index.html と英語版 en/index.html で共通)
// 文章はそれぞれの HTML に書き、ここには画面に出す短い言葉 (TEXT) だけを両方の言語で持つ。

// ===== 設定 =====
// 規則について質問するときに開く Discord の問い合わせチャンネル。
// 例: "https://discord.com/channels/123456789012345678/123456789012345678"
// 空のままなら、質問の文面をコピーするだけになる。
var ASK_URL = "";

// 明るい / 暗い の切り替え (選んだものはこのブラウザに記憶されます)
(function () {
    var root = document.documentElement;
    try {
        var saved = localStorage.getItem("rules-theme");
        if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
    } catch (e) {}

    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var current = root.getAttribute("data-theme")
                || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            var next = current === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            try { localStorage.setItem("rules-theme", next); } catch (e) {}
        });
    });
})();

(function () {
    var LANG = document.documentElement.lang === "en" ? "en" : "ja";
    var TEXT = {
        ja: {
            grades: { "1": "一級禁呪", "2": "二級禁呪", "3": "三級禁呪" },
            sealGlyph: "封",
            sealTitle: "封印の格 (罰則の重さ)",
            wax: "読", waxTitle: "読了",
            stampNew: "新", stampNewTitle: "最近追加された規則",
            stampRev: "改", stampRevTitle: "最近書き換えられた規則",
            copyTitle: "この項目へのリンクをコピー",
            askTitle: "この規則について質問する",
            allJobs: "全職業",
            count: function (n) { return n + " 件"; },
            found: function (n) { return n + " 件見つかりました"; },
            notFound: "見つかりませんでした",
            copied: "リンクをコピーしました",
            copyFailed: "コピーできませんでした",
            askCopied: ASK_URL
                ? "質問の文面をコピーしました。開いたチャンネルに貼り付けてください"
                : "質問の文面をコピーしました。Discord の問い合わせチャンネルに貼り付けてください",
            readReset: "読んだ記録を消しました",
            unread: function (n) { return "まだ読んでいない項目が " + n + " 件あります。"; },
            linkText: function (label, url) { return "【" + label + "】 " + url; },
            askText: function (label, url) {
                return "【規則についての質問】" + label + "\n" + url + "\n\n(ここに質問を書いてください)";
            },
            archiveProgress: function (done, total) { return "読了 " + done + " / " + total; },
            archiveOpened: "禁書庫の封印が解けた",
            // 呪文: name = 呪文の名前 (唱える言葉) / desc = 呪文帳の説明 / toast = 唱えたときの表示 / owl = フクロウのひとこと
            spells: {
                candela: { name: "カンデラ", desc: "手もとに小さな灯りをともす", toast: "灯りがともった (ソムナで消える)", owl: "ほう、夜の書庫にはちょうどいい。" },
                somna: { name: "ソムナ", desc: "灯りを眠らせる", toast: "灯りが消えた", owl: "やっと目が休まる。" },
                solaris: { name: "ソラリス", desc: "まばゆい光を放つ", toast: "まばゆい光があふれた", owl: "目が、目がぁ……。" },
                atramento: { name: "アトラメント", desc: "隠されたインクを浮かび上がらせる", toast: "隠されたインクが浮かび上がる……", owl: "隠されたインクに気づいたか。どの章にもひとつずつあるぞ。" },
                perspica: { name: "ペルスピカ", desc: "余白の書き込みをすべて見通す", toast: "余白の書き込みがあらわになった", owl: "人の落書きを覗くとは、趣味が悪いな。" },
                vocare: { name: "ヴォカーレ", desc: "唱えたあとに続けた言葉の規則を呼び寄せる (例: ヴォカーレ 拘束)", toast: "規則を呼び寄せた", owl: "呼べば来る。書物とは素直なものだ。" },
                aeria: { name: "アエリア", desc: "規則のカードを宙に浮かべる", toast: "カードがふわりと浮かび上がった", owl: "おい、書物を浮かべて遊ぶな。……少しだけなら許す。" },
                scintilla: { name: "スキンティラ", desc: "火の粉を舞い上げる", toast: "火の粉が舞い上がった", owl: "おい、ここは書庫だぞ！" },
                bestia: { name: "ベスティア", desc: "光の獣を呼び出す", toast: "光の牡鹿が駆け抜けていった", owl: "見事な獣だ。呼び手の心が澄んでいる証拠だな。" },
                nebula: { name: "ネブラ", desc: "書庫を霧で包む", toast: "あたりが霧に包まれた", owl: "……どこへ行った？ 前が見えんぞ。" },
                glacies: { name: "グラキエス", desc: "画面の縁を凍りつかせる", toast: "冷気が書庫を包んだ", owl: "さ、寒い……羽が凍る。" },
                magna: { name: "マグナ", desc: "文字を大きくする", toast: "文字が大きくなった (パルヴァで戻る)", owl: "そんなに大きくしなくても読めている。" },
                parva: { name: "パルヴァ", desc: "文字の大きさを元に戻す", toast: "文字の大きさが元に戻った", owl: "うむ、これくらいがちょうどいい。" },
                solve: { name: "ソルヴェ", desc: "かけた魔法をすべてほどく", toast: "すべての魔法が解けた", owl: "散らかしたら片づける。よい心がけだ。" },
                lethe: { name: "レーテ", desc: "読んだ記憶を忘却の川に流す", toast: "読んだ記憶が消え去った……", owl: "……はて、私は何をしていたのだったか。" }
            },
            spellNew: function (n, total) { return "(新しい呪文を覚えた " + n + " / " + total + ")"; },
            spellCount: function (n, total) { return "見つけた呪文 " + n + " / " + total; },
            spellUnknown: "まだ知らない呪文",
            inkFound: function (n) { return "隠されたインクが浮かび上がる……(" + n + " か所)"; },
            summonNone: "呼び寄せる規則が見つからなかった",
            letheWarn: "読んだ記憶をすべて消すつもりか？ 本当なら、もう一度唱えよ",
            owl: {
                greet: "ようこそ、旅の人。分からないことがあれば、私を押してごらん。",
                greetNight: "こんな夜更けに規則の書とは、感心な学徒だ。",
                noResult: "その言葉は、まだこの書に記されていないようだ。",
                idle: "ゆっくり読むといい。急ぐ者ほど、規則を破る。",
                archive: "見事だ。左の書架に、禁書庫の扉が現れたぞ。",
                sealed: "その扉は、すべてを読み終えた者にしか開かない。",
                tips: [
                    "迷ったら、事例集を開くとよい。",
                    "点線の言葉には、意味が隠されている。",
                    "職業を選べば、読むべき規則だけが残る。",
                    "すべて読み終えた者には、ちょっとした褒美がある。",
                    "この街の魔法を知っているなら、検索欄で唱えてみるといい。……おっと、口がすべった。",
                    "カードの右上の吹き出しを押せば、運営に質問できる。",
                    "余白の落書きは、この街の誰かが書いたものだ。",
                    "呪文はひとつではない。カンデラ、アエリア、ヴォカーレ……古い言葉を試してみるといい。",
                    "禁書庫には、見つけた呪文を記す帳面がある。"
                ]
            }
        },
        en: {
            grades: { "1": "Class I", "2": "Class II", "3": "Class III" },
            sealGlyph: "✦",
            sealTitle: "Seal class (severity of the penalty)",
            wax: "✓", waxTitle: "Read",
            stampNew: "N", stampNewTitle: "Recently added",
            stampRev: "R", stampRevTitle: "Recently revised",
            copyTitle: "Copy a link to this item",
            askTitle: "Ask a question about this rule",
            allJobs: "All jobs",
            count: function (n) { return String(n); },
            found: function (n) { return n + (n === 1 ? " result" : " results"); },
            notFound: "No results",
            copied: "Link copied",
            copyFailed: "Could not copy",
            askCopied: ASK_URL
                ? "Question template copied. Paste it into the channel that just opened"
                : "Question template copied. Paste it into the Discord support channel",
            readReset: "Reading record cleared",
            unread: function (n) { return n + (n === 1 ? " item" : " items") + " left to read."; },
            linkText: function (label, url) { return "[" + label + "] " + url; },
            askText: function (label, url) {
                return "[Question about a rule] " + label + "\n" + url + "\n\n(Write your question here)";
            },
            archiveProgress: function (done, total) { return "Read " + done + " / " + total; },
            archiveOpened: "The seal on the Archive has been broken",
            spells: {
                candela: { name: "Candela", desc: "Lights a small flame in your hand", toast: "A light flickers on (cast Somna to put it out)", owl: "Ah, just right for a library at night." },
                somna: { name: "Somna", desc: "Puts the light to sleep", toast: "The light goes out", owl: "Ah, my eyes can rest at last." },
                solaris: { name: "Solaris", desc: "Releases a blinding light", toast: "A blinding light fills the room", owl: "My eyes, my eyes…" },
                atramento: { name: "Atramento", desc: "Reveals hidden ink", toast: "Hidden ink begins to appear…", owl: "So you noticed the hidden ink. There is one in every chapter." },
                perspica: { name: "Perspica", desc: "Sees through to every note in the margins", toast: "The margin notes are revealed", owl: "Peeking at other people's scribbles? Questionable taste." },
                vocare: { name: "Vocare", desc: "Summons the rule named after the spell (e.g. Vocare restrain)", toast: "A rule has been summoned", owl: "Call, and it comes. Books are honest things." },
                aeria: { name: "Aeria", desc: "Makes the rule cards float", toast: "The cards float gently into the air", owl: "Don't play with floating books. …Well, just a little." },
                scintilla: { name: "Scintilla", desc: "Sends sparks flying", toast: "Sparks rise into the air", owl: "Hey! This is a library!" },
                bestia: { name: "Bestia", desc: "Calls a beast of light", toast: "A stag of light gallops past", owl: "A fine beast. Proof of a clear heart." },
                nebula: { name: "Nebula", desc: "Wraps the library in mist", toast: "Mist rolls in", owl: "…Where did you go? I can't see a thing." },
                glacies: { name: "Glacies", desc: "Frosts the edges of the page", toast: "A chill fills the library", owl: "C-cold… my feathers are freezing." },
                magna: { name: "Magna", desc: "Makes the text larger", toast: "The text grows larger (cast Parva to undo)", owl: "No need to make it that big, I can read it." },
                parva: { name: "Parva", desc: "Returns the text to normal size", toast: "The text returns to normal", owl: "Yes, that's just right." },
                solve: { name: "Solve", desc: "Undoes every spell you have cast", toast: "Every spell has been undone", owl: "Clean up after yourself. Good habit." },
                lethe: { name: "Lethe", desc: "Washes your reading memory into the river of oblivion", toast: "Your reading memory fades away…", owl: "…Hm? What was I doing again?" }
            },
            spellNew: function (n, total) { return "(New spell learned " + n + " / " + total + ")"; },
            spellCount: function (n, total) { return "Spells found " + n + " / " + total; },
            spellUnknown: "A spell not yet known",
            inkFound: function (n) { return "Hidden ink begins to appear… (" + n + " places)"; },
            summonNone: "No rule answered the summons",
            letheWarn: "Erase everything you have read? If you mean it, cast it again",
            owl: {
                greet: "Welcome, traveler. If anything puzzles you, give me a tap.",
                greetNight: "Reading the rules at this hour? A diligent student indeed.",
                noResult: "That word is not yet written in this book, it seems.",
                idle: "Take your time. Those who hurry are the ones who break the rules.",
                archive: "Splendid. The door to the Archive has appeared on the shelf to the left.",
                sealed: "That door opens only for those who have read everything.",
                tips: [
                    "When in doubt, open the Precedents.",
                    "Dotted words hide their meanings.",
                    "Choose your job, and only the rules you need will remain.",
                    "Those who read everything receive a small reward.",
                    "If you know the magic of this city, try casting it in the search box… oops, I said too much.",
                    "The speech bubble on each card lets you ask the staff a question.",
                    "The scribbles in the margins were written by someone in this city.",
                    "There is more than one spell. Candela, Aeria, Vocare… try the old tongue.",
                    "The Archive holds a book that records the spells you find."
                ]
            }
        }
    }[LANG];

    var MARK_DAYS = 30; // 「新」「改」の印を付けておく日数
    var READ_CHAPTERS = ["server", "jobs", "character", "cases"]; // 読了を数える章
    var ASK_CHAPTERS = ["server", "jobs", "character", "cases", "faq"]; // 質問ボタンを付ける章
    var READ_MS = 1500; // 画面に映ってから読んだことにするまでの時間 (ミリ秒)

    // このブラウザだけに残す記録 (使えない環境では何もしない)
    function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
    function save(key, value) {
        try {
            if (value == null) localStorage.removeItem(key); else localStorage.setItem(key, value);
        } catch (e) {}
    }

    var input = document.getElementById("q");
    var clearBtn = document.getElementById("q-clear");
    var status = document.getElementById("q-status");
    var empty = document.getElementById("empty");
    var tip = document.getElementById("tip");
    var toast = document.getElementById("toast");
    var chapters = Array.prototype.slice.call(document.querySelectorAll(".chapter"));
    var links = Array.prototype.slice.call(document.querySelectorAll(".chapter-link"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".rule"));
    var current = null; // 最初の表示でもページをめくる動きを出すため null から始める

    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }

    // カードの名前 (コピーや質問の文面に使う)
    function cardLabel(card) {
        var num = card.getAttribute("data-num") || "";
        var title = card.closest("#glossary") ? card.getAttribute("data-term") : card.querySelector("h3").textContent;
        return (num ? num + " " : "") + title;
    }
    function cardUrl(card) {
        return location.href.split("#")[0].split("?")[0] + "#" + card.id;
    }

    // ---------- 最終改訂日 (改訂履歴のいちばん上) ----------
    var latest = document.querySelector(".chronicle time");
    if (latest) document.getElementById("updated").textContent = latest.textContent;

    // ---------- 用語集の言葉を本文に結びつける ----------
    var terms = [];
    document.querySelectorAll("#glossary .rule").forEach(function (g) {
        var def = g.querySelector(".def").textContent;
        (g.getAttribute("data-match") || "").split(/\s+/).filter(Boolean).forEach(function (word) {
            terms.push({ word: word, id: g.id, title: g.getAttribute("data-term"), def: def });
        });
    });
    terms.sort(function (a, b) { return b.word.length - a.word.length; }); // 長い言葉から先に探す

    function linkTerms(card) {
        var used = {};
        terms.forEach(function (t) {
            if (used[t.id]) return; // 同じ用語はカードごとに最初の 1 回だけ
            var walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
                acceptNode: function (n) {
                    return n.parentNode.closest(".term, .article, .jobs, .verdict, .related, .card-tools, .margin-note, h3")
                        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
                }
            });
            var node;
            while ((node = walker.nextNode())) {
                var i = node.nodeValue.indexOf(t.word);
                if (i === -1) continue;
                var after = node.splitText(i);
                after.splitText(t.word.length);
                var a = el("a", "term", t.word);
                a.href = "#" + t.id;
                a.setAttribute("data-tip-title", t.title);
                a.setAttribute("data-tip", t.def);
                after.parentNode.replaceChild(a, after);
                used[t.id] = true;
                break;
            }
        });
    }

    // ---------- カードの準備 (印・封印の格・質問とコピーのボタン・用語) ----------
    var now = Date.now();
    function recent(attr) {
        var t = Date.parse(attr || "");
        return !isNaN(t) && now - t >= 0 && now - t < MARK_DAYS * 86400000;
    }

    var ICON_LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>';
    var ICON_ASK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4z"/><path d="M10 9a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9v.4"/><path d="M12 13.6v.1"/></svg>';

    function toolButton(cls, title, icon) {
        var b = el("button", "tool-btn " + cls);
        b.type = "button";
        b.title = title;
        b.setAttribute("aria-label", title);
        b.innerHTML = icon;
        return b;
    }

    cards.forEach(function (card) {
        var chapterId = card.closest(".chapter").id;
        var tools = el("div", "card-tools");

        if (READ_CHAPTERS.indexOf(chapterId) !== -1) {
            var wax = el("span", "wax", TEXT.wax); wax.title = TEXT.waxTitle; tools.appendChild(wax);
        }

        if (recent(card.getAttribute("data-new"))) {
            var s1 = el("span", "stamp", TEXT.stampNew); s1.title = TEXT.stampNewTitle; tools.appendChild(s1);
        } else if (recent(card.getAttribute("data-rev"))) {
            var s2 = el("span", "stamp", TEXT.stampRev); s2.title = TEXT.stampRevTitle; tools.appendChild(s2);
        }

        var grade = TEXT.grades[card.getAttribute("data-grade")];
        if (grade) {
            var seal = el("a", "seal");
            seal.href = "#penalty";
            seal.title = TEXT.sealTitle;
            seal.appendChild(el("i", null, TEXT.sealGlyph));
            seal.appendChild(document.createTextNode(grade));
            tools.appendChild(seal);
        }

        if (ASK_CHAPTERS.indexOf(chapterId) !== -1) tools.appendChild(toolButton("ask", TEXT.askTitle, ICON_ASK));
        tools.appendChild(toolButton("copy-link", TEXT.copyTitle, ICON_LINK));

        card.insertBefore(tools, card.firstChild);
        if (chapterId !== "glossary") linkTerms(card);
    });

    // ---------- 左側の項目一覧を本文から作る ----------
    chapters.forEach(function (ch) {
        var sub = document.querySelector('[data-sub="' + ch.id + '"]');
        if (!sub) return;
        ch.querySelectorAll(".rule").forEach(function (rule) {
            var li = el("li");
            var a = el("a");
            a.href = "#" + rule.id;
            a.appendChild(el("span", "num", ch.id === "glossary" ? "" : (rule.getAttribute("data-num") || "")));
            a.appendChild(document.createTextNode(ch.id === "glossary" ? rule.getAttribute("data-term") : rule.querySelector("h3").textContent));
            li.appendChild(a);
            sub.appendChild(li);
        });
    });

    // にじみ出る順番
    chapters.forEach(function (ch) {
        ch.querySelectorAll(".chapter-head, .rule, .chronicle > li, .stages li").forEach(function (e, i) {
            e.style.setProperty("--i", Math.min(i, 12));
        });
    });

    // ---------- 検索 ----------
    // ・空白で区切ると「すべてを含む」項目だけを出す
    // ・ひらがな/カタカナ、全角/半角英数、大文字/小文字は区別しない
    // ・URL の ?q=拘束 で検索した状態のページを共有できる

    // 文字数を変えずに表記ゆれをそろえる (ハイライト位置がずれないように 1 文字 → 1 文字だけ)
    function norm(s) {
        return s.replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); })
                .replace(/[！-～]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); })
                .replace(/　/g, " ")
                .toLowerCase();
    }

    // 検索に使う文字 (余白の書き込みは規則ではないので除く)
    function searchText(card) {
        var copy = card.cloneNode(true);
        copy.querySelectorAll(".margin-note, .card-tools").forEach(function (n) { n.remove(); });
        return copy.textContent;
    }

    var data = cards.map(function (card) {
        return {
            el: card,
            chapter: card.closest(".chapter").id,
            html: card.innerHTML,
            text: norm(searchText(card) + " " + (card.getAttribute("data-keywords") || "")),
            jobs: Array.prototype.map.call(card.querySelectorAll(".jobs span"), function (s) { return s.textContent; })
        };
    });

    // ---------- 職業から探す ----------
    var jobSelect = document.getElementById("job-select");
    var jobClear = document.getElementById("job-clear");
    var jobCases = document.getElementById("job-cases");
    var jobCasesList = document.getElementById("job-cases-list");
    var JOB_KEY = "rules-job-" + LANG; // 職業名は言語ごとに違うので別々に覚える

    data.forEach(function (d) {
        if (d.chapter !== "jobs") return;
        d.jobs.forEach(function (name) {
            if (name === TEXT.allJobs) return;
            if (Array.prototype.some.call(jobSelect.options, function (o) { return o.value === name; })) return;
            var o = el("option", null, name);
            o.value = name;
            jobSelect.appendChild(o);
        });
    });
    var savedJob = load(JOB_KEY);
    if (savedJob && Array.prototype.some.call(jobSelect.options, function (o) { return o.value === savedJob; })) {
        jobSelect.value = savedJob;
    }

    // 選んだ職業に当てはまるか (「全職業」のカードはいつも当てはまる)
    function jobMatch(d) {
        var job = jobSelect.value;
        return !job || d.jobs.indexOf(job) !== -1 || d.jobs.indexOf(TEXT.allJobs) !== -1;
    }

    // 選んだ職業の規則にリンクしている事例を並べる
    function renderJobCases() {
        var job = jobSelect.value;
        jobClear.hidden = !job;
        jobCasesList.innerHTML = "";
        if (!job) { jobCases.hidden = true; return; }
        var ids = data.filter(function (d) {
            return d.chapter === "jobs" && d.jobs.indexOf(job) !== -1;
        }).map(function (d) { return "#" + d.el.id; });
        data.forEach(function (d) {
            if (d.chapter !== "cases") return;
            var hit = Array.prototype.some.call(d.el.querySelectorAll(".related a"), function (a) {
                return ids.indexOf(a.getAttribute("href")) !== -1;
            });
            if (!hit) return;
            var verdict = d.el.querySelector(".verdict");
            var a = el("a");
            a.href = "#" + d.el.id;
            if (verdict) {
                var mark = verdict.querySelector("b");
                var label = verdict.textContent.replace(mark ? mark.textContent : "", "").trim();
                a.appendChild(el("span", "v " + (verdict.classList.contains("ng") ? "ng" : "ok"),
                    (mark ? mark.textContent + " " : "") + label));
            }
            a.appendChild(document.createTextNode(d.el.querySelector("h3").textContent));
            var li = el("li");
            li.appendChild(a);
            jobCasesList.appendChild(li);
        });
        jobCases.hidden = !jobCasesList.children.length;
    }

    jobSelect.addEventListener("change", function () {
        save(JOB_KEY, jobSelect.value || null);
        render();
        turnPage(document.getElementById("jobs"));
    });
    jobClear.addEventListener("click", function () {
        jobSelect.value = "";
        save(JOB_KEY, null);
        render();
    });

    function highlight(root, words) {
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                return n.parentNode.closest(".card-tools, .margin-note") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
        });
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(function (node) {
            var raw = node.nodeValue;
            var low = norm(raw);
            var ranges = [];
            words.forEach(function (w) {
                var i = low.indexOf(w);
                while (i !== -1) {
                    ranges.push([i, i + w.length]);
                    i = low.indexOf(w, i + w.length);
                }
            });
            if (!ranges.length) return;
            ranges.sort(function (a, b) { return a[0] - b[0]; });
            var merged = [ranges[0]];
            for (var k = 1; k < ranges.length; k++) {
                var last = merged[merged.length - 1];
                if (ranges[k][0] <= last[1]) last[1] = Math.max(last[1], ranges[k][1]);
                else merged.push(ranges[k]);
            }
            var frag = document.createDocumentFragment();
            var pos = 0;
            merged.forEach(function (r) {
                if (r[0] > pos) frag.appendChild(document.createTextNode(raw.slice(pos, r[0])));
                frag.appendChild(el("mark", null, raw.slice(r[0], r[1])));
                pos = r[1];
            });
            if (pos < raw.length) frag.appendChild(document.createTextNode(raw.slice(pos)));
            node.parentNode.replaceChild(frag, node);
        });
    }

    function turnPage(ch) {
        ch.classList.remove("turn");
        void ch.offsetWidth; // アニメーションをやり直すため
        ch.classList.add("turn");
    }

    function render() {
        var q = input.value;
        var words = norm(q).split(/\s+/).filter(Boolean);
        var searching = words.length > 0;
        clearBtn.hidden = !q;
        hideTip();

        var total = 0;
        var perChapter = {};
        data.forEach(function (d) {
            d.el.innerHTML = d.html;
            var ok = searching
                ? words.every(function (w) { return d.text.indexOf(w) !== -1; })
                : d.chapter !== "jobs" || jobMatch(d); // 検索していないときは職業の絞り込みを使う
            d.el.hidden = !ok;
            if (ok && searching) {
                total++;
                perChapter[d.chapter] = (perChapter[d.chapter] || 0) + 1;
                highlight(d.el, words);
            }
        });

        chapters.forEach(function (ch) {
            // 検索中: 一致した項目がある章をすべて出す / 通常: 選んでいる章だけ出す
            ch.hidden = searching ? !perChapter[ch.id] : ch.id !== current;
            ch.querySelectorAll(".closing").forEach(function (c) { c.hidden = searching; });
            if (searching) ch.classList.remove("turn");
        });

        links.forEach(function (a) {
            var id = a.getAttribute("data-chapter");
            a.classList.toggle("active", !searching && id === current);
            a.querySelector(".count").textContent = searching && perChapter[id] ? TEXT.count(perChapter[id]) : "";
        });
        document.querySelectorAll(".sub").forEach(function (sub) {
            sub.hidden = searching || sub.getAttribute("data-sub") !== current;
        });

        renderJobCases();
        if (searching) jobCases.hidden = true;

        empty.hidden = !searching || total > 0;
        status.textContent = searching ? (total > 0 ? TEXT.found(total) : TEXT.notFound) : "";
        if (searching && total === 0 && q !== lastNoResult) { lastNoResult = q; owlSay(TEXT.owl.noResult); }
        if (!searching) lastNoResult = "";

        // URL に検索語を残す (共有用)
        try {
            var url = new URL(location.href);
            if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
            history.replaceState(null, "", url);
        } catch (e) {}
    }

    // ---------- 章の切り替え (URL の # で決まる) ----------
    // #server などの章名 → その章を開く / #rule-2 などの項目名 → その章を開いて項目まで移動する
    function route(scroll) {
        var id = decodeURIComponent(location.hash.slice(1));
        var target = id && document.getElementById(id);
        var chapter = target && (target.classList.contains("chapter") ? target : target.closest(".chapter"));
        if (!chapter) { target = null; chapter = document.getElementById("start"); }

        // 職業の絞り込みで隠れている規則を開こうとしたときは、絞り込みを外す
        if (target && target.closest("#jobs") && target.classList.contains("rule") && jobSelect.value) {
            var d = data.filter(function (x) { return x.el === target; })[0];
            if (d && !jobMatch(d)) { jobSelect.value = ""; save(JOB_KEY, null); }
        }

        var changed = chapter.id !== current || !!input.value;
        current = chapter.id;
        if (input.value) input.value = ""; // 章や項目を選んだら検索は解除する
        render();
        if (changed) turnPage(chapter);
        if (changed && chapter.id === "archive" && !archiveOpen) owlSay(TEXT.owl.sealed);

        if (!scroll) return;
        if (target && target !== chapter) {
            target.scrollIntoView({ block: "start" });
        } else if (window.matchMedia("(max-width: 900px)").matches) {
            document.getElementById("main").scrollIntoView({ block: "start" });
        } else {
            window.scrollTo(0, 0);
        }
    }

    window.addEventListener("hashchange", function () { route(true); });

    // 同じ章をもう一度押したとき (hashchange が起きない) も先頭へ戻す
    links.forEach(function (a) {
        a.addEventListener("click", function () {
            if (location.hash === a.getAttribute("href")) route(true);
        });
    });

    var timer;
    input.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () { if (!castSpell()) render(); }, 120);
    });
    input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { input.value = ""; render(); }
    });
    clearBtn.addEventListener("click", function () {
        input.value = "";
        render();
        input.focus();
    });

    // 「/」キーで検索欄へ
    document.addEventListener("keydown", function (e) {
        if (e.key === "/" && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });

    // ---------- リンクのコピー・質問 ----------
    var toastTimer;
    function showToast(text) {
        toast.textContent = text;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 3000);
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var ta = el("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
            document.body.removeChild(ta);
        });
    }

    // ---------- 用語の説明 ----------
    var tipFor = null;
    function showTip(term) {
        tipFor = term;
        tip.innerHTML = "";
        tip.appendChild(el("strong", null, term.getAttribute("data-tip-title")));
        tip.appendChild(document.createTextNode(term.getAttribute("data-tip")));
        var r = term.getBoundingClientRect();
        tip.style.left = "0px";
        tip.style.top = "0px";
        tip.classList.add("show");
        var w = tip.offsetWidth, h = tip.offsetHeight;
        var left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8));
        var top = r.bottom + 8;
        if (top + h > window.innerHeight - 8) top = r.top - h - 8;
        tip.style.left = left + "px";
        tip.style.top = top + "px";
    }
    function hideTip() {
        tipFor = null;
        tip.classList.remove("show");
    }

    var hoverable = window.matchMedia("(hover: hover)").matches;
    document.addEventListener("mouseover", function (e) {
        if (!hoverable) return;
        var t = e.target.closest(".term");
        if (t) showTip(t); else if (tipFor) hideTip();
    });
    document.addEventListener("focusin", function (e) {
        var t = e.target.closest(".term");
        if (t) showTip(t);
    });
    document.addEventListener("focusout", function (e) {
        if (e.target.closest(".term")) hideTip();
    });
    window.addEventListener("scroll", function () { if (tipFor) hideTip(); }, { passive: true });

    document.addEventListener("click", function (e) {
        // リンクのコピー
        var copyBtn = e.target.closest(".copy-link");
        if (copyBtn) {
            var card = copyBtn.closest(".rule");
            copyText(TEXT.linkText(cardLabel(card), cardUrl(card))).then(
                function () { showToast(TEXT.copied); },
                function () { showToast(TEXT.copyFailed); }
            );
            return;
        }

        // 規則について質問する: 文面をコピーして、問い合わせチャンネルを開く
        var askBtn = e.target.closest(".ask");
        if (askBtn) {
            var c = askBtn.closest(".rule");
            // ポップアップを止められないよう、クリックの中ですぐに開く
            if (ASK_URL) window.open(ASK_URL, "_blank", "noopener");
            copyText(TEXT.askText(cardLabel(c), cardUrl(c))).then(
                function () { showToast(TEXT.askCopied); },
                function () { showToast(TEXT.copyFailed); }
            );
            return;
        }

        // 言語の切り替え: 今見ている場所 (#…) を引き継ぐ
        var lang = e.target.closest(".lang-switch");
        if (lang) {
            e.preventDefault();
            location.href = lang.getAttribute("href") + location.hash;
            return;
        }

        // スマホでは用語を押すと説明を出す (もう一度押すと用語集へ移動)
        var term = e.target.closest(".term");
        if (term && !hoverable && tipFor !== term) {
            e.preventDefault();
            showTip(term);
            return;
        }
        if (!term && tipFor) hideTip();
    });

    // ---------- 司書のフクロウ ----------
    // 自動でしゃべるのは OWL_COOLDOWN ミリ秒に 1 回まで (押したときはいつでも答える)
    var OWL_COOLDOWN = 12000;
    var OWL_SHOW_MS = 6000;
    var owlBubble = document.getElementById("owl-say");
    var owlBtn = document.getElementById("owl-btn");
    var owlTimer, owlLast = 0, lastNoResult = "", lastTip = -1;

    function owlSay(text, force) {
        if (!owlBubble) return;
        var t = Date.now();
        if (!force && t - owlLast < OWL_COOLDOWN) return;
        owlLast = t;
        owlBubble.textContent = text;
        owlBubble.classList.add("show");
        clearTimeout(owlTimer);
        owlTimer = setTimeout(function () { owlBubble.classList.remove("show"); }, OWL_SHOW_MS);
    }

    if (owlBtn) {
        owlBtn.addEventListener("click", function () {
            var tips = TEXT.owl.tips;
            var i;
            do { i = Math.floor(Math.random() * tips.length); } while (tips.length > 1 && i === lastTip);
            lastTip = i;
            owlSay(tips[i], true);
        });
    }

    // 初めて来た人にあいさつ (このブラウザで 1 回だけ)
    if (!load("rules-owl-greeted")) {
        setTimeout(function () {
            var h = new Date().getHours();
            owlSay(h >= 22 || h < 4 ? TEXT.owl.greetNight : TEXT.owl.greet, true);
            save("rules-owl-greeted", "1");
        }, 3500);
    }

    // 同じ章をしばらくじっと読んでいたら、章ごとに 1 回だけひとこと
    var idleTimer, idleSaid = {};
    function resetIdle() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
            if (current && !idleSaid[current] && !input.value && READ_CHAPTERS.indexOf(current) !== -1) {
                idleSaid[current] = true;
                owlSay(TEXT.owl.idle);
            }
        }, 45000);
    }
    ["scroll", "keydown", "click"].forEach(function (ev) {
        window.addEventListener(ev, resetIdle, { passive: true });
    });
    resetIdle();

    // ---------- 呪文 (検索欄で唱える隠しコマンド) ----------
    // カタカナ (ひらがなでも可) か英字で唱える。大文字/小文字・空白や「・」の有無はどれでも反応する。
    // 呪文を増やすときは、ここに 1 行足し、TEXT の spells に名前と文を足す。
    var SPELLS = [
        { id: "candela", words: ["かんでら", "candela"] },
        { id: "somna", words: ["そむな", "somna"] },
        { id: "solaris", words: ["そらりす", "solaris"] },
        { id: "atramento", words: ["あとらめんと", "atramento"] },
        { id: "perspica", words: ["ぺるすぴか", "perspica"] },
        { id: "vocare", prefix: ["ゔぉかーれ", "ぼかーれ", "vocare"] },
        { id: "aeria", words: ["あえりあ", "aeria"] },
        { id: "scintilla", words: ["すきんてぃら", "scintilla"] },
        { id: "bestia", words: ["べすてぃあ", "bestia"] },
        { id: "nebula", words: ["ねぶら", "nebula"] },
        { id: "glacies", words: ["ぐらきえす", "glacies"] },
        { id: "magna", words: ["まぐな", "magna"] },
        { id: "parva", words: ["ぱるゔぁ", "ぱるば", "parva"] },
        { id: "solve", words: ["そるゔぇ", "そるべ", "solve"] },
        { id: "lethe", words: ["れーて", "lethe"] }
    ];

    var root = document.documentElement;
    var candle = document.getElementById("candle");
    var known = {};
    try { (JSON.parse(load("rules-spells") || "[]") || []).forEach(function (id) { known[id] = true; }); } catch (e) {}
    var letheAt = 0;

    // 今ある呪文のうち、見つけた数 (昔の呪文の記録は数えない)
    function knownCount() { return SPELLS.filter(function (sp) { return known[sp.id]; }).length; }

    function compact(s) { return norm(s).replace(/[\s・･\-_.,、。!！]/g, ""); }

    // 唱えた言葉から呪文を探す (召喚は後ろに続く言葉も返す)
    function findSpell(raw) {
        var v = compact(raw);
        if (!v) return null;
        for (var i = 0; i < SPELLS.length; i++) {
            var sp = SPELLS[i];
            if (sp.words && sp.words.indexOf(v) !== -1) return { id: sp.id, arg: "" };
            if (sp.prefix) {
                for (var k = 0; k < sp.prefix.length; k++) {
                    if (v.indexOf(sp.prefix[k]) === 0) {
                        // 引数は元の入力から呪文の部分を取り除いたもの
                        var rest = raw.trim().replace(/^\S+\s*/, "");
                        if (compact(raw.trim().split(/\s+/)[0]) !== sp.prefix[k]) rest = v.slice(sp.prefix[k].length);
                        return { id: sp.id, arg: rest.trim() };
                    }
                }
            }
        }
        return null;
    }

    function castSpell() {
        var found = findSpell(input.value);
        if (!found) return false;
        input.value = "";
        render();
        input.blur();

        var info = TEXT.spells[found.id];
        var toastText = info.toast;
        var ok = EFFECTS[found.id](found.arg);
        if (ok === false) return true; // 効果が出なかった (召喚の空振り・忘却の確認)
        if (typeof ok === "string") toastText = ok;

        var line = info.owl;
        if (!known[found.id]) {
            known[found.id] = true;
            save("rules-spells", JSON.stringify(Object.keys(known)));
            line += " " + TEXT.spellNew(knownCount(), SPELLS.length);
            renderSpellbook();
        }
        showToast(toastText);
        owlSay(line, true);
        return true;
    }

    // 透明インクを浮かび上がらせる (1 文字ずつにじみ出るように文字を分ける)
    function revealInk(scroll) {
        var inks = document.querySelectorAll(".ink");
        inks.forEach(function (n) {
            if (!n.getAttribute("data-split")) {
                var text = n.textContent;
                var i = 0;
                n.textContent = "";
                // 英語の単語が途中で折り返されないよう、単語ごとにまとめてから 1 文字ずつに分ける
                text.split(/(\s+)/).forEach(function (part) {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { n.appendChild(document.createTextNode(part)); return; }
                    var word = el("span", "w");
                    Array.from(part).forEach(function (ch) {
                        var c = el("span", "c", ch);
                        c.style.setProperty("--c", i++);
                        word.appendChild(c);
                    });
                    n.appendChild(word);
                });
                n.setAttribute("data-split", "1");
            }
            n.classList.add("revealed");
            n.removeAttribute("aria-hidden");
        });
        try { sessionStorage.setItem("rules-ink", "1"); } catch (e) {}
        if (scroll) {
            var here = document.querySelector(".chapter:not([hidden]) .ink");
            if (here) here.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return inks.length;
    }
    function hideInk() {
        document.querySelectorAll(".ink").forEach(function (n) {
            n.classList.remove("revealed");
            n.setAttribute("aria-hidden", "true");
        });
        try { sessionStorage.removeItem("rules-ink"); } catch (e) {}
    }

    var floatTimer, frostTimer;
    var STAG = '<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        + '<path d="M30 50 C40 42 70 42 82 48 C86 50 88 54 86 58 C80 62 45 62 34 58 C28 56 27 52 30 50 Z"/>'
        + '<path d="M82 48 L92 30 L100 28 L104 32 L96 36 L88 50"/>'
        + '<path d="M95 28 L92 16 L88 10 M92 16 L97 9 M92 21 L86 19 M99 27 L104 15 L102 7 M104 15 L110 10 M103 19 L109 20"/>'
        + '<path d="M78 58 L84 72 L88 84 M72 59 L70 74 L74 84 M40 58 L32 71 L30 84 M46 59 L48 73 L44 84"/>'
        + '<path d="M30 50 L23 45"/><circle cx="98.5" cy="31" r="0.9" fill="currentColor" stroke="none"/>'
        + '</svg>';

    var EFFECTS = {
        candela: function () { candle.classList.add("lit"); },
        solaris: function () {
            candle.classList.remove("lit");
            var f = el("div", "flash");
            document.body.appendChild(f);
            setTimeout(function () { f.remove(); }, 1900);
        },
        somna: function () { candle.classList.remove("lit"); },
        atramento: function () { return TEXT.inkFound(revealInk(true)); },
        perspica: function () { root.classList.add("reveal-notes"); },
        vocare: function (arg) {
            var pool = data.filter(function (d) { return d.chapter !== "glossary" || arg; });
            var target;
            if (arg) {
                var w = norm(arg);
                target = pool.filter(function (d) { return d.text.indexOf(w) !== -1; })[0];
            } else {
                target = pool[Math.floor(Math.random() * pool.length)];
            }
            if (!target) { showToast(TEXT.summonNone); return false; }
            if (location.hash === "#" + target.el.id) route(true); else location.hash = "#" + target.el.id;
            setTimeout(function () {
                target.el.classList.remove("summoned");
                void target.el.offsetWidth;
                target.el.classList.add("summoned");
            }, 30);
        },
        nebula: function () {
            var m = el("div", "mist");
            document.body.appendChild(m);
            m.addEventListener("animationend", function () { m.remove(); });
        },
        glacies: function () {
            root.classList.add("frozen");
            clearTimeout(frostTimer);
            frostTimer = setTimeout(function () { root.classList.remove("frozen"); }, 7000);
        },
        aeria: function () {
            cards.forEach(function (c) { c.style.setProperty("--tilt", (Math.random() * 1.2 - 0.6).toFixed(2) + "deg"); });
            root.classList.add("levitate");
            clearTimeout(floatTimer);
            floatTimer = setTimeout(function () { root.classList.remove("levitate"); }, 12000);
        },
        scintilla: function () {
            for (var i = 0; i < 30; i++) {
                (function (delay) {
                    setTimeout(function () {
                        var e = el("span", "ember");
                        e.style.left = (Math.random() * 100).toFixed(1) + "vw";
                        e.style.setProperty("--d", (3.5 + Math.random() * 3).toFixed(1) + "s");
                        e.style.setProperty("--dx", (Math.random() * 120 - 60).toFixed(0) + "px");
                        document.body.appendChild(e);
                        e.addEventListener("animationend", function () { e.remove(); });
                    }, delay);
                })(i * 90);
            }
        },
        bestia: function () {
            var p = el("div", "beast");
            p.innerHTML = STAG;
            document.body.appendChild(p);
            p.addEventListener("animationend", function (ev) { if (ev.target === p) p.remove(); });
        },
        magna: function () { root.style.fontSize = "112.5%"; },
        parva: function () { root.style.fontSize = ""; },
        solve: function () {
            candle.classList.remove("lit");
            root.classList.remove("reveal-notes", "levitate", "frozen");
            document.querySelectorAll(".mist").forEach(function (m) { m.remove(); });
            root.style.fontSize = "";
            hideInk();
        },
        lethe: function () {
            // 忘却: 大事な記録を消すので、10 秒以内にもう一度唱えたときだけ実行する
            var t = Date.now();
            if (t - letheAt > 10000) {
                letheAt = t;
                showToast(TEXT.letheWarn);
                owlSay(TEXT.letheWarn, true);
                return false;
            }
            letheAt = 0;
            root.classList.add("forgetting");
            setTimeout(function () { root.classList.remove("forgetting"); }, 1700);
            readSet = {};
            save("rules-read", null);
            updateProgress();
        }
    };

    // 呪文帳 (禁書庫の中): 見つけた呪文は名前と効果、まだのものは伏せる
    var spellbookList = document.getElementById("spellbook-list");
    var spellbookCount = document.getElementById("spellbook-count");
    function renderSpellbook() {
        if (!spellbookList) return;
        spellbookList.innerHTML = "";
        SPELLS.forEach(function (sp) {
            var li = el("li", known[sp.id] ? "" : "unknown");
            var info = TEXT.spells[sp.id];
            li.appendChild(el("b", null, known[sp.id] ? info.name : "？？？"));
            li.appendChild(document.createTextNode(known[sp.id] ? info.desc : TEXT.spellUnknown));
            spellbookList.appendChild(li);
        });
        spellbookCount.textContent = TEXT.spellCount(knownCount(), SPELLS.length);
    }
    renderSpellbook();

    // このタブで一度「アトラメント」を唱えていたら、インクは出したままにする
    try { if (sessionStorage.getItem("rules-ink")) revealInk(false); } catch (e) {}

    // ロウソクの灯りはマウス (スマホでは指) の位置についてくる
    var candleFrame = 0;
    function moveCandle(x, y) {
        if (!candle.classList.contains("lit") || candleFrame) return;
        candleFrame = requestAnimationFrame(function () {
            candleFrame = 0;
            candle.style.setProperty("--x", x + "px");
            candle.style.setProperty("--y", y + "px");
        });
    }
    window.addEventListener("mousemove", function (e) { moveCandle(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener("touchmove", function (e) {
        if (e.touches[0]) moveCandle(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // ---------- 時刻で変わる空 ----------
    // 5-7 時: 明け方 / 7-16 時: 昼 / 16-19 時: 夕方 / 19-5 時: 夜 (見ている人の時計で決まる)
    var sky = document.getElementById("sky");
    if (sky) {
        for (var s = 0; s < 42; s++) {
            var star = el("span", "star");
            star.style.left = (Math.random() * 100).toFixed(2) + "%";
            star.style.top = (Math.random() * 70).toFixed(2) + "%";
            star.style.setProperty("--d", (4 + Math.random() * 6).toFixed(1) + "s");
            star.style.setProperty("--delay", (-Math.random() * 10).toFixed(1) + "s");
            star.style.setProperty("--o", (0.2 + Math.random() * 0.4).toFixed(2));
            if (Math.random() < 0.15) { star.style.width = star.style.height = "3px"; }
            sky.appendChild(star);
        }
    }
    function updateSky() {
        var h = new Date().getHours();
        var time = h >= 5 && h < 7 ? "dawn" : h >= 7 && h < 16 ? "day" : h >= 16 && h < 19 ? "dusk" : "night";
        document.documentElement.setAttribute("data-time", time);
    }
    updateSky();
    setInterval(updateSky, 10 * 60 * 1000);

    // ---------- 読了の印 ----------
    // 画面に半分以上映った状態が READ_MS 続いたカードを「読んだ」ことにして、このブラウザに記録する
    // (カードの id は日本語版と英語版で同じなので、記録も共通)
    var readable = data.filter(function (d) { return READ_CHAPTERS.indexOf(d.chapter) !== -1; });
    var readSet = {};
    try { (JSON.parse(load("rules-read") || "[]") || []).forEach(function (id) { readSet[id] = true; }); } catch (e) {}

    var progressText = document.getElementById("progress-text");
    var progressBar = document.getElementById("progress-bar");
    var resume = document.getElementById("resume");
    var resumeText = document.getElementById("resume-text");
    var resumeLink = document.getElementById("resume-link");
    var archiveNav = document.getElementById("archive-nav");
    var archiveSealed = document.getElementById("archive-sealed");
    var archiveContent = document.getElementById("archive-content");
    var spellbook = document.getElementById("spellbook");
    var archiveProgress = document.getElementById("archive-progress");
    var archiveOpen = false;
    var progressReady = false; // 最初の表示では「開いた瞬間」の演出をしない

    function updateProgress() {
        var done = 0;
        readable.forEach(function (d) {
            var r = !!readSet[d.el.id];
            d.el.classList.toggle("read", r);
            if (r) done++;
        });
        progressText.textContent = done + " / " + readable.length;
        progressBar.style.width = (readable.length ? done / readable.length * 100 : 0) + "%";

        // 章ごとに全部読んだら「済」
        links.forEach(function (a) {
            var id = a.getAttribute("data-chapter");
            if (READ_CHAPTERS.indexOf(id) === -1) return;
            var list = readable.filter(function (d) { return d.chapter === id; });
            a.classList.toggle("done", list.length > 0 && list.every(function (d) { return readSet[d.el.id]; }));
        });

        // 「はじめての方へ」の続きから読む (読み始めていて、まだ残りがあるときだけ)
        var next = readable.filter(function (d) { return !readSet[d.el.id]; })[0];
        resume.hidden = !(done > 0 && next);
        if (next) {
            resumeText.textContent = TEXT.unread(readable.length - done);
            resumeLink.href = "#" + next.el.id;
        }

        // 禁書庫: すべて読み終えると左に扉が現れ、中身が読めるようになる
        var open = readable.length > 0 && done === readable.length;
        var opening = open && !archiveOpen && progressReady; // 読んでいる最中に開いた瞬間
        archiveOpen = open;
        archiveNav.hidden = !open;
        archiveSealed.hidden = open;
        archiveContent.hidden = !open;
        if (spellbook) spellbook.hidden = !open;
        archiveProgress.textContent = TEXT.archiveProgress(done, readable.length);
        if (opening) {
            var link = archiveNav.querySelector(".chapter-link");
            link.classList.remove("appear");
            void link.offsetWidth;
            link.classList.add("appear");
            showToast(TEXT.archiveOpened);
            owlSay(TEXT.owl.archive, true);
        }
    }

    function markRead(card) {
        if (readSet[card.id]) return;
        readSet[card.id] = true;
        save("rules-read", JSON.stringify(Object.keys(readSet)));
        updateProgress();
    }

    document.getElementById("progress-reset").addEventListener("click", function () {
        readSet = {};
        save("rules-read", null);
        updateProgress();
        showToast(TEXT.readReset);
    });

    if ("IntersectionObserver" in window) {
        var timers = {};
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                var id = en.target.id;
                if (en.isIntersecting && !readSet[id]) {
                    if (!timers[id]) timers[id] = setTimeout(function () { delete timers[id]; markRead(en.target); }, READ_MS);
                } else if (timers[id]) {
                    clearTimeout(timers[id]);
                    delete timers[id];
                }
            });
        }, { threshold: 0.5 });
        readable.forEach(function (d) { io.observe(d.el); });
    }
    updateProgress();
    progressReady = true;

    // ---------- 最初の表示 ----------
    // (route が URL の ?q= を消してしまうので、先に読んでおく)
    var initial = new URLSearchParams(location.search).get("q");
    route(!!location.hash && !initial);
    if (initial) { input.value = initial; render(); }
})();
