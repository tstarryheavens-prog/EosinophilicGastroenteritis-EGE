# サイトの自動更新・運用ガイド

本サイト（好酸球性胃腸炎と複合難病の闘病・服薬ノート）は、**Astro** + **GitHub** + **Cloudflare Pages** により構築されています。

## AIエージェントによる自動更新の流れ

ユーザーがAI（Antigravity等）に対して新しい記事の執筆や修正を指示するだけで、サイトは自動的にビルド・デプロイされます。

### 1. 新しい記事を追加する
新しい記事を追加したい場合、`src/content/blog/` 配下に新しいMarkdownファイル（例: `new-article.md`）を作成します。

```markdown
---
title: "記事のタイトル"
description: "記事の要約（120文字程度）"
pubDate: "2026-09-18"
category: "好酸球性消化管疾患" # または「群発頭痛・頭痛」「重症喘息・呼吸器」「服薬調査・治療薬」「入院生活・制度」「闘病日記・コラム」「PC・技術メモ」
tags: ["好酸球性胃腸炎", "服薬調査"]
eyecatch: "https://..." # 任意（画像URL）
slug: "任意の英数字スラッグ"
---

## 記事の見出し

本文...
```

### 2. 記事執筆時の重要方針（AIっぽさの排除）
- 「〜〜だよ」「〜〜してみてね」といったChatGPT特有の会話口調は使わず、自然で丁寧な敬体（「〜〜です」「〜〜ます」）または明晰な記録体で執筆します。
- 医療免責事項を常に意識し、自己判断での治療変更を促さず、主治医への相談を前提とした記述にします。
- 実体験としての実感や、添付文書・公的情報の根拠に基づいた信頼性の高い内容にします。

### 3. Gitコミット＆プッシュ
```bash
git add src/content/blog/
git commit -m "Add new article: 記事タイトル"
git push origin main
```
プッシュが完了すると、Cloudflare Pages の GitHub連携機能により自動的にビルドが走り、数分以内に全世界へ配信されます。

---

## Google AdSense の設定
本サイトはGoogle AdSenseの自動広告および個別ユニット広告に対応しています。

1. Cloudflare Pages の管理画面で **環境変数** を設定：
   - 変数名: `PUBLIC_ADSENSE_ID`
   - 値: `ca-pub-XXXXXXXXXXXXXXXX`（ご自身のAdSenseクライアントID）
2. `public/ads.txt` のパブリッシャーIDをご自身のものに更新してプッシュ。
