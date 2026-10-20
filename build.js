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

const ROOT = __dirname;
const OUT = path.join(ROOT, '_site');
const DEV = process.argv.includes('--dev');

// 公開するファイル (src/ や .github/ などは含めない)
const PAGES = ['index.html', 'en/index.html', 'assets/style.css'];

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

const src = fs.readFileSync(path.join(ROOT, 'src', 'app.js'), 'utf8');
const js = DEV ? src : obfuscate(src);
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), js);
if (!DEV) fs.writeFileSync(path.join(ROOT, 'assets', 'app.js'), js);

console.log((DEV ? '[dev] ' : '') + '_site/ を作りました (app.js: ' + Math.round(js.length / 1024) + ' KB)');
