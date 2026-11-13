export interface DivisionFeature {
  name: string;
  description: string;
  status: 'active' | 'live' | 'planned';
  tag: string;
  link?: string;
  /** 自宅LAN / Tailscale 専用ツールへのアドレス。公開ページでは絶対にレンダリングしない */
  localLink?: string;
}

export interface RoadmapItem {
  phase: string;
  title: string;
  done: boolean;
  desc: string;
}

export interface Division {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  themeColor: string;
  themeBg: string;
  themeBorder: string;
  themeText: string;
  status: 'active' | 'monetized' | 'in_development';
  statusLabel: string;
  extUrl?: string;
  extLabel?: string;
  /** 自宅LAN 専用UI（192.168.x.x 等）。公開ページではレンダリングせず /company とHUDだけで使う */
  localUrl?: string;
  ghUrl?: string;
  path: string;
  monetization: string;
  mission: string;
  overview: string;
  features: DivisionFeature[];
  roadmap: RoadmapItem[];
  stats: {
    articlesCount?: number;
    toolsCount: number;
    updateFrequency: string;
    kpi: string;
  };
  techStack: string[];
  adSite: string;
}

export const DIVISIONS_DATA: Record<string, Division> = {
  'smartailife': {
    id: 'smartailife',
    title: 'くらしAIラボ（Smart AI Life 旗艦ポータル）',
    shortTitle: 'くらしAI',
    subtitle: '自律型AIエージェント、ローカルLLM、家庭内自動化の最先端実験ハブ',
    icon: '🐼',
    badge: '🚀 旗艦プラットフォーム',
    badgeColor: '#4338ca',
    themeColor: '#4338ca',
    themeBg: '#eef2ff',
    themeBorder: '#4338ca',
    themeText: '#312e81',
    status: 'active',
    statusLabel: '本番稼働中 (Pages)',
    extUrl: 'https://eosinophilicgastroenteritis-ege.pages.dev/ai-living-lab',
    extLabel: '旗艦HP ↗',
    ghUrl: 'https://github.com/tstarryheavens-prog/SmartAILife',
    path: '/Volumes/Docker/SmartAILife',
    monetization: 'AdBanner (A8 ＋ AdSense)',
    mission: '最先端の生成AI・エージェント技術を暮らしと実務に完全統合し、可処分時間を最大化する。',
    overview: 'Astro 5.xとCloudflare D1/R2、FastMCPを基盤としたメディアハブ。Tailscale直結の自宅GPU Strata（Z790 RTX 3060）やHermes Agentと連携し、ゼロクォータでの自律執筆・運用を実現。',
    features: [
      {
        name: 'EmDash CMS 統合コンテンツ管理',
        description: 'Cloudflare D1 SQLite ＆ R2 ストレージによる自律型CMS。API経由で即時記事公開と全ラボ配信を制御。',
        status: 'live',
        tag: 'D1 / FastMCP',
      },
      {
        name: 'Strata ゼロクォータ自動執筆・推敲',
        description: 'Tailscale経由の自宅GPU（Qwen 3.8B IQ2_XS）を活用し、APIコスト完全ゼロで高速ドラフト作成・推敲。',
        status: 'active',
        tag: 'RTX 3060 / 52.2 tok/s',
      },
      {
        name: 'yomiyasu 日本語推敲・AI臭さ排除',
        description: '「手触り」「解像度」等のAI頻出スロップを自動排除し、キャラクターの個性を保ちながら自然な日本語へ校正。',
        status: 'active',
        tag: 'NLP Skill',
      },
      {
        name: 'ぽトル 縦型ショート動画自動生成',
        description: 'Edge-TTS 5大ボイスプリセットとNoto Sans JP極太テロップによる1080×1920動画の完全自動レンダリング。',
        status: 'active',
        tag: 'FFmpeg / TTS',
      },
      {
        name: 'マルチプラットフォーム自動配信',
        description: 'はてなブログ AtomPub API投稿、公式X(Twitter)へのブラウザ自動ポスト、YouTube自動同期。',
        status: 'active',
        tag: 'Distribution Ops',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Astro 5.x ＆ Cloudflare D1 統合', done: true, desc: 'D1ハイブリッドデータベースとSSRアーキテクチャへの移行完了。' },
      { phase: 'Phase 2', title: 'Strata Z790 ＆ Hermes ACP 統合', done: true, desc: '自宅RTX 3060推論とHermes Agentのタスク共有を確立。' },
      { phase: 'Phase 3', title: '全8ラボスカウト＆EmDash自動入稿センター構築', done: true, desc: 'Web・論文の自律発掘からコメント注入・D1即時公開まで完備。' },
      { phase: 'Phase 4', title: '自律型SEOキーワード分析＆自動リライトエンジン', done: false, desc: '検索トレンドを動的検知し、既存記事のタイトルや導入文を自律更新。' },
      { phase: 'Phase 5', title: 'YouTube Shorts＆X自動ポストの完全自律マルチ配信ループ', done: false, desc: 'ブログ公開と同時にショート動画レンダリングとSNSポストを全自動完結。' },
      { phase: 'Phase 6', title: 'ユーザー行動解析に基づく関連コンテンツ自律リコメンド', done: false, desc: '読者の興味・回遊動線に合わせて他のラボコンテンツを相互案内。' },
    ],
    stats: {
      articlesCount: 19,
      toolsCount: 5,
      updateFrequency: '週2〜3回自律更新',
      kpi: 'メディア回遊率・APIゼロコスト率',
    },
    techStack: ['Astro 5.x', 'Cloudflare Pages & D1', 'Python FastMCP', 'Strata (llama.cpp)', 'Hermes ACP'],
    adSite: 'smartailife',
  },

  'aichi-high': {
    id: 'aichi-high',
    title: 'まなびラボ（尾張・名古屋地区 高校進学ナビ）',
    shortTitle: 'まなび',
    subtitle: '公立W出願・校群グループ判定・内申点シミュレータ＆教育費防衛ハック',
    icon: '🎓',
    badge: '💰 Google AdSense 収益稼働中',
    badgeColor: '#047857',
    themeColor: '#047857',
    themeBg: '#ecfdf5',
    themeBorder: '#047857',
    themeText: '#064e3b',
    status: 'monetized',
    statusLabel: '本番稼働中・収益化',
    extUrl: 'https://ikomainagoyaaichihighschool.pages.dev',
    extLabel: '特設HP ↗',
    ghUrl: 'https://github.com/tstarryheavens-prog/AichiHighschoolRoom',
    path: '/Volumes/Docker/AichiHighschoolRoom',
    monetization: 'Google AdSense (ca-pub-1988464307898443) ＋ 参考書アフィリ',
    mission: '複雑な愛知県公立高校のW出願制度と複合選抜を分かりやすく可視化し、受験生家庭の進路選択を最適化する。',
    overview: '愛知県独自の「尾張第1群・第2群」「Aグループ・Bグループ」制度に対応した組み合わせ判定ツールを提供。Google AdSense審査を通過し安定収益を獲得している教育メディア。',
    features: [
      {
        name: '公立W出願 組み合わせシミュレータ',
        description: '第一志望・第二志望の校群・グループ制約（A/Bグループ×群）を即座に自動判定し、有効な受験ペアを判定。',
        status: 'live',
        tag: 'W出願判定機',
      },
      {
        name: '内申点 総合得点計算機（I型〜V型対応）',
        description: '各高校ごとの配点比率（内申重視・当日点重視などI〜V型）に応じた総合得点をリアルタイム自動算出。',
        status: 'live',
        tag: '内申計算機',
      },
      {
        name: 'AI家庭教師 プロンプト集',
        description: 'GeminiやChatGPTを受験生専用の専属家庭教師として活用するための最適化プロンプトと学習メソッド。',
        status: 'active',
        tag: 'AI家庭教師',
      },
      {
        name: '尾張・名古屋地区 高校データベース',
        description: '偏差値、立地、部活動、進学実績、私立滑り止め校との組み合わせ推奨パターンを体系的に整理。',
        status: 'live',
        tag: '高校DB',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'W出願シミュレータ公開 & AdSense承認', done: true, desc: '複合選抜ルール判定機を実装しAdSense本番収益化を達成。' },
      { phase: 'Phase 2', title: '私立無償化・学費シミュレータ追加', done: true, desc: '世帯年収別の補助金・実質負担額計算ツールを拡充完了。' },
      { phase: 'Phase 3', title: '承認不要 自律即時パブリッシング稼働', done: true, desc: '愛知高校受験ニュースの自律スカウト・即時公開ラインを確立。' },
      { phase: 'Phase 4', title: '2026年度最新進学希望倍率＆定員減速報分析', done: false, desc: '教育委員会公表の進路希望状況から各校の倍率変動を自律解説。' },
      { phase: 'Phase 5', title: '愛知全県模試ボーダーデータ連携・合否可能性マップ', done: false, desc: '内申点と当日点のクロス集計から安全校・挑戦校を視覚判定。' },
      { phase: 'Phase 6', title: '私立推薦基準・特待生奨学金データベースの公開', done: false, desc: '名古屋市内・尾張主要私立の推薦条件と学費支援を完全網羅。' },
    ],
    stats: {
      articlesCount: 14,
      toolsCount: 4,
      updateFrequency: '受験期週3回集中更新',
      kpi: 'AdSense RPM・受験生世帯PV数',
    },
    techStack: ['HTML5 / Vanilla JS', 'Tailwind CSS', 'Cloudflare Pages', 'Google AdSense'],
    adSite: 'aichi-high',
  },

  'toyotahome': {
    id: 'toyotahome',
    title: 'すまいラボ（トヨタホーム建築10年実録アーカイブ）',
    shortTitle: 'すまい',
    subtitle: '5,200万フルローン・鉄骨ユニット工法・10年点検＆卒FIT蓄電池実録',
    icon: '🏠',
    badge: '🔨 住まい・建築実録',
    badgeColor: '#b45309',
    themeColor: '#b45309',
    themeBg: '#fffbeb',
    themeBorder: '#b45309',
    themeText: '#78350f',
    status: 'active',
    statusLabel: '本番稼働中 (Pages)',
    extUrl: 'https://mytoyotahomebottle.pages.dev',
    extLabel: '実録HP ↗',
    ghUrl: 'https://github.com/tstarryheavens-prog/ToyotahomeMyhome',
    path: '/Volumes/Docker/ToyotahomeMyhome',
    monetization: 'AdBanner ＋ リフォーム・蓄電池アフィリ',
    mission: 'ハウスメーカー検討者・10年点検を迎える施主へ、リアルな維持費用・設備更新・断熱空調の実測データを共有する。',
    overview: 'トヨタホーム鉄骨ラーメン構造シンセ・シリーズでの10年間の暮らしを記録。スマートエアーズ全館空調、外壁メンテナンス、ニチコン14.9kWh蓄電池の卒FIT導入など施主目線の真実を公開。',
    features: [
      {
        name: '5,200万円 住宅ローン返済シミュレータ',
        description: '変動金利上昇シナリオや繰上返済タイミング、団信・控除を踏まえたライフプラン連動シミュレーション。',
        status: 'live',
        tag: 'ローン試算機',
      },
      {
        name: '10年目設備点検・交換コスト台帳',
        description: 'エコキュート、外壁目地、スマートエアーズの実際の点検費用と長寿命化対策。',
        status: 'live',
        tag: '維持コスト台帳',
      },
      {
        name: '卒FIT 太陽光＆ニチコン蓄電池 収支実測',
        description: '売電単価下落に伴う14.9kWh蓄電池導入の実質ROI・電気代削減額の10年間実測検証。',
        status: 'active',
        tag: '蓄電池ROI実測',
      },
      {
        name: '全館空調スマートエアーズ温湿度解析',
        description: '冬場の乾燥対策や夏場の電気代を最小限に抑えるための換気モード・タイマー運用のノウハウ集。',
        status: 'live',
        tag: '空調調湿解析',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: '52Mフルローン実録アーカイブ公開', done: true, desc: '18本の10年実録記事をD1/Pages化完了。' },
      { phase: 'Phase 2', title: '設備交換・メンテナンス時期台帳の整備', done: true, desc: '水回り・空調機器の更新費用プール指針策定。' },
      { phase: 'Phase 3', title: 'スマートエアーズ年間電気代実測データベース化', done: true, desc: 'HEMS連携による全館空調の暖房・冷房別消費電力を完全可視化。' },
      { phase: 'Phase 4', title: '10年目定期点検・外壁シーリング・防蟻見積もり検証', done: false, desc: 'メーカー保証延長にかかる実費見積もりと相場比較レポートの公開。' },
      { phase: 'Phase 5', title: '鉄骨ユニットラーメン構造 vs 他社（積水・ヘーベル）性能比較', done: false, desc: '工場生産ユニット工法の耐震性能・間取り制約の客観的比較。' },
      { phase: 'Phase 6', title: '施主目線オプション採用満足度ランキング公開', done: false, desc: '10年使って本当に元が取れた神設備と不要だった設備の徹底格付け。' },
    ],
    stats: {
      articlesCount: 18,
      toolsCount: 4,
      updateFrequency: '月2回定期更新',
      kpi: '注文住宅検討者滞在時間・住宅系広告CV',
    },
    techStack: ['Astro', 'Cloudflare Pages', 'EmDash D1', 'Chart.js'],
    adSite: 'home',
  },

  'wakwak-money': {
    id: 'wakwak-money',
    title: 'お金のラボ（ワクワク家計管理）',
    shortTitle: 'お金',
    subtitle: '月末残高不足の先回り防止＆夫42歳から100歳までの生涯キャッシュフロー予測',
    icon: '💰',
    badge: '🛡️ 資産防衛・家計OS',
    badgeColor: '#0369a1',
    themeColor: '#0369a1',
    themeBg: '#f0f9ff',
    themeBorder: '#0369a1',
    themeText: '#0c4a6e',
    status: 'active',
    statusLabel: 'デーモン常時監視中',
    ghUrl: 'https://github.com/tstarryheavens-prog/wakwakmoney',
    path: '/Volumes/Docker/wakwakmoney',
    monetization: '家計見直し・FP相談・NISA金融送客',
    mission: '教育費の二重ピークを乗り越え、老後100歳までキャッシュ枯渇を起こさない強靭な家計構造を自動構築する。',
    overview: '三菱UFJ銀行（生活費）と三井住友銀行（投資）の口座残高を自動監視し、クレジットカード引き落とし前の残高不足を先回り検知。夫42歳〜100歳までの教育・住宅・年金CFをモデル化。',
    features: [
      {
        name: '100歳生涯キャッシュフロー予測モデル',
        description: '夫47〜53歳の二重教育費ピークを可視化し、退職金・年金・投資リターンを加味した100歳生存CF。',
        status: 'live',
        tag: '100歳CF予測',
      },
      {
        name: '口座残高不足 先回りアラートデーモン',
        description: '`balance_alert_rebalancer.py` による自動監視。月末引き落とし日前の資金ショートを事前防止。',
        status: 'active',
        tag: '残高監視デーモン',
      },
      {
        name: '三菱UFJ vs SMBC 自動口座最適化',
        description: '住宅ローン引き落としと生活決済口座、積立NISA/オルカン投資口座の最適振替ロジック。',
        status: 'active',
        tag: '口座最適化',
      },
      {
        name: 'Excel Live 連携自動集計',
        description: 'Apple Events経由でMac上のMicrosoft Excelを直接遠隔操作し、家計簿・月次決算シートを瞬時更新。',
        status: 'live',
        tag: 'Excel MCP直結',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: '100歳キャッシュフロー数理モデル構築', done: true, desc: '夫42歳〜100歳までの教育費ピークと公的年金を織り込んだCF完成。' },
      { phase: 'Phase 2', title: '残高監視デーモン & リバランサー稼働', done: true, desc: '引き落とし前の口座残高不足アラートを自動化。' },
      { phase: 'Phase 3', title: '三菱UFJ×SMBC口座分離ルール確立', done: true, desc: '生活決済と資産防衛・オルカン積立の口座完全分離ルール体系化。' },
      { phase: 'Phase 4', title: '夫47〜53歳教育費ダブルピーク耐久テスト', done: false, desc: '高校・大学重なり期の年間400万円超支出を無借金で乗り切る試算公開。' },
      { phase: 'Phase 5', title: '住宅ローン変動金利上昇ストレステスト', done: false, desc: '日銀利上げに伴う毎月返済額増加と繰上返済タイミング判断マップ。' },
      { phase: 'Phase 6', title: 'Web版100歳CFシミュレータの一般公開', done: false, desc: '誰でも自活資金と教育費ピークを試算できるSPAツールの公開。' },
    ],
    stats: {
      articlesCount: 1,
      toolsCount: 4,
      updateFrequency: '日次自動監視・月次集計',
      kpi: '口座残高ショートゼロ・生涯黒字維持率',
    },
    techStack: ['Python', 'Streamlit', 'Excel Live MCP', 'SQLite', 'Pandas'],
    adSite: 'money',
  },

  'nanbyo': {
    id: 'nanbyo',
    title: '難病とからだラボ（好酸球性疾患・群発頭痛・重症喘息）',
    shortTitle: '医療',
    subtitle: '最新抗体薬（デュピクセント/エキシデンサー）治療記録と生体バイタル分析',
    icon: '🩺',
    badge: '🏥 医療・ヘルスケア',
    badgeColor: '#be185d',
    themeColor: '#be185d',
    themeBg: '#fdf2f8',
    themeBorder: '#be185d',
    themeText: '#831843',
    status: 'active',
    statusLabel: '本番稼働中 (Pages)',
    extUrl: 'https://eosinophilicgastroenteritis-ege.pages.dev',
    extLabel: 'EGE特設HP ↗',
    ghUrl: 'https://github.com/tstarryheavens-prog/nanbyo',
    path: '/Volumes/Docker/nanbyo',
    monetization: '医療・健康広告 ＋ 難病当事者支援',
    mission: '指定難病（好酸球性胃腸炎等）の最新治療法・抗体薬のリアルな効果や生活工夫を当事者・家族へ届ける。',
    overview: '指定難病「好酸球性消化管疾患（EGE）」や群発頭痛に対する分子標的薬（デュピクセント等）の自己注射記録、副作用、特定医療費受給者証申請のノウハウを体系化した専門ポータル。',
    features: [
      {
        name: 'Note API 自動パイプライン',
        description: 'Noteで執筆した闘病手記を `fetch_nanbyo_notes.py` で自動スクレイピング＆Markdown化しD1へ同期。',
        status: 'active',
        tag: 'Note同期パイプライン',
      },
      {
        name: '抗体薬・自己注射 治療経過トラッカー',
        description: 'デュピクセント（IL-4/13阻害薬）等の投与間隔、末梢血好酸球数、IgE値、症状推移を可視化。',
        status: 'live',
        tag: '抗体薬ログ',
      },
      {
        name: '特定医療費受給者証 申請ガイド',
        description: '重症度分類、臨床個人調査票の依頼手順、自己負担上限額管理票の運用ノウハウを完全解説。',
        status: 'live',
        tag: '受給者証ナビ',
      },
      {
        name: '群発頭痛・気象トリガー相関分析',
        description: '気圧変動や季節の変わり目と群発頭痛発作の相関、酸素吸入療法の運用知見を共有。',
        status: 'active',
        tag: '頭痛気圧相関',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Note 15記事の自動インポート & Pages公開', done: true, desc: '好酸球性胃腸炎闘病記をPagesへ移譲完了。' },
      { phase: 'Phase 2', title: '特定医療費受給者証 申請・更新チェックリスト', done: true, desc: '臨床調査個人票の依頼手順と自己負担上限管理票の解説公開。' },
      { phase: 'Phase 3', title: '重症難病当事者の就労・テレワーク両立ガイド', done: false, desc: '体調不良時の業務調整やオープン就労・クローズ就労の実践知見。' },
      { phase: 'Phase 4', title: '最新抗体薬（デュピクセント・ヌーカラ等）助成併用シミュレータ', done: false, desc: '高額療養費と難病助成を組み合わせた実質自己負担額の自動算出。' },
      { phase: 'Phase 5', title: '群発頭痛・激痛期対処と自宅用酸素濃縮器手配マニュアル', done: false, desc: '群発期の予防薬投与スケジュールと在宅酸素療法の導入ノウハウ。' },
      { phase: 'Phase 6', title: '医師面談スムーズ化シート・症状バイタル記録ツールの提供', done: false, desc: '限られた診察時間で症状変化を的確に伝えるPDFレポート生成。' },
    ],
    stats: {
      articlesCount: 15,
      toolsCount: 4,
      updateFrequency: '月次更新',
      kpi: '難病患者・家族への情報到達数',
    },
    techStack: ['Astro', 'Cloudflare Pages', 'Python Note Scraper', 'EmDash D1'],
    adSite: 'smartailife',
  },

  'ai-hems': {
    id: 'ai-hems',
    title: 'でんきラボ（AI Home HEMS・スマートエネルギー）',
    shortTitle: 'でんき',
    subtitle: '太陽光発電×14.9kWhニチコン蓄電池×ECHONET Lite 自律JIT充電最適化OS',
    icon: '⚡',
    badge: '🔋 自律エネルギーOS',
    badgeColor: '#1d4ed8',
    themeColor: '#1d4ed8',
    themeBg: '#eff6ff',
    themeBorder: '#1d4ed8',
    themeText: '#1e3a8a',
    status: 'active',
    statusLabel: '30秒テレメトリ常時稼働',
    ghUrl: 'https://github.com/tstarryheavens-prog/AIHomeHEMS',
    path: '/Volumes/Docker/hems',
    monetization: '技術ショーケース ＋ スマート家電アフィリ',
    mission: '深夜電力（16.3円）と太陽光、14.9kWh蓄電池を完全自動制御し、家庭の買電量を極限まで削減する。',
    overview: '家庭内のHEMSゲートウェイ機とニチコン蓄電池本体（いずれも自宅LAN内に設置）へ直接通信し、30秒毎に全回路計測値をロギング。翌日日照予報に応じて必要な充電量だけを夜間に充電するJITアルゴリズムを搭載。',
    features: [
      {
        name: 'ECHONET Lite ＆ CenteHTTPd 30秒テレメトリ',
        description: '分電盤計測値、買電/売電電力、蓄電池SOC・充放電電力をミリ秒単位で直接取得しCSVへ継続記録。',
        status: 'live',
        tag: '30秒リアルタイム通信',
      },
      {
        name: 'JIT（Just-In-Time）深夜充電最適化',
        description: '翌朝の天気予報・日射量予測と家庭内消費パターンから、深夜割引時間帯（16.3円/kWh）の目標充電量を自動算出。',
        status: 'live',
        tag: 'JIT充電最適化',
      },
      {
        name: 'IP自動走査＆手動復旧エンジン (auto_recover.py)',
        description: 'ルーター再起動等でHEMSや蓄電池のIPが変更された際も、サブネット内を自動走査してワンクリックで完全復旧。',
        status: 'live',
        tag: '自動IP自己修復',
      },
      {
        name: 'Streamlit エネルギーダッシュボード',
        description: '電力フローの直感的な可視化、手動運転切替（充電/放電/待機）、バッテリーヘルス診断画面を提供。',
        status: 'live',
        tag: 'Streamlit UI',
      },
      {
        name: 'HomeAgent & Zigbee2MQTT 連携',
        description: 'SLZB-06 ZigbeeコーディネーターとTuya Local（応答20ms）による居室照明・エアコンの自動連動。',
        status: 'active',
        tag: 'Tuya Local 20ms',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'ニチコンTCP 3610＆HEMS通信プロトコル解析', done: true, desc: 'ECHONET Lite仕様に基づき直接制御コード構築完了。' },
      { phase: 'Phase 2', title: 'IP自動追従＆復旧ボタン実装', done: true, desc: 'ネットワーク変動時の自動復旧とUIボタン配備完了。' },
      { phase: 'Phase 3', title: 'JIT深夜充電アルゴリズム本番稼働', done: true, desc: '深夜電力（16.3円）時間帯に翌朝の太陽光余剰を見越した最適充電。' },
      { phase: 'Phase 4', title: '卒FIT売電終了後のエコキュート昼間沸き上げシフト', done: false, desc: '余剰電力をエコキュート沸き上げに振り向け買電をゼロ化。' },
      { phase: 'Phase 5', title: '年間電気代30万円削減の実測収支インフォグラフィック自動更新', done: false, desc: '1年間の買電・売電・蓄電池稼働実績を毎月自動図解化。' },
      { phase: 'Phase 6', title: '停電時自立運転全負荷切り替え手順のWebガイダンス化', done: false, desc: '非常時におけるIH・エコキュート・全館空調の負荷管理ガイド。' },
    ],
    stats: {
      articlesCount: 1,
      toolsCount: 5,
      updateFrequency: '30秒間隔 常時稼働',
      kpi: '買電電力量削減率・電気代0円達成日数',
    },
    techStack: ['Python', 'ECHONET Lite (TCP/UDP 3610)', 'Streamlit', 'Zigbee2MQTT', 'Pandas'],
    adSite: 'smartailife',
  },

  // 内部専用（一般公開しない）: src/data/public_scope.ts の INTERNAL_SITE_IDS で管理
  'motor-paper': {
    id: 'motor-paper',
    title: 'モータ研究ラボ（学術・モータ工学インテリジェンス）',
    shortTitle: 'モータ',
    subtitle: '2,431件の論文メタデータ・全文検索・AI速報・特許知財DB',
    icon: '🔬',
    badge: '📚 学術インテリジェンス',
    badgeColor: '#6d28d9',
    themeColor: '#6d28d9',
    themeBg: '#f5f3ff',
    themeBorder: '#6d28d9',
    themeText: '#4c1d95',
    status: 'active',
    statusLabel: 'NAS連携稼働中',
    localUrl: 'http://192.168.2.100:8520', // 自宅LAN専用（公開ページには出さない）
    extLabel: 'NAS WebUIを開く (Port 8520) ↗',
    ghUrl: 'https://github.com/tstarryheavens-prog/SmartAILife',
    path: '/Volumes/Docker/SmartAILife/tools/motor_paper_system',
    monetization: '専門エンジニア向けナレッジベース',
    mission: '膨大なモータ・パワエレ学術論文と特許文献を瞬時に検索・要約し、次世代電気機器の研究開発速度を向上させる。',
    overview: 'ASUSTOR NASに保管された2,431件のモータ工学学術論文（IEEJ、IEEE、arXiv、J-STAGE等）およびPDF本文を全文インデックス化。ローカルWeb UI（ポート8520）やCLIからキーワード・年代で高速検索。',
    features: [
      {
        name: '2,431件 学術論文全文検索インデックス',
        description: 'SQLite FTS5による超高速全文検索。論文タイトル、著者、学会、アブストラクト、本文キーワードを瞬時走査。',
        status: 'live',
        tag: 'FTS5高速全文検索',
        localLink: 'http://192.168.2.100:8520', // 自宅LAN専用ツール
      },
      {
        name: 'ASUSTOR NAS PDF直結ビューアー',
        description: 'NASストレージ内のPDF実体とシームレスに連携し、検索結果から1クリックで元論文PDFを閲覧。',
        status: 'live',
        tag: 'NAS PDF直結',
        localLink: 'http://192.168.2.100:8520', // 自宅LAN専用ツール
      },
      {
        name: 'Web UI ダッシュボード（Port 8520）',
        description: 'ASUSTOR NAS Docker上で常時稼働。モータの種類（IPMSM, SynRM等）や損失解析に応じたフィルタリング機能。',
        status: 'live',
        tag: 'Port 8520 WebUI',
        localLink: 'http://192.168.2.100:8520', // 自宅LAN専用ツール
      },
      {
        name: '最新AI研究速報・動画フィード（87件）',
        description: 'HuggingFace Daily Papers、arXiv、Two Minute Papers等の最新AI論文・解説動画を毎朝自動巡回・日本語要約。',
        status: 'live',
        tag: 'AI Daily Digest',
        localLink: 'http://192.168.2.100:8520', // 自宅LAN専用ツール
      },
      {
        name: '2Dクロス集計ヒートマップ',
        description: 'モータ構造トポロジー × 制御・設計課題の論文分布マトリクス。研究のホットスポットや技術空白地帯を可視化。',
        status: 'live',
        tag: '2Dマトリクス分析',
        localLink: 'http://192.168.2.100:8520', // 自宅LAN専用ツール
      },
      {
        name: 'モータ工学 専門知財スクリーニング (CLI)',
        description: '`cli.py` によりターミナルやAIエージェントから直接論文DBをクエリし要約を取得。',
        status: 'live',
        tag: '知財スクリーニングCLI',
        link: '/articles/motor-paper-ai-intelligence-hub-release',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: '1,664件メタデータDB化 & NAS連携', done: true, desc: 'NAS内PDFの全文インデックス構築とPort 8520ダッシュボード配備完了。' },
      { phase: 'Phase 2', title: 'モータ技術用語体系・損失低減タクソノミ構築', done: true, desc: 'IPMSM, SynRM, WF-FSMの専門用語マッピング辞書完成。' },
      { phase: 'Phase 3', title: '承認不要 自律即時パブリッシング稼働', done: true, desc: 'ArXiv・IEEE論文の自動探索・精読・EmDash自動公開ライン確立。' },
      { phase: 'Phase 4', title: '巻線界磁同期機（WF-FSM）深層サーベイ記事公開', done: false, desc: 'ステータ界磁巻線・回転子界磁巻線のトルク密度向上論文を徹底解説。' },
      { phase: 'Phase 5', title: 'SiCインバータ高dv/dtサージ電圧抑制技術の数理解析', done: false, desc: '高スイッチング周波数化に伴うモータ巻線絶縁設計の最前線。' },
      { phase: 'Phase 6', title: '効率マップ・磁気回路比較ビューアのWeb統合', done: false, desc: '論文中の効率等高線・トルクリプル波形をインタラクティブ表示。' },
    ],
    stats: {
      articlesCount: 0,
      toolsCount: 4,
      updateFrequency: 'オンデマンド即時検索',
      kpi: '論文検索ヒット率・研究調査時間短縮率',
    },
    techStack: ['Python', 'Flask / FastMCP', 'SQLite FTS5', 'ASUSTOR NAS', 'PDF.js'],
    adSite: 'smartailife',
  },

  'hobby-labs': {
    id: 'hobby-labs',
    title: 'ウルトラマンラボ (Ultraman Softvinyl & UCG Lab)',
    shortTitle: 'ウルトラマン',
    subtitle: 'ウルトラマンソフビ・怪獣シリーズ造形解析 ＆ ウルトラマンカードゲーム（UCG）攻略',
    icon: '👾',
    badge: '👾 ウルトラマン特化ラボ',
    badgeColor: '#dc2626',
    themeColor: '#dc2626',
    themeBg: '#fef2f2',
    themeBorder: '#dc2626',
    themeText: '#991b1b',
    status: 'active',
    statusLabel: '本番稼働中',
    extUrl: 'https://corestation.pages.dev',
    extLabel: 'カード検索 ↗',
    ghUrl: 'https://github.com/tstarryheavens-prog/UltramancardgameSearcher',
    path: '/Volumes/Docker/UltramancardgameSearcher',
    monetization: 'ウルトラマン愛好者コミュニティ送客 ＋ ホビーグッズ・カードアフィリエイト',
    mission: 'ウルトラマンソフビ（ウルトラヒーロー・怪獣シリーズ）の造形美・劇中スーツ再現度の徹底解剖と、ウルトラマンカードゲーム（UCG）の環境考察・デッキ構築支援を専門に発信する。',
    overview: 'ウルトラ怪獣ソフビの金型・塗装・劇中プロップ比較から、ウルトラマンカードゲーム（UCG）の効果テキスト検索・環境メタ分析まで、ウルトラマンに関するディープな検証記事と自作ツールを統合提供する専門ラボ。',
    features: [
      {
        name: 'ウルトラマンカードゲーム 高速検索エンジン',
        description: 'カード名、属性、レベル、効果テキスト、BP、SPをリアルタイムにフィルタリングできるデッキ構築支援ツール。',
        status: 'live',
        tag: 'UCG高速検索',
      },
      {
        name: 'ウルトラ怪獣シリーズ ソフビ造形・劇中再現度アーカイブ',
        description: '歴代ウルトラマン・怪獣ソフビの劇中スーツシワ、プロポーション、金型技術、塗装クオリティの徹底比較検証。',
        status: 'live',
        tag: 'ソフビ造形解析',
      },
      {
        name: '大人のウルトラマンコレクション＆ディスプレイ術',
        description: '増え続けるソフビやカードを美しく保護・展示するためのアクリルケース選定、UV退色対策、スミ入れ技法。',
        status: 'active',
        tag: '展示・保存術',
      },
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'カード検索ツール & ソフビ造形アーカイブ公開', done: true, desc: 'UCG高速検索エンジンと初期ソフビ造形レビュー配備完了。' },
      { phase: 'Phase 2', title: '特撮ホビーから「ウルトラマン」へ専門改称', done: true, desc: 'ウルトラマンソフビ＆カードゲーム特化のラボのリブランディング完了。' },
      { phase: 'Phase 3', title: 'UCG最新ブースター環境デッキ（ティガ・ブレーザー軸）分析', done: false, desc: '大会上位入賞デッキのテンポアドバンテージとプレイング指南記事公開。' },
      { phase: 'Phase 4', title: '歴代怪獣ソフビ（旧800 vs 現500シリーズ）金型進化比較', done: false, desc: '縮小化に伴う造形ディテール・塗装省略と劇中プロップ再現度の技術検証。' },
      { phase: 'Phase 5', title: 'ソフビ紫外線退色防止＆アクリルケース展示設計ガイド', done: false, desc: '退色・可塑剤ブリードを防ぐ最適な保管環境とライティング技術。' },
      { phase: 'Phase 6', title: 'スマホカメラによるUCGデッキ画像認識・一括リスト化', done: false, desc: '実物カードの写真を撮るだけでデッキレシピを即座にデジタル化。' },
    ],
    stats: {
      articlesCount: 7,
      toolsCount: 3,
      updateFrequency: '随時更新',
      kpi: 'ソフビ・UCG愛好者エンゲージメント数',
    },
    techStack: ['Astro', 'Vue / React', 'Python', 'Tailwind CSS'],
    adSite: 'smartailife',
  },
};
