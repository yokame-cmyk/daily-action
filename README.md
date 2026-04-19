# Daily Action — 日報・行動改善システム MVP

Next.js + TypeScript + Tailwind + Supabase で構築した日報管理システムです。

## すぐに動かす（デモモード）

```bash
# 1. 依存パッケージをインストール
npm install

# 2. 開発サーバーを起動
npm run dev

# 3. ブラウザで開く
open http://localhost:3000
```

`.env.local` はすでに `NEXT_PUBLIC_DEMO_MODE=true` で設定されています。
Supabaseなしでそのまま動きます。

---

## デモアカウント

| 名前       | メール                  | パスワード | 権限 |
|-----------|------------------------|--------|------|
| 田中 花子  | tanaka@example.com     | password | 社員 |
| 鈴木 一郎  | suzuki@example.com     | password | 社員 |
| 佐藤 美咲  | sato@example.com       | password | 社員 |
| 山田 管理者 | admin@example.com     | password | 管理者 |

---

## 画面一覧

| パス          | 説明                          |
|-------------|-------------------------------|
| `/login`    | ログイン画面                   |
| `/dashboard`| ダッシュボード（今日の状況）      |
| `/checkin`  | 出勤（重点入力）/ 退勤（振り返り）|
| `/history`  | 履歴・週次スコアグラフ           |
| `/admin`    | 管理者：社員一覧・日報閲覧        |

---

## Supabaseに接続する場合

### 1. Supabaseプロジェクトを作成
https://supabase.com でプロジェクトを作成してください。

### 2. スキーマを適用
`supabase-schema.sql` の内容を Supabase の SQL Editor に貼り付けて実行します。

### 3. 環境変数を更新
`.env.local` を編集してください：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEMO_MODE=false
```

### 4. `src/lib/authContext.tsx` を Supabase Auth に切り替える
現在はlocalStorageベースのデモ認証です。
Supabase接続後は `supabase.auth.signInWithPassword()` に置き換えてください。

---

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ルートリダイレクト
│   ├── login/page.tsx      # ログイン画面
│   ├── dashboard/page.tsx  # ダッシュボード
│   ├── checkin/page.tsx    # 出勤・退勤画面
│   ├── history/page.tsx    # 履歴・スコアグラフ
│   └── admin/page.tsx      # 管理者画面
├── components/
│   ├── Shell.tsx           # ナビゲーション・レイアウト
│   ├── ui.tsx              # 共通UIコンポーネント
│   └── useRequireAuth.ts   # ルートガード
└── lib/
    ├── authContext.tsx      # 認証コンテキスト
    ├── recordContext.tsx    # 日報コンテキスト
    ├── demoData.ts         # デモデータ・スコア計算
    ├── supabase.ts         # Supabaseクライアント
    └── utils.ts            # ユーティリティ
```

---

## スコア計算ロジック

```
重点3つの達成度合計（★/5 × 3） → 最大70点
振り返りの記入（10文字以上）    → 15点
改善点の記入（10文字以上）      → 15点
                              ─────────
                              合計 100点
```
