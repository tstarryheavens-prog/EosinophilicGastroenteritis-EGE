import os
import glob
import re
from pathlib import Path

blog_files = sorted(glob.glob('src/content/blog/*.md'))
blog_en_files = sorted(glob.glob('src/content/blog_en/*.md'))
page_files = sorted(glob.glob('src/pages/**/*.astro', recursive=True))

print(f"Total JA blog posts: {len(blog_files)}")
print(f"Total EN blog posts: {len(blog_en_files)}")
print(f"Total Astro pages: {len(page_files)}")

# 1. 記事のメタデータ（title, description, category, pubDate）と文字数の検査
empty_desc = []
short_posts = []
forbidden_ad_labels = []
duplicate_titles = {}

for bf in blog_files + blog_en_files:
    with open(bf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parts = content.split('---', 2)
    if len(parts) >= 3:
        fm = parts[1]
        body = parts[2]
    else:
        fm = ''
        body = content
        
    title_m = re.search(r'^title:\s*["\']?(.*?)["\']?$', fm, re.MULTILINE)
    desc_m = re.search(r'^description:\s*["\']?(.*?)["\']?$', fm, re.MULTILINE)
    
    title = title_m.group(1).strip() if title_m else ''
    desc = desc_m.group(1).strip() if desc_m else ''
    
    if title:
        duplicate_titles.setdefault(title, []).append(bf)
        
    if not desc:
        empty_desc.append((bf, title))
        
    # 本文の文字数（プレーンテキスト）
    plain_body = re.sub(r'#|\*|`|\[.*?\]\(.*?\)|\<.*?\>|\s+', '', body)
    if len(plain_body) < 300:
        short_posts.append((bf, title, len(plain_body)))
        
    # 広告ラベルの禁止語チェック
    for line in body.splitlines():
        if 'おすすめ' in line and ('スポンサー' in line or '広告' in line):
            forbidden_ad_labels.append((bf, line.strip()))

print("\n=== Audit Results ===")
print(f"Empty descriptions: {len(empty_desc)}")
for f, t in empty_desc:
    print(f"  - {f}: {t}")

print(f"\nShort posts (<300 chars): {len(short_posts)}")
for f, t, c in short_posts:
    print(f"  - {f}: {t} ({c} chars)")

print(f"\nForbidden ad labels: {len(forbidden_ad_labels)}")
for f, l in forbidden_ad_labels:
    print(f"  - {f}: {l}")

dups = {k: v for k, v in duplicate_titles.items() if len(v) > 1}
print(f"\nDuplicate titles: {len(dups)}")
for t, files in dups.items():
    print(f"  - {t}: {files}")
