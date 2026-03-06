"use client";

import {motion} from "framer-motion";
import {THEME} from "@/lib/theme";
import {useEffect, useState} from "react";

/* ── Vertical ticker ── */
const TICKER_ITEMS = [
    "batch-pipeline: latency reduced 44%",
    "dedupe-engine: evaluation order optimized",
    "config-system: runtime updates enabled",
    "batch-job: memory pressure eliminated",
    "incident-analysis: root cause isolated",
    "query-layer: concurrency model refactored",
    "data-ingestion: throughput improved",
    "system-debug: race condition resolved",
];

const VerticalTicker = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setOffset((o) => (o + 1) % TICKER_ITEMS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-[200px] overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10"/>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10"/>
            <motion.div
                animate={{y: -offset * 28}}
                transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
            >
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <div
                        key={i}
                        className="h-7 flex items-start font-mono text-[11px] text-muted-foreground/50"
                    >
                          <span
                              className="mr-2 mt-[2px]"
                              style={{color: THEME.colors.status.active}}>
                            →
                          </span>
                        <span>
                        {item}
                      </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

/* ── Glitch decode word ── */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

const GlitchWord = ({word, delay = 0}: { word: string; delay?: number }) => {
    const [display, setDisplay] = useState<string[] | null>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const start = setTimeout(() => {
            setDisplay(
                word.split("").map(
                    () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                )
            );
            setStarted(true);
        }, delay);

        return () => clearTimeout(start);
    }, [delay, word]);

    useEffect(() => {
        if (!started || !display) return;

        let locked = 0;

        const interval = setInterval(() => {
            setDisplay(prev =>
                prev!.map((ch, i) => {
                    if (i < locked) return word[i];
                    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                })
            );

            locked++;
            if (locked > word.length) clearInterval(interval);
        }, 60);

        return () => clearInterval(interval);
    }, [started, word]);

    if (!display) {
        return <span className="opacity-0">{word}</span>;
    }

    return (
        <span>
      {display.map((ch, i) => (
          <span key={i}>{ch}</span>
      ))}
    </span>
    );
};
/* ── Main hero ── */
export const EngineeringHero = () => {

    return (
        <section className="relative min-h-screen bg-background overflow-hidden">
            {/* Extremely faint vertical lines */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 120px)",
                }}
            />

            {/* Layout: full height, three horizontal bands */}
            <div className="relative z-10 min-h-screen flex flex-col">

                {/* Band 2: Main content — the big middle */}
                <div className="flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-16 md:py-0">
                        <div className="grid lg:grid-cols-[minmax(600px,auto)_1px_340px] gap-0 items-start lg:items-center">

                            {/* Left: Title stack */}
                            <div className="pr-0 lg:pr-16 py-8">
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 1, delay: 0.3}}
                                    className="flex items-center gap-2 mb-6"
                                >
                                    <span className="font-mono text-[12px] tracking-[0.4em] uppercase"
                                          style={{color: THEME.colors.status.active}}>
                                        Corey Roach
                                    </span>
                                    <span className="w-6 h-px bg-accent"/>
                                    <span className="font-mono text-[12px] tracking-[0.4em] uppercase"
                                          style={{color: THEME.colors.status.active}}>
                                        Software Engineer
                                    </span>
                                </motion.div>

                                <motion.div
                                    initial={{opacity: 0, y: 30}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1]}}
                                >
                                    <h1 className="font-mono font-bold text-foreground leading-[0.88] tracking-[-0.04em]">
                                        {/*<span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl block"><GlitchWord word="Inside" delay={200}  /></span>*/}
                                        <span
                                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl block mt-1 text-muted-foreground/25"><GlitchWord
                                            word="Engineering" delay={600}/></span>
                                        <span
                                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl block mt-1"><GlitchWord
                                            word="Field Notes" delay={1000}/></span>
                                    </h1>
                                </motion.div>

                                <motion.p
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 1.2, duration: 0.8}}
                                    className="mt-8 font-mono text-xs text-muted-foreground leading-[2] max-w-sm"
                                >
                                    A real-time engineering journal documenting system design, performance optimizations,
                                    incident debugging, and lessons learned over time.


                                </motion.p>

                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 1.4, duration: 0.6}}
                                    className="mt-8 flex items-center gap-6"
                                >
                                    <a
                                        href="/tickets"
                                        className="font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition"
                                    >
                                        Explore →
                                    </a>
                                </motion.div>
                            </div>

                            {/* Divider */}
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 1.8, duration: 0.8}}
                                className="hidden lg:block w-px self-stretch bg-border"
                            />

                            {/* Right: Live ticker */}
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 1.8, duration: 0.8}}
                                className="pl-0 lg:pl-10 py-8"
                            >
                                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                    Featured
                  </span>
                                    <motion.div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{
                                            backgroundColor: THEME.colors.status.active,
                                            boxShadow: `
                                              0 0 4px ${THEME.colors.status.active},
                                              0 0 8px ${THEME.colors.status.active}
                                            `,
                                        }}
                                        animate={{opacity: [0.2, 1, 0.3]}}
                                        transition={{duration: 2, repeat: Infinity}}
                                    />
                                </div>
                                <VerticalTicker/>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};