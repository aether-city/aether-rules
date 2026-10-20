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
                    return n.parentNode.closest(".term, .article, .jobs, .verdict, .related, .card-tools, h3")
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

    var data = cards.map(function (card) {
        return {
            el: card,
            chapter: card.closest(".chapter").id,
            html: card.innerHTML,
            text: norm(card.textContent + " " + (card.getAttribute("data-keywords") || "")),
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
                return n.parentNode.closest(".card-tools") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
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
        timer = setTimeout(render, 120);
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

    // ---------- 最初の表示 ----------
    // (route が URL の ?q= を消してしまうので、先に読んでおく)
    var initial = new URLSearchParams(location.search).get("q");
    route(!!location.hash && !initial);
    if (initial) { input.value = initial; render(); }
})();
