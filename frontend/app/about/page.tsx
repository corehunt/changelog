import {PageHeader} from '@/components/PageHeader';
import {THEME} from '@/lib/theme';
import {SocialIcons} from '@/components/SocialIcons';

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <PageHeader
                title="About"
                subtitle="How I work and why this log exists"
            />

            {/* About Me */}
            <section className="mt-10 mb-12 border-t border-white/5 pt-8">
                <h2
                    className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
                    style={{color: THEME.colors.text.muted}}
                >
                    About Me
                </h2>
                <h3
                    className="text-lg md:text-xl font-mono font-semibold mb-2"
                    style={{color: THEME.colors.text.primary}}
                >
                    Corey Roach
                </h3>
                <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{color: THEME.colors.text.secondary}}
                >
                    I&#39;m a software engineer focused on backend systems, data modeling,
                    and building reliable, scalable services. I enjoy simplifying complex workflows,
                    improving performance, and designing systems I can reason about over time.
                </p>
                <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{color: THEME.colors.text.secondary}}
                >
                    I care about understanding why things work and why they sometimes don&#39;t.
                    I&#39;m most engaged when working through ambiguity, testing assumptions, and leaving
                    codebases in a better state than when I found them.
                </p>
            </section>

            {/* Purpose */}
            <section className="py-8 border-t border-white/5">
                <h2
                    className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
                    style={{color: THEME.colors.text.muted}}
                >
                    Purpose
                </h2>
                <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{color: THEME.colors.text.secondary}}
                >
                    This is a public log of the work I do in real time that captures what I build, the
                    decisions I make, and the impact those decisions have. It keeps me accountable
                    and creates a clear record of outcomes and reasoning.
                </p>
                <p className="text-base md:text-lg leading-relaxed mb-6"
                   style={{color: THEME.colors.text.secondary}}
                >
                    It also provides context for how I approach problems and evaluate tradeoffs
                    by making that process visible.
                </p>
            </section>

            {/* How It Works */}
            <section className="py-8 border-t border-white/5">
                <h2
                    className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
                    style={{color: THEME.colors.text.muted}}
                >
                    How It Works
                </h2>
                <div className="space-y-5">
                    <div>
                        <h3
                            className="text-base md:text-lg font-mono font-semibold mb-1"
                            style={{color: THEME.colors.text.primary}}
                        >
                            Tickets
                        </h3>
                        <p
                            className="text-base md:text-lg leading-relaxed mb-6"
                            style={{color: THEME.colors.text.secondary}}
                        >
                            Each ticket represents a project, feature, investigation, or
                            performance improvement. It captures the context, goals,
                            technologies, status, and outcome.
                        </p>
                    </div>

                    <div>
                        <h3
                            className="text-base md:text-lg font-mono font-semibold mb-1"
                            style={{color: THEME.colors.text.primary}}
                        >
                            Entries
                        </h3>
                        <p
                            className="text-base md:text-lg leading-relaxed mb-6"
                            style={{color: THEME.colors.text.secondary}}
                        >
                            Entries are the day-to-day logs: design decisions, thought processes,
                            obstacles, and breakthroughs. They form a chronological,
                            honest view of how solutions come together.
                        </p>
                    </div>

                    <div>
                        <h3
                            className="text-base md:text-lg font-mono font-semibold mb-1"
                            style={{color: THEME.colors.text.primary}}
                        >
                            Postmortems
                        </h3>
                        <p
                            className="text-base md:text-lg leading-relaxed mb-6"
                            style={{color: THEME.colors.text.secondary}}
                        >
                            When work is completed, I consolidate what was learned, what
                            worked, what didn&#39;t, and what measurable impact the change
                            created.
                        </p>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-8 border-t border-white/5 pb-12 md:pb-16">
                <h2
                    className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
                    style={{color: THEME.colors.text.muted}}
                >
                    Philosophy
                </h2>
                <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{color: THEME.colors.text.secondary}}
                >
                    I value being deliberate. To me, that means understanding systems well
                    enough to explain the decisions behind them, the tradeoffs that were made,
                    and the consequences that followed, not just that something was released.
                </p>
                <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{color: THEME.colors.text.secondary}}
                >
                    This log is how I hold myself to that standard. Writing the work down
                    forces clarity in my reasoning, exposes weak assumptions,
                    and creates a record I can revisit as the systems, or my thinking, evolve over time.
                </p>
            </section>

            <section className="py-8 border-t border-white/5 pb-12 md:pb-16">
                <h2
                    className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
                    style={{color: THEME.colors.text.muted}}
                >
                    Connect
                </h2>
                <SocialIcons/>
            </section>
        </div>
    );
}
