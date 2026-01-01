# Vercelデプロイガイド

## 本番環境のデータベースセットアップ

このアプリケーションは現在SQLiteを使用していますが、Vercelではファイルベースのデータベースは使用できません。以下のいずれかの方法でデータベースをセットアップしてください。

### オプション1: Vercel Postgres（推奨）

#### 1. Vercelでデータベースを作成

1. [Vercelダッシュボード](https://vercel.com/dashboard)でプロジェクトを開く
2. **Storage** タブに移動
3. **Create Database** → **Postgres** を選択
4. データベース名を入力（例：`mujin-naiken-db`）
5. リージョンを選択（推奨：`Washington, D.C., USA (East)`）
6. **Create** をクリック

#### 2. 環境変数を設定

データベース作成後、Vercelが自動的に環境変数を設定しますが、`DATABASE_URL`も追加する必要があります：

1. プロジェクト設定 → **Environment Variables** に移動
2. 以下の変数を追加：
   - **Name**: `DATABASE_URL`
   - **Value**: `POSTGRES_PRISMA_URL`の値をコピー（既に設定されているはず）
   - **Environment**: Production, Preview, Development すべて選択

#### 3. Prismaスキーマを更新

`prisma/schema.prisma`のdatasourceを以下のように変更：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

この変更をコミット＆プッシュ：
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

#### 4. ビルドコマンドを設定

Vercelプロジェクト設定で：
1. **Settings** → **General** → **Build & Development Settings**
2. **Build Command** を以下に変更：
```bash
npx prisma migrate deploy && npx prisma db seed && next build
```

これでデプロイ時に自動的にマイグレーションとシードが実行されます。

### オプション2: Turso（SQLite互換）

1. [Turso](https://turso.tech/)でアカウント作成
2. データベースを作成：
```bash
turso db create mujin-naiken-db
```

3. データベースURLを取得：
```bash
turso db show mujin-naiken-db --url
```

4. 認証トークンを作成：
```bash
turso db tokens create mujin-naiken-db
```

5. Vercelの環境変数に設定：
   - `DATABASE_URL`: Tursoのデータベース URL
   - `DATABASE_AUTH_TOKEN`: 認証トークン

6. マイグレーションとシード：
```bash
npx prisma migrate deploy
npm run db:seed
```

### オプション3: Supabase

1. [Supabase](https://supabase.com/)でプロジェクト作成
2. Database設定からConnection stringを取得
3. Vercelの環境変数に`DATABASE_URL`を設定
4. Prismaスキーマを更新（PostgreSQL用）
5. マイグレーションとシード実行

## ローカル開発環境のセットアップ

1. 依存関係をインストール：
```bash
npm install
```

2. 環境変数を設定（`.env`ファイルを作成）：
```env
DATABASE_URL="file:./dev.db"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin123"
```

3. データベースをマイグレーション：
```bash
npx prisma migrate dev
```

4. シードデータを投入：
```bash
npm run db:seed
```

5. 開発サーバーを起動：
```bash
npm run dev
```

## データベースコマンド

- **シードデータを投入**: `npm run db:seed`
- **データベースをリセット**: `npm run db:reset`
- **マイグレーション作成**: `npx prisma migrate dev --name migration_name`
- **本番マイグレーション**: `npx prisma migrate deploy`

## 注意事項

- 本番環境では必ずPostgreSQLまたはTursoを使用してください
- SQLiteは開発環境のみで使用可能です
- シードデータには3つのサンプル物件と30日分の予約スロットが含まれます
