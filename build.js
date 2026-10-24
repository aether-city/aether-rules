// 公開用のページを _site/ に作る。
//   HTML と CSS はそのままコピーし、JavaScript (src/app.js) は難読化して _site/assets/app.js に置く。
//   src/ は _site/ に含めないので、公開されたページから元のコードは見えない。
//
//   npm run build        … 難読化して _site/ を作る (GitHub Actions もこれを使う)
//   npm run build:dev    … 難読化せずに _site/ を作る (手元で動きを確かめるとき)
//
// あわせて、リポジトリ直下の assets/app.js にも難読化したものを書き出す
// (GitHub Pages を「ブランチから公開」のまま使っている間も、ページが動くように)。
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const hash = (t) => crypto.createHash('sha1').update(t).digest('hex').slice(0, 10);

const ROOT = __dirname;
const OUT = path.join(ROOT, '_site');
const DEV = process.argv.includes('--dev');

// 公開するファイル (src/ や .github/ などは含めない)
const PAGES = ['index.html', 'en/index.html', 'assets/style.css'];
// (story/ の小説のテキストは、そのまま公開せず app.js の中に入れて難読化する)

function copy(rel) {
    const to = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(ROOT, rel), to);
}

function obfuscate(code) {
    const JavaScriptObfuscator = require('javascript-obfuscator');
    return JavaScriptObfuscator.obfuscate(code, {
        target: 'browser',
        compact: true,
        simplify: true,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,           // ASK_URL など、外から見える名前は変えない
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.3,
        deadCodeInjection: false,
        selfDefending: false,
        stringArray: true,              // 文字列 (物語・合言葉・呪文名) をまとめて暗号化する
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 1,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 2,
        splitStrings: true,
        splitStringsChunkLength: 8,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    }).getObfuscatedCode();
}

fs.rmSync(OUT, { recursive: true, force: true });
PAGES.forEach(copy);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// ----- 最後の書架の小説 (story/novel.ja.txt・story/novel.en.txt) を読み込む -----
// 書き方はそれぞれのファイルの先頭に書いてある。
//   題名:/title:  # 見出し  空行で段落  !! 前後を空ける一文  [奥付]/[colophon]  [贈り物]/[gift]  // メモ
function readStory(lang) {
    const file = path.join(ROOT, 'story', 'novel.' + lang + '.txt');
    const lines = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r/g, '').split('\n');
    const joiner = lang === 'ja' ? '' : ' '; // 段落の中の改行のつなぎ方 (日本語はそのまま、英語は空白)
    const novel = { title: '', chapters: [], colophon: { title: '', rows: [], note: '' }, gift: { h: '', ps: [], sign: '' } };
    let section = 'body';
    let chapter = null;
    let buf = [];
    const where = (i) => file + ' の ' + (i + 1) + ' 行目';
    const field = (t) => { const m = /^([^:：]+)[:：]\s*(.*)$/.exec(t); return m ? [m[1].trim(), m[2].trim()] : null; };
    const is = (key, names) => names.indexOf(key.toLowerCase()) !== -1;

    function flush(i) {
        if (!buf.length) return;
        let text = buf.join(joiner).trim();
        buf = [];
        if (text.startsWith('!!')) text = '!!' + text.slice(2).trim();
        if (section === 'gift') { novel.gift.ps.push(text); return; }
        if (!chapter) throw new Error(where(i) + ': 最初の「# 見出し」より前に段落があります');
        chapter.ps.push(text);
    }

    lines.forEach((line, i) => {
        if (line.trim().startsWith('//')) return;
        const t = line.trim();
        if (!t) { flush(i); return; }
        if (/^\[(奥付|colophon)\]$/i.test(t)) { flush(i); section = 'colophon'; return; }
        if (/^\[(贈り物|gift)\]$/i.test(t)) { flush(i); section = 'gift'; return; }

        if (section === 'colophon') {
            const f = field(t);
            if (!f) throw new Error(where(i) + ': 奥付は「項目: 内容」の形で書いてください');
            if (is(f[0], ['題名', 'title'])) novel.colophon.title = f[1];
            else if (is(f[0], ['注記', 'note'])) novel.colophon.note = f[1];
            else novel.colophon.rows.push(f);
            return;
        }
        if (section === 'gift') {
            const f = field(t);
            if (f && is(f[0], ['見出し', 'heading'])) { flush(i); novel.gift.h = f[1]; return; }
            if (f && is(f[0], ['署名', 'sign'])) { flush(i); novel.gift.sign = f[1]; return; }
            buf.push(t);
            return;
        }
        // 本文
        if (!novel.title && !chapter) {
            const f = field(t);
            if (f && is(f[0], ['題名', 'title'])) { novel.title = f[1]; return; }
        }
        if (t.startsWith('#')) {
            flush(i);
            chapter = { h: t.replace(/^#+\s*/, ''), ps: [] };
            novel.chapters.push(chapter);
            return;
        }
        buf.push(t);
    });
    flush(lines.length);

    if (!novel.title) throw new Error(file + ': 「題名:」(title:) がありません');
    if (!novel.chapters.length) throw new Error(file + ': 「# 見出し」の章がひとつもありません');
    return novel;
}

const src = fs.readFileSync(path.join(ROOT, 'src', 'app.js'), 'utf8')
    .replace('__FINAL_NOVEL__', () => JSON.stringify({ ja: readStory('ja'), en: readStory('en') }));
if (src.includes('__FINAL_NOVEL__')) throw new Error('小説の本文を入れられませんでした');
const js = DEV ? src : obfuscate(src);
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), js);
if (!DEV) fs.writeFileSync(path.join(ROOT, 'assets', 'app.js'), js);

// ブラウザに古い app.js / style.css が残って新しい HTML と食い違わないよう、読み込む URL に中身ごとの印を付ける
const jsVer = hash(js);
const cssVer = hash(fs.readFileSync(path.join(ROOT, 'assets', 'style.css'), 'utf8'));
['index.html', 'en/index.html'].forEach((rel) => {
    const f = path.join(OUT, rel);
    let html = fs.readFileSync(f, 'utf8');
    html = html.replace(/(assets\/app\.js)"/g, '$1?v=' + jsVer + '"').replace(/(assets\/style\.css)"/g, '$1?v=' + cssVer + '"');
    fs.writeFileSync(f, html);
});

console.log((DEV ? '[dev] ' : '') + '_site/ を作りました (app.js: ' + Math.round(js.length / 1024) + ' KB)');
