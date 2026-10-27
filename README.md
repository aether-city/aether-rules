# aether-rules
AETHER CITY RULES

## 禁書庫の通知 (Discord)

禁書庫・第二の書架・夜の書架・最後の書架が開かれると、Discord に「〇人目の読者」と知らせる。
同じブラウザからは、書架ごとに 1 回だけ。管理者表示では知らせない。

```
ルールのページ (src/app.js の NOTIFY_URL) → Cloudflare Workers (worker/notify-worker.js) → Discord の Webhook
```

### 置き方

1. **Discord の Webhook を作る**: 通知を受けるチャンネルの設定 → 連携サービス → ウェブフック → 新しいウェブフック → 「ウェブフック URL をコピー」。
2. **KV を作る**: Cloudflare のダッシュボード → Storage & Databases → KV (Workers KV) → Create。名前は `aether-readers` など。
3. **Worker を作る**: Workers & Pages → Create → Worker → 「Hello World」から作って Deploy → Edit code で中身を `worker/notify-worker.js` に置き換えて Deploy。
4. **Worker の Settings**:
   - Bindings → Add → KV namespace: 変数名 `READERS`、2 で作った KV を選ぶ。
   - Variables and Secrets → Add: 種類 **Secret**、名前 `DISCORD_WEBHOOK`、値に 1 の URL。
5. Worker の URL (`https://〇〇.workers.dev`) を `src/app.js` の `NOTIFY_URL` に入れてプッシュする。

Worker のコードを変えたときは、3 の Edit code で貼り直して Deploy する (プッシュだけでは Cloudflare には届かない)。
