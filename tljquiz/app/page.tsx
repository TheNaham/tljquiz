import Link from "next/link";
import { getDailyScenario, scenarios } from "@/data/scenarios";
import { CATEGORY_LABEL, LEARNING_ROADMAP } from "@/lib/types";
import ScenarioCard from "@/components/ScenarioCard";

const CATEGORY_ORDER = LEARNING_ROADMAP;

export default function Home() {
  const daily = getDailyScenario();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header>
        <span className="text-[11px] uppercase tracking-widest text-se-gold">
          Private · Not for distribution · M
        </span>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-se-ink">
          TLJquiz
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-se-muted">
          글로벌 사업본부장급 의사결정 트레이닝. 실무 검토 이력을 기반으로 한
          시나리오를 매일 하나씩 풀며 전략가·기술가·경제가의 감각을
          단련합니다.
        </p>
      </header>

      <section className="mt-10 rounded border border-se-gold/40 bg-se-panel p-6">
        <span className="text-[11px] uppercase tracking-widest text-se-gold">
          오늘의 챌린지
        </span>
        <h2 className="mt-2 font-serif text-xl font-semibold text-se-ink">
          {daily.title}
        </h2>
        <p className="mt-2 text-sm text-se-muted">{daily.intro}</p>
        <Link
          href={`/scenario/${daily.id}`}
          className="mt-4 inline-block rounded bg-se-gold px-5 py-2.5 text-sm font-medium tracking-wide text-se-charcoal transition hover:brightness-110"
        >
          시작하기
        </Link>
      </section>

      {CATEGORY_ORDER.map((category) => {
        const items = scenarios.filter((s) => s.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-se-muted">
              {CATEGORY_LABEL[category]}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {items.map((s) => (
                <ScenarioCard key={s.id} scenario={s} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
