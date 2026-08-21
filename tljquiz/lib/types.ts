export type ChoiceGrade = "good" | "ok" | "risky";

export interface Choice {
  id: string;
  text: string;
  feedback: string;
  grade: ChoiceGrade;
}

export interface Step {
  id: string;
  situation: string;
  choices: Choice[];
}

export type Category =
  | "market-entry"
  | "digital-transformation"
  | "cost-localization"
  | "production-system"
  | "regulatory-tax"
  | "agile-culture"
  | "stakeholder-alignment"
  | "crisis-management"
  | "brand-qa"
  | "partnership"
  | "data-roi"
  | "talent-org"
  | "ma-equity"
  | "brand-marketing"
  | "esg"
  | "succession";

export type Tier = "core" | "executive";

export interface Scenario {
  id: string;
  category: Category;
  tier: Tier;
  title: string;
  intro: string;
  steps: Step[];
  takeaway: string;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  "market-entry": "시장 진출 전략 · Market Entry",
  "digital-transformation": "디지털 전환 · Digital Transformation",
  "cost-localization": "원가 최적화 · Cost & Localization",
  "production-system": "생산 시스템 설계 · Production System",
  "regulatory-tax": "규제·세무 대응 · Regulatory & Tax",
  "agile-culture": "조직문화 · Agile Reporting",
  "stakeholder-alignment": "이해관계자 정렬 · Stakeholder Alignment",
  "crisis-management": "위기 관리 · Crisis Management",
  "brand-qa": "브랜드 표준화 · Brand & QA",
  partnership: "파트너십 협상력 · Partnership Leverage",
  "data-roi": "데이터 기반 검증 · Data & ROI",
  "talent-org": "인재육성 · Talent & Org Design",
  "ma-equity": "M&A·지분구조 · M&A & Equity",
  "brand-marketing": "브랜드 마케팅 · Consumer Insight",
  esg: "ESG·지속가능성 · Sustainability",
  succession: "리더십 계승 · Succession Planning",
};

export const LEARNING_ROADMAP: Category[] = [
  "market-entry",
  "partnership",
  "cost-localization",
  "production-system",
  "brand-qa",
  "digital-transformation",
  "data-roi",
  "brand-marketing",
  "regulatory-tax",
  "esg",
  "crisis-management",
  "stakeholder-alignment",
  "agile-culture",
  "talent-org",
  "ma-equity",
  "succession",
];
