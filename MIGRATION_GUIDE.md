# サクキロ公開URL移行ガイド

## 移行先

| 用途 | URL | 状態（2026-09-01確認） |
| --- | --- | --- |
| アプリ本体 | `https://sakukiro.ritastella.com/` | DNS未設定のため未開通 |
| LP | `https://sakukiro.ritastella.com/lp` | DNS未設定のため未開通 |
| 旧URL | `https://sakukiro.vercel.app/` | アプリ本体と最新LPを表示中 |

リポジトリでは、LPの最新日英対応版を `origin/main` から現在の `dev` に取り込み済みです。LPは [`client/src/pages/Landing.tsx`](client/src/pages/Landing.tsx)、ルートは `/lp` です。

## 先に知っておくこと

- アプリはバックエンドを持たず、記録をブラウザの `localStorage` に保存します。
- `sakukiro.vercel.app` と `sakukiro.ritastella.com` は別オリジンなので、既存ユーザーの記録は新URLへ自動移行されません。
- 現状はCSVエクスポートのみで再インポート機能がないため、既存ユーザーには切替前のCSV保存を案内してください。
- 旧 `*.vercel.app` のDNSはCloudflareから管理できません。旧URLから新URLへのリダイレクトは、旧Vercelプロジェクト側で設定します。

## Cloudflare Pagesの作成

1. Cloudflare Dashboardの **Workers & Pages** → **Create application** → **Pages** → Git連携を開きます。
2. GitHubリポジトリ `RitaStar1128/sakukiro` を接続します。
3. 次のビルド設定を入力します。

   | 項目 | 設定値 |
   | --- | --- |
   | Root directory | `/` |
   | Production branch | `main`（本番） |
   | Framework preset | React (Vite) または手動設定 |
   | Build command | `pnpm build` |
   | Build output directory | `dist/public` |
   | `NODE_VERSION` | `20` |
   | `PNPM_VERSION` | `10.4.1` |

4. Analyticsを使う場合だけ、`VITE_ANALYTICS_ENDPOINT` と `VITE_ANALYTICS_WEBSITE_ID` をPagesの環境変数に登録します。不要なら現状の分析スクリプトを整理するまで、分析値を前提にしないでください。
5. **Save and Deploy** で初回デプロイを実行し、発行された `*.pages.dev` URLで次を確認します。

   - `/` がアプリ本体を表示する
   - `/lp` が日本語LPを表示する
   - LPの `English` 切替とアプリへのCTAが動作する
   - `/history` の直アクセスでSPAフォールバックが機能する
   - PWAマニフェスト・アイコン・記録保存が動作する

Cloudflare PagesはGitHubのブランチへのpushで自動デプロイし、Pull RequestごとにPreview URLを作成できます。本番ブランチは、UI調整を含む変更を確認してから `main` に統合してください。

## カスタムドメインの設定

1. Pagesプロジェクトの **Custom domains** → **Set up a domain** を選択します。
2. `sakukiro.ritastella.com` を登録します。
3. `ritastella.com` のDNSをCloudflareで管理している場合は、画面の案内に従ってCNAMEを確定します。
4. DNSを別事業者で管理している場合は、Pages側でカスタムドメインを関連付けた後、次のCNAMEを登録します。

   ```text
   Type: CNAME
   Name: sakukiro
   Target: <Cloudflare Pagesのプロジェクト名>.pages.dev
   ```

手動でCNAMEだけを先に作らず、先にPagesの **Custom domains** へ登録してください。Cloudflare公式ドキュメントでは、関連付け前のCNAMEは解決失敗や `522` の原因になると案内されています。SSL証明書の発行完了後、`https://sakukiro.ritastella.com/` と `/lp` を確認します。

## 旧Vercel URLのリダイレクト

新ドメインが正常に表示できることを確認した後、旧Vercelプロジェクトをリダイレクト専用デプロイにします。プロジェクトルートに次の `vercel.json` を置いてデプロイすると、旧URLのパスを維持したまま新ドメインへ移せます。

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://sakukiro.ritastella.com/:path*",
      "permanent": true
    }
  ]
}
```

この設定はVercel側の旧プロジェクトに適用するものです。新しいCloudflare Pagesのデプロイが確認できる前に適用せず、切替後もしばらく旧Vercelプロジェクトを残してロールバック可能にしてください。

## 切替チェックリスト

- [ ] Pagesの `*.pages.dev` で `/`、`/lp`、`/history` を確認
- [ ] カスタムドメインのSSLが有効
- [ ] 新URLで新規記録・収入記録・履歴・CSV出力を確認
- [ ] 新URLでPWAの再インストールが必要なことを利用者へ案内
- [ ] 既存ユーザーへ、切替前のCSV保存と旧URLの利用期限を案内
- [ ] 旧Vercel URLのリダイレクトを設定
- [ ] 旧URLと新URLの両方で主要導線を確認
- [ ] 問題がなければ旧Vercelの自動デプロイを停止（プロジェクト削除は後日）

## 利用者向け移行案内文

```text
【サクキロ公開URL変更のお知らせ】

サクキロの公開URLを変更します。

新しいURL：https://sakukiro.ritastella.com/
LP：https://sakukiro.ritastella.com/lp
旧URL：https://sakukiro.vercel.app/

旧URLは順次新URLへ移行します。記録データはブラウザごとに保存されるため、
既存の記録を残したい場合は、URL切替前に旧URLからCSVを保存してください。
新URLではPWAをホーム画面へ追加し直してください。
```

## 公式ドキュメント

- [Cloudflare Pages GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Pages serving Pages（SPA fallback）](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Vercel static configuration（redirects）](https://vercel.com/docs/project-configuration/vercel-json)
