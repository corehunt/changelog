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
                    I built this site as a personal record of how I work. Especially how I solve problems,
                    make decisions, and measure the impact of the things I build.
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
                    This log is my public representation of capturing and tracking the work
                    I do in real time. It serves as a way to keep myself accountable to what
                    I&#39;ve completed, reflect on my decisions, and document their impact.
                </p>
                <p className="text-base md:text-lg leading-relaxed mb-6"
                   style={{color: THEME.colors.text.secondary}}
                >
                    It also gives others a way to get to know me better and understand how
                    I take on challenges. This site exists because this is a process I was already
                    completing daily, and I&#39;ve chosen to make it visible.
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

            {/* What This Isn’t */}
            <section className="py-8 border-t border-white/5">
                <h2
                    className="text-sm font-mono tracking-[0.18em] uppercase mb-3"
                    style={{color: THEME.colors.text.muted}}
                >
                    What This Isn’t
                </h2>
                <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{color: THEME.colors.text.secondary}}
                >
                    This isn’t a replacement for Jira, formal documentation, or project
                    management tools. It isn’t a productivity tracker or a polished case
                    study library. It&#39;s a public representation of how I think and accomplish
                    goals in a way provides context but isn&#39;t too revealing.
                </p>
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
                    I value being deliberate. To me means understanding the system well
                    enough to explain the decisions behind it, the tradeoffs that were made,
                    and the consequences that followed and not just that something released.
                </p>
                <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{color: THEME.colors.text.secondary}}
                >
                    This log is how I hold myself to that standard. Writing the work down
                    forces me to be explicit about my reasoning, exposes weak assumptions,
                    and creates a record I can revisit as the system or my thinking evolves over time.
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
