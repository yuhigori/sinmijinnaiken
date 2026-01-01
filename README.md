# 無人内見予約システム (sinmijinnaiken)

> 作り直しー無人内見

## プロジェクトのセットアップ

### 1. 依存関係のインストール

```bash
cd /Users/fumoriyuuhi/.gemini/antigravity/scratch/mujin-naiken-system
npm install
```

### 2. データベースのセットアップ

Prismaのマイグレーションとシードは既に完了していますが、再セットアップが必要な場合:

```bash
# データベースをリセット
npx prisma migrate reset

# または個別に実行
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 利用可能なページ

- **トップページ**: http://localhost:3000
- **物件一覧**: http://localhost:3000/properties
- **予約確認**: http://localhost:3000/reservations/check

## データベースの確認

Prisma Studioでデータベースの内容を確認できます:

```bash
npx prisma studio
```

## ビルド

本番用ビルド:

```bash
npm run build
npm start
```

## 環境変数

`.env` ファイルで以下を設定:

```
DATABASE_URL="file:./dev.db"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin123"
```

## トラブルシューティング

### データベースエラー

```bash
# データベースをリセット
rm -f prisma/dev.db
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### ビルドエラー

```bash
# node_modulesを再インストール
rm -rf node_modules package-lock.json
npm install
```

## 次のステップ

以下の機能を追加できます:

1. 物件詳細ページの予約フォーム実装
2. 予約完了ページの実装
3. 管理画面の実装（Basic認証付き）
4. メール通知機能
5. 予約キャンセル機能
