export interface BiologicEntry {
  id: string;
  brandNameJa: string;
  brandNameEn: string;
  genericNameJa: string;
  genericNameEn: string;
  category: 
    | 'allergy_respiratory'
    | 'gi_ibd'
    | 'rheumatology_autoimmune'
    | 'dermatology'
    | 'neurology_headache'
    | 'oncology'
    | 'ophthalmology_metabolism_blood';
  target: string;
  modality: string;
  indications: string[];
  administration: string;
  company: string;
  approvalStatus: string;
  description: string;
  molecularMechanism: string;
  pmdaUrl?: string;
  imageUrl?: string;
  imageSourceText?: string;
  imageSourceUrl?: string;
}

export const BIOLOGIC_CATEGORIES: Record<BiologicEntry['category'], { label: string; icon: string; color: string; description: string }> = {
  allergy_respiratory: {
    label: 'アレルギー・呼吸器・好酸球性疾患',
    icon: '🫁',
    color: 'emerald',
    description: '重症喘息、アトピー性皮膚炎、好酸球性副鼻腔炎、好酸球性消化管疾患などのType 2（Th2）炎症を遮断する抗体医薬品。'
  },
  gi_ibd: {
    label: '消化器・炎症性腸疾患 (IBD)',
    icon: '🩺',
    color: 'teal',
    description: '潰瘍性大腸炎（UC）やクローン病（CD）の腸管粘膜における炎症シグナルやリンパ球遊走をピンポイントで抑え込む分子標的薬。'
  },
  rheumatology_autoimmune: {
    label: 'リウマチ・膠原病・自己免疫',
    icon: '🧬',
    color: 'blue',
    description: '関節リウマチ、全身性エリテマトーデス（SLE）などの自己抗体産生や全身炎症性サイトカイン（TNF, IL-6等）を阻害する製剤群。'
  },
  dermatology: {
    label: '皮膚科・乾癬・アトピー',
    icon: '✨',
    color: 'amber',
    description: '尋常性乾癬、乾癬性関節炎、膿疱性乾癬、結節性痒疹などの表皮過角化や激しい痒みを司る特異的サイトカイン（IL-17, IL-23, IL-31）阻害薬。'
  },
  neurology_headache: {
    label: '神経内科・頭痛・認知症',
    icon: '🧠',
    color: 'purple',
    description: '片頭痛発作を抑えるCGRP関連抗体、重症筋無力症（MG）、多発性硬化症（MS）、アルツハイマー病アミロイドβ抗体などの最先端神経抗体。'
  },
  oncology: {
    label: 'がん・腫瘍（免疫チェックポイント＆ADC）',
    icon: '🎯',
    color: 'rose',
    description: '免疫のブレーキを解除する抗PD-1/CTLA-4抗体や、がん細胞特異抗原に抗がん剤を直接届ける抗体薬物複合体（ADC）。'
  },
  ophthalmology_metabolism_blood: {
    label: '眼科・骨粗鬆症・循環器・血液',
    icon: '👁️',
    color: 'indigo',
    description: '加齢黄斑変性の抗VEGF薬、重症骨粗鬆症の抗RANKL/スクレロスチン抗体、家族性高コレステロール血症のPCSK9抗体、血友病の二重特異性抗体。'
  }
};

