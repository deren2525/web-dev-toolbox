# Web Dev Toolbox

Web開発・テスト・デバッグで使える無料のWebツール集です。

公開サイト: <https://web-dev-toolbox.web.app/>

## 提供中のツール

- ブラウザ情報確認
- ダミー画像生成
- JSON整形・構文チェック
- Base64エンコード・デコード
- URLエンコード・デコード
- Unixタイムスタンプ変換
- UUID生成
- JWTデコーダー
- ハッシュ生成
- 文字数・バイト数カウンター

## データの取り扱い

文字列やファイルの変換、画像・UUID・ハッシュの生成など、主要な処理はブラウザ内で行います。入力した内容や生成結果を、本サイトのアプリケーションサーバーへ送信・保存する機能はありません。

ブラウザ情報確認ツールの前回との差分のみ、利用中のブラウザの`localStorage`へ保存します。

## ローカルで確認する

Node.js 24とpnpmが必要です。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## 使用技術

Nuxt、Vue、TypeScript、Tailwind CSSを使用しています。

## ライセンス

現時点ではライセンスを設定していません。
