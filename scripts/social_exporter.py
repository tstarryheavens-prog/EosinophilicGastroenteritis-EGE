#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Social & Community Exporter for Global Traffic
Generates high-engagement X (Twitter) threads and Reddit-compliant Markdown posts from English clinical articles.
Optionally dispatches payloads to Make.com Webhook for 100% automated multi-platform posting.
"""

import os
import sys
import re
import json
import ssl
import urllib.request
import urllib.error
from pathlib import Path

WORKSPACE_DIR = Path("/Volumes/Docker/nanbyo")
BLOG_EN_DIR = WORKSPACE_DIR / "src/content/blog_en"
OUTPUT_DIR = WORKSPACE_DIR / "scripts/output"
CONFIG_FILE = WORKSPACE_DIR / "scripts/config/social_config.json"

ssl_ctx = ssl._create_unverified_context()

os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_config() -> dict:
    if CONFIG_FILE.exists():
        try:
            return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}

def parse_markdown_frontmatter(md_path: Path) -> tuple[dict, str]:
    text = md_path.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", text, re.DOTALL)
    if not m:
        return {}, text
    
    meta_str, body = m.group(1), m.group(2)
    meta = {}
    for line in meta_str.split("\n"):
        if ":" in line:
            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip().strip('"').strip("'")
            meta[k] = v
    return meta, body

def generate_social_payload(slug: str, publish: bool = False):
    md_file = BLOG_EN_DIR / f"{slug}.md"
    if not md_file.exists():
        print(f"Error: {md_file} not found.", file=sys.stderr)
        return

    meta, body = parse_markdown_frontmatter(md_file)
    title = meta.get("title", slug)
    desc = meta.get("description", "")
    url = f"https://eosinophilicgastroenteritis-ege.pages.dev/en/blog/{slug}"

    if "vital-data" in slug:
        tweet_1 = "📊 12-Year Real-World Evidence (4,389 Days):\nMorning BP surges (Sys >180 mmHg) correlate directly with acute eosinophilic flares, uncovering a mucosal-pressor connection.\n\nOpen dataset & clinical review 👇"
        tweet_2 = "📈 4,389 Consecutive Days Tracked:\n• 8,700+ Omron certified BP logs\n• Nocturnal SpO2 dropped to 93-94% 48-72h BEFORE overt GI symptoms\n• Predictive biomarker window for early dietary intervention."
        tweet_3 = f"🔬 Pharmacology & Hemodynamics:\nHigh-affinity ARB (Azilsartan 20mg) settled morning spikes without compromising baseline perfusion, unlike standard ACE-Is.\n\nFull study & charts:\n🔗 {url}"
        reddit_title = f"[Patient Evidence & Data] {title}"
        reddit_body = f"""**Background & Methodology:**
While randomized clinical trials (RCTs) typically evaluate targeted biologics over 12-24 weeks, longitudinal multi-metric trajectories over a decade are virtually absent in EGID literature. 

As a diagnosed EGE patient, I recorded verified daily telemetry across **4,389 consecutive days (2014-2026)** encompassing over 8,700 blood pressure measurements, nocturnal SpO2, and step counts.

**Primary Findings:**
1. **Severe Morning Surge Hypertension**: Acute gastrointestinal eosinophilic flares triggered dramatic morning systolic spikes (up to 186 mmHg), likely driven by autonomic arousal and localized cytokine cascades.
2. **SpO2 as a Pre-Symptomatic Prodrome**: Resting SpO2 desaturation (96.5% -> 93.5%) consistently preceded gastrointestinal abdominal pain by 48-72 hours.
3. **Targeted ARB Efficacy**: Azilsartan demonstrated superior hemodynamic blunting of the morning surge compared to earlier-generation ACE-Is during active mucosal inflammation.

**Full Report & Open-Access De-identified Dataset:**
The complete longitudinal analysis and research database can be accessed here:
{url}

*Disclaimer: This is de-identified real-world observational data and does not constitute medical advice. Happy to discuss the data and observations with clinicians and fellow patients!*
"""
    elif "nurtec" in slug:
        tweet_1 = "🧠 Neuropharmacology Review:\nEvaluating CGRP antagonist (Nurtec 75mg) vs. 5-HT1F agonist (Rayvow 100mg) for intractable cluster headache attacks.\n\nOnset kinetics, CNS tolerability & rebound data 👇"
        tweet_2 = "⏱️ Resolution Kinetics & CNS Tolerability:\n• Rayvow: Rapid relief in 30m, but heavy somnolence & dizziness (best nocturnal).\n• Nurtec: Relief in 45m with ZERO sedation, zero dizziness, and neutral BP."
        tweet_3 = f"🛡️ Long-tail Shielding:\nNurtec's ~11-hour half-life blocked secondary breakthrough clusters, eliminating triptan-overuse rebound headache.\n\nFull comparative protocol:\n🔗 {url}"
        reddit_title = f"[Pharmacology Review] Nurtec vs. Rayvow for Cluster Headache"
        reddit_body = f"""**Clinical Background:**
