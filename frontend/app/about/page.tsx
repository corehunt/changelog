import { PageHeader } from '@/components/PageHeader';
import { THEME } from '@/lib/theme';
import { SocialIcons } from '@/components/SocialIcons';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <PageHeader
        title="About"
        subtitle="Who I am and what this log is for."
      />

      {/* About Me */}
      <section className="mt-10 mb-12 border-t border-white/5 pt-8">
        <h2
          className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
          style={{ color: THEME.colors.text.muted }}
        >
          About Me
        </h2>
        <h3
          className="text-lg md:text-xl font-mono font-semibold mb-2"
          style={{ color: THEME.colors.text.primary }}
        >
          Corey Roach
        </h3>
        <p
          className="text-base md:text-lg leading-relaxed mb-6"
          style={{ color: THEME.colors.text.secondary }}
        >
          I'm a software engineer focused on backend systems, data modeling, and
          building reliable services that scale. I enjoy simplifying complex workflows, 
          improving performance, and designing systems I can reason about over time. 
        </p>
        <p
          className="text-base md:text-lg leading-relaxed mb-6"
          style={{ color: THEME.colors.text.secondary }}
        >
          I built this site as a personal record of how I work especially how I solve problems, 
          make decisions, and measure the impact of the things I build.
        </p>
      </section>

      {/* Purpose */}
      <section className="py-8 border-t border-white/5">
        <h2
          className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
          style={{ color: THEME.colors.text.muted }}
        >
          Purpose
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed mb-4"
          style={{ color: THEME.colors.text.secondary }}
        >
          This log is my system for capturing the real work behind engineering—
          decisions made, problems solved, and the impact created. Each ticket
          represents a meaningful unit of work. Each entry records the
          reasoning, tradeoffs, and progress along the way.
        </p>
        <p
          className="text-base leading-relaxed"
          style={{ color: THEME.colors.text.secondary }}
        >
          It’s not a portfolio. It’s a record of engineering practice.
        </p>
      </section>

      {/* How It Works */}
      <section className="py-8 border-t border-white/5">
        <h2
          className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
          style={{ color: THEME.colors.text.muted }}
        >
          How It Works
        </h2>
        <div className="space-y-5">
          <div>
            <h3
              className="text-base md:text-lg font-mono font-semibold mb-1"
              style={{ color: THEME.colors.text.primary }}
            >
              Tickets
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: THEME.colors.text.secondary }}
            >
              Each ticket represents a project, feature, investigation, or
              performance improvement. It holds the context, goals,
              technologies, status, and outcome.
            </p>
          </div>

          <div>
            <h3
              className="text-base md:text-lg font-mono font-semibold mb-1"
              style={{ color: THEME.colors.text.primary }}
            >
              Entries
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: THEME.colors.text.secondary }}
            >
              Entries are the day-to-day logs: design decisions, debugging
              sessions, obstacles, and breakthroughs. They form a chronological,
              honest view of how solutions come together.
            </p>
          </div>

          <div>
            <h3
              className="text-base md:text-lg font-mono font-semibold mb-1"
              style={{ color: THEME.colors.text.primary }}
            >
              Postmortems
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: THEME.colors.text.secondary }}
            >
              When work is completed, I consolidate what was learned—what
              worked, what didn't, and what measurable impact the change
              created.
            </p>
          </div>
        </div>
      </section>

      {/* Why I Built This */}
      <section className="py-8 border-t border-white/5">
        <h2
          className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
          style={{ color: THEME.colors.text.muted }}
        >
          Why I Built This
        </h2>
        <p
          className="text-base leading-relaxed mb-4"
          style={{ color: THEME.colors.text.secondary }}
        >
          A lot of the real work in engineering never shows up in a commit log
          or a Jira board—the failed attempts, the reasoning, the tradeoffs
          that led to the final solution. Over time, those details disappear,
          even though they’re usually the most valuable part.
        </p>
        <p
          className="text-base leading-relaxed"
          style={{ color: THEME.colors.text.secondary }}
        >
          This log gives me a structured way to preserve that process. It’s a
          long-term archive I can use when I&apos;m preparing for interviews,
          writing performance reviews, or just trying to understand how my own
          approach has evolved.
        </p>
      </section>

      {/* What This Isn’t */}
      <section className="py-8 border-t border-white/5">
        <h2
          className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
          style={{ color: THEME.colors.text.muted }}
        >
          What This Isn’t
        </h2>
        <p
          className="text-base leading-relaxed mb-4"
          style={{ color: THEME.colors.text.secondary }}
        >
          This isn’t a replacement for Jira, formal documentation, or project
          management tools. It isn’t a productivity tracker or a polished case
          study library.
        </p>
        <p
          className="text-base leading-relaxed"
          style={{ color: THEME.colors.text.secondary }}
        >
          It’s a personal record of how I work—high-fidelity notes on the
          problems I’ve taken on, the decisions I’ve made, and the impact those
          changes created.
        </p>
      </section>

      {/* Philosophy */}
      <section className="py-8 border-t border-white/5 pb-12 md:pb-16">
        <h2
          className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
          style={{ color: THEME.colors.text.muted }}
        >
          Philosophy
        </h2>
        <p
          className="text-base leading-relaxed mb-4"
          style={{ color: THEME.colors.text.secondary }}
        >
          Good engineering is iterative. It&apos;s about understanding systems,
          revisiting assumptions, and improving behavior with intention—not just
          shipping code and moving on.
        </p>
        <p
          className="text-base leading-relaxed"
          style={{ color: THEME.colors.text.secondary }}
        >
          This log is a way to stay accountable to that process. It creates a
          quiet narrative of the decisions I make and the outcomes they lead to,
          over years rather than days.
        </p>
      </section>

      <section className="py-8 border-t border-white/5 pb-12 md:pb-16">
  <h2
    className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
    style={{ color: THEME.colors.text.muted }}
  >
    Connect
  </h2>
  <SocialIcons />
</section>
    </div>
  );
}
