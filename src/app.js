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
                nebula: { name: "ネブラ", desc: "書庫を霧で包む", toast: "あたりが霧に包まれた", owl: "……どこへ行った？ 前が見えんぞ。" },
                glacies: { name: "グラキエス", desc: "画面の縁を凍りつかせる", toast: "冷気が書庫を包んだ", owl: "さ、寒い……羽が凍る。" },
                magna: { name: "マグナ", desc: "文字を大きくする", toast: "文字が大きくなった (パルヴァで戻る)", owl: "そんなに大きくしなくても読めている。" },
                parva: { name: "パルヴァ", desc: "文字の大きさを元に戻す", toast: "文字の大きさが元に戻った", owl: "うむ、これくらいがちょうどいい。" },
                solve: { name: "ソルヴェ", desc: "かけた魔法をすべてほどく", toast: "すべての魔法が解けた", owl: "散らかしたら片づける。よい心がけだ。" },
                lethe: { name: "レーテ", desc: "読んだ記憶を忘却の川に流す", toast: "読んだ記憶が消え去った……", owl: "……はて、私は何をしていたのだったか。" },
                virga: { name: "ヴィルガ", desc: "指先を杖に変え、金の粉をこぼす (もう一度唱えると戻る)", toast: "指先が杖になった (もう一度唱えると戻る)", toastOff: "杖をしまった", owl: "ほう、なかなか様になっているぞ。" },
                obscura: { name: "オブスクーラ", desc: "魔法を人の目から覆い隠し、普通の書に戻す (10 秒以内にもう一度唱えると発動)", toast: "魔法が覆い隠されていく……", owl: "人の目から隠れるのも、我らの務めだ。……また会おう。" }
            },
            obscuraWarn: "魔法を覆い隠し、普通の書に戻るつもりか？ 本当なら、もう一度唱えよ",
            // 覚醒して魔法モードで開いたときの告知
            awaken: { eyebrow: "Awakening", title: "エーテルが目を覚ました", sub: "この書の、本当の姿が見えるようになった。" },
            // 最後の書架
            final: {
                nav: "最後の書架",
                title: "最後の書架",
                lead: "炎の日から閉ざされていた書架。司書が最後まで隠し通した、一冊の物語。",
                announceTitle: "最後の書架が開いた",
                announceSub: "炎の日から、ずっと閉ざされていた書架。",
                owlOpen: "……それは、私がずっと隠してきた物語だ。どうか、最後まで読んでやってくれ。",
                askTooEarly: "……その名を、どこで聞いた？ 今はまだ、話せぬ。",
                askShelf: "その名の続きは、第二の書架の封印を解いてからだ。",
                askSpells: "すべての呪文を知る者にしか、話せぬことがある。",
                askRiddle: "……空の都の名を、ついに口にしたか。ならば教えよう。\n月が天にある刻 (零時から四時)、手もとの灯と杖の灯、二つの灯をともし、禁書庫の余白に渦を描け。そこに、最後の扉がある。",
                notHere: "扉は禁書庫の中だ。",
                notTime: "まだ月の刻ではない。",
                noLight: "灯が足りぬ。手もとの灯と、杖の灯だ。"
            },
            admin: { badge: "管理者表示 (このタブのみ)", exit: "終了", wrong: "合言葉が違います" },
            book: { prev: "前のページ", next: "次のページ" },
            // ルーン: 本文の余白にマウスで描くと唱えられる呪文
            runes: { candela: "円", scintilla: "三角", glacies: "ジグザグ", aeria: "下から上へまっすぐ" },
            runeLabel: function (shape) { return "ルーン: " + shape; },
            mana: { empty: "魔力が足りない。少し休もう", label: function (n, max) { return Math.floor(n) + " / " + max; } },
            keys: {
                eyebrow: "Hidden Key",
                found: function (n, total) { return "隠された鍵 " + n + " / " + total; },
                foundSub: "残りの鍵も、この書のどこかに眠っている。",
                allTitle: "三つの鍵がそろった",
                allSub: "だが、書架の扉にはまだ最後の封印が残っている。禁書庫の中で、封印の印を描け。",
                allSubSealed: "だが、鍵を使う扉はまだ見えない。……まずは禁書庫の封印を解こう。",
                sealTitle: "第二の書架が開いた",
                sealSub: "星の印が封印を砕いた。禁書庫のさらに奥に、もうひとつの書架が現れた。",
                go: "第二の書架へ"
            },
            passcode: {
                eyebrow: "Passphrase",
                title: "合言葉が受け入れられた",
                sub: "眠っていた三つの鍵が目を覚ました。\n言葉の書は灯りを、裁きの書は霧を、時の書は凍てつく息を待っている。",
                again: "その合言葉は、もう届いている。"
            },
            ask: {
                placeholder: "フクロウに尋ねる (例: 配信していい？)",
                send: "尋ねる",
                tip: "ひとこと",
                close: "閉じる",
                intro: "それなら、ここを読むといい。",
                none: "ふむ、その答えはこの書には記されていないようだ。カードの吹き出しから運営に聞いてみるといい。"
            },
            spellNew: function (n, total) { return "(新しい呪文を覚えた " + n + " / " + total + ")"; },
            spellCount: function (n, total) { return "見つけた呪文 " + n + " / " + total; },
            spellUnknown: "まだ知らない呪文",
            // 呪文帳の「？？？」に添える謎かけ (呪文の名は、古い言葉 (ラテン語) の意味から来ている)
            spellRiddles: {
                candela: "古い言葉で「ろうそく」。闇に小さな灯をともす。",
                somna: "古い言葉で「眠り」。灯りを寝かしつける。",
                solaris: "古い言葉で「太陽の」。目を焼くほどの光を放つ。",
                atramento: "古い言葉で「墨」。隠された文字を呼び覚ます。",
                perspica: "古い言葉で「見通す」。余白に潜む声をすべて暴く。",
                vocare: "古い言葉で「呼ぶ」。あとに続けた言葉の規則が飛んでくる。",
                aeria: "古い言葉で「空気」。書物を宙へ放つ。下から上へ、まっすぐ描いても呼べる。",
                scintilla: "古い言葉で「火花」。三つの角を持つ形を描いても呼べる。",
                nebula: "古い言葉で「霧」。書庫を白く閉ざす。",
                glacies: "古い言葉で「氷」。稲妻のような形を描いても呼べる。",
                magna: "古い言葉で「大いなる」。文字を大きくする。",
                parva: "古い言葉で「小さな」。大きくした文字を元に戻す。",
                solve: "古い言葉で「ほどけ」。かけた魔法をすべて解く。",
                lethe: "忘却の川の名。読んだ記憶を流し去る。",
                virga: "古い言葉で「杖」。指先に宿り、金の粉をこぼす。",
                obscura: "古い言葉で「覆われた」。魔法を人の目から覆い隠す。"
            },
            inkFound: function (n) { return "隠されたインクが浮かび上がる……(" + n + " か所)"; },
            summonNone: "呼び寄せる規則が見つからなかった",
            letheWarn: "読んだ記憶をすべて消すつもりか？ 本当なら、もう一度唱えよ",
            // 画面中央の告知
            announce: {
                close: "閉じる",
                archiveEyebrow: "Seal Broken",
                archiveTitle: "禁書庫の封印が解けた",
                archiveSub: "規則の書をすべて読み終えた者だけが入れる書庫が、左の書架に現れた。",
                archiveGo: "禁書庫へ入る",
                spellEyebrow: "New Spell",
                spellSub: function (desc, n, total) { return desc + "\n見つけた呪文 " + n + " / " + total; },
                spellGo: "呪文帳を見る",
                chapterEyebrow: "Chapter Complete",
                chapterTitle: function (name) { return "「" + name + "」を読み終えた"; },
                chapterSub: function () { return ""; } // 章の読了は見出しだけ
            },
            owl: {
                greet: "ようこそ、旅の人。分からないことがあれば、私を押してごらん。",
                greetNight: "こんな夜更けに規則の書とは、感心な学徒だ。",
                noResult: "その言葉は、まだこの書に記されていないようだ。",
                idle: "ゆっくり読むといい。急ぐ者ほど、規則を破る。",
                archive: "見事だ。左の書架に、禁書庫の扉が現れたぞ。",
                sealed: "その扉は、すべてを読み終えた者にしか開かない。",
                manaEmpty: "魔力切れだ。少し休め。急ぐ魔法使いほど、杖を折る。",
                rune: "見事なルーンだ。指先で描く魔法も、悪くないだろう？",
                key: "鍵か……古い錠前の匂いがする。",
                keysAll: "三つそろったか。……私の昔話を読まれるのは、少し照れるな。",
                passcode: "その言葉を見つけたか。……だが鍵たちは臆病だ。好む場所でしか姿を見せんぞ。",
                keysAllHint: "最後の封印は、星の形をしている。禁書庫の余白に描いてみよ。",
                starWrongPlace: "その星は、ここではない。鍵を使う扉は、禁書庫の中にある。",
                starNotYet: "見事な星だ。……だが、まだ鍵が足りないようだな。",
                night: "夜の書架に気づいたか。……夜明けまでには閉じるぞ。",
                // 親しさ (0: よそよそしい / 1: ふつう / 2: 打ち解けた / 3: 名を明かした)
                name: "オルド",
                nobody: "司書のフクロウ",
                affinity: "親しさ",
                levelUp: ["", "……ふむ。君となら、少しは話してもよさそうだ。", "君とは気が合いそうだ。また来るといい。", ""],
                greetBack: ["", "また来たか。", "おや、待っていたよ。", "やあ、友よ。今日は何を読む？"],
                tipsCold: [
                    "……読みに来たのなら、静かに読みたまえ。",
                    "規則の書は逃げない。急がずともよい。",
                    "君はまだ見ない顔だな。",
                    "用があるなら、上の欄に書きたまえ。"
                ],
                tipsWarm: [
                    "封印の星は、一筆で五つの角を描く。……覚えておくといい。",
                    "また来たのか。君が来ると、書庫が少し明るくなる。",
                    "君の読み方は丁寧だ。気に入った。",
                    "ひとつ秘密を。私は昔、人の姿をしていた。……冗談だと思うかね？",
                    "夜更けに来てみるといい。夜にしか開かない書架がある。"
                ],
                tipsFriend: [
                    "空の都の名を、いつか私に尋ねてみるといい。……すべてを知ったあとでな。",
                    "オルドと呼んでくれていい。古い友には、そう呼ばれていた。",
                    "規則を守る者は多いが、規則を楽しむ者は少ない。君は後者だ。",
                    "君になら、禁書庫の鍵を預けてもいい気がする。",
                    "初代の司書だった頃より、今のほうが楽しいかもしれん。君のおかげでな。"
                ],
                nameAnnounce: {
                    eyebrow: "The Librarian",
                    title: "司書の名は「オルド」",
                    sub: "フクロウが、ようやく名を明かしてくれた。\nかつて学院の初代司書だった者の名だ。"
                },
                nightAnnounce: {
                    eyebrow: "Midnight",
                    title: "夜の書架が現れた",
                    sub: "真夜中のあいだだけ、禁書庫に開く書架がある。"
                },
                tips: [
                    "迷ったら、事例集を開くとよい。",
                    "点線の言葉には、意味が隠されている。",
                    "職業を選べば、読むべき規則だけが残る。",
                    "すべて読み終えた者には、ちょっとした褒美がある。",
                    "この街の魔法を知っているなら、検索欄で唱えてみるといい。……おっと、口がすべった。",
                    "カードの右上の吹き出しを押せば、運営に質問できる。",
                    "余白の落書きは、この街の誰かが書いたものだ。",
                    "呪文はひとつではない。カンデラ、アエリア、ヴォカーレ……古い言葉を試してみるといい。",
                    "禁書庫には、見つけた呪文を記す帳面がある。",
                    "本文の余白に、マウスで円を描いてみるといい。……何が起きるかは、お楽しみだ。",
                    "インクの中に、色の違う文字が混じっている。",
                    "この書のどこかに、小さな鍵が三つ眠っている。目を覚ます言葉は、インクの中だ。",
                    "呪文を唱えすぎると、魔力が尽きる。左の青い線を見ておけ。",
                    "魔法を人の目から隠す古い言葉がある。……知りたければ、禁書庫の呪文帳を開くといい。"
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
                nebula: { name: "Nebula", desc: "Wraps the library in mist", toast: "Mist rolls in", owl: "…Where did you go? I can't see a thing." },
                glacies: { name: "Glacies", desc: "Frosts the edges of the page", toast: "A chill fills the library", owl: "C-cold… my feathers are freezing." },
                magna: { name: "Magna", desc: "Makes the text larger", toast: "The text grows larger (cast Parva to undo)", owl: "No need to make it that big, I can read it." },
                parva: { name: "Parva", desc: "Returns the text to normal size", toast: "The text returns to normal", owl: "Yes, that's just right." },
                solve: { name: "Solve", desc: "Undoes every spell you have cast", toast: "Every spell has been undone", owl: "Clean up after yourself. Good habit." },
                lethe: { name: "Lethe", desc: "Washes your reading memory into the river of oblivion", toast: "Your reading memory fades away…", owl: "…Hm? What was I doing again?" },
                virga: { name: "Virga", desc: "Turns your fingertip into a wand that sheds golden dust (cast again to stop)", toast: "Your fingertip becomes a wand (cast again to stop)", toastOff: "You put the wand away", owl: "Oh, that suits you rather well." },
                obscura: { name: "Obscura", desc: "Hides magic from human eyes and returns to the ordinary book (cast twice within 10 seconds)", toast: "The magic is being veiled…", owl: "Hiding from human eyes is our duty too. …Until we meet again." }
            },
            obscuraWarn: "Veil the magic and return to the ordinary book? If you mean it, cast it again",
            awaken: { eyebrow: "Awakening", title: "The Aether has awakened", sub: "You can now see this book as it truly is." },
            final: {
                nav: "The Last Shelf",
                title: "The Last Shelf",
                lead: "A shelf sealed since the day of the fire. The one story the librarian kept hidden to the very end.",
                announceTitle: "The Last Shelf is open",
                announceSub: "A shelf sealed ever since the day of the fire.",
                owlOpen: "…That is the story I have hidden all this time. Please, read it to the end.",
                askTooEarly: "…Where did you hear that name? I cannot speak of it yet.",
                askShelf: "The rest of that name waits until you break the seal of the Second Shelf.",
                askSpells: "Some things can be told only to one who knows every spell.",
                askRiddle: "…So you have finally spoken the name of the city in the sky. Then hear this.\nIn the hours when the moon is high (midnight to four), light two lights — the light in your hand and the light of your wand — and draw a spiral in the margins of the Archive. There lies the last door.",
                notHere: "The door lies within the Archive.",
                notTime: "It is not yet the moon's hour.",
                noLight: "Not enough light. The light in your hand, and the light of your wand."
            },
            admin: { badge: "Admin view (this tab only)", exit: "Exit", wrong: "Wrong passphrase" },
            book: { prev: "Previous page", next: "Next page" },
            runes: { candela: "circle", scintilla: "triangle", glacies: "zigzag", aeria: "a straight line upward" },
            runeLabel: function (shape) { return "Rune: " + shape; },
            mana: { empty: "Not enough mana. Rest a while", label: function (n, max) { return Math.floor(n) + " / " + max; } },
            keys: {
                eyebrow: "Hidden Key",
                found: function (n, total) { return "Hidden key " + n + " / " + total; },
                foundSub: "The other keys still sleep somewhere in this book.",
                allTitle: "All three keys are gathered",
                allSub: "But one last seal still binds the shelf. Draw the sigil of the seal inside the Archive.",
                allSubSealed: "But the door these keys open is not yet in sight… First, break the Archive's seal.",
                sealTitle: "The Second Shelf is open",
                sealSub: "The star sigil shattered the seal. Another shelf has appeared deeper within the Archive.",
                go: "Go to the Second Shelf"
            },
            passcode: {
                eyebrow: "Passphrase",
                title: "The passphrase is accepted",
                sub: "Three sleeping keys have awakened.\nThe Book of Words awaits light, the Book of Judgment awaits mist, and the Book of Time awaits a frozen breath.",
                again: "That passphrase has already been heard."
            },
            ask: {
                placeholder: "Ask the owl (e.g. can I stream?)",
                send: "Ask",
                tip: "A word",
                close: "Close",
                intro: "Then read this.",
                none: "Hm, the answer is not written in this book. Try asking the staff with the speech bubble on a card."
            },
            spellNew: function (n, total) { return "(New spell learned " + n + " / " + total + ")"; },
            spellCount: function (n, total) { return "Spells found " + n + " / " + total; },
            spellUnknown: "A spell not yet known",
            spellRiddles: {
                candela: "The old word for \u201ccandle.\u201d Lights a small flame in the dark.",
                somna: "The old word for \u201csleep.\u201d Puts the light to bed.",
                solaris: "The old word for \u201cof the sun.\u201d A light bright enough to blind.",
                atramento: "The old word for \u201cink.\u201d Awakens hidden writing.",
                perspica: "The old word for \u201csee through.\u201d Exposes every voice hiding in the margins.",
                vocare: "The old word for \u201cto call.\u201d The rule you name after it flies to you.",
                aeria: "The old word for \u201cair.\u201d Sends books into the sky. Also cast by drawing a straight line upward.",
                scintilla: "The old word for \u201cspark.\u201d Also cast by drawing a shape with three corners.",
                nebula: "The old word for \u201cmist.\u201d Shrouds the library in white.",
                glacies: "The old word for \u201cice.\u201d Also cast by drawing a shape like a lightning bolt.",
                magna: "The old word for \u201cgreat.\u201d Makes the text larger.",
                parva: "The old word for \u201csmall.\u201d Returns enlarged text to normal.",
                solve: "The old word for \u201cloosen.\u201d Undoes every spell you cast.",
                lethe: "The name of the river of oblivion. Washes away what you have read.",
                virga: "The old word for \u201cwand.\u201d Dwells in your fingertip and sheds golden dust.",
                obscura: "The old word for \u201cveiled.\u201d Hides magic from human eyes."
            },
            inkFound: function (n) { return "Hidden ink begins to appear… (" + n + " places)"; },
            summonNone: "No rule answered the summons",
            letheWarn: "Erase everything you have read? If you mean it, cast it again",
            announce: {
                close: "Close",
                archiveEyebrow: "Seal Broken",
                archiveTitle: "The Archive is unsealed",
                archiveSub: "A library open only to those who have read the whole Book of Rules has appeared on the shelf to the left.",
                archiveGo: "Enter the Archive",
                spellEyebrow: "New Spell",
                spellSub: function (desc, n, total) { return desc + "\nSpells found " + n + " / " + total; },
                spellGo: "Open the Book of Spells",
                chapterEyebrow: "Chapter Complete",
                chapterTitle: function (name) { return "You finished “" + name + "”"; },
                chapterSub: function () { return ""; }
            },
            owl: {
                greet: "Welcome, traveler. If anything puzzles you, give me a tap.",
                greetNight: "Reading the rules at this hour? A diligent student indeed.",
                noResult: "That word is not yet written in this book, it seems.",
                idle: "Take your time. Those who hurry are the ones who break the rules.",
                archive: "Splendid. The door to the Archive has appeared on the shelf to the left.",
                sealed: "That door opens only for those who have read everything.",
                manaEmpty: "Out of mana. Rest. The hasty wizard is the one who breaks their wand.",
                rune: "A fine rune. Magic drawn by hand isn't bad, is it?",
                key: "A key… it smells of old locks.",
                keysAll: "All three, then. …It's a little embarrassing to have my old story read.",
                passcode: "So you found the words. …But the keys are shy. They show themselves only where they like.",
                keysAllHint: "The last seal takes the shape of a star. Draw it in the margins of the Archive.",
                starWrongPlace: "Not here. The door these keys open lies within the Archive.",
                starNotYet: "A fine star. …But you seem to be short of keys.",
                night: "You noticed the Midnight Shelf. …It closes before dawn.",
                name: "Ord",
                nobody: "The librarian owl",
                affinity: "Friendship",
                levelUp: ["", "…Hm. Perhaps I can talk with you a little.", "I think we'll get along. Come again.", ""],
                greetBack: ["", "Back again, I see.", "Ah, I was waiting for you.", "Hello, my friend. What shall we read today?"],
                tipsCold: [
                    "…If you came to read, read quietly.",
                    "The Book of Rules won't run away. No need to hurry.",
                    "I don't recognize your face.",
                    "If you need something, write it in the box above."
                ],
                tipsWarm: [
                    "The star of the seal is drawn in one stroke, with five points. …Remember that.",
                    "Back again? The library feels a little brighter when you come.",
                    "You read carefully. I like that.",
                    "A secret: I once had human form. …Do you think I'm joking?",
                    "Come late at night. There is a shelf that opens only then."
                ],
                tipsFriend: [
                    "Someday, ask me the name of the city in the sky. …Once you know everything.",
                    "You may call me Ord. My old friends did.",
                    "Many keep the rules; few enjoy them. You are one of the few.",
                    "I feel I could trust you with the keys to the Archive.",
                    "I may be happier now than when I was the first librarian. Thanks to you."
                ],
                nameAnnounce: {
                    eyebrow: "The Librarian",
                    title: "The librarian's name is \u201cOrd\u201d",
                    sub: "The owl has finally told you its name.\nIt was the name of the Academy's first librarian."
                },
                nightAnnounce: {
                    eyebrow: "Midnight",
                    title: "The Midnight Shelf has appeared",
                    sub: "There is a shelf in the Archive that opens only in the dead of night."
                },
                tips: [
                    "When in doubt, open the Precedents.",
                    "Dotted words hide their meanings.",
                    "Choose your job, and only the rules you need will remain.",
                    "Those who read everything receive a small reward.",
                    "If you know the magic of this city, try casting it in the search box… oops, I said too much.",
                    "The speech bubble on each card lets you ask the staff a question.",
                    "The scribbles in the margins were written by someone in this city.",
                    "There is more than one spell. Candela, Aeria, Vocare… try the old tongue.",
                    "The Archive holds a book that records the spells you find.",
                    "Try drawing a circle with your mouse in the empty margins… you'll see.",
                    "Some letters in the hidden ink are a different color.",
                    "Three small keys sleep somewhere in this book. The word that wakes them lies in the ink.",
                    "Cast too much and your mana runs dry. Watch the blue line on the left.",
                    "There is an old word that hides magic from human eyes. …Look in the Book of Spells in the Archive."
                ]
            }
        }
    }[LANG];

    // ===== 隠し要素 =====
    // 禁書庫の物語・第二の書架・夜の書架・透明インク・隠された鍵は HTML には書かず、ここから書き出す。
    // 公開するときは、このファイルごと難読化される (build.js)。文章を直すときは、ここを書き換える。
    //   ink: 各章の最後に置く透明インク。cipher = 暗号の印を付ける文字の番号 (空白を除いて何文字目か)
    //   鍵の場所: 1 = 用語集の説明文の終わり / 2 = 罰則の最後の注意書き / 3 = 改訂履歴のいちばん上の見出し
    var SECRETS = {
        "ja": {
            "ink": {
                "start": {
                    "text": "はじめの一歩を踏み出した者に、ひとしずくの祝福を。",
                    "cipher": 16
                },
                "server": {
                    "text": "この書を最後まで読みとおした者にだけ、禁書庫の扉はふたたび開かれる。",
                    "cipher": 28
                },
                "jobs": {
                    "text": "職は人をつくる。だが、人が職を汚すこともあるらしい。",
                    "cipher": 22
                },
                "character": {
                    "text": "名とは、人が最初にかける呪文。だからこそ、大切に名をつけよ。",
                    "cipher": 25
                },
                "cases": {
                    "text": "前例は、まだ見ぬ誰かをひそかに救うために記される。",
                    "cipher": 11
                },
                "faq": {
                    "text": "答えの無い問いは、右下の司書に聞いてごらん。",
                    "cipher": 19
                },
                "glossary": {
                    "text": "言葉を知る者は、呪文を知る者でもある。ためしに検索欄で「カンデラ」と唱えてみよ。けっして難しくはない。",
                    "cipher": 40
                },
                "penalty": {
                    "text": "印は、灯りをかざした者にだけ見える。印の文字を章の順に並べて唱えよ。"
                },
                "chronicle": {
                    "text": "この書もまた、生きている。"
                }
            },
            "archive": "<li>\n                    <h3>焼け残った目録</h3>\n                    <p>煤で黒ずんだ一枚の紙。聖堂都市エルスハインの大聖堂書庫の蔵書目録の、最後の頁だという。『星読みの暦 第七巻』『ルーン定着論 注解』『主神への讃歌集』……並んだ書名のほとんどに、細い線が引かれている。焼けて失われた印だ。</p>\n                    <p>頁の余白には、震える字で一行だけ書き添えられている。「持ち出せたのは、一羽の翼で運べる分だけだった」</p>\n                </li>\n                <li>\n                    <h3>結界と祈りについて</h3>\n                    <p>本土の西の島に建つ学院を、外の目から隠す結界は、石や杖で保たれているのではない。学徒たちが日々ルーンに込める、澄んだエーテルによって編まれている。</p>\n                    <p>だから学院は、規則を重んじる。呪いや悪意で濁った魔力は、結界の糸を少しずつほつれさせる。規則を守ることは、自分たちの最後の居場所を守ることでもある。</p>\n                </li>\n                <li>\n                    <h3>規則の書の由来</h3>\n                    <p>この書の原本は、故郷を失った魔法使いたちが、本土の西の島へ逃れてから、最初に書き記したものだと伝えられている。力ある者が力に溺れれば、何が起きるか。彼らはそれを、身をもって知っていた。</p>\n                    <p>最初の一条が「礼節」なのは、炎の中で誰もが最初に失ったものが、それだったからだという。</p>\n                </li>\n                <li>\n                    <h3>運営より</h3>\n                    <p>ここまで読んでくださって、ありがとうございます。規則は、あなたの物語を守るためにあります。</p>\n                    <p>この禁書庫の存在は、まだ読み終えていない人には内緒にしておいてください。</p>\n                    <p class=\"sign\">— AETHER CITY 運営</p>\n                </li>",
            "secondShelf": "<div class=\"second-shelf\" id=\"second-shelf\" hidden>\n                <h3 class=\"section-title\">第二の書架</h3>\n                <ol class=\"lore\">\n                    <li>\n                        <h3>赤い瞳の手記</h3>\n                        <p>地下の監獄の壁に、爪で刻まれていたという文。「最初は、ほんの小さな呪いだった。腹の立つ相手に、ひとつだけ。次は、もう少し強く。気づいたときには、水面に映る自分の目が、知らない色をしていた」</p>\n                        <p>「これを読む者へ。怒りでルーンを描くな。エーテルは、描いた者の心の色に染まる」</p>\n                    </li>\n                    <li>\n                        <h3>大儀式の前夜</h3>\n                        <p>ある学徒の日記より。「明日はいよいよ大儀式。一年かけて集めたエーテルを、主神アルテリオンへお還しする。先輩は、昔の儀式では祭壇の光がもっとまぶしかったと言っていた。今年の光は、去年より少しだけ弱かった気がする。……私たちの祈りは、ちゃんと届いているのだろうか」</p>\n                    </li>\n                    <li>\n                        <h3>司書の正体</h3>\n                        <p>規則の書の隅にいるフクロウ、オルド。かつてはエルスハイン大聖堂の書庫を預かる司書だったという。</p>\n                        <p>都が炎に包まれた日、彼は人の足では間に合わないと悟り、自らに変身の術をかけた。煙の中を幾度も往復し、運べるだけの書物を雲の下へと運び出した。そのとき抱えていた一冊が、この規則の書の元になった古い戒律の写しだった。</p>\n                        <p>なぜ人の姿に戻らないのかと尋ねると、オルドは決まってこう答える。「戻り方を記した本は、あの日、燃えてしまったのでな」</p>\n                        <p class=\"sign\">— 鍵を三つ集めた者へ</p>\n                    </li>\n                </ol>\n            </div>",
            "nightShelf": "<div class=\"second-shelf night-shelf\" id=\"night-shelf\" hidden>\n                <h3 class=\"section-title\">夜の書架</h3>\n                <p class=\"count-line\">零時から四時のあいだだけ開く書架。夜明けとともに、また閉じる。</p>\n                <ol class=\"lore\">\n                    <li>\n                        <h3>青い残滓</h3>\n                        <p>昼の喧騒の中では見落とされがちだが、夜が深まると、街のあちこちに漂う青いエーテルの名残が見えやすくなる。それを辿った先で、学院への道を見つけた者がいるという。ただし、辿れるのは自らのルーンを持つ者だけだ。</p>\n                    </li>\n                    <li>\n                        <h3>燻る声</h3>\n                        <p>真夜中の回廊で、若い魔導士たちの囁きを聞いた、という記録がある。「なぜ我らが隠れねばならない」「奪われたものは、取り返すべきだ」。声の主は分からない。記録を残した者は、最後にこう書き添えている。「怒りは、エーテルをいちばん早く濁らせる」</p>\n                    </li>\n                    <li>\n                        <h3>夜更かしの学徒へ</h3>\n                        <p>こんな時間まで起きているなら、ひとつだけ忠告を。明日の物語は、よく眠った者にほど優しい。</p>\n                        <p class=\"sign\">— 書庫の番をする者より</p>\n                    </li>\n                </ol>\n            </div>",
            "keyLabel": "鍵"
        },
        "en": {
            "ink": {
                "start": {
                    "text": "Blessings upon those who take the first step.",
                    "cipher": 9
                },
                "server": {
                    "text": "Only those who read this book to the end will find the archive's door open.",
                    "cipher": 1
                },
                "jobs": {
                    "text": "A job shapes a person. But a person can also stain a job.",
                    "cipher": 32
                },
                "character": {
                    "text": "A name is the first spell a person ever casts.",
                    "cipher": 25
                },
                "cases": {
                    "text": "Precedents are written to save someone yet to come.",
                    "cipher": 38
                },
                "faq": {
                    "text": "For questions without answers, ask the librarian in the corner.",
                    "cipher": 29
                },
                "glossary": {
                    "text": "Those who know words also know spells… try casting \"Candela\" in the search box."
                },
                "penalty": {
                    "text": "The marks show only to those who hold up a light. Read the marked letters in chapter order, and speak them aloud."
                },
                "chronicle": {
                    "text": "This book, too, is alive."
                }
            },
            "archive": "<li>\n                    <h3>The Scorched Catalogue</h3>\n                    <p>A single sheet blackened with soot — said to be the last page of the catalogue of the great cathedral library of Elsheim, the Cathedral City. \"Almanac of the Stars, Vol. VII.\" \"Commentary on the Binding of Runes.\" \"Hymns to the High God.\" Nearly every title is struck through with a thin line: the mark of a book lost to the fire.</p>\n                    <p>In the margin, one line in a trembling hand: \"We saved only what a single pair of wings could carry.\"</p>\n                </li>\n                <li>\n                    <h3>On the Barrier and Prayer</h3>\n                    <p>The barrier that hides the Academy on the isle west of the mainland from outside eyes is not held up by stone or staff. It is woven from the clear Aether that students pour into their runes each day.</p>\n                    <p>That is why the Academy values its rules. Mana clouded by curses or malice slowly frays the threads of the barrier. Keeping the rules is also keeping the last place they can call home.</p>\n                </li>\n                <li>\n                    <h3>The Origin of the Book of Rules</h3>\n                    <p>It is said the original of this book was the first thing the mages wrote after fleeing to the isle west of the mainland, having lost their homeland. They knew firsthand what happens when the powerful drown in their own power.</p>\n                    <p>The first article is \"courtesy\" because, in the flames, it was the first thing everyone lost.</p>\n                </li>\n                <li>\n                    <h3>From the Staff</h3>\n                    <p>Thank you for reading this far. The rules exist to protect your story.</p>\n                    <p>Please keep the existence of this archive a secret from those who have not finished reading.</p>\n                    <p class=\"sign\">— The AETHER CITY Staff</p>\n                </li>",
            "secondShelf": "<div class=\"second-shelf\" id=\"second-shelf\" hidden>\n                <h3 class=\"section-title\">The Second Shelf</h3>\n                <ol class=\"lore\">\n                    <li>\n                        <h3>The Red-Eyed Journal</h3>\n                        <p>Words said to have been scratched into a wall of the underground prison: \"It began as a very small curse. Just one, on someone who angered me. Then a slightly stronger one. By the time I noticed, the eyes looking back at me from the water were a color I did not know.\"</p>\n                        <p>\"To whoever reads this: never draw a rune in anger. Aether takes on the color of the heart that draws it.\"</p>\n                    </li>\n                    <li>\n                        <h3>The Eve of the Great Rite</h3>\n                        <p>From a student's diary: \"Tomorrow is the Great Rite. We will return to the High God Arterion the Aether we gathered all year. A senior told me the altar's light used to be far brighter in the old rites. This year it felt a little dimmer than last. …Are our prayers really reaching Him?\"</p>\n                    </li>\n                    <li>\n                        <h3>The Librarian's Secret</h3>\n                        <p>Ord, the owl in the corner of this book, is said to have once kept the library of Elsheim's great cathedral.</p>\n                        <p>On the day the city burned, he knew human feet would never be fast enough, so he cast a transformation upon himself. Again and again he flew through the smoke, carrying every book he could down beneath the clouds. Among those he held was an old copy of the precepts that became this Book of Rules.</p>\n                        <p>Ask him why he never returned to human form, and Ord always answers: \"The book that explained how to change back burned that day, you see.\"</p>\n                        <p class=\"sign\">— To the one who gathered three keys</p>\n                    </li>\n                </ol>\n            </div>",
            "nightShelf": "<div class=\"second-shelf night-shelf\" id=\"night-shelf\" hidden>\n                <h3 class=\"section-title\">The Midnight Shelf</h3>\n                <p class=\"count-line\">A shelf that opens only between midnight and four. It closes again at dawn.</p>\n                <ol class=\"lore\">\n                    <li>\n                        <h3>Blue Remnants</h3>\n                        <p>Easily missed in the bustle of day, the lingering traces of blue Aether drifting about the city grow easier to see as night deepens. Some say they followed those traces and found the way to the Academy. Only those with a rune of their own can follow them, however.</p>\n                    </li>\n                    <li>\n                        <h3>Smoldering Voices</h3>\n                        <p>One record tells of whispers overheard in a midnight corridor — young mages talking. \"Why must we hide?\" \"What was taken should be taken back.\" The speakers were never identified. The one who wrote it down added a final line: \"Anger is what clouds Aether fastest of all.\"</p>\n                    </li>\n                    <li>\n                        <h3>To the Student Still Awake</h3>\n                        <p>If you are up at this hour, one piece of advice. Tomorrow's story is kindest to those who have slept well.</p>\n                        <p class=\"sign\">— From the keeper of the library</p>\n                    </li>\n                </ol>\n            </div>",
            "keyLabel": "Key"
        }
    };

    // 最後の書架の小説「青の残滓」。条件を満たすまで、ページには書き出さない
    // 抑揚の印: 段落の頭の "!!" = 大きく中央寄せ / {g|…} 金 (名前) / {b|…} 青 (エーテル・光) / {r|…} 赤 (堕落・報復)
    var FINAL_NOVEL = {
        "ja": {
            "title": "青の残滓",
            "chapters": [
                {
                    "h": "序章　空が落ちた日",
                    "ps": [
                        "その朝、{g|聖堂都市エルスハイン}の鐘は、いつもより少しだけ早く鳴った。",
                        "白い石畳を朝の光が洗い、雲海から吹き上がる風が、回廊の旗を静かに揺らしていた。大聖堂の尖塔の頂では、{g|主神アルテリオン}の光が、いつもと変わらぬ拍子で脈打っていた。都に生まれた者なら、誰もがその色を知っている。夜明けの空よりもなお澄んだ、{b|淡い青――エーテルの色}だった。",
                        "見習いの少女リュシアは、大聖堂の階段に腰を下ろして、遥か下の地上を眺めていた。雲の切れ間の底に、人間たちの街が小さく光っている。昨日も、一昨日も、都の魔法使いたちは祝福を携えて雲を下り、病を癒やし、枯れた畑に水を呼んだ。地上の人々は彼らを迎え、焼きたてのパンと葡萄酒を差し出した。少なくとも、リュシアはそう聞かされて育った。",
                        "最初に異変に気づいたのは、鳥たちだった。",
                        "雲の下から、群れがいっせいに舞い上がった。そのあとを追うように、低い唸りが昇ってきた。風の音でも、雷の音でもない。リュシアが生まれてから一度も耳にしたことのない、規則正しく、冷たい音だった。",
                        "!!鉄の翼が、雲を裂いて現れた。",
                        "そこから先のことを、リュシアはあまり覚えていない。燃え落ちる回廊。祈りの言葉を途中で失った司祭たち。光の盾を広げ、盾ごと吹き飛ばされていった教師の背中。そして――大聖堂の奥深く、{r|主神の座が砕ける音}。",
                        "その瞬間、都じゅうのエーテルが、一度だけ大きく揺らいだ。まるで世界そのものが、息を呑んだかのように。",
                        "誰かがリュシアの腕を掴み、崩れゆく階段を駆け下りた。燃える空の向こうで、尖塔の{b|青い光}が、ゆっくりと、ゆっくりと細くなっていくのが見えた。",
                        "!!それが、魔法使いたちが空を失った日だった。"
                    ]
                },
                {
                    "h": "第一章　街の片隅で",
                    "ps": [
                        "本土の港町は、いつも少しだけ騒がしい。",
                        "ノアがこの街に流れ着いて、三年になる。昼は倉庫で荷を運び、夜は安アパートの窓辺で、遠い高速道路の光の川を眺める。友人と呼べる相手は多くないが、困るほど少なくもない。どこにでもある、ありふれた暮らしだった。",
                        "ただひとつだけ、誰にも話していないことがある。",
                        "!!ときどき、空気が光るのだ。",
                        "路地の曲がり角に、雨上がりの水たまりの上に、誰もいない駐車場の片隅に。{b|かすかな青い揺らめき}が、ふと漂っていることがある。陽炎に似ているのに熱はなく、近づけば溶けるように消えてしまう。物心ついた頃から見えていた。一度だけ母に話したことがある。母は困ったように笑って「疲れているのね」とノアの額に手を当て、それきり、ノアは誰にも言わなくなった。",
                        "見えているのは自分だけらしい、ということも、とうに分かっていた。",
                        "その夜、仕事帰りの高架下で、ノアはまた揺らめきを見た。いつもより濃く、いつもより長く、何かを待つように、ひとところに留まっていた。",
                        "ノアは足を止めた。",
                        "疲れていたのかもしれないし、退屈していたのかもしれない。理由はどうでもよかった。気づけば足が勝手に、光のほうへ向いていた。",
                        "近づくと、揺らめきはふっと消えた。",
                        "そして、数歩先に、また現れた。その先にも、もうひとつ。さらにその先にも。",
                        "!!光は、道を描いていた。",
                        "指先が熱い、とノアは思った。手のひらを返すと、皮膚の下で、細い糸のようなものが{b|かすかに青く脈打っていた}。"
                    ]
                },
                {
                    "h": "第二章　路地裏の店",
                    "ps": [
                        "光の道は、港から少し離れた路地裏の、一軒の古びた店の前で途切れていた。",
                        "看板の文字はかすれて読めず、ショーウィンドウには埃をかぶった雑貨が並んでいる。何度もこの通りを歩いてきたはずなのに、ノアは今夜まで一度も、そこに店があることを気に留めたことがなかった。",
                        "気に留めないように、させられていたのだ。そう知ったのは、ずっと後のことだった。",
                        "扉を押すと、ドアベルが小さく鳴った。カウンターの奥で、ノアと同じくらいの年頃の店番が、頬杖をついてこちらを見ていた。",
                        "「遅かったな」と店番は言った。「三日前から、毎晩ここで待ってたんだぜ」",
                        "「……誰を？」",
                        "「おまえを、だよ。残滓をたどって来るやつは、たいていこんな夜更けに着く」",
                        "店番はカイと名乗った。昼はこの店で働き、夜は学院の案内係をしているという。学院、という言葉の意味を、ノアはまだ知らなかった。",
                        "カイはカウンターをくぐり、店の奥にある古い木の扉の前に立った。扉の表には、見たこともない文字が、細い線で刻まれていた。",
                        "「手を当ててみな。おまえのルーンが、鍵になる」",
                        "言われるままに触れると、手のひらの糸が{b|青く光り}、刻まれた文字がひとつ、またひとつと灯っていった。扉がきしんで開き、その向こうから、潮の香りを含んだ夜明けの風が吹き込んできた。",
                        "冷たい水の中をくぐり抜けるような感触があって――次の瞬間、ノアは息を呑んだ。",
                        "!!路地裏の店は、どこにもなかった。",
                        "目の前に広がっていたのは、{g|本土の西に浮かぶ、ひとつの大きな島}だった。なだらかな丘と深い森がどこまでも続き、麓には石畳の町並みと畑が広がっている。その向こう、朝霧の中に、尖塔がいくつも立ち並んでいた。石造りの回廊、硝子張りの温室、小さな天文台。窓という窓に灯りがともり、見たこともない色の旗が潮風にはためいている。",
                        "「結界だよ」とカイは言った。「本土からは、ただの島にしか見えない。見えちゃいけないんだ。……地上の人間には、な」",
                        "!!地上の、人間。",
                        "その言い方が、ノアの胸に小さく引っかかった。まるで、自分たちは人間ではないかのような。",
                        "カイはそれ以上何も言わず、丘の上の学院へと歩き出した。"
                    ]
                },
                {
                    "h": "第三章　覚醒",
                    "ps": [
                        "学院の奥、星の模様が刻まれた小部屋で、ノアは一つの結晶の前に立たされた。",
                        "拳ほどの大きさの、透きとおった石だった。台座の上で、それはノアが近づいただけで、手のひらの糸と呼び交わすように淡く光った。",
                        "「触れてごらん」と、白衣の老教師が言った。保健室を預かる先生だと、カイが耳打ちした。「怖がらなくていい。思い出すだけだからね」",
                        "「思い出す……？」",
                        "「おまえさんは、生まれたときから魔法使いだったんだよ。ただ、それを知らずに地上で育っただけさ。そういう子は、珍しくない」",
                        "ノアは、結晶に触れた。",
                        "!!世界が、裏返った。",
                        "音が色になり、色が匂いになり、空気の粒のひとつひとつが光の糸となって見えた。糸は部屋を満たし、窓の外へ、島へ、海へ、空へと伸びていた。そのすべてが、ゆっくりと、大きな何かの鼓動に合わせて流れていた。",
                        "!!{b|エーテル。}",
                        "誰に教わったわけでもないのに、ノアはその名を知っていた。",
                        "糸の流れをたどって、意識が空へと昇っていく。雲の上、はるかな高みに、白い何かが浮かんでいた。崩れかけた尖塔。折れた回廊。かつて都であったものの、骨のような影。",
                        "その中心に、小さな、とても小さな、{b|青い灯}がひとつ。",
                        "消えかけた蝋燭のように、震えていた。",
                        "気づくと、ノアは床に膝をついて泣いていた。なぜ泣いているのか、自分でも分からなかった。",
                        "「見えたかい」と、老教師が静かに言った。「{g|あれが、わたしたちの空だよ}」"
                    ]
                },
                {
                    "h": "第四章　赤い瞳",
                    "ps": [
                        "学院での日々は、驚くほどの速さで過ぎていった。",
                        "ルーンの書き方を習い、杖を選び、寮に振り分けられた。指先でエーテルの糸をつまみ、ルーンの形に結ぶと、そこに小さな炎がともる。初めて火がついた夜、ノアは寮の部屋でひとり、何度も何度も、火をともしては消した。",
                        "学院には決まりごとが多かった。中でもいちばん厳しく教えられたのは、たったひとつ。",
                        "!!――地上の者に、決して悟られるな。",
                        "街へ出るときは、魔法を使わない。杖を見せない。青い残滓を見かけても、立ち止まらない。理由を尋ねると、上級生たちは皆、少しだけ目を伏せた。",
                        "その理由の一端を、ノアはある雨の夜に知ることになる。",
                        "回廊の向こうから、風紀委員たちが誰かを連れて歩いてきた。両手を光の枷で縛られた、ノアより少し年上の青年だった。すれ違いざま、青年がふと顔を上げた。",
                        "!!その瞳は、{r|血のように赤かった}。",
                        "ぞっとするほど深い赤だった。ルーンの光とも、炎の色とも違う。{r|濁った水の底で、何かが燃え残っているような色}。",
                        "「呪いを重ねすぎたんだ」と、隣のカイが低く言った。「腹の立つ相手に、ひとつ。次は、もう少し強いのを。そうやって少しずつエーテルを汚していくと、ある日、戻れなくなる。……ああなったら、地下行きだ」",
                        "青年は、地下へと続く階段の暗がりへ消えていった。最後まで、一言も発さなかった。",
                        "その夜、ノアは指先にともした炎を、いつまでも見つめていた。{b|青く澄んだ、小さな炎}だった。この色だけは失いたくない、と思った。"
                    ]
                },
                {
                    "h": "第五章　灰色の男",
                    "ps": [
                        "秋の初め、ノアは学院の使いで本土へ渡った。",
                        "港の市場で薬草を受け取るだけの、簡単な用事だった。帰りにあの路地裏の店へ向かう途中、ノアは背中に視線を感じた。",
                        "振り返ると、灰色の外套を着た男が、少し離れたベンチに腰かけていた。新聞を広げてはいるが、読んではいない。その手元で、小さな金属の箱が、かすかに針を震わせていた。",
                        "!!針は、まっすぐにノアを指していた。",
                        "ノアは歩調を変えずに通り過ぎようとした。男は新聞を畳み、独り言のように呟いた。",
                        "「この街には、ときどき空気が光る場所がある。……君にも見えるんだろう？」",
                        "ノアは答えなかった。止まりそうになる足を、必死に前へ運んだ。",
                        "「心配しなくていい。捕まえようってわけじゃないさ」男は箱を懐にしまった。「ただ、ひとつだけ訊きたくてね。……君たちは、あの日のことを、本当に知っているのか？」",
                        "「あの日？」",
                        "思わず訊き返していた。男は少しだけ笑った。ひどく疲れた笑い方だった。",
                        "「空の都が落ちた日のことさ。君たちの側では、どう語られている？ 人間が恐れて、人間が襲った。{g|……それだけか？}」",
                        "男は立ち上がり、人波の中へ歩き去っていった。追いかけることは、できなかった。カイの声が、頭の中で繰り返し響いていた。決して悟られるな。",
                        "店の奥の扉をくぐるまで、ノアの手のひらは、ずっと冷たいままだった。",
                        "あの男は、いったい何を知っているのだろう。"
                    ]
                },
                {
                    "h": "第六章　大儀式",
                    "ps": [
                        "冬至の夜、学院の大広間で、大儀式が執り行われた。",
                        "学徒たちは一年かけて集めたエーテルを小さな硝子の器に満たし、祭壇の前に並んだ。器の中で、青い光が静かに揺れていた。ノアの器も、その列の中にあった。",
                        "学院長が祈りの言葉を唱え、学徒たちは一人ずつ、器を祭壇へと傾けていった。光は祭壇の上でひとつに集まり、細い柱となって、天井の高窓から夜空へ昇っていく。",
                        "雲の上の、あの白い影のほうへ。",
                        "光の柱を見上げていると、すぐ後ろで、上級生たちが小声で言葉を交わした。",
                        "!!「去年より、細いな」",
                        "「毎年、少しずつな」",
                        "祭壇の光が細いのか、それとも空の灯が弱っているのか。はっきりと口にする者は、誰もいなかった。",
                        "儀式が終わり、学徒たちが広間を後にする中で、ノアは回廊の暗がりから、もうひとつの声を聞いた。若い声だった。",
                        "「いつまで、こうやって隠れてるつもりなんだ」",
                        "「声が大きい」",
                        "「祈って、捧げて、怯えて。そのあいだに、神さまはどんどん弱っていく。あいつらは今も、俺たちを探してるんだぞ。……{r|奪われたものは、取り返すべきだ}」",
                        "声の主たちはノアに気づくと、すっと闇に溶けるように去っていった。",
                        "ノアはひとり、回廊の窓から空を見上げた。",
                        "雲の切れ間に、一瞬だけ、白い影が見えた気がした。崩れた尖塔の上で、小さな{b|青い灯}が、それでもまだ、消えずに揺れていた。"
                    ]
                },
                {
                    "h": "終章　問い",
                    "ps": [
                        "その夜、ノアは眠れなかった。",
                        "人間は、魔法使いを恐れて都を落とした――学院では、そう教わった。けれど、灰色の男の言葉が、耳の奥から離れなかった。",
                        "!!――それだけか？",
                        "指先に、小さな炎をともす。青く澄んだ炎の中に、答えは映らなかった。",
                        "窓の外では、海の向こうの本土の灯が、夜明けまで静かにまたたいていた。そこには、魔法を知らない人々が眠っている。魔法使いを探し続ける人々もいる。そしてたぶん、あの日の本当のことを知っている誰かも。",
                        "ノアは炎を消し、そっと目を閉じた。",
                        "明日もまた、ルーンを学ぼう。いつか、この目で確かめに行くために。",
                        "!!{g|あの日、雲の上の都で何が起きたのかを――。}"
                    ]
                }
            ],
            "colophon": {
                "title": "青の残滓",
                "rows": [
                    [
                        "著",
                        "リュシア"
                    ],
                    [
                        "写",
                        "オルド (学院書庫)"
                    ],
                    [
                        "発行",
                        "学院暦三〇七年 冬至"
                    ],
                    [
                        "発行所",
                        "隠されし学院 図書委員会"
                    ]
                ],
                "note": "本書の書庫外への持ち出しを禁ず"
            },
            "gift": {
                "h": "ここまでたどり着いたあなたへ",
                "ps": [
                    "長い道のりを越えて、この書架の最後の頁にたどり着いたあなたに、心からの敬意を。",
                    "AETHER CITY の運営から、あなたにささやかな贈り物を用意しています。",
                    "この頁を写し取り (スクリーンショットを撮り)、合言葉「雲の上の都は、まだそこにある」とともに、運営へ知らせてください。",
                    "ただ、ひとつだけお願いがあります。この書架のことと、ここへの道のりは、どうか誰にも明かさないでください。秘密は、自分の手で見つけるからこそ、物語になるのですから。"
                ],
                "sign": "— AETHER CITY 運営"
            }
        },
        "en": {
            "title": "Blue Remnants",
            "chapters": [
                {
                    "h": "Prologue: The Day the Sky Fell",
                    "ps": [
                        "That morning, the bells of {g|Elsheim, the Cathedral City}, rang a little earlier than usual.",
                        "Morning light washed the white flagstones, and the wind rising from the sea of clouds stirred the banners along the colonnades. At the summit of the cathedral spire, the light of {g|the High God Arterion} pulsed at its unchanging pace. Anyone born in the city knew its color: a pale blue, clearer even than the dawn sky — {b|the color of Aether}.",
                        "Lucia, a young apprentice, sat on the cathedral steps and gazed down at the earth far below. Through a gap in the clouds, the towns of humankind glimmered small and distant. Yesterday, and the day before, the mages of the city had descended through the clouds bearing blessings, healing the sick and calling water to withered fields. The people below had welcomed them with fresh bread and wine. At least, that was what Lucia had been told all her life.",
                        "The birds were the first to notice.",
                        "A flock burst upward from beneath the clouds all at once. Following after it came a low drone — not the wind, not thunder, but a sound Lucia had never heard in her life: steady, regular, and cold.",
                        "!!Iron wings tore through the clouds.",
                        "Lucia remembered little of what came after. Colonnades collapsing in flame. Priests who lost their prayers halfway through. The back of a teacher who spread a shield of light and was flung away, shield and all. And then — deep within the cathedral — {r|the sound of the god's seat shattering}.",
                        "In that moment, all the Aether in the city shuddered once, violently, as if the world itself had caught its breath.",
                        "Someone seized Lucia's arm and ran with her down the crumbling stairs. Beyond the burning sky, she watched the {b|blue light} of the spire grow thin — slowly, so slowly.",
                        "!!That was the day the mages lost their sky."
                    ]
                },
                {
                    "h": "Chapter One: A Corner of the City",
                    "ps": [
                        "The harbor town on the mainland was always a little noisy.",
                        "Three years had passed since Noah drifted into this city. By day, hauling crates at a warehouse; by night, watching the distant river of highway lights from the window of a cheap apartment. Not many people Noah could call friends, but not so few as to be a problem. An ordinary life, like any other.",
                        "There was only one thing Noah had never told anyone.",
                        "!!Sometimes, the air glowed.",
                        "At the bend of an alley, above a puddle after rain, in the corner of an empty parking lot — {b|a faint blue shimmer} would sometimes drift there. Like a heat haze, but with no heat, and it melted away whenever Noah came close. It had been there for as long as Noah could remember. Once, Noah had told their mother. She had smiled, troubled, laid a hand on Noah's forehead and said, \"You must be tired.\" After that, Noah never told anyone again.",
                        "Noah had long since understood that no one else could see it.",
                        "That night, beneath an overpass on the way home from work, Noah saw the shimmer again. Thicker than usual, lasting longer than usual, lingering in one place as if it were waiting for something.",
                        "Noah stopped.",
                        "Maybe it was tiredness. Maybe boredom. The reason didn't matter. Before Noah knew it, their feet were moving toward the light.",
                        "As Noah drew near, the shimmer winked out.",
                        "Then it appeared again, a few steps ahead. And another beyond that. And another beyond that.",
                        "!!The light was drawing a path.",
                        "My fingertips are hot, Noah thought. Turning a palm upward, Noah saw something like fine threads {b|pulsing faintly blue} beneath the skin."
                    ]
                },
                {
                    "h": "Chapter Two: The Shop in the Alley",
                    "ps": [
                        "The path of light ended in a back alley a little way from the harbor, in front of a run-down shop.",
                        "The letters on its sign had faded past reading, and dusty knickknacks lined the display window. Noah must have walked this street countless times, yet until tonight had never once noticed there was a shop here.",
                        "Noah had been made not to notice. That, Noah would learn much later.",
                        "When Noah pushed the door, a bell chimed softly. Behind the counter, a shopkeeper about Noah's age sat with their chin in one hand, watching.",
                        "\"You're late,\" the shopkeeper said. \"I've been waiting here every night for three days.\"",
                        "\"…Waiting for who?\"",
                        "\"For you. The ones who follow the remnants usually show up this late at night.\"",
                        "The shopkeeper's name was Kai — a clerk here by day, and by night a guide for the Academy. Noah did not yet know what the word Academy meant.",
                        "Kai ducked under the counter and stood before an old wooden door at the back of the shop. Letters Noah had never seen were carved into its face in fine lines.",
                        "\"Put your hand on it. Your rune is the key.\"",
                        "When Noah touched it, the threads in Noah's palm {b|glowed blue}, and the carved letters lit one after another. The door creaked open, and a dawn wind carrying the scent of the sea blew in from the other side.",
                        "There was a sensation like passing through cold water — and in the next moment, Noah's breath caught.",
                        "!!The shop in the alley was gone.",
                        "Spread out before Noah was {g|a great island floating west of the mainland}. Gentle hills and deep forests stretched on and on, with cobbled streets and fields at their feet. Beyond them, spires stood in rows within the morning mist. Stone colonnades, glass greenhouses, a small observatory. Light burned in every window, and banners of colors Noah had never seen snapped in the sea breeze.",
                        "\"It's a barrier,\" said Kai. \"From the mainland, it just looks like an island. It can't be seen. …Not by the humans on the ground, anyway.\"",
                        "!!The humans on the ground.",
                        "The phrase caught softly in Noah's chest. As if they themselves were not human.",
                        "Kai said nothing more, and set off toward the Academy on the hill."
                    ]
                },
                {
                    "h": "Chapter Three: Awakening",
                    "ps": [
                        "Deep within the Academy, in a small room carved with patterns of stars, Noah was made to stand before a crystal.",
                        "It was a clear stone about the size of a fist. Resting on its pedestal, it glowed faintly the moment Noah drew near, as if answering the threads in Noah's palm.",
                        "\"Go on, touch it,\" said an old teacher in a white coat — the one who kept the infirmary, Kai whispered. \"No need to be afraid. You're only remembering.\"",
                        "\"Remembering…?\"",
                        "\"You've been a mage since the day you were born. You just grew up on the ground without knowing it. Children like you aren't so rare.\"",
                        "Noah touched the crystal.",
                        "!!The world turned inside out.",
                        "Sound became color, color became scent, and every mote of air became a thread of light. The threads filled the room and stretched out the window, to the island, to the sea, to the sky. All of them flowed slowly, in time with the heartbeat of something vast.",
                        "!!{b|Aether.}",
                        "No one had taught Noah the name, and yet Noah knew it.",
                        "Following the flow of threads, Noah's awareness rose into the sky. Above the clouds, far, far above, something white was floating. Crumbling spires. Broken colonnades. The bone-like shadow of what had once been a city.",
                        "And at its center, a single {b|blue light} — small, so very small.",
                        "Trembling, like a candle about to go out.",
                        "When Noah came to, they were on their knees on the floor, weeping, without knowing why.",
                        "\"You saw it, didn't you,\" the old teacher said quietly. \"{g|That is our sky.}\""
                    ]
                },
                {
                    "h": "Chapter Four: Red Eyes",
                    "ps": [
                        "The days at the Academy passed with astonishing speed.",
                        "Noah learned to write runes, chose a wand, and was sorted into a house. Pinching a thread of Aether between the fingertips and tying it into the shape of a rune made a small flame appear. The first night a flame took, Noah sat alone in the dormitory, lighting it and putting it out again and again.",
                        "The Academy had many rules. The one taught most strictly of all was only this:",
                        "!!— Never let those on the ground notice you.",
                        "When going into the city, use no magic. Show no wand. Even if you see the blue remnants, do not stop. When Noah asked why, the older students all lowered their eyes a little.",
                        "Noah would learn part of the reason one rainy night.",
                        "Prefects came walking down the colonnade, escorting someone — a young man a little older than Noah, his hands bound in shackles of light. As they passed, he suddenly looked up.",
                        "!!His eyes were {r|red as blood}.",
                        "A red so deep it made Noah's skin crawl. Not the light of runes, not the color of fire. {r|A color like something still burning at the bottom of murky water.}",
                        "\"He stacked up too many curses,\" Kai said quietly beside Noah. \"One on someone who made him angry. Then a slightly stronger one. Keep fouling your Aether a little at a time, and one day you can't go back. …Once you're like that, it's the cells below.\"",
                        "The young man vanished into the darkness of the stairway leading underground. He never said a word.",
                        "That night, Noah stared for a long time at the flame on their fingertip. {b|A small flame, clear and blue.} This color, at least, I never want to lose, Noah thought."
                    ]
                },
                {
                    "h": "Chapter Five: The Man in Gray",
                    "ps": [
                        "In early autumn, Noah crossed to the mainland on an errand for the Academy.",
                        "A simple task: pick up herbs at the harbor market. On the way back to the shop in the alley, Noah felt eyes on their back.",
                        "Turning, Noah saw a man in a gray coat sitting on a bench a short distance away. He held a newspaper open but was not reading it. In his hand, a small metal box trembled, its needle quivering.",
                        "!!The needle pointed straight at Noah.",
                        "Noah tried to walk past without changing pace. The man folded his newspaper and murmured, as if to himself:",
                        "\"In this city, there are places where the air sometimes glows. …You can see them too, can't you?\"",
                        "Noah did not answer, forcing their feet forward though they wanted to stop.",
                        "\"Don't worry. I'm not here to catch anyone.\" The man slipped the box into his coat. \"I just want to ask one thing. …Do your people really know what happened that day?\"",
                        "\"That day?\"",
                        "Noah had asked before thinking. The man smiled a little — a terribly tired smile.",
                        "\"The day the city in the sky fell. How is it told on your side? Humans were afraid, and humans attacked. {g|…Is that all?}\"",
                        "The man stood and walked off into the crowd. Noah could not follow. Kai's voice echoed again and again: never let them notice you.",
                        "Until Noah passed through the door at the back of the shop, their palms stayed cold the whole time.",
                        "What did that man know?"
                    ]
                },
                {
                    "h": "Chapter Six: The Great Rite",
                    "ps": [
                        "On the night of the winter solstice, the Great Rite was held in the Academy's great hall.",
                        "The students filled small glass vessels with the Aether they had gathered over the year and lined up before the altar. Inside each vessel, blue light rocked gently. Noah's vessel was among them.",
                        "The headmaster spoke the prayer, and one by one the students tipped their vessels toward the altar. Above it the light gathered into one, rising as a slender pillar through the high windows into the night sky.",
                        "Toward that white shadow above the clouds.",
                        "As Noah looked up at the pillar of light, older students murmured just behind.",
                        "!!\"Thinner than last year.\"",
                        "\"A little more every year.\"",
                        "Was the altar's light growing thin, or was the light in the sky growing weak? No one said it outright.",
                        "When the rite ended and the students left the hall, Noah heard another voice from the dark of the colonnade. A young voice.",
                        "\"How long are we going to keep hiding like this?\"",
                        "\"Keep your voice down.\"",
                        "\"We pray, we offer, we cower. And all the while, the god keeps getting weaker. They're still looking for us, you know. …{r|What was taken should be taken back.}\"",
                        "Noticing Noah, the speakers slipped away, melting into the dark.",
                        "Alone, Noah looked up at the sky from the colonnade window.",
                        "For a moment, through a gap in the clouds, Noah thought they saw the white shadow. Above the crumbling spire, a small {b|blue light} still flickered — and still, it did not go out."
                    ]
                },
                {
                    "h": "Epilogue: The Question",
                    "ps": [
                        "That night, Noah could not sleep.",
                        "Humans feared the mages and brought down their city — that was what the Academy taught. But the man in gray's words would not leave Noah's ears.",
                        "!!— Is that all?",
                        "Noah lit a small flame on a fingertip. No answer appeared in the clear blue fire.",
                        "Beyond the window, the lights of the mainland across the sea twinkled quietly until dawn. There, people who knew nothing of magic were sleeping. There were also people still searching for mages. And, perhaps, someone who knew the truth of that day.",
                        "Noah put out the flame and gently closed their eyes.",
                        "Tomorrow, I'll study runes again. So that someday I can go and see for myself.",
                        "!!{g|What happened that day, in the city above the clouds—.}"
                    ]
                }
            ],
            "colophon": {
                "title": "Blue Remnants",
                "rows": [
                    [
                        "Written by",
                        "Lucia"
                    ],
                    [
                        "Copied by",
                        "Ord, Academy Library"
                    ],
                    [
                        "Published",
                        "Winter Solstice, Academy Year 307"
                    ],
                    [
                        "Publisher",
                        "Library Committee of the Hidden Academy"
                    ]
                ],
                "note": "Not to be removed from the library."
            },
            "gift": {
                "h": "To You Who Came This Far",
                "ps": [
                    "To you who crossed the long road and reached the last page of this shelf: our deepest respect.",
                    "The staff of AETHER CITY have prepared a small gift for you.",
                    "Take a copy of this page (a screenshot), and tell the staff along with the passphrase \"The city above the clouds is still there.\"",
                    "We ask only one thing. Please do not reveal this shelf, or the road that leads here, to anyone. A secret becomes a story only when you find it with your own hands."
                ],
                "sign": "— The AETHER CITY Staff"
            }
        }
    };

    // ===== 管理者の確認用の表示 =====
    // URL に ?admin=合言葉 を付けて開くと、そのタブだけ「管理者表示」になり、
    // 禁書庫・第二の書架・夜の書架・最後の書架を条件なしで見られる (参加者としての記録は書き換えない)。
    // 合言葉はここには書かず、SHA-256 のハッシュ値だけを置く。合言葉を変えるときは、次で出した値に置き換える:
    //   node -e "console.log(require('crypto').createHash('sha256').update('新しい合言葉').digest('hex'))"
    var ADMIN_HASH = "ebceaf1f9b39a60982e7c8c0b21aee1691761cf0744c511d708c49f2f2cdbafc";
    var ADMIN = false;
    try { ADMIN = sessionStorage.getItem("rules-admin") === "1"; } catch (e) {}

    // ===== 表示モード =====
    //   magic  … 魔法の世界の規則 (魔法の職業・呪文・禁書庫などの仕掛けがすべて出る)
    //   normal … 魔法を知らない人向けの通常の規則 (ふつうの職業。魔法の言葉や仕掛けは一切出ない)
    // HTML の data-only="magic" / data-only="normal" の要素のうち、今のモードでないものを最初に取り除く。
    // 今は URL の ?mode=normal / ?mode=magic で切り替え、選んだモードはこのブラウザに記憶する (指定も記録もなければ通常)。
    // (ゲームからの切り替え方法は今後決める。ここで MODE を決めれば、あとはすべてそれに従う)
    // モードの記録を一度だけ消して、全員を通常モードに戻すための印。
    // もう一度全員を戻したいときは、この値を新しくする (index.html と en/index.html の先頭のスクリプトの値も同じものに)
    var MODE_RESET_ID = "20261023";
    if (load("rules-mode-reset") !== MODE_RESET_ID) {
        save("rules-mode", null);
        save("rules-mode-reset", MODE_RESET_ID);
    }
    var MODE = (function () {
        if (ADMIN) return "magic"; // 管理者表示は、いつも魔法モード
        var asked = new URLSearchParams(location.search).get("mode");
        // #jobs?mode=normal のように # の後ろに書かれていても受け付ける (受け付けたら # からは消す)
        var inHash = /[?&]mode=(normal|magic)/.exec(location.hash);
        if (!asked && inHash) {
            asked = inHash[1];
            try { history.replaceState(null, "", location.pathname + location.search + location.hash.replace(/[?&]mode=(normal|magic)/, "")); } catch (e) {}
        }
        if (asked === "normal" || asked === "magic") { save("rules-mode", asked); return asked; }
        var saved = load("rules-mode");
        return saved === "magic" ? "magic" : "normal"; // 指定も記録もなければ通常モード
    })();
    document.documentElement.setAttribute("data-mode", MODE);
    // 開いたまま # の後ろに mode= を書き足されたとき (ページは読み込み直されない) も、モードを切り替えて読み込み直す
    window.addEventListener("hashchange", function () {
        var m = /[?&]mode=(normal|magic)/.exec(location.hash);
        if (!m) return;
        save("rules-mode", m[1]);
        try { history.replaceState(null, "", location.pathname + location.search + location.hash.replace(/[?&]mode=(normal|magic)/, "")); } catch (e) {}
        location.reload();
    });
    document.querySelectorAll('[data-only]:not([data-only="' + MODE + '"])').forEach(function (n) { n.remove(); });
    if (MODE === "normal") {
        // 違反の重さの呼び方も、魔法の言葉を使わない
        TEXT.grades = LANG === "en"
            ? { "1": "Grave", "2": "Serious", "3": "Minor" }
            : { "1": "重度", "2": "中度", "3": "軽度" };
        TEXT.sealGlyph = "◆";
        TEXT.sealTitle = LANG === "en" ? "Severity of the violation" : "違反の重さ";
        TEXT.wax = "✓"; // 読了の印も、封蝋の「読」ではなくチェック
    }

    (function placeSecrets() {
        if (MODE !== "magic") return; // 隠し要素は魔法モードだけ
        var sec = SECRETS[LANG];
        var archiveList = document.getElementById("archive-content");
        if (archiveList) {
            archiveList.innerHTML = sec.archive;
            var after = document.getElementById("spellbook") || archiveList;
            after.insertAdjacentHTML("afterend", sec.secondShelf + sec.nightShelf);
        }
        Object.keys(sec.ink).forEach(function (id) {
            var chapter = document.getElementById(id);
            if (!chapter) return;
            var p = document.createElement("p");
            p.className = "ink";
            p.setAttribute("aria-hidden", "true");
            p.textContent = sec.ink[id].text;
            if (sec.ink[id].cipher != null) p.setAttribute("data-cipher", sec.ink[id].cipher);
            chapter.appendChild(p);
        });
        var KEY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="7.5" cy="12" r="3.5"/><path d="M11 12h10M17 12v3M20 12v2"/></svg>';
        [[1, "#glossary .chapter-head .lead"], [2, "#penalty .penalty-notes li:last-child"], [3, ".chronicle > li:first-child h3"]].forEach(function (k) {
            var host = document.querySelector(k[1]);
            if (!host) return;
            var b = document.createElement("button");
            b.className = "hidden-key";
            b.type = "button";
            b.setAttribute("data-key", k[0]);
            b.setAttribute("aria-label", sec.keyLabel);
            b.title = sec.keyLabel;
            b.innerHTML = KEY_SVG;
            host.appendChild(b);
        });

        // 最後の書架: 左の章の項目と、本文の章の入れ物だけを作っておく (中身は開いたときに書き出す)
        var archiveNavEl = document.getElementById("archive-nav");
        var archiveSec = document.getElementById("archive");
        if (archiveNavEl && archiveSec) {
            var nav = document.createElement("div");
            nav.id = "final-nav";
            nav.hidden = true;
            nav.innerHTML = '<a class="chapter-link final-link" href="#final" data-chapter="final"><span class="en">The Last Shelf</span><span class="ja"></span></a>';
            nav.querySelector(".ja").textContent = TEXT.final.nav;
            nav.querySelector(".ja").appendChild(Object.assign(document.createElement("span"), { className: "count" }));
            archiveNavEl.parentNode.insertBefore(nav, archiveNavEl.nextSibling);
            var sec2 = document.createElement("section");
            sec2.className = "chapter";
            sec2.id = "final";
            sec2.innerHTML = '<div class="chapter-head"><p class="eyebrow">The Last Shelf</p><h2></h2><p class="lead"></p><div class="rule-line"></div></div><div class="novel" id="final-novel"></div>';
            sec2.querySelector("h2").textContent = TEXT.final.title;
            sec2.querySelector(".lead").textContent = TEXT.final.lead;
            archiveSec.parentNode.insertBefore(sec2, archiveSec.nextSibling);
        }
    })();

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
        if (chapter.id === "final" && !finalOpen()) { target = null; chapter = document.getElementById("start"); }

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
        if (chapter.id === "final") setTimeout(layoutBook, 0);
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
    // ---------- 通知 ----------
    // 右上の通知カード (notify): ちょっとしたお知らせ・新しい呪文・鍵など。積み重なって、数秒で消える (押しても消える)。
    // 画面中央の告知 (announce): 禁書庫の解放など大きな出来事。文字だけが浮かんで消える。重なったときは順番に出す。
    var NOTIFY_MAX = 4;
    var notifyStack = el("div", "notify-stack");
    notifyStack.setAttribute("aria-live", "polite");
    document.body.appendChild(notifyStack);

    function notify(o) {
        if (typeof o === "string") o = { title: o };
        var card = el("div", "notify");
        if (o.eyebrow) card.appendChild(el("p", "n-eyebrow", o.eyebrow));
        card.appendChild(el("p", "n-title", o.title));
        if (o.sub) card.appendChild(el("p", "n-sub", o.sub.replace(/\n/g, " ")));
        notifyStack.appendChild(card);
        while (notifyStack.children.length > NOTIFY_MAX) notifyStack.firstChild.remove();
        requestAnimationFrame(function () { card.classList.add("show"); });
        var gone = false;
        function dismiss() {
            if (gone) return;
            gone = true;
            card.classList.remove("show");
            card.classList.add("leave");
            setTimeout(function () { card.remove(); }, 500);
        }
        card.addEventListener("click", dismiss);
        setTimeout(dismiss, o.ms || 4500);
    }

    var PROCLAIM_MS = 5000;
    var announceQueue = [];
    var announcing = false;
    function announce(o) {
        if (o.light) { notify(o); return; } // 小さな出来事は右上のカードで
        announceQueue.push(o);
        if (!announcing) nextAnnounce();
    }
    function nextAnnounce() {
        var o = announceQueue.shift();
        if (!o) { announcing = false; return; }
        announcing = true;
        hideTip();
        var p = el("div", "proclaim");
        p.setAttribute("role", "status");
        p.setAttribute("aria-live", "assertive");
        if (o.eyebrow) p.appendChild(el("p", "p-eyebrow", o.eyebrow));
        p.appendChild(el("h2", null, o.title));
        p.appendChild(el("div", "p-line"));
        if (o.sub) {
            var sub = el("p", "p-sub");
            o.sub.split("\n").forEach(function (line, i) {
                if (i) sub.appendChild(el("br"));
                sub.appendChild(document.createTextNode(line));
            });
            p.appendChild(sub);
        }
        document.body.appendChild(p);
        fitOneLine(p.querySelector("h2"));
        requestAnimationFrame(function () { p.classList.add("show"); });
        setTimeout(function () {
            p.classList.remove("show");
            setTimeout(function () { p.remove(); nextAnnounce(); }, 1000);
        }, Math.min(o.ms || PROCLAIM_MS, 6500));
    }

    // 見出しを 1 行に収める (はみ出す間、文字を少しずつ小さくし、字の間隔も詰める)
    function fitOneLine(h) {
        var size = parseFloat(getComputedStyle(h).fontSize);
        var spacing = 0.22;
        for (var i = 0; i < 30 && h.scrollWidth > h.clientWidth && size > 13; i++) {
            size *= 0.94;
            spacing = Math.max(0.04, spacing - 0.02);
            h.style.fontSize = size + "px";
            h.style.letterSpacing = spacing + "em";
        }
    }

    // 唱えた呪文の名前を画面中央に浮かべる
    function incant(name) {
        document.querySelectorAll(".incant").forEach(function (n) { n.remove(); });
        var n = el("div", "incant", name);
        n.setAttribute("aria-hidden", "true");
        document.body.appendChild(n);
        n.addEventListener("animationend", function () { n.remove(); });
    }

    function showToast(text) {
        notify({ title: text, ms: 3200 });
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

    // ---------- フクロウの親しさ ----------
    // 話しかける・尋ねる・呪文やルーン・鍵・毎日の訪問などで少しずつ上がり、口調が打ち解けていく。
    // 最後の段階で名前 (オルド) を明かす。記録はこのブラウザに残る。
    var OWL_LEVELS = [0, 10, 25, 45]; // この値以上でその段階
    var affinity = +(load("rules-owl-affinity") || 0) || 0;
    var befriendAt = {};
    function owlLevel(v) {
        v = v == null ? affinity : v;
        for (var i = OWL_LEVELS.length - 1; i >= 0; i--) if (v >= OWL_LEVELS[i]) return i;
        return 0;
    }
    function owlName() { return owlLevel() >= 3 ? TEXT.owl.name : TEXT.owl.nobody; }
    // 親しさを上げる (同じ理由で続けて上がりすぎないよう、cooldown ミリ秒あける)
    function befriend(n, why, cooldown) {
        if (MODE !== "magic") return; // フクロウは魔法モードだけ
        var t = Date.now();
        if (cooldown && befriendAt[why] && t - befriendAt[why] < cooldown) return;
        befriendAt[why] = t;
        var before = owlLevel();
        affinity += n;
        save("rules-owl-affinity", String(affinity));
        var after = owlLevel();
        drawOwlName();
        if (after > before) {
            if (after >= 3) {
                setTimeout(function () {
                    announce({
                        eyebrow: TEXT.owl.nameAnnounce.eyebrow,
                        title: TEXT.owl.nameAnnounce.title,
                        sub: TEXT.owl.nameAnnounce.sub,
                        ms: 9000
                    });
                    owlSay(TEXT.owl.tipsFriend[0], true);
                }, 2500);
            } else {
                setTimeout(function () { owlSay(TEXT.owl.levelUp[after], true); }, 2500);
            }
        }
    }
    function drawOwlName() {
        if (owlBtn) {
            owlBtn.title = owlName();
            owlBtn.setAttribute("aria-label", owlName());
        }
        if (askHead) {
            var lv = owlLevel();
            askHead.textContent = owlName() + " ― " + TEXT.owl.affinity + " "
                + "●●●".slice(0, lv) + "○○○".slice(0, 3 - lv);
        }
    }
    var askHead = null;

    // 毎日はじめて来たときに少し親しくなり、2 回目以降はあいさつを返す
    (function () {
        var today = new Date().toDateString();
        if (load("rules-owl-day") !== today) {
            save("rules-owl-day", today);
            if (load("rules-owl-greeted")) befriend(2, "day");
        }
        var lv = owlLevel();
        var said = false;
        try { said = !!sessionStorage.getItem("rules-owl-hello"); } catch (e) {}
        if (load("rules-owl-greeted") && lv >= 1 && !said) {
            try { sessionStorage.setItem("rules-owl-hello", "1"); } catch (e) {}
            setTimeout(function () { owlSay(TEXT.owl.greetBack[lv], true); }, 3500);
        }
    })();

    function owlTip() {
        befriend(1, "tip", 20000);
        var lv = owlLevel();
        var tips = lv === 0 ? TEXT.owl.tipsCold
            : lv === 1 ? TEXT.owl.tips
            : lv === 2 ? TEXT.owl.tips.concat(TEXT.owl.tipsWarm)
            : TEXT.owl.tipsWarm.concat(TEXT.owl.tipsFriend, TEXT.owl.tips.slice(0, 3));
        var i;
        do { i = Math.floor(Math.random() * tips.length); } while (tips.length > 1 && i === lastTip);
        lastTip = i;
        owlSay(tips[i], true);
    }
    if (owlBtn) {
        owlBtn.addEventListener("click", function () { toggleAsk(); });
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
        { id: "nebula", words: ["ねぶら", "nebula"] },
        { id: "glacies", words: ["ぐらきえす", "glacies"] },
        { id: "magna", words: ["まぐな", "magna"] },
        { id: "parva", words: ["ぱるゔぁ", "ぱるば", "parva"] },
        { id: "solve", words: ["そるゔぇ", "そるべ", "solve"] },
        { id: "lethe", words: ["れーて", "lethe"] },
        { id: "virga", words: ["ゔぃるが", "びるが", "virga"] },
        { id: "obscura", words: ["おぶすくーら", "obscura"] }
    ];

    var root = document.documentElement;
    var candle = document.getElementById("candle");
    var known = {};
    try { (JSON.parse(load("rules-spells") || "[]") || []).forEach(function (id) { known[id] = true; }); } catch (e) {}
    var letheAt = 0, obscuraAt = 0;

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

    // 呪文ごとの魔力の消費 (書いていない呪文は 0)
    var SPELL_COST = {
        candela: 10, solaris: 25, atramento: 20, perspica: 15, vocare: 15,
        aeria: 30, scintilla: 25, nebula: 25, glacies: 25, magna: 5, virga: 10
    };
    // インクの暗号を解いた合言葉 (日本語版: とびらをひらけ / 英語版: UNLOCK。どちらの版でも通じる)
    var PASSCODES = ["とびらをひらけ", "unlock"];

    // 検索欄に唱えた言葉を呪文として扱う (呪文でなければ false を返し、ふつうの検索になる)
    function castSpell() {
        // 通常モードでは呪文は無く、ふつうの検索になる。ただし覚醒の言葉だけは受け付ける
        if (MODE !== "magic") {
            if (AWAKEN_WORDS.indexOf(compact(input.value)) === -1) return false;
            var box = input.getBoundingClientRect();
            input.value = "";
            render();
            input.blur();
            awaken(box.left + box.width / 2, box.top + box.height / 2);
            return true;
        }
        var raw = input.value;
        if (PASSCODES.indexOf(compact(raw)) !== -1) {
            input.value = "";
            render();
            input.blur();
            speakPasscode();
            return true;
        }
        var found = findSpell(raw);
        if (!found) return false;
        input.value = "";
        render();
        input.blur();
        performSpell(found.id, found.arg);
        return true;
    }

    function performSpell(id, arg) {
        var info = TEXT.spells[id];
        var cost = SPELL_COST[id] || 0;
        if (cost > mana) {
            showToast(TEXT.mana.empty);
            owlSay(TEXT.owl.manaEmpty, true);
            manaBox.classList.remove("shake");
            void manaBox.offsetWidth;
            manaBox.classList.add("shake");
            return false;
        }
        var toastText = info.toast;
        var ok = EFFECTS[id](arg);
        if (ok === false) return false; // 効果が出なかった (召喚の空振り・忘却の確認)
        if (typeof ok === "string") toastText = ok;
        spendMana(cost);

        incant(info.name);
        if (!known[id]) {
            known[id] = true;
            save("rules-spells", JSON.stringify(Object.keys(known)));
            befriend(3, "spell-" + id);
            renderSpellbook();
            var learned = {
                eyebrow: TEXT.announce.spellEyebrow,
                title: info.name,
                sub: TEXT.announce.spellSub(info.desc, knownCount(), SPELLS.length),
                light: true
            };
            // 呪文帳は禁書庫の中にあるので、開いている人にだけ案内する
            if (archiveOpen) { learned.href = "#spellbook"; learned.go = TEXT.announce.spellGo; }
            // 呪文の効果を先に見せてから告知する
            setTimeout(function () { announce(learned); }, 2200);
        }
        showToast(toastText);
        owlSay(info.owl, true);
        return true;
    }

    // ---------- 魔力 ----------
    // 最大 100。呪文で減り、1 秒に MANA_REGEN ずつ戻る (このタブを開いている間だけ)
    var MANA_MAX = 100;
    var MANA_REGEN = 2;
    var mana = MANA_MAX;
    var manaBox = document.getElementById("mana");
    var manaBar = document.getElementById("mana-bar");
    var manaText = document.getElementById("mana-text");
    function drawMana() {
        if (!manaBox) return; // 通常モードには魔力ゲージが無い
        manaBar.style.width = (mana / MANA_MAX * 100) + "%";
        manaText.textContent = TEXT.mana.label(mana, MANA_MAX);
        manaBox.classList.toggle("empty", mana < 10);
    }
    function spendMana(n) {
        mana = Math.max(0, mana - n);
        drawMana();
    }
    setInterval(function () {
        if (mana >= MANA_MAX) return;
        mana = Math.min(MANA_MAX, mana + MANA_REGEN / 2);
        drawMana();
    }, 500);
    drawMana();

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
                // 暗号の印: data-cipher 番目の文字の色を変える
                var ci = n.getAttribute("data-cipher");
                if (ci !== null) {
                    var mark = n.querySelectorAll(".c")[+ci];
                    if (mark) mark.classList.add("cipher");
                }
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

    var frostTimer;

    document.addEventListener("animationend", function (e) {
        if (e.animationName === "fly") e.target.classList.remove("flying");
    });

    // カードのまわりに金の粉を散らす
    function dust(r) {
        for (var k = 0; k < 10; k++) {
            var d = el("span", "dust");
            d.style.left = (r.left + Math.random() * r.width).toFixed(0) + "px";
            d.style.top = (r.top + r.height * (0.5 + Math.random() * 0.5)).toFixed(0) + "px";
            d.style.setProperty("--dx", (Math.random() * 60 - 30).toFixed(0) + "px");
            document.body.appendChild(d);
            d.addEventListener("animationend", function () { this.remove(); });
        }
    }
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
            keyWeather("mist", 9000);
        },
        glacies: function () {
            root.classList.add("frozen");
            clearTimeout(frostTimer);
            frostTimer = setTimeout(function () { root.classList.remove("frozen"); }, 7000);
            keyWeather("frost", 7000);
        },
        aeria: function () {
            // 画面に見えているカードだけを、1 枚ずつ違う方向へ飛ばして、数秒後に元の場所へ戻す
            // (飛ぶ方向・回転・順番はカードごとの CSS 変数で渡し、動きは style.css の .flying で付ける)
            var vw = window.innerWidth, vh = window.innerHeight;
            var visible = cards.filter(function (c) {
                if (c.offsetParent === null) return false;
                var r = c.getBoundingClientRect();
                return r.bottom > 0 && r.top < vh;
            });
            visible.forEach(function (c, i) {
                var r = c.getBoundingClientRect();
                // 左・右・上のどこかへ、画面の外まで飛んでいく
                var side = Math.random();
                var tx = side < 0.33 ? -(r.right + 80) : side < 0.66 ? (vw - r.left + 80) : (Math.random() - 0.5) * vw * 0.6;
                var ty = -(r.bottom + 60 + Math.random() * 120);
                var rot = Math.random() * 70 - 35;
                c.style.setProperty("--fx", tx.toFixed(0) + "px");
                c.style.setProperty("--fy", ty.toFixed(0) + "px");
                c.style.setProperty("--fr", rot.toFixed(1) + "deg");
                c.style.setProperty("--fr-lift", (rot * 0.08).toFixed(1) + "deg");
                c.style.setProperty("--fr-land", (-rot * 0.05).toFixed(1) + "deg");
                c.style.setProperty("--fd", (i * 110) + "ms");
                c.classList.remove("flying");
                void c.offsetWidth; // もう一度唱えたときも最初から飛ぶように
                c.classList.add("flying");
                // 飛び立つときに金の粉を少し散らす
                setTimeout(function () { dust(r); }, i * 110 + 500);
            });
        },
        scintilla: function () {
            var glow = el("div", "ember-glow");
            document.body.appendChild(glow);
            glow.addEventListener("animationend", function () { glow.remove(); });
            for (var i = 0; i < 70; i++) {
                (function (delay) {
                    setTimeout(function () {
                        var e = el("span", "ember");
                        e.style.left = (Math.random() * 100).toFixed(1) + "vw";
                        e.style.setProperty("--d", (3.5 + Math.random() * 3).toFixed(1) + "s");
                        e.style.setProperty("--s", (3 + Math.random() * 5).toFixed(1) + "px");
                        e.style.setProperty("--dx", (Math.random() * 200 - 100).toFixed(0) + "px");
                        document.body.appendChild(e);
                        e.addEventListener("animationend", function () { e.remove(); });
                    }, delay);
                })(i * 55);
            }
        },
        magna: function () { root.style.fontSize = "112.5%"; },
        parva: function () { root.style.fontSize = ""; },
        solve: function () {
            candle.classList.remove("lit");
            root.classList.remove("reveal-notes", "frozen");
            cards.forEach(function (c) { c.classList.remove("flying"); });
            document.querySelectorAll(".mist").forEach(function (m) { m.remove(); });
            root.style.fontSize = "";
            hideInk();
        },
        virga: function () {
            wandOn = !wandOn;
            if (!wandOn) return TEXT.spells.virga.toastOff;
        },
        obscura: function () {
            // 魔法を覆い隠して通常モードへ戻る。間違いで唱えても困らないよう、10 秒以内に 2 回唱えたときだけ
            var t = Date.now();
            if (t - obscuraAt > 10000) {
                obscuraAt = t;
                showToast(TEXT.obscuraWarn);
                owlSay(TEXT.obscuraWarn, true);
                return false;
            }
            obscuraAt = 0;
            root.classList.add("veiling");
            document.body.appendChild(el("div", "veil"));
            setTimeout(function () { switchMode("normal", "rules-veil"); }, 1900);
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
            li.appendChild(document.createTextNode(known[sp.id] ? info.desc : (TEXT.spellRiddles[sp.id] || TEXT.spellUnknown)));
            if (known[sp.id] && TEXT.runes[sp.id]) {
                li.appendChild(el("br"));
                li.appendChild(el("small", null, TEXT.runeLabel(TEXT.runes[sp.id])));
            }
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
            lightUp(x, y);
        });
    }
    window.addEventListener("mousemove", function (e) { moveCandle(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener("touchmove", function (e) {
        if (e.touches[0]) moveCandle(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // 灯りの届く所 (半径 CANDLE_R) にある暗号の印と「灯りの鍵」だけを光らせる
    var CANDLE_R = 160;
    function near(elm, x, y) {
        var r = elm.getBoundingClientRect();
        if (!r.width) return false;
        return Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y) < CANDLE_R;
    }
    function lightUp(x, y) {
        var on = candle.classList.contains("lit");
        document.querySelectorAll(".ink.revealed .c.cipher").forEach(function (c) {
            c.classList.toggle("shine", on && near(c, x, y));
        });
        var k = document.querySelector('.hidden-key[data-key="1"]');
        if (k) k.classList.toggle("lit", on && keysAwake() && !keysFound["1"] && near(k, x, y));
    }

    // ---------- ルーン (本文の余白にマウスで描いて唱える) ----------
    // 何もない余白 (カードや文字の上ではない所) でマウスを押したまま描くと、形を見分けて呪文を唱える。
    //   円 → カンデラ / 三角 → スキンティラ / ジグザグ → グラキエス / 下から上へまっすぐ → アエリア
    // スマホの指はスクロールと区別できないので、マウスとペンだけ。
    var RUNE_SPELL = { circle: "candela", triangle: "scintilla", zigzag: "glacies", up: "aeria" };
    var runeCanvas = el("canvas", "rune-canvas");
    runeCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(runeCanvas);
    var rctx = runeCanvas.getContext ? runeCanvas.getContext("2d") : null;
    var runePts = null, runeFade = 0;

    function sizeRuneCanvas() {
        var dpr = window.devicePixelRatio || 1;
        runeCanvas.width = window.innerWidth * dpr;
        runeCanvas.height = window.innerHeight * dpr;
        if (rctx) rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeRuneCanvas();
    window.addEventListener("resize", sizeRuneCanvas);

    function drawRune(alpha) {
        if (!rctx) return;
        rctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (!runePts || runePts.length < 2) return;
        rctx.lineCap = "round";
        rctx.lineJoin = "round";
        rctx.strokeStyle = "rgba(214, 178, 110, " + (0.9 * alpha) + ")";
        rctx.shadowColor = "rgba(214, 178, 110, " + (0.8 * alpha) + ")";
        rctx.shadowBlur = 12;
        rctx.lineWidth = 2.2;
        rctx.beginPath();
        rctx.moveTo(runePts[0].x, runePts[0].y);
        for (var i = 1; i < runePts.length; i++) rctx.lineTo(runePts[i].x, runePts[i].y);
        rctx.stroke();
    }

    // 何もない余白で押したかどうか
    function isBlank(target) {
        if (!target || !target.closest) return false;
        if (target.closest(".side, .owl, .announce-wrap, a, button, input, select, label, textarea")) return false;
        return target === document.body || target === document.documentElement
            || target.matches(".layout, .main, .chapter, .rules, .circle, .sky");
    }

    // 点の列を等間隔に並べ直す
    function resample(pts, n) {
        var len = 0, i;
        for (i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        var step = len / (n - 1), out = [pts[0]], acc = 0, prev = pts[0];
        for (i = 1; i < pts.length; i++) {
            var cur = pts[i], d = Math.hypot(cur.x - prev.x, cur.y - prev.y);
            while (acc + d >= step && out.length < n) {
                var t = (step - acc) / d;
                prev = { x: prev.x + (cur.x - prev.x) * t, y: prev.y + (cur.y - prev.y) * t };
                out.push(prev);
                d = Math.hypot(cur.x - prev.x, cur.y - prev.y);
                acc = 0;
            }
            acc += d;
            prev = cur;
        }
        while (out.length < n) out.push(pts[pts.length - 1]);
        return { pts: out, len: len };
    }

    // 描いた形を見分ける (circle / triangle / zigzag / up / null)
    function recognize(raw) {
        if (raw.length < 6) return null;
        var r = resample(raw, 40), pts = r.pts, len = r.len;
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        pts.forEach(function (q) {
            minX = Math.min(minX, q.x); maxX = Math.max(maxX, q.x);
            minY = Math.min(minY, q.y); maxY = Math.max(maxY, q.y);
        });
        var w = maxX - minX, h = maxY - minY, diag = Math.hypot(w, h);
        if (diag < 70) return null; // 小さすぎるのはただのクリック
        var first = pts[0], last = pts[pts.length - 1];
        var closed = Math.hypot(last.x - first.x, last.y - first.y) < diag * 0.3;

        // 曲がり角の数 (向きが 55 度以上変わる所。続けて曲がる所は 1 つと数える)
        var corners = 0, bending = false, totalTurn = 0;
        for (var i = 2; i < pts.length; i++) {
            var a1 = Math.atan2(pts[i - 1].y - pts[i - 2].y, pts[i - 1].x - pts[i - 2].x);
            var a2 = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
            var dA = Math.abs(a2 - a1);
            if (dA > Math.PI) dA = 2 * Math.PI - dA;
            totalTurn += dA;
            if (dA > 0.96) { if (!bending) corners++; bending = true; } else bending = false;
        }

        if (!closed && corners === 0 && (first.y - last.y) > len * 0.8 && h > 90) return "up";
        // 五芒星: 一筆で描く星。向きの変化の合計が三角や円のほぼ倍になる
        if (closed && corners >= 3 && totalTurn > 9.5) return "star";
        if (closed && corners >= 2 && corners <= 4) return "triangle";
        if (closed && corners <= 1 && totalTurn > 4.5 && w > 0.4 * h && h > 0.4 * w) return "circle";
        // 渦: 閉じずに、角を作らず、ぐるぐると 1 周半以上まわる
        if (!closed && corners <= 2 && totalTurn > 9) return "spiral";
        if (!closed && corners >= 3) return "zigzag";
        return null;
    }

    document.addEventListener("pointerdown", function (e) {
        if (MODE !== "magic") return; // ルーンは魔法モードだけ
        if (e.button !== 0 || (e.pointerType !== "mouse" && e.pointerType !== "pen")) return;
        if (!isBlank(e.target)) return;
        e.preventDefault();
        runePts = [{ x: e.clientX, y: e.clientY }];
        clearTimeout(runeFade);
        root.classList.add("drawing");
    });
    window.addEventListener("pointermove", function (e) {
        if (!runePts) return;
        runePts.push({ x: e.clientX, y: e.clientY });
        drawRune(1);
    });
    window.addEventListener("pointerup", function () {
        if (!runePts) return;
        root.classList.remove("drawing");
        var shape = recognize(runePts);
        var pts = runePts;
        // 描いた線をゆっくり消す
        var t0 = Date.now();
        (function fade() {
            var k = 1 - (Date.now() - t0) / 900;
            runePts = null;
            if (k <= 0) { if (rctx) rctx.clearRect(0, 0, window.innerWidth, window.innerHeight); return; }
            runePts = pts;
            drawRune(k);
            runePts = null;
            runeFade = setTimeout(fade, 30);
        })();
        if (shape === "spiral") { tryFinal(); return; }
        if (shape === "star") { drawStar(); return; }
        if (shape && performSpell(RUNE_SPELL[shape], "")) {
            befriend(2, "rune", 60000);
            setTimeout(function () { owlSay(TEXT.owl.rune); }, 2600);
        }
    });

    // ---------- ヴィルガ (指先が杖になり、金の粉がこぼれる) ----------
    var wandOn = false, wandLast = 0;
    window.addEventListener("mousemove", function (e) {
        if (!wandOn) return;
        var t = Date.now();
        if (t - wandLast < 35) return;
        wandLast = t;
        var d = el("span", "wand-dust");
        d.style.left = (e.clientX + Math.random() * 6 - 3).toFixed(0) + "px";
        d.style.top = (e.clientY + Math.random() * 6 - 3).toFixed(0) + "px";
        d.style.setProperty("--dx", (Math.random() * 16 - 8).toFixed(0) + "px");
        document.body.appendChild(d);
        d.addEventListener("animationend", function () { d.remove(); });
    }, { passive: true });

    // ---------- 隠された三つの鍵 ----------
    // 合言葉を唱えるまで、鍵はどこにも存在しない。目覚めたあとも、鍵はそれぞれ好む場所でしか姿を見せない。
    //   鍵 1 (用語集の説明文): カンデラの灯りを近づけたとき
    //   鍵 2 (罰則の注意書き): ネブラの霧の中
    //   鍵 3 (改訂履歴の見出し): グラキエスで凍っているあいだ
    // 三つそろったら、禁書庫の余白に五芒星のルーンを描くと「第二の書架」が開く。
    var KEY_TOTAL = 3;
    var keysFound = {};
    try { (JSON.parse(load("rules-keys") || "[]") || []).forEach(function (k) { keysFound[k] = true; }); } catch (e) {}
    var secondShelf = document.getElementById("second-shelf");
    var sealBroken = !!load("rules-seal");
    var passcodeHeard = !!load("rules-passcode");
    function keyCount() { return Object.keys(keysFound).length; }
    function keysAwake() { return passcodeHeard; }
    function shelfOpen() { return ADMIN || (keyCount() >= KEY_TOTAL && sealBroken); }
    function drawKeys() {
        root.classList.toggle("keys-awake", keysAwake());
        document.querySelectorAll(".hidden-key").forEach(function (k) {
            k.classList.toggle("gone", !!keysFound[k.getAttribute("data-key")]);
        });
    }

    // 霧の中の鍵は、霧より手前に「幻の鍵」を浮かべて拾えるようにする (霧が本文を覆ってしまうため)
    var phantom = null;
    function keyWeather(kind, ms) {
        if (!keysAwake()) return;
        var id = kind === "mist" ? "2" : "3";
        if (keysFound[id]) return;
        var k = document.querySelector('.hidden-key[data-key="' + id + '"]');
        if (!k || k.offsetParent === null) return; // その章を開いていない
        if (kind === "frost") {
            k.classList.add("lit");
            setTimeout(function () { k.classList.remove("lit"); }, ms);
            return;
        }
        // 霧: 少し遅れて、霧がいちばん濃くなる頃に浮かぶ
        setTimeout(function () {
            var r = k.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) return;
            if (phantom) phantom.remove();
            phantom = k.cloneNode(true);
            phantom.classList.add("phantom", "lit");
            phantom.style.left = r.left + "px";
            phantom.style.top = r.top + "px";
            document.body.appendChild(phantom);
            var p = phantom;
            setTimeout(function () { if (p.parentNode) p.remove(); if (phantom === p) phantom = null; }, ms - 2500);
        }, 1800);
    }
    window.addEventListener("scroll", function () { if (phantom) { phantom.remove(); phantom = null; } }, { passive: true });

    function collectKey(id, k) {
        if (keysFound[id]) return;
        keysFound[id] = true;
        save("rules-keys", JSON.stringify(Object.keys(keysFound)));
        k.classList.add("found");
        befriend(3, "key-" + id);
        setTimeout(function () { drawKeys(); if (k.classList.contains("phantom")) k.remove(); }, 900);
        var n = keyCount();
        if (n < KEY_TOTAL) {
            announce({ eyebrow: TEXT.keys.eyebrow, title: TEXT.keys.found(n, KEY_TOTAL), sub: TEXT.keys.foundSub, light: true, ms: 4000 });
            owlSay(TEXT.owl.key, true);
        } else {
            announce({ eyebrow: TEXT.keys.eyebrow, title: TEXT.keys.allTitle, sub: archiveOpen ? TEXT.keys.allSub : TEXT.keys.allSubSealed, ms: 10000 });
            owlSay(TEXT.owl.keysAllHint, true);
        }
    }
    document.addEventListener("click", function (e) {
        var k = e.target.closest(".hidden-key");
        if (!k) return;
        e.preventDefault();
        if (!k.classList.contains("lit")) return; // 姿を見せていない鍵は拾えない
        collectKey(k.getAttribute("data-key"), k);
    });
    drawKeys();

    // 五芒星を描いたとき: 禁書庫の中で、鍵が三つそろっていれば封印が解ける
    function drawStar() {
        if (shelfOpen()) return;
        if (keyCount() < KEY_TOTAL) { owlSay(TEXT.owl.starNotYet, true); return; }
        if (current !== "archive" || !archiveOpen) { owlSay(TEXT.owl.starWrongPlace, true); return; }
        sealBroken = true;
        save("rules-seal", "1");
        befriend(5, "seal");
        var f = el("div", "flash");
        document.body.appendChild(f);
        setTimeout(function () { f.remove(); }, 1900);
        updateProgress();
        setTimeout(function () {
            announce({ eyebrow: TEXT.keys.eyebrow, title: TEXT.keys.sealTitle, sub: TEXT.keys.sealSub, href: "#second-shelf", go: TEXT.keys.go, ms: 12000 });
            owlSay(TEXT.owl.keysAll, true);
        }, 1200);
    }

    // ---------- 合言葉 (インクの暗号を解くと、鍵が目を覚ます) ----------
    function speakPasscode() {
        incant(LANG === "en" ? "UNLOCK" : "とびらをひらけ");
        if (passcodeHeard) { showToast(TEXT.passcode.again); return; }
        passcodeHeard = true;
        save("rules-passcode", "1");
        befriend(4, "passcode");
        drawKeys();
        setTimeout(function () {
            announce({ eyebrow: TEXT.passcode.eyebrow, title: TEXT.passcode.title, sub: TEXT.passcode.sub, ms: 12000 });
            owlSay(TEXT.owl.passcode, true);
        }, 1200);
    }

    // ---------- 季節の舞い物 ----------
    // 月に合わせて、ときどきひとつずつ舞い落ちる (春: 花びら / 夏: 蛍 / 秋: 落ち葉 / 冬: 雪)
    var SEASON_MAX = 6;
    function seasonKind() {
        var m = new Date().getMonth() + 1;
        return m >= 3 && m <= 5 ? "petal" : m >= 6 && m <= 8 ? "firefly" : m >= 9 && m <= 11 ? "leaf" : "snow";
    }
    function spawnSeason() {
        // (ゆっくり少しだけ舞うので、Windows の「アニメーション効果」がオフでも出す)
        if (document.hidden || document.querySelectorAll(".season").length >= SEASON_MAX) return;
        var kind = seasonKind();
        var f = el("span", "season " + kind);
        f.setAttribute("aria-hidden", "true");
        f.style.left = (5 + Math.random() * 90).toFixed(1) + "vw";
        f.style.setProperty("--dx", (Math.random() * 160 - 80).toFixed(0) + "px");
        f.style.setProperty("--rot", (Math.random() * 720 - 360).toFixed(0) + "deg");
        if (kind === "firefly") {
            f.style.top = (35 + Math.random() * 55).toFixed(1) + "vh";
            f.style.setProperty("--d", (7 + Math.random() * 4).toFixed(1) + "s");
        } else {
            f.style.setProperty("--d", (11 + Math.random() * 6).toFixed(1) + "s");
        }
        document.body.appendChild(f);
        f.addEventListener("animationend", function () { f.remove(); });
    }
    (function seasonLoop() {
        spawnSeason();
        setTimeout(seasonLoop, 4000 + Math.random() * 5000);
    })();

    // ---------- フクロウに尋ねる ----------
    // 尋ねた言葉に近い規則・質問を探して案内する (検索と違い、言い回しが違っても近いものを拾う)
    var askBox = null, askAnswer = null;
    function toggleAsk() {
        if (askBox && !askBox.hidden) { askBox.hidden = true; return; }
        if (!askBox) {
            askBox = el("div", "owl-ask");
            askHead = el("p", "owl-ask-head");
            askBox.appendChild(askHead);
            var form = el("form");
            var q = el("input");
            q.type = "text";
            q.placeholder = TEXT.ask.placeholder;
            q.setAttribute("aria-label", TEXT.ask.placeholder);
            var send = el("button", null, TEXT.ask.send);
            send.type = "submit";
            form.appendChild(q);
            form.appendChild(send);
            askAnswer = el("div", "answer-area");
            var row = el("div", "row-end");
            var tipBtn = el("button", null, TEXT.ask.tip);
            tipBtn.type = "button";
            tipBtn.addEventListener("click", function () { owlTip(); });
            var closeBtn = el("button", null, TEXT.ask.close);
            closeBtn.type = "button";
            closeBtn.addEventListener("click", function () { askBox.hidden = true; });
            row.appendChild(tipBtn);
            row.appendChild(closeBtn);
            askBox.appendChild(form);
            askBox.appendChild(askAnswer);
            askBox.appendChild(row);
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                answer(q.value);
            });
            askAnswer.addEventListener("click", function (e) {
                if (e.target.closest("a")) askBox.hidden = true;
            });
            var owlEl = document.getElementById("owl");
            owlEl.insertBefore(askBox, owlBtn);
        }
        askBox.hidden = false;
        drawOwlName();
        owlBubble.classList.remove("show");
        askBox.querySelector("input").focus();
    }

    // 文字の組 (2 文字ずつ) の重なりで近さを測る。ひらがなだけの組 (「して」「いい」など) は軽く数える
    function grams(t) {
        var s = norm(t).replace(/[\s、。・，．,.!?！？「」()（）]/g, "");
        var out = {};
        for (var i = 0; i < s.length - 1; i++) {
            var g = s.substr(i, 2);
            out[g] = /^[ぁ-ゟ]+$/.test(g) ? 0.15 : 1;
        }
        return out;
    }
    var STOP_EN = ["the", "a", "an", "is", "are", "can", "i", "do", "does", "to", "of", "in", "on", "it", "my", "what", "how", "if", "be", "and", "or", "for", "with", "me", "should"];
    function score(query, d) {
        if (LANG === "en") {
            var words = norm(query).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 1 && STOP_EN.indexOf(w) === -1; });
            if (!words.length) return 0;
            var hit = words.filter(function (w) { return d.text.indexOf(w.length > 4 ? w.slice(0, -1) : w) !== -1; }).length;
            return hit / words.length;
        }
        var g = grams(query), total = 0, got = 0;
        Object.keys(g).forEach(function (k) {
            total += g[k];
            if (d.text.indexOf(k) !== -1) got += g[k];
        });
        return total ? got / total : 0;
    }
    function answer(query) {
        askAnswer.innerHTML = "";
        if (!query.trim()) return;
        if (FINAL_NAMES.indexOf(compact(query)) !== -1) { askAnswer.appendChild(document.createTextNode(elsheimReply())); return; }
        var best = data
            .map(function (d) { return { d: d, s: score(query, d) }; })
            .filter(function (x) { return x.s >= 0.5; })
            .sort(function (a, b) { return b.s - a.s; })
            .slice(0, 3);
        if (!best.length) {
            askAnswer.appendChild(document.createTextNode(TEXT.ask.none));
            return;
        }
        befriend(2, "ask", 30000);
        askAnswer.appendChild(document.createTextNode(TEXT.ask.intro));
        var ul = el("ul");
        best.forEach(function (x) {
            var a = el("a");
            a.href = "#" + x.d.el.id;
            var num = x.d.el.getAttribute("data-num") || "";
            if (num) a.appendChild(el("span", "num", num));
            a.appendChild(document.createTextNode(x.d.chapter === "glossary" ? x.d.el.getAttribute("data-term") : x.d.el.querySelector("h3").textContent));
            var li = el("li");
            li.appendChild(a);
            ul.appendChild(li);
        });
        askAnswer.appendChild(ul);
    }

    // ---------- 夜の書架 (見ている人の時計で 0〜4 時、禁書庫が開いていれば現れる) ----------
    var nightShelf = document.getElementById("night-shelf");
    function isMidnight() { var h = new Date().getHours(); return h >= 0 && h < 4; }
    function updateNight() {
        if (!nightShelf) return;
        var show = archiveOpen && (isMidnight() || ADMIN);
        nightShelf.hidden = !show;
        if (!show || ADMIN) return;
        // その夜に初めて現れたときだけ告知する (日付で覚える)
        var night = new Date().toDateString();
        if (load("rules-night") === night) return;
        save("rules-night", night);
        setTimeout(function () {
            announce({
                eyebrow: TEXT.owl.nightAnnounce.eyebrow,
                title: TEXT.owl.nightAnnounce.title,
                sub: TEXT.owl.nightAnnounce.sub,
                href: "#night-shelf",
                go: TEXT.announce.archiveGo,
                ms: 9000
            });
            owlSay(TEXT.owl.night, true);
        }, 2000);
    }
    setInterval(updateNight, 60 * 1000);

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
    var progressReady = false;
    var chapterDone = {}; // 章ごとの「読み終えた」状態 (読み終えた瞬間を見分けるため) // 最初の表示では「開いた瞬間」の演出をしない

    function updateProgress() {
        var done = 0;
        readable.forEach(function (d) {
            var r = !!readSet[d.el.id];
            d.el.classList.toggle("read", r);
            if (r) done++;
        });
        progressText.textContent = done + " / " + readable.length;
        progressBar.style.width = (readable.length ? done / readable.length * 100 : 0) + "%";

        // 章ごとに全部読んだら「済」。読んでいる最中に読み終えたら中央に告知する
        links.forEach(function (a) {
            var id = a.getAttribute("data-chapter");
            if (READ_CHAPTERS.indexOf(id) === -1) return;
            var list = readable.filter(function (d) { return d.chapter === id; });
            var all = list.length > 0 && list.every(function (d) { return readSet[d.el.id]; });
            a.classList.toggle("done", all);
            // (最後の章を読み終えたときは、すぐ後に禁書庫の告知が出るので章の告知は省く)
            if (all && !chapterDone[id] && progressReady && done < readable.length) {
                var name = a.querySelector(".ja").firstChild.textContent.trim();
                announce({
                    eyebrow: TEXT.announce.chapterEyebrow,
                    title: TEXT.announce.chapterTitle(name),
                    sub: TEXT.announce.chapterSub(readable.length - done),
                    ms: 4500
                });
            }
            chapterDone[id] = all;
        });

        // 「はじめての方へ」の続きから読む (読み始めていて、まだ残りがあるときだけ)
        var next = readable.filter(function (d) { return !readSet[d.el.id]; })[0];
        resume.hidden = !(done > 0 && next);
        if (next) {
            resumeText.textContent = TEXT.unread(readable.length - done);
            resumeLink.href = "#" + next.el.id;
        }

        // 禁書庫: すべて読み終えると左に扉が現れ、中身が読めるようになる (魔法モードだけ)
        if (MODE !== "magic" || !archiveNav) return;
        var open = ADMIN || (readable.length > 0 && done === readable.length);
        var opening = open && !archiveOpen && progressReady; // 読んでいる最中に開いた瞬間
        archiveOpen = open;
        archiveNav.hidden = !open;
        archiveSealed.hidden = open;
        archiveContent.hidden = !open;
        if (spellbook) spellbook.hidden = !open;
        if (secondShelf) secondShelf.hidden = !(open && shelfOpen());
        updateNight();
        archiveProgress.textContent = TEXT.archiveProgress(done, readable.length);
        if (opening) {
            var link = archiveNav.querySelector(".chapter-link");
            link.classList.remove("appear");
            void link.offsetWidth;
            link.classList.add("appear");
            announce({
                eyebrow: TEXT.announce.archiveEyebrow,
                title: TEXT.announce.archiveTitle,
                sub: TEXT.announce.archiveSub,
                href: "#archive",
                go: TEXT.announce.archiveGo,
                ms: 12000
            });
            owlSay(TEXT.owl.archive, true);
            befriend(5, "archive");
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

    // ---------- モードの切り替えの仕掛け ----------
    // ① 通常 → 魔法: 通常モードの検索欄に「覚醒の言葉」を打つと、検索欄から青い光が広がって魔法モードに覚醒する。
    //    言葉は物語の主神の名。通常モードのページには一切出てこないので、ふつうの検索で偶然切り替わることはない。
    // ② 魔法 → 通常: 呪文オブスクーラ (EFFECTS.obscura)。
    // どちらも、モードを記録して読み込み直し、読み込んだ先で到着の演出を出す。
    var AWAKEN_WORDS = ["あるてりおん", "arterion"]; // (ひらがな/カタカナ・大文字/小文字はどちらでも可)

    function switchMode(to, arrivalFlag) {
        save("rules-mode", to);
        try { sessionStorage.setItem(arrivalFlag, "1"); } catch (e) {}
        var u = new URL(location.href);
        u.searchParams.delete("mode"); // URL の ?mode= が残っていると、そちらが優先されてしまうため
        // (URL が今と同じだと replace では読み込み直されないので、URL を整えてから必ず読み込み直す)
        try { history.replaceState(null, "", u.toString()); } catch (e) {}
        location.reload();
    }

    // 覚醒: (x, y) から青い光が広がって画面を満たし、魔法モードで開き直す
    function awaken(x, y) {
        root.classList.add("awakening");
        var light = el("div", "awaken-light");
        light.style.left = x + "px";
        light.style.top = y + "px";
        document.body.appendChild(light);
        setTimeout(function () { switchMode("magic", "rules-awaken"); }, 1900);
    }

    // 切り替わった先で開いたときの演出
    (function () {
        var awakened = false, veiled = false;
        try {
            awakened = !!sessionStorage.getItem("rules-awaken");
            veiled = !!sessionStorage.getItem("rules-veil");
            sessionStorage.removeItem("rules-awaken");
            sessionStorage.removeItem("rules-veil");
        } catch (e) {}
        if (awakened && MODE === "magic") {
            // 青い光が引いていき、背景の魔法陣が描かれていく
            root.classList.add("arriving");
            var a = el("div", "arrive");
            document.body.appendChild(a);
            a.addEventListener("animationend", function () { a.remove(); });
            setTimeout(function () { root.classList.remove("arriving"); }, 7000);
            setTimeout(function () {
                announce({ eyebrow: TEXT.awaken.eyebrow, title: TEXT.awaken.title, sub: TEXT.awaken.sub, ms: 6000 });
            }, 1500);
        }
        if (veiled && MODE === "normal") {
            // 霧が晴れるように、普通の紙面が現れる
            var v = el("div", "unveil");
            document.body.appendChild(v);
            v.addEventListener("animationend", function () { v.remove(); });
        }
    })();

    // ---------- 最後の書架 ----------
    // たどり着くには、次のすべてが必要 (管理者表示では条件なしで開く):
    //   1. 第二の書架の封印を解いている   2. すべての呪文を見つけている   3. フクロウの親しさが最高 (名を明かしている)
    //   4. フクロウに空の都の名 (エルスハイン) を尋ね、謎かけを聞く
    //   5. 謎かけのとおり、0〜4 時に、カンデラの灯とヴィルガの杖をともし、禁書庫の余白に渦のルーンを描く
    var FINAL_NAMES = ["えるすはいん", "elsheim"];
    function finalOpen() { return ADMIN || load("rules-final") === "1"; }

    function elsheimReply() {
        if (owlLevel() < 3) return TEXT.final.askTooEarly;
        if (!shelfOpen()) return TEXT.final.askShelf;
        if (knownCount() < SPELLS.length) return TEXT.final.askSpells;
        save("rules-final-riddle", "1");
        return TEXT.final.askRiddle.replace(/\n/g, " ");
    }

    // ---------- 本 (最後の書架の小説) ----------
    // 本文を 1 本の「帯」に並べ、見開きの 2 ページがそれぞれ帯の別の位置を窓からのぞく形でページを作る。
    //   日本語: 縦書き (右から左へ行が進む)。行の幅 BOOK_LINE をそろえ、ページの幅をその倍数にして、行の途中で切れないようにする
    //   英語: 横書き。帯を段組みにして、1 段 = 1 ページにする
    // 抑揚の印 ("!!" や {g|…}) は、本では色や大きさを変えず、"!!" の一文の前後を 1 行ずつ空けるだけにする
    var BOOK_LINE = 30;   // 1 行の幅 (縦書き) / 行の高さ (横書き) [px]
    var book = null;

    function plainText(t) { return t.replace(/\{[bgr]\|([^}]*)\}/g, "$1"); }

    function renderNovel() {
        var box = document.getElementById("final-novel");
        if (!box || box.childNodes.length) return;
        var data = FINAL_NOVEL[LANG];
        var vertical = LANG !== "en";

        var strip = el("div", "book-strip");
        var titlePage = el("div", "book-titlepage");
        titlePage.appendChild(el("h2", null, data.title));
        strip.appendChild(titlePage);
        data.chapters.forEach(function (ch) {
            strip.appendChild(el("div", "book-break")); // 章を新しいページから始めるための空き (幅は layoutBook で決める)
            strip.appendChild(el("h3", "book-start", ch.h));
            ch.ps.forEach(function (t) {
                var gap = t.indexOf("!!") === 0;
                if (gap) t = t.slice(2);
                strip.appendChild(el("p", gap ? "gap" : null, plainText(t)));
            });
        });

        // 奥付 (架空の著者など)
        strip.appendChild(el("div", "book-break"));
        var col = el("div", "book-colophon book-start");
        col.appendChild(el("p", "col-title", data.colophon.title));
        var dl = el("dl");
        data.colophon.rows.forEach(function (row) {
            dl.appendChild(el("dt", null, row[0]));
            dl.appendChild(el("dd", null, row[1]));
        });
        col.appendChild(dl);
        col.appendChild(el("p", "col-note", data.colophon.note));
        strip.appendChild(col);
        // ここまでたどり着いた人への贈り物
        strip.appendChild(el("div", "book-break"));
        var gift = el("div", "book-gift book-start");
        gift.appendChild(el("h3", null, data.gift.h));
        data.gift.ps.forEach(function (t) { gift.appendChild(el("p", null, t)); });
        gift.appendChild(el("p", "gift-sign", data.gift.sign));
        strip.appendChild(gift);

        var bookEl = el("div", "book " + (vertical ? "vertical" : "horizontal"));
        var spread = el("div", "book-spread");
        var pages = [];
        for (var i = 0; i < 2; i++) {
            var page = el("div", "book-page");
            var view = el("div", "book-view");
            page.appendChild(view);
            page.appendChild(el("span", "book-folio"));
            spread.appendChild(page);
            pages.push({ page: page, view: view, strip: null });
        }
        // 読む順の 1 ページ目: 縦書きは右、横書きは左
        pages[0].page.classList.add(vertical ? "is-right" : "is-left");
        pages[1].page.classList.add(vertical ? "is-left" : "is-right");
        pages[0].strip = strip;
        pages[0].view.appendChild(strip);

        var nav = el("div", "book-nav");
        var back = el("button", "book-btn", vertical ? "→" : "←");
        var fwd = el("button", "book-btn", vertical ? "←" : "→");
        back.type = fwd.type = "button";
        back.setAttribute("aria-label", TEXT.book.prev);
        fwd.setAttribute("aria-label", TEXT.book.next);
        var counter = el("span", "book-count");
        // 縦書きは右から左へ進むので、「次へ」のボタンを左に置く
        if (vertical) { nav.appendChild(fwd); nav.appendChild(counter); nav.appendChild(back); }
        else { nav.appendChild(back); nav.appendChild(counter); nav.appendChild(fwd); }

        bookEl.appendChild(spread);
        bookEl.appendChild(nav);
        box.appendChild(bookEl);
        book = { el: bookEl, spread: spread, pages: pages, vertical: vertical, page: 0, count: 1, spreadMode: true, textW: 0, back: back, fwd: fwd, counter: counter };

        back.addEventListener("click", function () { turnBook(-1); });
        fwd.addEventListener("click", function () { turnBook(1); });
        // ページそのものを押してもめくれる (読む方向の先のページ = 次へ)
        pages.forEach(function (p) {
            p.page.addEventListener("click", function (e) {
                if (window.getSelection && String(window.getSelection())) return; // 文字を選んでいるときはめくらない
                var r = p.page.getBoundingClientRect();
                var leftHalf = e.clientX < r.left + r.width / 2;
                if (book.spreadMode) turnBook(p.page.classList.contains("is-right") === vertical ? -1 : 1);
                else turnBook((leftHalf === vertical) ? 1 : -1);
            });
        });
        // スマホ: 横にスワイプしてめくる
        var sx = null;
        spread.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
        spread.addEventListener("touchend", function (e) {
            if (sx == null) return;
            var dx = e.changedTouches[0].clientX - sx;
            sx = null;
            if (Math.abs(dx) < 40) return;
            turnBook((dx > 0) === vertical ? 1 : -1);
        });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layoutBook(); });
    }

    // 画面の大きさに合わせて、ページの大きさとページ数を決め直す
    function layoutBook() {
        if (!book || !book.el.offsetParent) return; // 最後の書架の章が見えていないときは測れない
        var b = book, L = BOOK_LINE;
        var ratio = b.count > 1 ? b.page / (b.count - 1) : 0;
        b.el.style.display = "none";
        var avail = b.el.parentNode.clientWidth;
        b.el.style.display = "";
        b.spreadMode = avail >= 700;
        var pad = b.spreadMode ? 34 : 22;
        var pageW = b.spreadMode ? Math.floor(avail / 2) : avail;
        var textW = b.vertical ? Math.floor((pageW - pad * 2) / L) * L : pageW - pad * 2;
        var textH = Math.max(300, Math.min(600, window.innerHeight - 250));
        if (!b.vertical) textH = Math.floor(textH / L) * L;
        b.textW = textW;
        b.el.style.setProperty("--text-w", textW + "px");
        b.el.style.setProperty("--text-h", textH + "px");
        b.el.style.setProperty("--line", L + "px");
        b.el.style.setProperty("--pad", pad + "px");
        b.pages[1].page.hidden = !b.spreadMode;

        var strip = b.pages[0].strip;
        strip.style.transform = "none";
        var breaks = strip.querySelectorAll(".book-break");
        breaks.forEach(function (x) { x.style.blockSize = "0px"; });
        if (b.vertical) {
            // 章・奥付・贈り物が、ページの最初の行から始まるように空きを入れる (前から順に)
            strip.querySelectorAll(".book-start").forEach(function (h) {
                var gap = h.previousElementSibling;
                if (!gap || !gap.classList.contains("book-break")) return;
                var fromRight = strip.offsetWidth - (h.offsetLeft + h.offsetWidth);
                var rest = fromRight % textW;
                if (rest > 0.5) gap.style.blockSize = (textW - rest) + "px";
            });
            b.count = Math.max(1, Math.ceil((strip.offsetWidth - 0.5) / textW));
        } else {
            b.count = Math.max(1, Math.ceil((strip.scrollWidth - 0.5) / textW));
        }
        // 見開きのもう 1 ページは、帯をそのまま写したもの
        if (b.pages[1].strip) b.pages[1].strip.remove();
        b.pages[1].strip = strip.cloneNode(true);
        b.pages[1].strip.setAttribute("aria-hidden", "true");
        b.pages[1].view.appendChild(b.pages[1].strip);

        var step = b.spreadMode ? 2 : 1;
        var p = Math.round(ratio * (b.count - 1));
        b.page = Math.max(0, p - (p % step));
        showBookPage();
    }

    function showBookPage() {
        var b = book;
        var step = b.spreadMode ? 2 : 1;
        b.pages.forEach(function (pg, i) {
            var idx = b.page + i;
            var off = idx * b.textW;
            if (pg.strip) {
                pg.strip.style.transform = "translateX(" + (b.vertical ? off : -off) + "px)";
                pg.strip.style.visibility = idx < b.count ? "visible" : "hidden";
            }
            pg.page.querySelector(".book-folio").textContent = idx > 0 && idx < b.count ? String(idx + 1) : "";
        });
        var last = Math.min(b.count, b.page + step);
        b.counter.textContent = (step === 2 && last > b.page + 1 ? (b.page + 1) + "–" + last : String(b.page + 1)) + " / " + b.count;
        b.back.disabled = b.page <= 0;
        b.fwd.disabled = b.page + step >= b.count;
    }

    function turnBook(dir) {
        if (!book) return;
        var step = book.spreadMode ? 2 : 1;
        var next = book.page + dir * step;
        if (next < 0 || next >= book.count) return;
        book.spread.classList.add("turning");
        setTimeout(function () {
            book.page = next;
            showBookPage();
            book.spread.classList.remove("turning");
        }, 180);
    }

    // キーボード: 本を開いているときだけ ← → でめくる (縦書きは ← が次へ)
    document.addEventListener("keydown", function (e) {
        if (!book || current !== "final" || document.activeElement === input) return;
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        var toLeft = e.key === "ArrowLeft";
        turnBook(toLeft === book.vertical ? 1 : -1);
    });
    var bookResize;
    window.addEventListener("resize", function () {
        clearTimeout(bookResize);
        bookResize = setTimeout(layoutBook, 200);
    });

    function showFinal(appear) {
        var nav = document.getElementById("final-nav");
        if (!nav) return;
        renderNovel();
        nav.hidden = false;
        if (appear) {
            var link = nav.querySelector(".chapter-link");
            link.classList.add("appear");
        }
    }

    function tryFinal() {
        if (finalOpen() || !load("rules-final-riddle")) return; // 謎かけを聞いていなければ、何も起きない
        if (current !== "archive") { owlSay(TEXT.final.notHere, true); return; }
        if (!isMidnight()) { owlSay(TEXT.final.notTime, true); return; }
        if (!(candle.classList.contains("lit") && wandOn)) { owlSay(TEXT.final.noLight, true); return; }
        save("rules-final", "1");
        befriend(5, "final");
        var f = el("div", "flash");
        document.body.appendChild(f);
        setTimeout(function () { f.remove(); }, 1900);
        showFinal(true);
        setTimeout(function () {
            announce({ eyebrow: "The Last Shelf", title: TEXT.final.announceTitle, sub: TEXT.final.announceSub, ms: 7000 });
            owlSay(TEXT.final.owlOpen, true);
        }, 1200);
        setTimeout(function () { location.hash = "#final"; }, 5000);
    }
    if (MODE === "magic" && finalOpen()) showFinal(false);

    // ---------- 管理者表示の入口と札 ----------
    (function () {
        var asked = new URLSearchParams(location.search).get("admin");
        if (asked != null) {
            // 合言葉を URL や履歴に残さないよう、確かめたらすぐ取り除いて読み込み直す
            var u = new URL(location.href);
            u.searchParams.delete("admin");
            var digest = window.crypto && crypto.subtle
                ? crypto.subtle.digest("SHA-256", new TextEncoder().encode(asked))
                : Promise.reject();
            digest.then(function (buf) {
                var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
                if (hex !== ADMIN_HASH) throw new Error("wrong");
                try { sessionStorage.setItem("rules-admin", "1"); } catch (e) {}
                try { history.replaceState(null, "", u.toString()); } catch (e) {}
                location.reload();
            }).catch(function () {
                try { history.replaceState(null, "", u.toString()); } catch (e) {}
                showToast(TEXT.admin.wrong);
            });
            return;
        }
        if (!ADMIN) return;
        var badge = el("div", "admin-badge");
        badge.appendChild(el("span", null, TEXT.admin.badge));
        var exit = el("button", null, TEXT.admin.exit);
        exit.type = "button";
        exit.addEventListener("click", function () {
            try { sessionStorage.removeItem("rules-admin"); } catch (e) {}
            location.reload();
        });
        badge.appendChild(exit);
        document.body.appendChild(badge);
    })();

    // ---------- 最初の表示 ----------
    // (route が URL の ?q= を消してしまうので、先に読んでおく)
    var initial = new URLSearchParams(location.search).get("q");
    route(!!location.hash && !initial);
    if (initial) { input.value = initial; render(); }
})();