export const biologicsDatabase: BiologicEntry[] = [
  // ==========================================
  // 1. アレルギー・呼吸器・耳鼻科・好酸球性疾患
  // ==========================================
  {
    id: 'dupixent',
    brandNameJa: 'デュピクセント',
    brandNameEn: 'Dupixent',
    genericNameJa: 'デュピルマブ（遺伝子組換え）',
    genericNameEn: 'Dupilumab',
    category: 'allergy_respiratory',
    target: 'IL-4Rα (IL-4 / IL-13受容体共有サブユニット)',
    modality: '完全ヒト型モノクローナル抗体 (IgG4)',
    indications: [
      '好酸球性食道炎 (EoE: 国内外承認)',
      '好酸球性胃腸炎 (治験・適応拡大期待)',
      'アトピー性皮膚炎 (生後6ヶ月以上)',
      '気管支喘息 (難治性・アトピー型)',
      '鼻茸を伴う慢性副鼻腔炎 (CRSwNP)',
      '結節性痒疹',
      '慢性閉塞性肺疾患 (COPD: 海外承認/国内審査)'
    ],
    administration: '皮下注射（通常初回600mg、以降300mgを2週間隔。自己注射可能）',
    company: 'サノフィ / リジェネロン (Sanofi / Regeneron)',
    approvalStatus: '日本・米国・欧州承認（好酸球性食道炎を含む多領域で標準治療薬）',
    description: 'アレルギー・好酸球性疾患の根本原因である「Type 2炎症」の二大マスターサイトカイン「IL-4」と「IL-13」の共通受容体α鎖（IL-4Rα）に結合し、両方のシグナル伝達を同時にブロックする画期的な完全ヒト抗体です。消化管粘膜の好酸球浸潤やバリア機能不全を劇的に改善します。',
    molecularMechanism: 'IL-4およびIL-13受容体複合体を構成するIL-4Rαに特異的に結合し、STAT6等の下流転写因子のリン酸化を阻害。Th2細胞の分化、IgEクラススイッチ、好酸球遊走ケモカイン（エオタキシン）の放出を強力に遮断します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999450G1'
  },
  {
    id: 'nucala',
    brandNameJa: 'ヌーカラ',
    brandNameEn: 'Nucala',
    genericNameJa: 'メポリズマブ（遺伝子組換え）',
    genericNameEn: 'Mepolizumab',
    category: 'allergy_respiratory',
    target: 'IL-5 (インターロイキン-5リガンド)',
    modality: 'ヒト化モノクローナル抗体 (IgG1κ)',
    indications: [
      '気管支喘息 (難治性・好酸球性)',
      '好酸球性多発血管炎性肉芽腫症 (EGPA: 指定難病)',
      '好酸球増多症候群 (HES)',
      '鼻茸を伴う慢性副鼻腔炎 (CRSwNP)'
    ],
    administration: '皮下注射（通常1回100mgまたは300mgを4週間隔。オートインジェクターによる自己注射可能）',
    company: 'グラクソ・スミスクライン (GSK)',
    approvalStatus: '日本・米国・欧州承認（EGPAにおける唯一の生物学的製剤としても重要）',
    description: '好酸球の分化・増殖・生存を直接制御するサイトカイン「IL-5」に直接結合して中和する抗体医薬品です。血中および組織中の好酸球数を極めて安全かつ迅速に正常域へと低減させ、重症喘息発作や好酸球による全身臓器障害を防ぎます。',
    molecularMechanism: '血中の遊離IL-5に高親和性で結合し、好酸球表面のIL-5受容体α鎖（IL-5Rα）との結合を物理的に阻害。骨髄における好酸球前駆細胞の成熟停止および末梢好酸球のアポトーシス（自然死）を誘導します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2290401G1'
  },
  {
    id: 'fasenra',
    brandNameJa: 'ファセンラ',
    brandNameEn: 'Fasenra',
    genericNameJa: 'ベンラリズマブ（遺伝子組換え）',
    genericNameEn: 'Benralizumab',
    category: 'allergy_respiratory',
    target: 'IL-5Rα (IL-5受容体α鎖)',
    modality: 'ヒト化モノクローナル抗体（アフコシル化 / ADCC活性超増強型 IgG1κ）',
    indications: [
      '気管支喘息 (重症難治性・好酸球性)',
      '好酸球性多発血管炎性肉芽腫症 (EGPA: 日米承認)'
    ],
    administration: '皮下注射（初回・4週後・8週後、以降8週間隔。自己注射ペン対応）',
    company: 'アストラゼネカ / 協和キリン (AstraZeneca / Kyowa Kirin)',
    approvalStatus: '日本・米国・欧州承認（8週に1回の維持投与が特徴）',
    description: '好酸球および好塩基球の細胞膜表面に発現している「IL-5受容体α鎖」に直接結合する抗体です。抗体の糖鎖からフコースを除去した「ポテリジェント技術（アフコシル化）」により、NK細胞のFcγRIIIa受容体への結合親和性を数十倍に高め、抗体依存性細胞傷害作用（ADCC）によって好酸球を直接アポトーシスへ追い込みます。',
    molecularMechanism: 'IL-5Rαを介したシグナル伝達の遮断に加え、抗体Fc部位にNK細胞を強力にリクルート。パーフォリンおよびグランザイムを放出させて標的好酸球を迅速かつほぼ完全に直接アポトーシス・枯渇（near-complete depletion）させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2290402G1'
  },
  {
    id: 'tezspire',
    brandNameJa: 'テゼスパイア',
    brandNameEn: 'Tezspire',
    genericNameJa: 'テゼペルマブ（遺伝子組換え）',
    genericNameEn: 'Tezepelumab',
    category: 'allergy_respiratory',
    target: 'TSLP (胸腺間質性リンパ球新生因子)',
    modality: '完全ヒト型モノクローナル抗体 (IgG2λ)',
    indications: [
      '気管支喘息 (難治性・好酸球数やアレルギーの有無を問わない全表現型)'
    ],
    administration: '皮下注射（通常1回210mgを4週間隔。自己注射ペン可能）',
    company: 'アストラゼネカ / アムジェン (AstraZeneca / Amgen)',
    approvalStatus: '日本・米国・欧州承認（気道上皮最上流をブロックするファースト・イン・クラス）',
    description: 'ウイルス・大気汚染物質・アレルゲンなどの刺激によって気道上皮細胞から分泌される炎症の「最上流アラーミン（警報物質）」であるTSLPを特異的にブロックする最新世代の抗体です。好酸球性（Type 2）だけでなく非Type 2喘息にも効果を示します。',
    molecularMechanism: 'TSLPが樹状細胞やマスト細胞上の受容体（TSLPR / IL-7Rα複合体）に結合するのを阻害。Th2サイトカイン（IL-4, IL-5, IL-13）の産生だけでなく、好中球性炎症や気道過敏性の亢進など複数の下流炎症カスケードを一挙に遮断します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2290404G1'
  },
  {
    id: 'xolair',
    brandNameJa: 'ゾレア',
    brandNameEn: 'Xolair',
    genericNameJa: 'オマリズマブ（遺伝子組換え）',
    genericNameEn: 'Omalizumab',
    category: 'allergy_respiratory',
    target: 'IgE (免疫グロブリンE Fc領域)',
    modality: 'ヒト化モノクローナル抗体 (IgG1κ)',
    indications: [
      '気管支喘息 (重症アレルギー性)',
      '季節性アレルギー性鼻炎 (重症花粉症)',
      '特発性の慢性蕁麻疹',
      '食物アレルギー (米国FDA承認: 偶発的摂取時のアナフィラキシー低減)'
    ],
    administration: '皮下注射（患者の体重と血清中総IgE値に基づき、2週または4週間隔で75〜600mgを投与）',
    company: 'ノバルティス / ロシュ (Novartis / Genentech)',
    approvalStatus: '世界中で広く承認・実用化（バイオ製剤の草分け的存在）',
    description: '血中を循環する遊離IgEに特異的に結合し、マスト細胞や好塩基球のFcεRI受容体にIgEが結合するのを阻害します。アレルゲン侵入時のヒスタミンやロイコトリエン等の脱顆粒反応を根本から遮断し、激しいアレルギー発作を予防します。',
    molecularMechanism: '遊離IgEのCε3ドメインに結合して受容体結合部位をマスク。マスト細胞膜上の高親和性IgE受容体（FcεRI）のダウンレギュレーション（発現減少）をもたらし、アレルギー即時型反応を劇的に鎮静化させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2290400G1'
  },

  // ==========================================
  // 2. 消化器・炎症性腸疾患 (IBD: 潰瘍性大腸炎・クローン病)
  // ==========================================
  {
    id: 'remicade',
    brandNameJa: 'レミケード',
    brandNameEn: 'Remicade',
    genericNameJa: 'インフリキシマブ（遺伝子組換え）',
    genericNameEn: 'Infliximab',
    category: 'gi_ibd',
    target: 'TNF-α (腫瘍壊死因子α)',
    modality: 'マウス/ヒト キメラ型モノクローナル抗体 (IgG1κ)',
    indications: [
      'クローン病 (中等症〜重症、難治性瘻孔)',
      '潰瘍性大腸炎 (中等症〜重症)',
      '関節リウマチ (関節破壊防止)',
      '尋常性乾癬 / 乾癬性関節炎',
      'ベーチェット病 (眼病変)',
      '強直性脊椎炎',
      '腸管型・血管型・神経型ベーチェット病'
    ],
    administration: '点滴静脈注射（初回・2週後・6週後、以降8週間隔で5mg/kg）',
    company: 'ヤンセン / 田辺三菱製薬 (Janssen / Tanabe Mitsubishi)',
    approvalStatus: '世界約100カ国以上で承認（IBD治療のパラダイムシフトを起こした先駆的抗体）',
    description: '炎症性腸疾患（IBD）やリウマチ治療の歴史を塗り替えた世界初の抗TNF-α抗体です。消化管粘膜の激しい潰瘍形成や狭窄・瘻孔を強力に鎮静化し、粘膜治癒（Mucosal Healing）を達成して外科的手術の回避に決定的な役割を果たします。',
    molecularMechanism: '可溶型TNF-αおよび膜結合型TNF-αの両方に高い親和性で結合。受容体（TNFR1/TNFR2）との結合を競合的に阻害するだけでなく、抗体依存性細胞障害（ADCC）および補体依存性細胞傷害（CDC）により活性化マクロファージやT細胞をアポトーシスさせます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999401A1'
  },
  {
    id: 'humira',
    brandNameJa: 'ヒュミラ',
    brandNameEn: 'Humira',
    genericNameJa: 'アダリムマブ（遺伝子組換え）',
    genericNameEn: 'Adalimumab',
    category: 'gi_ibd',
    target: 'TNF-α (腫瘍壊死因子α)',
    modality: '完全ヒト型モノクローナル抗体 (IgG1κ)',
    indications: [
      '潰瘍性大腸炎 / クローン病',
      '関節リウマチ / 若年性特発性関節炎',
      '尋常性乾癬 / 膿疱性乾癬 / 乾癬性関節炎',
      '強直性脊椎炎',
      '腸管型ベーチェット病',
      '非感染性ぶどう膜炎',
      '化膿性汗腺炎'
    ],
    administration: '皮下注射（通常成人40mgを2週間隔。自己注射可能）',
    company: 'アッヴィ (AbbVie)',
    approvalStatus: '世界で最も処方された医薬品の一つ（完全ヒト型抗体による低免疫原性と皮下注の利便性）',
    description: 'ファージディスプレイ技術を用いて開発された世界初の完全ヒト型抗TNF-α抗体です。ヒト由来のアミノ酸配列のみで構成されているため中和抗体（抗薬物抗体）の発生リスクが低く、在宅自己注射により通院負担を大幅に軽減しながら寛解を長期維持します。',
    molecularMechanism: '遊離および膜結合型のヒトTNF-αに特異的に結合し、受容体を介した接着分子・ケモカイン・メタロプロテアーゼの産生を抑え、全身の慢性炎症を抑制します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999403G1'
  },
  {
    id: 'stelara',
    brandNameJa: 'ステラーラ',
    brandNameEn: 'Stelara',
    genericNameJa: 'ウステキヌマブ（遺伝子組換え）',
    genericNameEn: 'Ustekinumab',
    category: 'gi_ibd',
    target: 'IL-12/23 p40 (共有サブユニット)',
    modality: '完全ヒト型モノクローナル抗体 (IgG1κ)',
    indications: [
      'クローン病 (難治性・中等症〜重症)',
      '潰瘍性大腸炎 (難治性・中等症〜重症)',
      '尋常性乾癬 / 乾癬性関節炎'
    ],
    administration: '導入期: 体重別点滴静脈内投与、維持期: 90mgを8週または12週間隔で皮下注射（自己注射可能）',
    company: 'ヤンセンファーマ (Janssen)',
    approvalStatus: '日本・米国・欧州承認（抗TNF阻害薬抵抗例に対する第2の柱）',
    description: 'Th1細胞分化を促すIL-12と、Th17細胞の生存・増殖を司るIL-23の両方が共有する「p40タンパク質サブユニット」を標的とする完全ヒト抗体です。抗TNF-α阻害薬が無効または効果減弱したIBD患者において高い寛解導入・維持効果を発揮します。',
    molecularMechanism: 'IL-12およびIL-23のp40サブユニットに特異的に結合し、リンパ球表面のIL-12Rβ1受容体との相互作用を阻止。INF-γやIL-17Aなどの下流炎症因子の放出を抑え、消化管および皮膚の慢性炎症を鎮静化させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999405G1'
  },
  {
    id: 'skyrizi',
    brandNameJa: 'スキリージ',
    brandNameEn: 'Skyrizi',
    genericNameJa: 'リサンキズマブ（遺伝子組換え）',
    genericNameEn: 'Risankizumab',
    category: 'gi_ibd',
    target: 'IL-23 p19 (特異的サブユニット)',
    modality: 'ヒト化モノクローナル抗体 (IgG1κ)',
    indications: [
      'クローン病 (中等症〜重症)',
      '潰瘍性大腸炎 (中等症〜重症)',
      '尋常性乾癬 / 乾癬性関節炎 / 膿疱性乾癬'
    ],
    administration: '導入期: 600mg点滴静脈投与（0, 4, 8週）、維持期: 180mgまたは360mgを8週間隔で皮下注射（オンボディインジェクター対応）',
    company: 'アッヴィ (AbbVie)',
    approvalStatus: '日本・米国・欧州承認（IL-23選択的阻害による高い粘膜治癒率）',
    description: 'IL-12を温存し、病的Th17細胞の駆動に特化した「IL-23」の固有サブユニットp19のみを選択的に阻害する次世代バイオ製剤です。免疫防御能を過剰に損なうことなく、クローン病や潰瘍性大腸炎における極めて深い内視鏡的寛解をもたらします。',
    molecularMechanism: 'IL-23のp19サブユニットに特異的に結合してIL-23Rとの結合を遮断。生理的なTh1応答（感染防御）に影響を与えず、病原性Th17回路のみを遮断して大腸・小腸組織の組織学的修復を促進します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999448G1'
  },
  {
    id: 'entyvio',
    brandNameJa: 'エンタイビオ',
    brandNameEn: 'Entyvio',
    genericNameJa: 'ベドリズマブ（遺伝子組換え）',
    genericNameEn: 'Vedolizumab',
    category: 'gi_ibd',
    target: 'α4β7インテグリン (腸管選択的ホーミング受容体)',
    modality: 'ヒト化モノクローナル抗体 (IgG1κ)',
    indications: [
      '潰瘍性大腸炎 (中等症〜重症)',
      'クローン病 (中等症〜重症)'
    ],
    administration: '点滴静脈注射（300mgを0, 2, 6週、以降8週間隔）または皮下注射（維持期108mgを2週間隔）',
    company: '武田薬品工業 (Takeda)',
    approvalStatus: '世界70カ国以上で承認（全身免疫抑制を回避する腸管選択的抗体）',
    description: '全身の免疫を抑えるのではなく、炎症を起こしているリンパ球の「腸管への進入」だけを遮断する極めてユニークな腸管選択的抗体です。全身の感染症リスクを最小限に抑えながら、腸局所の激しい炎症を鎮める高い安全性プロファイルを有します。',
    molecularMechanism: '炎症性リンパ球の表面にある「α4β7インテグリン」に特異的に結合し、腸管内皮細胞に発現するリガンド「MAdCAM-1」との接着を阻害。血中リンパ球が腸管粘膜固有層へ血管外遊出することを物理的に阻止します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2399406A1'
  },

  // ==========================================
  // 3. リウマチ・膠原病・自己免疫疾患
  // ==========================================
  {
    id: 'actemra',
    brandNameJa: 'アクテムラ',
    brandNameEn: 'Actemra',
    genericNameJa: 'トシリズマブ（遺伝子組換え）',
    genericNameEn: 'Tocilizumab',
    category: 'rheumatology_autoimmune',
    target: 'IL-6R (インターロイキン-6受容体)',
    modality: 'ヒト化モノクローナル抗体 (IgG1κ)',
    indications: [
      '関節リウマチ (骨破壊防止)',
      '高安動脈炎 / 巨細胞性動脈炎 (大血管炎: 指定難病)',
      '全身型・多関節型 若年性特発性関節炎 (JIA)',
      'サイトカイン放出症候群 (CRS: CAR-T療法関連)',
      '成人スチル病',
      'キャッスルマン病'
    ],
    administration: '点滴静脈投与（4週に1回 8mg/kg）または皮下注射（通常162mgを2週間隔、自己注射可能）',
    company: '中外製薬 / ロシュ (Chugai / Roche)',
    approvalStatus: '日本発の世界的メガブロックバスター（岸本忠三博士らのIL-6基礎研究から創薬）',
    description: '日本発の世界的大成功バイオ製剤です。炎症性サイトカインIL-6の受容体に結合し、CRPの上昇、発熱、倦怠感、関節破壊を瞬時に抑え込みます。COVID-19重症例のサイトカインストーム治療や大血管炎難病の標準薬としても世界中で救命に貢献しています。',
    molecularMechanism: '膜結合型IL-6受容体（mIL-6R）および可溶型IL-6受容体（sIL-6R）の両方に結合し、gp130タンパク質との複合体形成およびJAK/STATシグナル伝達を完全にブロックします。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999402A1'
  },
  {
    id: 'enbrel',
    brandNameJa: 'エンブレル',
    brandNameEn: 'Enbrel',
    genericNameJa: 'エタネルセプト（遺伝子組換え）',
    genericNameEn: 'Etanercept',
    category: 'rheumatology_autoimmune',
    target: 'TNF-α / TNF-β (リンホトキシンα)',
    modality: '可溶性TNF受容体 Fc融合タンパク質 (Fc-fusion protein)',
    indications: [
      '関節リウマチ',
      '若年性特発性関節炎',
      '尋常性乾癬 / 乾癬性関節炎',
      '強直性脊椎炎'
    ],
    administration: '皮下注射（1回25mgを週2回、または50mgを週1回。自己注射可能）',
    company: 'アムジェン / ファイザー / 武田薬品 (Amgen / Pfizer / Takeda)',
    approvalStatus: '世界中で長年使用されるTNF阻害の代表的生物学的製剤',
    description: '抗体分子ではなく、ヒトのTNF受容体（TNFR2）の細胞外ドメインとヒトIgG1のFc領域を遺伝子工学的に結合させた「可溶性受容体おとり（デコイ受容体）型バイオ製剤」です。半減期が比較的短く、感染症等の緊急時に投薬中止後の回復が早い特徴があります。',
    molecularMechanism: '血中の遊離TNF-αおよびTNF-βに直接結合し、細胞膜上の本物の受容体と結合するのを防ぎます。抗体型と異なり膜結合型TNFに対する逆シグナルや補体活性化（CDC）を起こさないため結核再燃リスクが比較的低いとされます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999404G1'
  },
  {
    id: 'orencia',
    brandNameJa: 'オレンシア',
    brandNameEn: 'Orencia',
    genericNameJa: 'アバタセプト（遺伝子組換え）',
    genericNameEn: 'Abatacept',
    category: 'rheumatology_autoimmune',
    target: 'CD80 / CD86 (共刺激シグナル阻害)',
    modality: '可溶性CTLA-4細胞外領域 Fc融合タンパク質',
    indications: [
      '関節リウマチ',
      '多関節に活動性を有する若年性特発性関節炎'
    ],
    administration: '点滴静脈投与（4週に1回）または皮下注射（125mgを週1回自己注射）',
    company: 'ブリストル・マイヤーズ スクイブ / 小野薬品 (BMS / Ono)',
    approvalStatus: '日本・米国・欧州承認（T細胞の過剰活性化の初動を絶つアプローチ）',
    description: 'サイトカイン（TNFやIL-6）を後から中和するのではなく、抗原提示細胞からT細胞へと送られる「第二の活性化シグナル（共刺激シグナル）」を先回りして遮断するユニークな作用機序を持ちます。自己免疫反応の火種そのものを消し去ります。',
    molecularMechanism: 'CTLA-4の細胞外ドメインが抗原提示細胞表面の「CD80/CD86」に高親和性で結合。T細胞表面のCD28との結合を競合阻害し、T細胞の増殖とインターロイキン産生を初期段階でシャットダウンします。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999411A1'
  },
  {
    id: 'benlysta',
    brandNameJa: 'ベンリスタ',
    brandNameEn: 'Benlysta',
    genericNameJa: 'ベリムマブ（遺伝子組換え）',
    genericNameEn: 'Belimumab',
    category: 'rheumatology_autoimmune',
    target: 'BLyS / BAFF (Bリンパ球刺激因子)',
    modality: '完全ヒト型モノクローナル抗体 (IgG1λ)',
    indications: [
      '全身性エリテマトーデス (SLE: 指定難病)',
      'ループス腎炎 (ステロイドおよび免疫抑制剤併用)'
    ],
    administration: '点滴静注（10mg/kgを導入後4週間隔）または皮下注射（週1回200mg自己注射）',
    company: 'グラクソ・スミスクライン (GSK)',
    approvalStatus: 'SLE領域で半世紀ぶりに登場した歴史的生物学的製剤',
    description: '自己抗体を大量に産生して全身の皮膚・関節・腎臓を攻撃するB細胞の生存因子「BLyS（BAFF）」を中和する完全ヒト抗体です。全身性エリテマトーデスの再燃発作を有意に抑え、長期的なステロイド減量を可能にします。',
    molecularMechanism: '可溶型BLySタンパク質に結合してB細胞膜上の受容体（BAFF-R, TACI, BCMA）への結合を阻止。自己反応性B細胞のアポトーシスを促進し、抗dsDNA抗体などの自己抗体価を低下させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999424A1'
  },
  {
    id: 'saphnelo',
    brandNameJa: 'サフネロー',
    brandNameEn: 'Saphnelo',
    genericNameJa: 'アニフロルマブ（遺伝子組換え）',
    genericNameEn: 'Anifrolumab',
    category: 'rheumatology_autoimmune',
    target: 'IFNAR1 (I型インターフェロン受容体サブユニット1)',
    modality: '完全ヒト型モノクローナル抗体 (IgG1κ)',
    indications: [
      '全身性エリテマトーデス (SLE: 中等症〜重症)'
    ],
    administration: '点滴静脈内投与（300mgを4週間隔）',
    company: 'アストラゼネカ (AstraZeneca)',
    approvalStatus: '日本・米国・欧州承認（I型インターフェロン経路遮断薬として初承認）',
    description: 'SLEの病態形成において極めて中心的な役割を果たす「I型インターフェロン（IFN-α, IFN-β等）」の共通受容体IFNAR1を特異的にブロックします。難治性の蝶形紅斑や関節炎、血液異常を迅速に改善へと導きます。',
    molecularMechanism: 'IFNAR1に結合し、すべてのI型インターフェロン（IFN-αの全サブタイプ、IFN-β、IFN-κ、IFN-ω等）によるシグナル伝達を網羅的に遮断。下流のインターフェロン遺伝子発現シグネチャー（IFN signature）を正常化します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999451A1'
  },

  // ==========================================
  // 4. 皮膚科・乾癬・アトピー性皮膚炎
  // ==========================================
  {
    id: 'cosentyx',
    brandNameJa: 'コセンティクス',
    brandNameEn: 'Cosentyx',
    genericNameJa: 'セクキヌマブ（遺伝子組換え）',
    genericNameEn: 'Secukinumab',
    category: 'dermatology',
    target: 'IL-17A (インターロイキン-17A)',
    modality: '完全ヒト型モノクローナル抗体 (IgG1κ)',
    indications: [
      '尋常性乾癬 / 乾癬性関節炎 / 膿疱性乾癬',
      '強直性脊椎炎 / X線基準を満たさない体軸性脊椎関節炎',
      '化膿性汗腺炎 (海外・国内適応追加)'
    ],
    administration: '皮下注射（通常300mgを導入後4週間隔。オートインジェクター自己注射対応）',
    company: 'ノバルティス (Novartis)',
    approvalStatus: '世界中で乾癬および脊椎関節炎の標準抗体薬として普及',
    description: '乾癬の皮膚病変（銀白色の鱗屑と肥厚した紅斑）を引き起こす中核因子「IL-17A」を直接中和する抗体です。皮膚症状のほぼ完全な消失（PASI 90 / PASI 100）を高率に達成し、関節破壊の進行も強力に抑えます。',
    molecularMechanism: 'IL-17AホモダイマーおよびIL-17A/Fヘテロダイマーに高親和性で結合し、ケラチノサイト（表皮細胞）上のIL-17受容体複合体への結合を阻止。好中球遊走因子や炎症性ケモカインの放出を断ち切ります。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999427G1'
  },
  {
    id: 'bimzelx',
    brandNameJa: 'ビンゼレックス',
    brandNameEn: 'Bimzelx',
    genericNameJa: 'ビメキズマブ（遺伝子組換え）',
    genericNameEn: 'Bimekizumab',
    category: 'dermatology',
    target: 'IL-17A および IL-17F (二重中和)',
    modality: 'ヒト化モノクローナル抗体 (IgG1κ 二重特異性結合)',
    indications: [
      '尋常性乾癬 / 乾癬性関節炎 / 膿疱性乾癬 / 乾癬性紅皮症',
      '強直性脊椎炎',
      '化膿性汗腺炎'
    ],
    administration: '皮下注射（通常1回320mgを導入期4週毎、維持期8週毎。自己注射可能）',
    company: 'ユーシービージャパン (UCB)',
    approvalStatus: '日米欧で承認（IL-17AとIL-17Fの両方を同時に抑える最新鋭抗体）',
    description: '炎症を引き起こすIL-17Aだけでなく、病態増幅に強く関与する「IL-17F」をも同時にピンポイントで中和する次世代二重阻害抗体です。従来の単一サイトカイン阻害薬を上回る圧倒的な皮膚病変クリア率（皮疹消失）を誇ります。',
    molecularMechanism: '抗体の抗原認識部位がIL-17AとIL-17Fの共通構造を認識して両者に高親和性で結合。両因子の相乗的な炎症カスケードを根絶し、表皮細胞の異常増殖と組織破壊を極限まで抑制します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999452G1'
  },
  {
    id: 'mitchga',
    brandNameJa: 'ミチーガ',
    brandNameEn: 'Mitchga',
    genericNameJa: 'ネモリズマブ（遺伝子組換え）',
    genericNameEn: 'Nemolizumab',
    category: 'dermatology',
    target: 'IL-31RA (IL-31受容体A鎖)',
    modality: 'ヒト化モノクローナル抗体 (IgG2)',
    indications: [
      'アトピー性皮膚炎に伴う掻痒 (既存治療で効果不十分な場合)',
      '結節性痒疹'
    ],
    administration: '皮下注射（通常成人60mgを4週間隔。シリンジ自己注射可能）',
    company: '中外製薬 / ガルデルマ (Chugai / Galderma)',
    approvalStatus: '日本発創薬（世界初の「痒みシグナル特異的阻害抗体」）',
    description: '「痒みのサイトカイン」として知られるIL-31の受容体（IL-31RA）をブロックする、日本発の画期的な抗体医薬品です。アトピー性皮膚炎や結節性痒疹における耐えがたい痒みの神経伝達を投与直後から急速に遮断し、掻きむしりによる皮膚破壊の悪循環を断ち切ります。',
    molecularMechanism: '感覚神経末梢および免疫細胞表面のIL-31RAに結合し、IL-31シグナルを遮断。脳への痒み刺激伝達を抑制するとともに、バリア機能低下や炎症誘導を直接改善します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999453G1'
  },

  // ==========================================
  // 5. 神経内科・頭痛・認知症・神経難病
  // ==========================================
  {
    id: 'emgality',
    brandNameJa: 'エムガルティ',
    brandNameEn: 'Emgality',
    genericNameJa: 'ガルカネズマブ（遺伝子組換え）',
    genericNameEn: 'Galcanezumab',
    category: 'neurology_headache',
    target: 'CGRP (カルシトニン遺伝子関連ペプチド リガンド)',
    modality: 'ヒト化モノクローナル抗体 (IgG4)',
    indications: [
      '片頭痛発作の発症抑制 (慢性片頭痛 / 反復性片頭痛)',
      '反復性群発頭痛発作の抑制 (米国FDA承認 / 国内適応拡大期待)'
    ],
    administration: '皮下注射（初回240mg、以降120mgを1ヶ月に1回。オートインジェクター自己注射対応）',
    company: '日本イーライリリー (Eli Lilly)',
    approvalStatus: '日本・米国・欧州承認（片頭痛予防医療の劇的転換点となったバイオ製剤）',
    description: '片頭痛発作の激痛カスケードを引き起こす神経伝達物質「CGRP」に直接結合して中和する抗体です。従来の降圧薬や抗てんかん薬の予防内服と異なり、発作回数を半減〜完全ゼロへと導き、寝込む日々から患者を劇的に解放します。',
    molecularMechanism: '三叉神経終末から放出される遊離CGRPに高い特異性で結合。頭蓋血管の過剰な拡張および神経原性硬膜炎症を遮断し、痛覚シグナルの中枢への伝達を根本から防ぎます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1190403G1'
  },
  {
    id: 'ajovy',
    brandNameJa: 'アジョビ',
    brandNameEn: 'Ajovy',
    genericNameJa: 'フレマネズマブ（遺伝子組換え）',
    genericNameEn: 'Fremanezumab',
    category: 'neurology_headache',
    target: 'CGRP (カルシトニン遺伝子関連ペプチド α/βアイソフォーム)',
    modality: 'ヒト化モノクローナル抗体 (IgG2Δa/κ)',
    indications: [
      '片頭痛発作の発症抑制'
    ],
    administration: '皮下注射（4週に1回225mg、または12週に1回675mg。3ヶ月に1回投与の選択が可能）',
    company: '大塚製薬 / テバ (Otsuka / Teva)',
    approvalStatus: '日本・米国・欧州承認（「3ヶ月に1回」のまとめ投与オプションが特徴）',
    description: 'CGRP分子を直接捕捉する抗体医薬品で、4週間隔の投与に加えて「12週（3ヶ月）に1回3本をまとめて投与する」スケジュールが認められているのが最大の強みです。忙しい社会人や通院が困難な患者の負担を最小限に抑えます。',
    molecularMechanism: 'CGRPのαおよびβの両アイソフォームに選択的に結合し、CGRP受容体との相互作用を阻止。三叉神経血管系の過興奮を鎮静化させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1190404G1'
  },
  {
    id: 'aimovig',
    brandNameJa: 'アイモビーク',
    brandNameEn: 'Aimovig',
    genericNameJa: 'エレヌマブ（遺伝子組換え）',
    genericNameEn: 'Erenumab',
    category: 'neurology_headache',
    target: 'CGRP受容体 (CLR/RAMP1受容体複合体)',
    modality: '完全ヒト型モノクローナル抗体 (IgG2λ)',
    indications: [
      '片頭痛発作の発症抑制'
    ],
    administration: '皮下注射（通常1回70mgを4週間隔。自己注射ペン対応）',
    company: 'アムジェン / ノバルティス (Amgen / Novartis)',
    approvalStatus: '日本・米国・欧州承認（CGRP「受容体」側を遮断する唯一の完全ヒト抗体）',
    description: 'リガンド（CGRPペプチド）ではなく、血管や神経の細胞膜側にある「CGRP受容体」そのものを特異的に占有・ブロックする唯一の完全ヒト型抗体です。リガンド結合型抗体で効果が不十分だった患者の有力な切り替え選択肢となります。',
    molecularMechanism: 'CGRP受容体の構成要素であるCalcitonin Receptor-Like Receptor (CLR)およびRAMP1の複合体に競合的に結合。CGRPが結合できなくすることで受容体の活性化と細胞内cAMPの上昇を阻害します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1190402G1'
  },
  {
    id: 'vyvgart',
    brandNameJa: 'ウィフガート',
    brandNameEn: 'Vyvgart',
    genericNameJa: 'エフガルティギモド アルファ（遺伝子組換え）',
    genericNameEn: 'Efgartigimod alfa',
    category: 'neurology_headache',
    target: 'FcRn (新生児型Fc受容体)',
    modality: '改変ヒトIgG1 Fc領域フラグメント製剤',
    indications: [
      '全身型重症筋無力症 (gMG: 指定難病)',
      '免疫性血小板減少症 (ITP: 海外・国内開発)'
    ],
    administration: '点滴静注（1回10mg/kgを1週間隔で4回投与を1サイクル）または皮下注（ヒアルロニダーゼ配合）',
    company: 'アルジェニクス (argenx)',
    approvalStatus: '日米欧で承認（病原性IgG自己抗体を血中から選択的にお掃除する新薬）',
    description: '神経筋接合部を破壊する自己抗体（抗AChR抗体など）を体内で再利用させて長寿命にしている「FcRn受容体」を奪い取ることで、血液中のすべてのIgG抗体を急速に分解・排泄させる画期的な抗体フラグメント製剤です。',
    molecularMechanism: '内皮細胞のエンドソーム内でFcRnに極めて高い親和性で結合。本来ならFcRnに結合して分解を免れるはずの病原性自己抗体（IgG）をリソソームでの分解へと送り込み、血清IgG濃度を劇的に低下させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6399432A1'
  },
  {
    id: 'leqembi',
    brandNameJa: 'レケンビ',
    brandNameEn: 'Leqembi',
    genericNameJa: 'レカネマブ（遺伝子組換え）',
    genericNameEn: 'Lecanemab',
    category: 'neurology_headache',
    target: '可溶性アミロイドβプロトフィブリル (Aβ Protofibrils)',
    modality: 'ヒト化モノクローナル抗体 (IgG1)',
    indications: [
      'アルツハイマー病による軽度認知障害 (MCI) および軽度認知症の進行抑制'
    ],
    administration: '点滴静脈注射（2週に1回、10mg/kg）',
    company: 'エーザイ / バイオジェン (Eisai / Biogen)',
    approvalStatus: '日本・米国・中国等で承認（アルツハイマー病の病態進行を遅らせる初の原因標的抗体）',
    description: '脳内に蓄積して神経細胞毒性を発揮するアミロイドβの凝集体「可溶性プロトフィブリル」を選択的に結合・除去し、アルツハイマー病の臨床症状進行を約27%遅らせる、世界中から注目される歴史的疾患修飾薬です。',
    molecularMechanism: 'アミロイドβのモノマー（単量体）や不溶性プラーク（線維）よりも、最も神経毒性が高いとされる可溶性プロトフィブリル（中間凝集体）に選択的に結合。ミクログリアによる貪食を誘導して脳内アミロイド蓄積を除去します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1190405A1'
  },
  {
    id: 'soliris',
    brandNameJa: 'ソリリス',
    brandNameEn: 'Soliris',
    genericNameJa: 'エクリズマブ（遺伝子組換え）',
    genericNameEn: 'Eculizumab',
    category: 'neurology_headache',
    target: '補体タンパク質C5 (終末補体活性化阻害)',
    modality: 'ヒト化モノクローナル抗体 (IgG2/4κ)',
    indications: [
      '発作性夜間ヘモグロビン尿症 (PNH: 指定難病)',
      '非典型溶血性尿毒症症候群 (aHUS: 指定難病)',
      '全身型重症筋無力症 (gMG)',
      '視神経脊髄炎スペクトラム障害 (NMOSD: 再発予防)'
    ],
    administration: '点滴静脈注射（導入期週1回、維持期2週に1回）',
    company: 'アレクシオン / アストラゼネカ (Alexion / AstraZeneca)',
    approvalStatus: '難病領域における救命的超大型バイオ製剤（補体カスケード遮断の先駆け）',
    description: '免疫の終末補体カスケードで細胞膜障害複合体（MAC: C5b-9）を形成する「C5」の切断を阻止する超強力な抗体です。補体の過剰暴走によって赤血球が破壊されたり視神経・脊髄が破壊される致死的難病を劇的に安定化させます。',
    molecularMechanism: 'C5タンパク質に高親和性で結合し、C5転換酵素によるC5aおよびC5bへの酵素的切断を阻害。アナフィラトキシンC5aの遊離と膜傷害複合体MACの形成を阻止して補体媒介性組織破壊を防ぎます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6399420A1'
  },

  // ==========================================
  // 6. がん・悪性腫瘍（オンコロジー）
  // ==========================================
  {
    id: 'opdivo',
    brandNameJa: 'オプジーボ',
    brandNameEn: 'Opdivo',
    genericNameJa: 'ニボルマブ（遺伝子組換え）',
    genericNameEn: 'Nivolumab',
    category: 'oncology',
    target: 'PD-1 (Programmed Cell Death-1)',
    modality: '完全ヒト型モノクローナル抗体 (IgG4κ)',
    indications: [
      '悪性黒色腫 (メラノーマ)',
      '非小細胞肺癌',
      '腎細胞癌',
      '悪性リンパ腫 (ホジキンリンパ腫)',
      '頭頸部癌',
      '胃癌 / 食道癌',
      '尿路上皮癌 / 大腸癌 (MSI-High)'
    ],
    administration: '点滴静注（2週間隔で240mg、または4週間隔で480mg）',
    company: '小野薬品工業 / ブリストル・マイヤーズ スクイブ (Ono / BMS)',
    approvalStatus: 'ノーベル生理学・医学賞（本庶佑博士）の研究から結実した世界的免疫療法薬',
    description: 'がん細胞が自己防衛のためにT細胞にかけるブレーキ「PD-1/PD-L1経路」を解除する免疫チェックポイント阻害薬です。自分自身の免疫系（キラーT細胞）を再活性化してがん細胞を攻撃させる革新的治療法を確立しました。',
    molecularMechanism: '活性化T細胞表面のPD-1受容体に結合し、がん細胞表面のPD-L1/PD-L2との結合を遮断。免疫応答抑制シグナルを解除し、疲弊した細胞傷害性T細胞の抗腫瘍活性を劇的に復活させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4291427A1'
  },
  {
    id: 'keytruda',
    brandNameJa: 'キイトルーダ',
    brandNameEn: 'Keytruda',
    genericNameJa: 'ペムブロリズマブ（遺伝子組換え）',
    genericNameEn: 'Pembrolizumab',
    category: 'oncology',
    target: 'PD-1 (Programmed Cell Death-1)',
    modality: 'ヒト化モノクローナル抗体 (IgG4κ)',
    indications: [
      '肺癌 / 胃癌 / 食道癌 / 乳癌 / 子宮頸癌',
      '大腸癌 (高頻度マイクロサテライト不安定性: MSI-High)',
      '悪性黒色腫 / 尿路上皮癌 / 頭頸部癌',
      '高腫瘍遺伝子変異量 (TMB-High) を有する固形癌'
    ],
    administration: '点滴静注（3週に1回200mg、または6週に1回400mg）',
    company: 'MSD (Merck & Co.)',
    approvalStatus: '世界で年間売上高No.1のがん免疫チェックポイント阻害メガブロックバスター',
    description: '世界中のあらゆる固形がんで標準治療薬の地位を確立したPD-1阻害抗体です。「臓器横断的（組織非依存的）」に、遺伝子変異が多く免疫が認識しやすいがん（MSI-High / TMB-High）に対して広く保険適用を持つことでも有名です。',
    molecularMechanism: 'PD-1受容体に極めて高い親和性で結合してPD-L1/PD-L2の結合を競合阻害。がん微小環境におけるT細胞のアネルギー（無反応状態）を解除します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4291432A1'
  },
  {
    id: 'enhertu',
    brandNameJa: 'エンハーツ',
    brandNameEn: 'Enhertu',
    genericNameJa: 'トラスツズマブ デルクステカン（遺伝子組換え）',
    genericNameEn: 'Trastuzumab deruxtecan (T-DXd)',
    category: 'oncology',
    target: 'HER2 (ヒト上皮増殖因子受容体2型) + トポイソメラーゼI阻害薬',
    modality: '抗体薬物複合体 (ADC: Antibody-Drug Conjugate)',
    indications: [
      'HER2陽性およびHER2低発現の乳癌 (化学療法既治療)',
      'HER2陽性の胃癌 / 胃食道接合部癌',
      'HER2変異を有する非小細胞肺癌',
      'HER2陽性の大腸癌'
    ],
    administration: '点滴静脈注射（通常3週間に1回 5.4mg/kg）',
    company: '第一三共 / アストラゼネカ (Daiichi Sankyo / AstraZeneca)',
    approvalStatus: '世界中で「がん治療の歴史を変えた」と絶賛される日本発の次世代ADC',
    description: 'がん細胞表面のHER2抗原に結合する抗体に、強力な抗がん剤（トポイソメラーゼI阻害薬デルクステカン）を特殊なリンカーで結合させた国産ADCです。抗原を目印にしてがん細胞内に薬剤を直接送り込み、さらに膜透過性によって周囲の抗原陰性がん細胞まで撃破する「バイスタンダー効果」を発揮します。',
    molecularMechanism: 'HER2に結合後エンドサイトーシスで細胞内に取り込まれ、リソソームのリソソーム酵素によってリンカーが選択的切断。遊離したDXdが核内トポイソメラーゼIを阻害してアポトーシスを誘導します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4291444A1'
  },
  {
    id: 'herceptin',
    brandNameJa: 'ハーセプチン',
    brandNameEn: 'Herceptin',
    genericNameJa: 'トラスツズマブ（遺伝子組換え）',
    genericNameEn: 'Trastuzumab',
    category: 'oncology',
    target: 'HER2 (細胞外ドメインIV)',
    modality: 'ヒト化モノクローナル抗体 (IgG1κ)',
    indications: [
      'HER2過剰発現が確認された乳癌 (術前・術後補助療法、進行・再発)',
      'HER2過剰発現が確認された治癒切除不能な進行・再発の胃癌'
    ],
    administration: '点滴静注（初回8mg/kg、以降3週間隔で6mg/kg または毎週投与）',
    company: 'ロシュ / 中外製薬 / ジェネンテック (Roche / Chugai / Genentech)',
    approvalStatus: '分子標的抗体薬の金字塔（予後不良だったHER2陽性乳がんの予後を激変）',
    description: 'かつて極めて予後が悪かった「HER2陽性乳がん」の予後を劇的に改善した、分子標的抗体医薬品の歴史的記念碑です。HER2シグナルを阻害するとともに、抗体のFc部位を介したADCC活性によって強力にがん細胞を攻撃します。',
    molecularMechanism: 'HER2受容体のドメインIVに結合し、リガンド非依存的な受容体の二量体化およびホスファチジルイノシトール3キナーゼ（PI3K）経路の活性化を抑制。同時にNK細胞を動員してADCC活性を発揮します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4291403A1'
  },

  // ==========================================
  // 7. 眼科・骨粗鬆症・循環器・血液疾患
  // ==========================================
  {
    id: 'eylea',
    brandNameJa: 'アイリーア',
    brandNameEn: 'Eylea',
    genericNameJa: 'アフリベルセプト（遺伝子組換え）',
    genericNameEn: 'Aflibercept',
    category: 'ophthalmology_metabolism_blood',
    target: 'VEGF-A / VEGF-B / PlGF (胎盤増殖因子)',
    modality: '可溶性受容体 Fc融合タンパク質 (VEGF Trap)',
    indications: [
      '中心窩下脈絡膜新生血管を伴う加齢黄斑変性 (AMD)',
      '糖尿病黄斑浮腫 (DME)',
      '網膜静脈閉塞症に伴う黄斑浮腫',
      '病的近視における脈絡膜新生血管'
    ],
    administration: '硝子体内注射（眼球内へ直接微量注入。維持期2〜4ヶ月間隔）',
    company: 'リジェネロン / バイエル (Regeneron / Bayer)',
    approvalStatus: '眼科網膜硝子体領域の世界標準バイオ製剤',
    description: '眼底の網膜で異常な血管新生や水漏れ（浮腫）を引き起こすVEGFファミリーを強力にトラップして中和する眼科バイオ製剤です。失明の主要原因である加齢黄斑変性患者の視力を維持・改善させます。',
    molecularMechanism: 'ヒトVEGF受容体1および受容体2の主要ドメインをヒトIgG1のFc領域と融合させたデコイ受容体。抗体よりもはるかに強固な親和性（ピコモル単位）でVEGF分子を捕獲し、新生血管増殖を停止させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1319404A1'
  },
  {
    id: 'prolia',
    brandNameJa: 'プラリア / ランマーク',
    brandNameEn: 'Prolia / Xgeva',
    genericNameJa: 'デノスマブ（遺伝子組換え）',
    genericNameEn: 'Denosumab',
    category: 'ophthalmology_metabolism_blood',
    target: 'RANKL (Receptor Activator of Nuclear Factor-κB Ligand)',
    modality: '完全ヒト型モノクローナル抗体 (IgG2)',
    indications: [
      '骨粗鬆症 (プラリア: 6ヶ月に1回皮下注射)',
      '多発性骨髄腫および固形癌骨転移による骨病変 (ランマーク: 4週に1回)',
      '骨巨細胞腫'
    ],
    administration: '皮下注射（骨粗鬆症は60mgを6ヶ月に1回。骨転移は120mgを4週に1回）',
    company: 'アムジェン / 第一三共 (Amgen / Daiichi Sankyo)',
    approvalStatus: '世界中で骨粗鬆症およびがん骨転移治療の第一選択薬',
    description: '骨を壊して吸収する細胞「破骨細胞」の形成・活性化・生存に不可欠なタンパク質RANKLを特異的にブロックする抗体です。骨密度を急速かつ大幅に高め、高齢者や難病ステロイド治療に伴う大腿骨近位部骨折や脊椎圧迫骨折を劇的に予防します。',
    molecularMechanism: '生体内の生理的阻害因子オステオプロテゲリン（OPG）を模倣し、RANKLに高親和性で結合。破骨細胞前駆細胞表面のRANK受容体との相互作用を遮断して破骨細胞の成熟を完全に停止させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999419G1'
  },
  {
    id: 'evenity',
    brandNameJa: 'イベニティ',
    brandNameEn: 'Evenity',
    genericNameJa: 'ロモソズマブ（遺伝子組換え）',
    genericNameEn: 'Romosozumab',
    category: 'ophthalmology_metabolism_blood',
    target: 'スクレロスチン (Sclerostin)',
    modality: 'ヒト化モノクローナル抗体 (IgG2κ)',
    indications: [
      '骨折の危険性の高い骨粗鬆症 (投与期間は原則12ヶ月間限定)'
    ],
    administration: '皮下注射（1ヶ月に1回210mgをシリンジ2本で皮下注。通算12ヶ月で終了）',
    company: 'アムジェン / UCB / アステラス (Amgen / UCB / Astellas)',
    approvalStatus: '日本・米国・欧州承認（「骨形成促進」と「骨吸収抑制」を併せ持つデュアル作用）',
    description: '骨細胞から分泌され、骨が作られるのを邪魔するブレーキ役タンパク質「スクレロスチン」を阻害する抗体です。骨を作る細胞（骨芽細胞）を猛烈に活性化させながら、同時に骨を壊す破骨細胞の働きも抑える「二重作用」で、わずか1年間で骨密度を一気に激増させます。',
    molecularMechanism: 'スクレロスチンに結合してLRP5/6受容体との結合を解除。Wnt/β-カテニンシグナル伝達を再活性化して強烈な骨形成（Bone Formation）をドライブし、破骨細胞誘導も低下させます。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3999443G1'
  },
  {
    id: 'repatha',
    brandNameJa: 'レパーサ',
    brandNameEn: 'Repatha',
    genericNameJa: 'エボロクマブ（遺伝子組換え）',
    genericNameEn: 'Evolocumab',
    category: 'ophthalmology_metabolism_blood',
    target: 'PCSK9 (前駆タンパク質転換酵素サブチリシン/ケキシン9型)',
    modality: '完全ヒト型モノクローナル抗体 (IgG2λ)',
    indications: [
      '家族性高コレステロール血症',
      '高コレステロール血症 (心血管イベントリスクが高くスタチン抵抗性)'
    ],
    administration: '皮下注射（140mgを2週に1回、または420mgを4週に1回。オートインジェクター自己注射可能）',
    company: 'アムジェン (Amgen)',
    approvalStatus: '日米欧で承認（スタチン最大耐用量でも下がらない超高悪玉コレステロールを半減）',
    description: '肝細胞表面で悪玉（LDL）コレステロールを回収する受容体を破壊してしまうタンパク質「PCSK9」を中和する完全ヒト抗体です。スタチンを限界まで飲んでも下がらない遺伝性の重症高コレステロール血症患者のLDL-Cを60%以上追加低下させ、心筋梗塞を強力に予防します。',
    molecularMechanism: '遊離PCSK9に結合し、LDL受容体との相互作用を阻止。受容体がリソソームで分解されるのを防ぎ、細胞膜表面へリサイクルされる受容体数を劇的に増やして血中LDLを強力にクリアランスします。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2189402G1'
  },
  {
    id: 'hemlibra',
    brandNameJa: 'ヘムライブラ',
    brandNameEn: 'Hemlibra',
    genericNameJa: 'エミシズマブ（遺伝子組換え）',
    genericNameEn: 'Emicizumab',
    category: 'ophthalmology_metabolism_blood',
    target: '活性型血液凝固第IX因子 (FIXa) および 第X因子 (FX) の架橋',
    modality: '非対称ヒト化二重特異性モノクローナル抗体 (Bispecific IgG4)',
    indications: [
      '先天性血液凝固第VIII因子欠乏症（血友病A）における出血傾向の抑制 (インヒビター保有・非保有問わず)'
    ],
    administration: '皮下注射（1週、2週、または4週に1回自己注射）',
    company: '中外製薬 / ロシュ (Chugai / Roche)',
    approvalStatus: '世界中で血友病A治療の概念を一新した日本発の至宝的二重特異性抗体',
    description: '先天的に「第VIII因子」が欠損している血友病A患者のために、抗体の左右2つの腕でそれぞれ「活性化第IX因子」と「第X因子」を同時に掴んで近づけることで、欠損した第VIII因子の補酵素機能を完全に代替する天才的な二重特異性抗体です。静脈注射ではなく月1回の皮下注を可能にしました。',
    molecularMechanism: 'Bispecific技術により、片方のアームがFIXaに、もう片方のアームがFXに同時に結合。立体構造上で両分子を最適な空間配置へと誘導し、FIXaによるFXの活性化反応を促進してトロンビン生成と止血を達成します。',
    pmdaUrl: 'https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6343450G1'
  }
];
