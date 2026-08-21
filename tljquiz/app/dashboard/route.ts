import decisionLog from "@/data/decision-log.json";
import intelLog from "@/data/intel-log.json";
import { scenarios } from "@/data/scenarios";
import { CATEGORY_LABEL, LEARNING_ROADMAP } from "@/lib/types";

export const dynamic = "force-dynamic";

interface DecisionEntry {
  date: string;
  scenarioTitle: string;
  choiceText: string;
  grade: "good" | "ok" | "risky";
  feedback: string;
}

interface IntelEntry {
  date: string;
  time?: string;
  routine: string;
  label: string;
  summary: string;
  sourceUrl?: string;
}

const log = decisionLog as DecisionEntry[];
const intelLogEntries = intelLog as IntelEntry[];

const LAUNCH_DATE = new Date("2026-08-04T00:00:00+09:00");

function daysSinceLaunch(): number {
  const now = new Date();
  const diff = now.getTime() - LAUNCH_DATE.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

const GRADE_LABEL: Record<DecisionEntry["grade"], string> = {
  good: "탁월한 판단",
  ok: "무난한 판단",
  risky: "위험한 판단",
};

function renderDecisionLog(): string {
  if (log.length === 0) {
    return `<p class="pipeline-caption">아직 기록된 의사결정이 없습니다. TLJquiz 매일 트레이닝에서 M이 내린 선택과 피드백이 이곳에 날짜순으로 누적됩니다.</p>`;
  }
  return `<ul class="risk-rules">${log
    .slice()
    .reverse()
    .map(
      (d) => `<li><span class="stripe" style="background:var(${
        d.grade === "good" ? "--good" : d.grade === "ok" ? "--warn" : "--crit"
      })"></span><strong>${d.date} · ${d.scenarioTitle}</strong> — ${GRADE_LABEL[d.grade]}: ${d.choiceText}<br/><span style="color:var(--muted)">${d.feedback}</span></li>`
    )
    .join("")}</ul>`;
}

const REF_LINKS: Record<number, string> = {
  1: "https://www.theguru.co.kr/news/article.html?no=104253",
  2: "https://cbmpress.com/bbs/board.php?bo_table=tnews&wr_id=3506",
  3: "https://www.hankyung.com/economy/article/2021092314251",
  4: "https://namu.wiki/w/%ED%8C%8C%EB%A6%AC%EB%B0%94%EA%B2%8C%EB%9C%A8",
  5: "https://www.hankyung.com/article/202603238928P",
  6: "https://biz.heraldcorp.com/article/10828617",
  7: "https://news.bizwatch.co.kr/article/consumer/2023/10/23/0017",
  9: "https://news.nate.com/view/20241009n18639",
  10: "https://www.spcmagazine.com/spc%EA%B7%B8%EB%A3%B9-%ED%8C%8C%EB%A6%AC%EB%B0%94%EA%B2%8C%EB%9C%A8-%ED%95%B4%EC%99%B8-11%EB%B2%88%EC%A7%B8-%EC%A7%84%EC%B6%9C%EA%B5%AD-%ED%95%84%EB%A6%AC%ED%95%80-1%ED%98%B8/",
};

const CIRCLED = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

function ref(n: number): string {
  const url = REF_LINKS[n];
  if (!url) return `<span class="ref">${CIRCLED[n]}</span>`;
  return `<a class="ref" href="${url}" target="_blank" rel="noopener">${CIRCLED[n]}</a>`;
}

function competitorRow(continent: string, country: string, stores: string, refNum: number): string {
  return `<tr><td class="continent">${continent}</td><td>${country}</td><td>${stores}${ref(refNum)}</td></tr>`;
}

function renderIntelLog(): string {
  if (intelLogEntries.length === 0) {
    return `<p class="pipeline-caption">아직 기록된 인텔 로그가 없습니다. 매일 아침 7시·저녁 9시, 토요일 주간 리포트 루틴이 여기 누적됩니다.</p>`;
  }
  return `<ul class="risk-rules">${intelLogEntries
    .slice()
    .reverse()
    .map((e) => {
      const src = e.sourceUrl
        ? ` <a href="${e.sourceUrl}" target="_blank" rel="noopener" style="font-size:11px;color:var(--muted)">출처</a>`
        : "";
      return `<li><span class="stripe" style="background:var(--accent)"></span><strong>${e.date}${
        e.time ? " " + e.time : ""
      } · ${e.label}</strong> — ${e.summary}${src}</li>`;
    })
    .join("")}</ul>`;
}

function renderLearningRoadmap(): string {
  const completedTitles = new Set(log.map((d) => d.scenarioTitle));
  const completedCount = LEARNING_ROADMAP.filter((category) => {
    const scenario = scenarios.find((s) => s.category === category);
    return scenario && completedTitles.has(scenario.title);
  }).length;

  const items = LEARNING_ROADMAP.map((category, i) => {
    const scenario = scenarios.find((s) => s.category === category);
    const done = scenario ? completedTitles.has(scenario.title) : false;
    const num = i + 1;
    return `<div class="roadmap-step ${done ? "done" : ""}">
      <div class="roadmap-num">${done ? "✓" : num}</div>
      <div class="roadmap-body">
        <div class="roadmap-label">${CATEGORY_LABEL[category]}</div>
        <div class="roadmap-scenario">${scenario ? scenario.title : "시나리오 준비 중"}</div>
      </div>
    </div>`;
  }).join("");

  return `<div class="roadmap-progress">
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(
        (completedCount / LEARNING_ROADMAP.length) * 100
      )}%"></div></div>
      <span class="note">${completedCount} / ${LEARNING_ROADMAP.length}개 영역 완료</span>
    </div>
    <div class="roadmap-grid">${items}</div>`;
}

function marketCard(region: string, country: string, tag: string): string {
  return `<div class="market-card">
      <div class="region">${region}</div>
      <div class="country display">${country}</div>
      <div class="tag">${tag}</div>
    </div>`;
}

function buildHtml(): string {
  const day = daysSinceLaunch();
  const decisionLogHtml = renderDecisionLog();

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>TLJ — 글로벌사업본부 대시보드</title>
<style>
  :root {
    --ink: #201a14;
    --ink-soft: #4a4038;
    --muted: #7c7166;
    --line: #e4dcd0;
    --paper: #f6f2ea;
    --card: #fffdf9;
    --card-raised: #ffffff;
    --accent: #1f5c56;
    --accent-soft: #e4efec;
    --accent-ink: #123330;
    --gold: #a8752a;
    --gold-soft: #f3e6d2;
    --good: #2f8f5b;
    --good-soft: #e3f2e9;
    --warn: #c98a2e;
    --warn-soft: #faf0dd;
    --crit: #c4432d;
    --crit-soft: #fbe9e5;
    --focus: #1f5c56;
    --shadow: 0 1px 2px rgba(32,26,20,0.06), 0 8px 24px -12px rgba(32,26,20,0.18);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --ink: #efe9df; --ink-soft: #cabfaf; --muted: #9c9082; --line: #362f27;
      --paper: #16130f; --card: #1e1a15; --card-raised: #241f19;
      --accent: #5fb3a6; --accent-soft: #1c2f2b; --accent-ink: #cdeee7;
      --gold: #d3a35f; --gold-soft: #2c2419;
      --good: #6bc492; --good-soft: #1b2c22;
      --warn: #e0ac4f; --warn-soft: #2f2716;
      --crit: #e2755f; --crit-soft: #34201c;
      --focus: #7fcabd; --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.5);
    }
  }
  :root[data-theme="dark"] {
    --ink: #efe9df; --ink-soft: #cabfaf; --muted: #9c9082; --line: #362f27;
    --paper: #16130f; --card: #1e1a15; --card-raised: #241f19;
    --accent: #5fb3a6; --accent-soft: #1c2f2b; --accent-ink: #cdeee7;
    --gold: #d3a35f; --gold-soft: #2c2419;
    --good: #6bc492; --good-soft: #1b2c22;
    --warn: #e0ac4f; --warn-soft: #2f2716;
    --crit: #e2755f; --crit-soft: #34201c;
    --focus: #7fcabd; --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.5);
  }
  :root[data-theme="light"] {
    --ink: #201a14; --ink-soft: #4a4038; --muted: #7c7166; --line: #e4dcd0;
    --paper: #f6f2ea; --card: #fffdf9; --card-raised: #ffffff;
    --accent: #1f5c56; --accent-soft: #e4efec; --accent-ink: #123330;
    --gold: #a8752a; --gold-soft: #f3e6d2;
    --good: #2f8f5b; --good-soft: #e3f2e9;
    --warn: #c98a2e; --warn-soft: #faf0dd;
    --crit: #c4432d; --crit-soft: #fbe9e5;
    --focus: #1f5c56; --shadow: 0 1px 2px rgba(32,26,20,0.06), 0 8px 24px -12px rgba(32,26,20,0.18);
  }

  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, Roboto, "Noto Sans KR", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  body { overflow-x: hidden; }

  .display {
    font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Noto Serif KR", Georgia, serif;
  }

  a { color: var(--accent); }
  :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

  .wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 28px 24px 64px;
  }

  .topbar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 28px;
  }
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand-mark {
    width: 44px; height: 44px; border-radius: 10px;
    background: linear-gradient(155deg, var(--accent), var(--accent-ink));
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-family: "Iowan Old Style", Georgia, serif; font-weight: 600; font-size: 17px;
    letter-spacing: -0.02em;
    flex: none;
  }
  .brand h1 {
    margin: 0; font-size: 21px; font-weight: 600;
    letter-spacing: -0.01em;
  }
  .brand .sub {
    margin: 2px 0 0; font-size: 13px; color: var(--muted);
  }
  .topbar-meta {
    text-align: right; font-size: 13px; color: var(--muted);
    display: flex; flex-direction: column; gap: 4px;
  }
  .day-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--gold-soft); color: var(--gold);
    border-radius: 999px; padding: 4px 12px; font-size: 12.5px; font-weight: 600;
    align-self: flex-end;
    letter-spacing: 0.01em;
  }

  .honesty-banner {
    display: flex; gap: 10px; align-items: flex-start;
    background: var(--accent-soft); color: var(--accent-ink);
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    border-radius: 10px; padding: 12px 16px; margin-bottom: 28px;
    font-size: 13.5px; line-height: 1.55;
  }
  .honesty-banner svg { flex: none; margin-top: 2px; }

  .section-head {
    display: flex; align-items: baseline; justify-content: space-between;
    margin: 0 0 14px;
    gap: 12px; flex-wrap: wrap;
  }
  .section-head h2 {
    font-size: 15px; margin: 0; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--ink-soft); font-weight: 700;
  }
  .section-head .note { font-size: 12.5px; color: var(--muted); }

  .kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 32px;
  }
  .kpi-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 18px 18px 16px;
    box-shadow: var(--shadow);
  }
  .kpi-card .label {
    font-size: 12.5px; color: var(--muted); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.04em;
    margin-bottom: 10px;
  }
  .kpi-card .value {
    font-family: "Iowan Old Style", Georgia, serif;
    font-size: 30px; font-weight: 600; letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
    display: flex; align-items: baseline; gap: 6px;
  }
  .kpi-card .value .unit { font-size: 14px; font-weight: 500; color: var(--ink-soft); font-family: inherit; }
  .kpi-card .foot { margin-top: 10px; font-size: 12.5px; color: var(--muted); }
  .bar-track {
    margin-top: 12px; height: 6px; border-radius: 999px; background: var(--line); overflow: hidden;
  }
  .bar-fill { height: 100%; border-radius: 999px; background: var(--accent); }

  .main-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
    margin-bottom: 32px;
    align-items: start;
  }
  .panel {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 20px;
    box-shadow: var(--shadow);
  }

  .pipeline {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }
  .stage {
    border: 1px dashed var(--line);
    border-radius: 10px;
    padding: 12px 10px;
    min-height: 108px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .stage .stage-name {
    font-size: 11.5px; font-weight: 700; color: var(--ink-soft);
    text-transform: uppercase; letter-spacing: 0.03em;
  }
  .stage .stage-count {
    font-family: "Iowan Old Style", Georgia, serif;
    font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums;
    color: var(--muted);
  }
  .stage .stage-status {
    margin-top: auto; font-size: 11px; color: var(--muted);
  }
  .pipeline-caption {
    margin-top: 14px; font-size: 12.5px; color: var(--muted); line-height: 1.6;
  }

  .stack { display: flex; flex-direction: column; gap: 20px; }
  .status-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
  }
  .pill.warn { background: var(--warn-soft); color: var(--warn); }
  .pill.good { background: var(--good-soft); color: var(--good); }
  .pill.crit { background: var(--crit-soft); color: var(--crit); }
  .pill .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  .addendum-flow {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    font-size: 13px; margin: 12px 0 4px;
  }
  .addendum-flow .node {
    background: var(--paper); border: 1px solid var(--line); border-radius: 8px;
    padding: 6px 10px; font-weight: 600;
  }
  .addendum-flow .arrow { color: var(--muted); }
  .panel p.desc { font-size: 13px; color: var(--ink-soft); line-height: 1.6; margin: 10px 0 0; }

  .risk-rules { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .risk-rules li {
    display: flex; gap: 10px; align-items: flex-start;
    font-size: 13px; color: var(--ink-soft); line-height: 1.5;
  }
  .risk-rules .stripe {
    width: 4px; align-self: stretch; border-radius: 3px; background: var(--good); flex: none; margin-top: 2px;
  }

  .market-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .market-card {
    background: var(--card); border: 1px solid var(--line); border-radius: 12px;
    padding: 14px 16px; box-shadow: var(--shadow);
  }
  .market-card .region { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; font-weight: 700; }
  .market-card .country { font-family: "Iowan Old Style", Georgia, serif; font-size: 17px; font-weight: 600; margin: 4px 0 8px; }
  .market-card .tag { font-size: 12px; color: var(--ink-soft); }

  .roadmap-progress { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .roadmap-progress .bar-track { flex: 1; margin-top: 0; }
  .roadmap-progress .note { white-space: nowrap; font-weight: 600; color: var(--ink-soft); }
  .roadmap-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .roadmap-step {
    display: flex; align-items: center; gap: 10px;
    background: var(--paper); border: 1px solid var(--line); border-radius: 10px;
    padding: 10px 12px;
  }
  .roadmap-step.done { background: var(--good-soft); border-color: color-mix(in srgb, var(--good) 40%, var(--line)); }
  .roadmap-num {
    flex: none; width: 26px; height: 26px; border-radius: 50%;
    background: var(--card); border: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--muted);
  }
  .roadmap-step.done .roadmap-num { background: var(--good); border-color: var(--good); color: #fff; }
  .roadmap-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.02em; }
  .roadmap-scenario { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; line-height: 1.4; }

  .backup-links { margin-top: 8px; font-size: 12px; color: var(--muted); }
  .backup-links a { color: var(--muted); text-decoration: underline; }

  .competitor-panel table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .competitor-panel th, .competitor-panel td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--line); }
  .competitor-panel th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--muted); font-weight: 700; }
  .competitor-panel td.continent { color: var(--muted); font-size: 12px; }
  .ref { font-size: 7px; vertical-align: super; color: var(--accent); text-decoration: none; margin-left: 1px; }
  .footnotes { margin-top: 12px; font-size: 7px; line-height: 1.9; color: var(--muted); word-break: break-all; }
  .footnotes a { color: var(--muted); }

  footer {
    margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--line);
    font-size: 12px; color: var(--muted); display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  }

  @media (max-width: 880px) {
    .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .main-grid { grid-template-columns: 1fr; }
    .pipeline { grid-template-columns: repeat(3, 1fr); }
    .market-grid { grid-template-columns: repeat(2, 1fr); }
    .roadmap-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 520px) {
    .kpi-row { grid-template-columns: 1fr; }
    .pipeline { grid-template-columns: repeat(2, 1fr); }
    .market-grid { grid-template-columns: 1fr; }
    .roadmap-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="wrap">

  <div class="topbar">
    <div class="brand">
      <div class="brand-mark">TLJ</div>
      <div>
        <h1 class="display">TLJ 글로벌사업본부 대시보드</h1>
        <p class="sub">M · CJ푸드빌 뚜레쥬르(Tous Les Jours) 글로벌사업본부장</p>
      </div>
    </div>
    <div class="topbar-meta">
      <span class="day-chip">● 취임 D+${day} · 2026.08.04</span>
      <span>매일 아침 첫 화면 · TLJquiz 결정 이력 연동</span>
    </div>
  </div>

  <div class="honesty-banner">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M8 5.2V8.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11" r="0.9" fill="currentColor"/></svg>
    <div>이 대시보드는 사실 기반 원칙을 따릅니다. 아직 실적이 없는 항목은 가짜 수치 대신 <strong>&ldquo;데이터 입력 대기&rdquo;</strong>로 표기합니다. 파이프라인 진행에 따라 각 카드는 실시간으로 채워질 예정입니다.
    </div>
  </div>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="label">2025 글로벌 매출 목표</div>
      <div class="value">2,000<span class="unit">억 원</span></div>
      <div class="bar-track"><div class="bar-fill" style="width: 4%"></div></div>
      <div class="foot">2023년 1,000억 돌파 기준 · 본부장 기여분 트래킹 대기</div>
    </div>
    <div class="kpi-card">
      <div class="label">글로벌 매장 네트워크</div>
      <div class="value">9<span class="unit">개국</span> · 560<span class="unit">개점</span></div>
      <div class="foot">미국 160개점 포함 · 기존 인프라 기준값</div>
    </div>
    <div class="kpi-card">
      <div class="label">우선 미진출 시장</div>
      <div class="value">2<span class="unit">개국 우선</span></div>
      <div class="foot">태국 · 필리핀 (중동 사우디·카타르 후속 검토)</div>
    </div>
    <div class="kpi-card">
      <div class="label">활성 파이프라인 건수</div>
      <div class="value">0<span class="unit">건</span></div>
      <div class="foot">데이터 입력 대기 · 계약 단계 진입 시 자동 반영</div>
    </div>
  </div>

  <div class="main-grid">
    <div class="panel">
      <div class="section-head">
        <h2>MF 파이프라인 트래커</h2>
        <span class="note">계약/JV·MF 협상 단계 기준</span>
      </div>
      <div class="pipeline">
        <div class="stage"><div class="stage-name">리서치</div><div class="stage-count">0</div><div class="stage-status">대기</div></div>
        <div class="stage"><div class="stage-name">접촉</div><div class="stage-count">0</div><div class="stage-status">대기</div></div>
        <div class="stage"><div class="stage-name">협상</div><div class="stage-count">0</div><div class="stage-status">대기</div></div>
        <div class="stage"><div class="stage-name">Key Terms</div><div class="stage-count">0</div><div class="stage-status">대기</div></div>
        <div class="stage"><div class="stage-name">계약 체결</div><div class="stage-count">0</div><div class="stage-status">대기</div></div>
        <div class="stage"><div class="stage-name">오픈</div><div class="stage-count">0</div><div class="stage-status">대기</div></div>
      </div>
      <p class="pipeline-caption">태국 · 필리핀 리서치 착수와 동시에 각 스테이지가 채워집니다. 카드 클릭 시 국가/파트너별 상세로 드릴다운할 수 있도록 다음 버전에서 연결 예정.</p>
    </div>

    <div class="stack">
      <div class="panel">
        <div class="section-head">
          <h2>몽골 → 말련·싱가폴 Addendum</h2>
        </div>
        <div class="status-row">
          <span class="pill warn"><span class="dot"></span>분석 착수 전</span>
        </div>
        <div class="addendum-flow">
          <span class="node">몽골 MF 성공요인 분석</span>
          <span class="arrow">→</span>
          <span class="node">말레이시아 반영</span>
          <span class="arrow">→</span>
          <span class="node">싱가포르 반영</span>
        </div>
        <p class="desc">과거 파트너십에서 구축한 몽골 유통망의 계약 조건·유통 안정화 전략을 분석해, 기존 거점인 말레이시아·싱가포르 계약에 보완 조항(addendum)으로 이식하는 실행 항목.</p>
      </div>

      <div class="panel">
        <div class="section-head">
          <h2>리스크 경고</h2>
        </div>
        <div class="status-row">
          <span class="pill good"><span class="dot"></span>활성 · 감지된 리스크 없음</span>
        </div>
        <ul class="risk-rules">
          <li><span class="stripe" style="background:var(--warn)"></span>조직/경영 변동성 신호 감지 시 경고 (과거 이직 사유 패턴 학습)</li>
          <li><span class="stripe" style="background:var(--crit)"></span>계약 조건이 뚜레쥬르 브랜드 가이드라인과 충돌 시 즉시 플래그</li>
          <li><span class="stripe" style="background:var(--good)"></span>규제 마일스톤(FDD 등) 기한 임박 시 사전 알림</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section-head">
    <h2>우선순위 시장</h2>
    <span class="note">동남아 · 중동 미진출 지역</span>
  </div>
  <div class="market-grid" style="margin-bottom: 32px;">
    ${marketCard("동남아 · 최우선", "태국", "리서치 착수 대기")}
    ${marketCard("동남아 · 최우선", "필리핀", "리서치 착수 대기")}
    ${marketCard("중동 · 후속", "사우디아라비아", "참고 단계")}
    ${marketCard("중동 · 후속", "카타르", "참고 단계")}
  </div>

  <div class="section-head">
    <h2>기존 거점 · 참고 사례</h2>
    <span class="note">이미 운영 중이거나 협상 레퍼런스로 언급된 시장 (가짜 수치 없음 · 참고용)</span>
  </div>
  <div class="market-grid" style="margin-bottom: 32px;">
    ${marketCard("동남아 · 기존 거점", "캄보디아", "최초 해외 JV 설립 사례")}
    ${marketCard("동북아 · 참고 사례", "몽골", "MF 파트너십 addendum 분석 대상")}
    ${marketCard("동남아 · 기존 거점", "말레이시아", "몽골 addendum 반영 대상")}
    ${marketCard("동남아 · 기존 거점", "싱가포르", "EDB 법인세 협상 사례 (17%→10%)")}
    ${marketCard("북미 · 최대 거점", "미국", "160개점 · 현재 성장 엔진")}
    ${marketCard("북미 · 참고 사례", "캐나다", "타 브랜드 북미 진출 전략 벤치마크")}
  </div>

  <div class="panel competitor-panel" style="margin-bottom: 32px;">
    <div class="section-head">
      <h2>경쟁 벤치마크 · 파리바게뜨 해외 진출 현황</h2>
      <span class="note">공개 보도 기준 · 대륙별·국가별</span>
    </div>
    <table>
      <thead><tr><th>대륙</th><th>국가</th><th>매장 현황</th></tr></thead>
      <tbody>
        ${competitorRow("동남아", "캄보디아", "4개 매장 (2021년 HSC그룹 JV 진출)", 5)}
        ${competitorRow("동남아", "말레이시아", "17개 매장 · 할랄 인증 공장 가동", 4)}
        ${competitorRow("동남아", "싱가포르", "11개+ 매장 (2012년 진출)", 3)}
        ${competitorRow("동남아", "태국", "1호점 오픈 단계 (2025 신규 진출)", 9)}
        ${competitorRow("동남아", "필리핀", "해외 11번째 진출국 · 마닐라 1호점+공항점", 10)}
        ${competitorRow("동북아", "몽골", "1개 매장 (자이산스퀘어점, 연내 2개 추가 예정)", 6)}
        ${competitorRow("중동", "사우디아라비아", "JV 계약 단계 (2033년까지 중동·아프리카 12개국 목표)", 7)}
        ${competitorRow("중동", "카타르", "확인 안됨 (중동 JV 목표국 포함, 매장 정보 미확인)", 8)}
        ${competitorRow("북미", "미국", "약 300개 매장 · 2030년까지 1,000개 목표", 1)}
        ${competitorRow("북미", "캐나다", "10개 매장 · 2030년까지 100개 목표", 2)}
      </tbody>
    </table>
    <div class="footnotes">
      ${[1, 2, 3, 4, 5, 6, 7, 9, 10]
        .map((n) => `${CIRCLED[n]} <a href="${REF_LINKS[n]}" target="_blank" rel="noopener">${REF_LINKS[n]}</a>`)
        .join("<br/>")}<br/>⑧ 확인 안됨 — 공개 보도 검색 결과 없음
    </div>
  </div>

  <div class="panel" style="margin-bottom: 32px;">
    <div class="section-head">
      <h2>학습 로드맵</h2>
      <span class="note">글로벌 신사업 핵심 16개 영역 · TLJquiz 시나리오 연계</span>
    </div>
    ${renderLearningRoadmap()}
  </div>

  <div class="panel" style="margin-bottom: 32px;">
    <div class="section-head">
      <h2>의사결정 이력</h2>
      <span class="note">TLJquiz 매일 트레이닝 누적</span>
    </div>
    ${decisionLogHtml}
  </div>

  <div class="panel" style="margin-bottom: 32px;">
    <div class="section-head">
      <h2>글로벌 인텔 로그</h2>
      <span class="note">아침 7시·저녁 9시 일일 + 토요일 주간 리포트 4종 누적</span>
    </div>
    ${renderIntelLog()}
  </div>

  <footer>
    <span>TLJ · tljquiz 저장소 문서 기반 자동 구성
      <span class="backup-links"><br/>백업 참고: <a href="https://cjthebestmax.cloud">cjthebestmax.cloud</a> · <a href="https://20260720-cj-the-best-hfwwzin4m-20262026.vercel.app">이전 프리뷰</a></span>
    </span>
    <span>최종 갱신 ${new Date().toISOString().slice(0, 10)} · 취임 D+${day}</span>
  </footer>

</div>
</body>
</html>
`;
}

export async function GET() {
  return new Response(buildHtml(), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
