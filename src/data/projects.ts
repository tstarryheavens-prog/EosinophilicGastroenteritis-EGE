export interface ProjectSite {
  id: string;
  title: string;
  subtitle: string;
  category: 'energy' | 'home' | 'health' | 'money' | 'education' | 'hobby';
  categoryLabel: string;
  categoryColor: string;
  tags: string[];
  description: string;
  aiTechSummary: string;
  lifeUpdateValue: string;
  link?: string;
  hatenaSlug?: string;
  icon: string;
  status: 'released' | 'operational' | 'planning';
}

export const NETWORK_SITES: ProjectSite[] = [
  {
    id: 'ai-hems',
    title: 'AI Home HEMS',
    subtitle: '汎用次世代スマートエネルギーOS',
    category: 'energy',
    categoryLabel: 'エネルギー・スマートハウス',
    categoryColor: 'emerald',
    tags: ['ECHONET Lite', '自作OS', '14.9kWh蓄電池', '卒FIT', '市場連動充電'],
    description: '家庭用蓄電池・太陽光発電（PV）・スマートメーターをECHONET Lite経由で自動探索し、電気代最小化と非常時電源確保を自律両立する自作OS。',
    aiTechSummary: 'ECHONET Lite UDPマルチキャスト自動探索 × 翌日天気予報・日射量連動充電制御アルゴリズム',
    lifeUpdateValue: '卒FIT後の電気代を月数万円削減＆台風・停電時にも自動で満充電待機する安心の暮らし。',
    link: 'https://github.com/tstarryheavens-prog/AIHomeHEMS',
    hatenaSlug: 'https://kurashi-ai.hatenadiary.com/entry/2026/10/04/002546',
    icon: '⚡',
    status: 'operational',
  },
  {
    id: 'toyotahome-10years',
    title: 'トヨタホーム建築10年記念アーカイブ',
    subtitle: '5,200万フルローン・卒FIT・蓄電池実録ポータル',
    category: 'home',
    categoryLabel: '住まい・建築実録',
    categoryColor: 'amber',
    tags: ['注文住宅', '10年点検', '頭金0円', '値引き527万', 'はてな連載'],
    description: '2016年にトヨタホームで新築して10年。土地探し、見積値引き527万円の内訳、つなぎ融資、鉄骨ユニット据付から卒FIT・蓄電池導入までの全10万字超の実録データアーカイブ。',
    aiTechSummary: '過去10年分の見積・融資・電気代実績データを完全整理し、Webポータル＆はてなブログ連載（全15回）へ体系化',
    lifeUpdateValue: '家づくりの「見えない諸費用」や10年後のメンテナンス・光熱費リアル収支を透明化。',
    link: 'https://mytoyotahomebottle.hatenablog.com/entry/2026/10/03/152614',
    hatenaSlug: 'https://mytoyotahomebottle.hatenablog.com/entry/2026/10/03/171744',
    icon: '🏠',
    status: 'operational',
  },
  {
    id: 'nanbyo-ege-cgrp',
    title: '好酸球性疾患・群発頭痛・重症喘息 闘病記',
    subtitle: '最新抗体薬・服薬調査・血圧マネジメントノート',
    category: 'health',
    categoryLabel: '医療・ヘルスケア',
    categoryColor: 'teal',
    tags: ['好酸球性胃腸炎', '群発頭痛', '重症喘息', 'エキシデンサー', 'note連携', 'Cloudflare Pages'],
    description: '指定難病の好酸球性胃腸炎・激痛を伴う群発頭痛・重症喘息と向き合い、最新抗体薬（デュピクセント/エキシデンサー）の実感や高血圧との格闘を記録した医療情報サイト。',
    aiTechSummary: '膨大な処方薬情報・論文治験データ・生体バイタル（血圧/呼気好酸球）の分析とアーカイブ化',
    lifeUpdateValue: '情報が少ない難病・激痛疾患に対し、客観的データと実体験を提供し同じ苦しみを持つ人へ希望を届ける。',
    link: 'https://eosinophilicgastroenteritis-ege.pages.dev',
    hatenaSlug: 'https://note.com/nanbyou_ege_cgrp',
    icon: '🔬',
    status: 'operational',
  },
  {
    id: 'wakwak-money',
    title: 'ワクワク家計管理',
    subtitle: '我が家特化 家計簿＆100歳ライフプランシミュレーション',
    category: 'money',
    categoryLabel: '家計・ライフプラン',
    categoryColor: 'blue',
    tags: ['Docker', '残高不足防止', '100歳シミュレーション', '住宅ローン返済', '生涯キャッシュフロー'],
    description: '月末やカード引き落とし日の残高不足を先回り防止し、夫42歳から100歳までの生涯収支・資産推移をリアルタイムにシミュレーションできるDocker自作家計管理Webアプリ。',
    aiTechSummary: '家計支出パターンの可視化と動的な退職・年金・ローン完済キャッシュフロー予測計算',
    lifeUpdateValue: '「今月いくら使えるか」「老後破綻しないか」の不安を完全にゼロにし、前向きにお金を使える暮らし。',
    link: 'https://kurashi-ai.hatenadiary.com/entry/2026/10/03/213015',
    hatenaSlug: 'https://kurashi-ai.hatenadiary.com/entry/2026/10/03/213015',
    icon: '💰',
    status: 'operational',
  },
  {
    id: 'aichi-highschool',
    title: '愛知県公立高校進学ガイド',
    subtitle: '名古屋・尾張地区 内申点ランキング＆AI学習ガイド',
    category: 'education',
    categoryLabel: '教育・受験ハック',
    categoryColor: 'indigo',
    tags: ['高校入試', '内申点ランキング', '当日点配点', 'AI勉強法', '生成スクリプト'],
    description: '愛知県（尾張・名古屋地区）の公立高校入試に必要な内申点と当日点比率（Ⅰ型〜Ⅴ型）をデータベース化。中高生がAIを家庭教師にして定期テストを攻略するプロンプト集を収録。',
    aiTechSummary: '全公立校データ自動生成スクリプト ＆ 対話型AI学習プロンプト（ai-prompts.html / ai-study-guide.html）の設計',
    lifeUpdateValue: '塾任せにせず、AIを活用して親子で効率的・戦略的に志望校合格を目指す新しい学び。',
    link: 'https://ikomainagoyaaichihighschool.pages.dev',
    hatenaSlug: 'https://gotonagoyaaichihighschool.pages.dev',
    icon: '🎒',
    status: 'operational',
  },
  {
    id: 'homeagent',
    title: 'HomeAgent 🏠⚡',
    subtitle: '自律型AIエージェント搭載スマートハブ',
    category: 'home',
    categoryLabel: 'スマートホーム・自律AI',
    categoryColor: 'violet',
    tags: ['Docker', '自律エージェント', '家電連携', 'オートメーション', 'SwitchBot/Remo'],
    description: 'ローカルネットワーク上の多彩なスマートホーム家電・センサーを一元管理し、自律型AIエージェントが生活パターンに合わせて快適環境を維持するスマートハブ。',
    aiTechSummary: '自然言語指示による家電オートメーション生成 ＆ 自律エージェントによるセンサー値追従制御',
    lifeUpdateValue: '「ボタンを押す」「アプリを開く」手間すらなく、空気が読める住まいへの進化。',
    link: 'https://kurashi-ai.hatenadiary.com/entry/2026/10/04/010848',
    hatenaSlug: 'https://kurashi-ai.hatenadiary.com/entry/2026/10/04/003849',
    icon: '🤖',
    status: 'operational',
  },
  {
    id: 'ultraman-cg-viewer',
    title: 'ウルトラマンCG コレクションビューア',
    subtitle: '保有・未保有ビジュアルリスト＆データ照合',
    category: 'hobby',
    categoryLabel: '趣味・データ連携',
    categoryColor: 'rose',
    tags: ['Excel照合', '公式API', 'CDN連携', '1400枚管理', '高解像度ビューア'],
    description: 'デスクトップのExcel（1,413行）と公式カードAPI（1,339枚）を照合・紐付けし、高画質画像で未保有カードを一目で特定できる直感的なコレクション管理Webアプリ。',
    aiTechSummary: '非構造化データ・ExcelとREST APIのマッチング自動化アルゴリズム ＆ 画像最適化配信',
    lifeUpdateValue: '散らかりがちなコレクションの重複買いを防ぎ、親子での収集・整理を何倍も楽しく。',
    link: 'https://kurashi-ai.hatenadiary.com/entry/2026/10/04/021338',
    hatenaSlug: 'https://kurashi-ai.hatenadiary.com/entry/2026/10/04/021338',
    icon: '🎴',
    status: 'operational',
  },
];

export const HATENA_BLOG_URL = 'https://kurashi-ai.hatenadiary.com/';
export const GITHUB_REPO_URL = 'https://github.com/tstarryheavens-prog/ai-living-lab';
export const CLOUDFLARE_PAGES_URL = 'https://eosinophilicgastroenteritis-ege.pages.dev/ai-living-lab';
export const WORKERS_DEV_URL = 'https://ai-living-lab.t-starryheavens.workers.dev';