For intractable cluster headache bouts refractory to triptans or constrained by cardiovascular hypertension risks, non-vasoconstrictive therapies—namely CGRP receptor antagonists (Nurtec) and selective 5-HT1F agonists (Rayvow)—offer distinct therapeutic profiles.

**Real-World Attack Resolution Observations:**
1. **Rayvow (Lasmiditan 100mg)**: 25-35 min onset. Dropped peak pain from 9/10 to 2/10. However, marked central nervous system dizziness and heavy sedation occur within 45 min, making it ideal for nocturnal attacks rather than active daytime hours.
2. **Nurtec (Rimegepant 75mg ODT)**: 45 min onset. Zero dizziness, zero sedation, and completely neutral blood pressure impact. Single morning dose provided sustained receptor blockade, preventing secondary midday attack clusters.

**Complete Protocol & Hemodynamic Data:**
{url}
"""
    elif "weekly-egid" in slug:
        tweet_1 = f"🔬 Weekly EGID & EGE Research Digest:\nLatest PubMed evidence, pipeline biologics, and mucosal biomarker analysis for rare gastrointestinal diseases.\n\nFull open digest 👇"
        tweet_2 = f"📊 This Week's Highlights:\n• New PubMed & ClinicalTrials updates\n• Longitudinal vital telemetry & mucosal-pressor dynamics\n• Real-world dietary & therapeutic protocols"
        tweet_3 = f"🌐 Open-Access Research Portal:\nSearch international trials and explore open telemetry data:\n🔗 {url}"
        reddit_title = f"[Weekly Research Digest] New EGID Findings & Clinical Trials ({meta.get('title', slug)})"
        reddit_body = f"""**Weekly EGID Research Digest & Clinical Summary**

Here is this week's synthesis of new eosinophilic gastroenteritis & EGID studies from PubMed, ongoing clinical trials, and real-world patient data:

**Key Takeaways:**
{desc}

**Full Report & Interactive Database:**
{url}
"""
    else:
        clean_desc = desc.replace("\n", " ")[:100]
        tweet_1 = f"🔬 EGID Research Analysis:\n{clean_desc}...\n\nFull clinical trial breakdown 👇"
        tweet_2 = f"📊 Key Findings:\n{clean_desc}\n\nExplore full interactive findings on our portal:\n🔗 {url}"
        tweet_3 = f"🌐 Open-Access Research Hub:\nCataloging international trials from PubMed and ClinicalTrials.gov with patient perspectives.\n🔗 {url}"
        reddit_title = f"[Research Analysis] {title}"
        reddit_body = f"{desc}\n\nFull study: {url}"

    # Twitter character limit safety guard (280 half-width characters, URL consumes 23)
    # Ensure tweet_1 + url comfortably stays under 260 characters
    max_tweet1_len = 220
    if len(tweet_1) > max_tweet1_len:
        tweet_1 = tweet_1[:max_tweet1_len - 3] + "..."

    x_thread = "\n\n--- TWEET BREAK ---\n\n".join([tweet_1, tweet_2, tweet_3])

    # Save to local text file
    out_file = OUTPUT_DIR / f"social_{slug}.txt"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("=== X (TWITTER) THREAD ===\n\n" + x_thread + "\n\n" + "="*40 + "\n\n=== REDDIT POST ===\n\n" + reddit_body)

    print(f"✅ Generated social distribution payload for '{slug}':\n   Saved to: {out_file}")

    # Dispatch to Make.com Webhook if requested
    if publish:
        cfg = load_config()
        webhook_url = cfg.get("make_webhook_url")
        if not webhook_url:
            print("⚠️ Webhook URL not found in scripts/config/social_config.json. Skipping automated dispatch.")
            return

        payload = {
            "slug": slug,
            "title": title,
            "url": url,
            "tweet_1": tweet_1,
            "tweet_2": tweet_2,
            "tweet_3": tweet_3,
            "reddit_title": reddit_title,
            "reddit_body": reddit_body
        }

        print(f"🚀 Dispatching automated social payload to Make.com Webhook...")
        req = urllib.request.Request(
            webhook_url,
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "Nanbyo-Social-Bot/1.0"}
        )
        try:
            with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as res:
                body = res.read().decode("utf-8")
                print(f"🎉 Successfully dispatched to Make.com! Response: {body}")
        except Exception as e:
            print(f"❌ Failed to dispatch to Make.com Webhook: {e}", file=sys.stderr)

if __name__ == "__main__":
    slug_arg = "12-year-real-world-vital-data-eosinophilic-gastroenteritis"
    publish_arg = False

    args = sys.argv[1:]
    if "--publish" in args:
        publish_arg = True
        args.remove("--publish")

    if args:
        slug_arg = args[0]

    generate_social_payload(slug_arg, publish=publish_arg)
