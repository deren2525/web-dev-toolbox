export type ToolSeoDefinition = {
  slug: string
  targetUser: string
  searchIntent: string
  primaryQuery: string
  secondaryQueries: string[]
  title: string
  h1: string
  description: string
  relatedTools: string[]
}

export const toolSeoDefinitions: ToolSeoDefinition[] = [
  {
    slug: 'browser-checker',
    targetUser: '利用中のブラウザや画面環境を確認し、不具合報告へ添えたい人',
    searchIntent: 'ブラウザ、OS、User-Agent、画面サイズをまとめて確認する',
    primaryQuery: 'ブラウザ情報 確認',
    secondaryQueries: ['ブラウザ 確認', 'UserAgent 確認', '画面サイズ 確認'],
    title: 'ブラウザ情報確認ツール｜OS・画面サイズ・User-Agentを確認',
    h1: 'ブラウザ情報確認ツール',
    description:
      '現在使用しているブラウザ、OS、User-Agent、画面サイズ、Viewport、Device Pixel Ratioなどの環境情報をブラウザ上で確認できます。',
    relatedTools: ['timestamp-converter', 'json-formatter'],
  },
  {
    slug: 'dummy-image-generator',
    targetUser: 'アップロード試験用に指定サイズや容量の画像を作りたい人',
    searchIntent: 'サイズ、容量、形式、枚数を指定してテスト画像を生成する',
    primaryQuery: 'ダミー画像 生成',
    secondaryQueries: ['ダミー画像 作成', '指定容量 画像 作成', '100MB 画像 作成'],
    title: 'ダミー画像生成ツール｜サイズ・容量・形式を指定して作成',
    h1: 'ダミー画像生成ツール',
    description:
      'サイズ・枚数・形式・ファイル容量を指定して、開発やアップロードテスト用のダミー画像をブラウザ内で一括生成できます。',
    relatedTools: ['hash-generator'],
  },
  {
    slug: 'json-formatter',
    targetUser: 'JSONを読みやすく整形し、構文が正しいか確認したい人',
    searchIntent: 'JSONの整形、圧縮、構文チェックを行う',
    primaryQuery: 'JSON 整形',
    secondaryQueries: ['JSON Formatter', 'JSON 構文チェック', 'JSON 圧縮'],
    title: 'JSON整形・構文チェックツール｜JSON Formatter',
    h1: 'JSON整形・構文チェックツール',
    description:
      'JSONを読みやすく整形・圧縮し、構文エラーを無料で確認できるブラウザ完結型JSON Formatterです。',
    relatedTools: ['base64'],
  },
  {
    slug: 'base64',
    targetUser: '日本語を含む文字列とBase64を相互変換したい人',
    searchIntent: 'UTF-8文字列をBase64へエンコードまたはデコードする',
    primaryQuery: 'Base64 変換',
    secondaryQueries: ['Base64 エンコード', 'Base64 デコード'],
    title: 'Base64エンコード・デコードツール｜文字列を相互変換',
    h1: 'Base64エンコード・デコードツール',
    description: '日本語対応のBase64エンコード・デコードをブラウザ内で無料で行えます。',
    relatedTools: ['jwt-decoder', 'url-encoder', 'json-formatter'],
  },
  {
    slug: 'url-encoder',
    targetUser: 'URLやクエリ値をパーセントエンコードしたい人',
    searchIntent: '文字列またはURL全体をエンコード・デコードする',
    primaryQuery: 'URL エンコード',
    secondaryQueries: ['URL デコード', 'パーセントエンコード'],
    title: 'URLエンコード・デコードツール｜パーセントエンコード変換',
    h1: 'URLエンコード・デコードツール',
    description: '文字列やURLをパーセントエンコードへ変換し、デコードできる無料ツールです。',
    relatedTools: ['base64'],
  },
  {
    slug: 'timestamp-converter',
    targetUser: 'Unix時間と人が読める日時を相互変換したい人',
    searchIntent: '秒・ミリ秒のUnixタイムスタンプを日時と相互変換する',
    primaryQuery: 'Unix時間 変換',
    secondaryQueries: ['Unix Timestamp 変換', 'Epoch 変換', 'Unix時間 日付'],
    title: 'Unixタイムスタンプ変換ツール｜日時とUnix時間を相互変換',
    h1: 'Unixタイムスタンプ変換ツール',
    description:
      'Unix時間を日時へ、日時をUnixタイムスタンプへ変換します。秒・ミリ秒、ローカル時間・UTCに対応します。',
    relatedTools: ['jwt-decoder', 'json-formatter'],
  },
  {
    slug: 'uuid-generator',
    targetUser: 'テストデータなどに使うUUID v4をまとめて作りたい人',
    searchIntent: '暗号学的乱数を使ったUUID v4を一括生成する',
    primaryQuery: 'UUID 生成',
    secondaryQueries: ['UUID v4 生成', 'UUID 一括生成'],
    title: 'UUID生成ツール｜UUID v4をブラウザで一括作成',
    h1: 'UUID生成ツール',
    description: 'UUID v4をブラウザ内で最大100件までまとめて生成できます。',
    relatedTools: ['json-formatter'],
  },
  {
    slug: 'jwt-decoder',
    targetUser: 'JWTのHeader、Payload、有効期限を調査したい人',
    searchIntent: 'JWTをデコードし、主要Claimと日時を確認する',
    primaryQuery: 'JWT デコード',
    secondaryQueries: ['JWT Payload 確認', 'JWT exp 確認'],
    title: 'JWTデコーダー｜Header・Payload・有効期限を確認',
    h1: 'JWTデコーダー',
    description: 'JWTのHeaderとPayload、発行日時、有効期限をブラウザ内でデコードして確認できます。',
    relatedTools: ['base64', 'timestamp-converter', 'json-formatter'],
  },
  {
    slug: 'hash-generator',
    targetUser: '文字列やファイルのチェックサムを確認したい人',
    searchIntent: 'SHA-256、SHA-384、SHA-512のハッシュを生成する',
    primaryQuery: 'SHA256 ハッシュ 生成',
    secondaryQueries: ['ファイル ハッシュ 確認', 'チェックサム 計算'],
    title: 'ハッシュ生成ツール｜SHA-256・SHA-384・SHA-512',
    h1: 'ハッシュ生成ツール',
    description:
      'テキストやファイルからSHA-256・SHA-384・SHA-512のハッシュ値をブラウザ内で生成します。',
    relatedTools: ['base64', 'uuid-generator'],
  },
  {
    slug: 'text-counter',
    targetUser: '文章の文字数とUTF-8バイト数を確認したい人',
    searchIntent: '文字数、UTF-8バイト数、行数、単語数を集計する',
    primaryQuery: '文字数 バイト数 カウント',
    secondaryQueries: ['UTF-8 バイト数', '文字数 カウンター', '行数 カウント'],
    title: '文字数・バイト数カウンター｜UTF-8・行数・単語数',
    h1: '文字数・バイト数カウンター',
    description: '文章の文字数、UTF-8バイト数、行数、単語数をブラウザ内でリアルタイム集計します。',
    relatedTools: ['base64', 'url-encoder', 'json-formatter'],
  },
]
