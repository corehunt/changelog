'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TechnologySelector } from '@/components/TechnologySelector';
import { THEME } from '@/lib/theme';
import { Ticket, TicketStatus } from '@/lib/types';
import { updateTicket, createTicket } from '@/lib/api/tickets';

interface TicketFormProps {
    ticket?: Ticket;
}

function toDateInputValue(value?: string | null): string {
    if (!value) return '';
    return value.length >= 10 ? value.slice(0, 10) : value;
}

function slugify(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function TicketForm({ ticket }: TicketFormProps) {
    const router = useRouter();
    const isEditMode = !!ticket?.id;

    const [title, setTitle] = useState(ticket?.title ?? '');
    const [slug, setSlug] = useState(ticket?.slug ?? '');
    const [status, setStatus] = useState<TicketStatus>(ticket?.status ?? 'ACTIVE');

    const initialVisibilityUi = ticket?.isPublic === false ? 'private' : 'public';
    const [visibilityUi, setVisibilityUi] = useState<'public' | 'private'>(initialVisibilityUi);

    const [startDate, setStartDate] = useState<string>(toDateInputValue(ticket?.startDate ?? ''));
    const [endDate, setEndDate] = useState<string>(toDateInputValue(ticket?.endDate ?? ''));

    const [background, setBackground] = useState(ticket?.background ?? '');
    const [learned, setLearned] = useState(ticket?.learned ?? '');
    const [roadblocksSummary, setRoadblocksSummary] = useState(ticket?.roadblocksSummary ?? '');
    const [metricsSummary, setMetricsSummary] = useState(ticket?.metricsSummary ?? '');

    const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(ticket?.technologies ?? []);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveOk, setSaveOk] = useState(false);
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        if (isEditMode) return;
        if (slug.trim()) return;
        const next = slugify(title);
        if (next) setSlug(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, isEditMode]);

    useEffect(() => {
        if (!saveOk) return;

        setShowNotice(true);

        const hide = setTimeout(() => setShowNotice(false), 2200);
        const clear = setTimeout(() => setSaveOk(false), 2450);

        return () => {
            clearTimeout(hide);
            clearTimeout(clear);
        };
    }, [saveOk]);

    useEffect(() => {
        if (!saveOk && !showNotice) return;
        setShowNotice(false);
        setSaveOk(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        title,
        slug,
        status,
        visibilityUi,
        startDate,
        endDate,
        background,
        learned,
        roadblocksSummary,
        metricsSummary,
        selectedTechnologies,
    ]);

    const canSave = useMemo(() => {
        if (!title.trim()) return false;
        if (!startDate) return false;
        return true;
    }, [title, startDate]);

    const handleSubmit = async () => {
        setSaving(true);
        setSaveError(null);
        setSaveOk(false);
        setShowNotice(false);

        try {
            const finalSlug = (slug || slugify(title)).trim();
            if (!finalSlug) {
                throw new Error('Slug could not be generated. Please enter a slug.');
            }

            type Visibility = "Public" | "Private";

            const visibility: Visibility = visibilityUi === "public" ? "Public" : "Private";

            const requestBase: {
                slug: string;
                title: string;
                status: TicketStatus;
                visibility: Visibility;
                startDate: string;
                endDate: string | null;
                background: string | null;
                technologies: string[];
                learned: string | null;
                roadblocksSummary: string | null;
                metricsSummary: string | null;
            } = {
                slug: finalSlug,
                title: title.trim(),
                status,
                visibility,
                startDate,
                endDate: endDate ? endDate : null,
                background: background || null,
                technologies: selectedTechnologies,
                learned: learned || null,
                roadblocksSummary: roadblocksSummary || null,
                metricsSummary: metricsSummary || null,
            };


            if (isEditMode && ticket?.id) {
                await updateTicket({
                    id: ticket.id,
                    request: requestBase,
                });
                setSaveOk(true);
                return;
            }

            // create mode
            const created = await createTicket({
                title: requestBase.title,
                slug: requestBase.slug,
                status: requestBase.status,
                visibility: requestBase.visibility,
                startDate: requestBase.startDate,
                endDate: requestBase.endDate,
                background: requestBase.background,
                technologies: requestBase.technologies,
            });

            // Redirect to admin detail
            router.push(`/admin/tickets/${encodeURIComponent(created.slug)}`);
            router.refresh();
        } catch (err: any) {
            setSaveError(err?.message ?? 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter ticket title"
                    className="w-full px-4 py-3 text-sm"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                        borderRadius: THEME.borderRadius.input,
                    }}
                />
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Slug
                </label>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="w-full px-4 py-3 text-sm"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                        borderRadius: THEME.borderRadius.input,
                    }}
                />
                {!isEditMode && (
                    <div className="mt-2 text-xs font-mono" style={{ color: THEME.colors.text.muted }}>
                        Leave blank to auto-generate from the title.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TicketStatus)}
                        className="w-full px-4 py-3 text-sm"
                        style={{
                            backgroundColor: THEME.colors.surface.elevated,
                            color: THEME.colors.text.primary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                            borderRadius: THEME.borderRadius.input,
                        }}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                        Visibility
                    </label>
                    <select
                        value={visibilityUi}
                        onChange={(e) => setVisibilityUi(e.target.value as 'public' | 'private')}
                        className="w-full px-4 py-3 text-sm"
                        style={{
                            backgroundColor: THEME.colors.surface.elevated,
                            color: THEME.colors.text.primary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                            borderRadius: THEME.borderRadius.input,
                        }}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 text-sm"
                        style={{
                            backgroundColor: THEME.colors.surface.elevated,
                            color: THEME.colors.text.primary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                            borderRadius: THEME.borderRadius.input,
                        }}
                    />
                </div>

                <div>
                    <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 text-sm"
                        style={{
                            backgroundColor: THEME.colors.surface.elevated,
                            color: THEME.colors.text.primary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                            borderRadius: THEME.borderRadius.input,
                        }}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Background
                </label>
                <textarea
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="Describe the project background and context"
                    rows={4}
                    className="w-full px-4 py-3 text-sm"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                        borderRadius: THEME.borderRadius.input,
                    }}
                />
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Technologies
                </label>
                <TechnologySelector selectedTechnologies={selectedTechnologies} onChange={setSelectedTechnologies} />
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                    What I Learned
                </label>
                <textarea
                    value={learned}
                    onChange={(e) => setLearned(e.target.value)}
                    placeholder="Key learnings and insights from this ticket"
                    rows={3}
                    className="w-full px-4 py-3 text-sm"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                        borderRadius: THEME.borderRadius.input,
                    }}
                />
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Roadblocks Summary
                </label>
                <textarea
                    value={roadblocksSummary}
                    onChange={(e) => setRoadblocksSummary(e.target.value)}
                    placeholder="Challenges and obstacles encountered"
                    rows={3}
                    className="w-full px-4 py-3 text-sm"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                        borderRadius: THEME.borderRadius.input,
                    }}
                />
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Metrics Summary
                </label>
                <textarea
                    value={metricsSummary}
                    onChange={(e) => setMetricsSummary(e.target.value)}
                    placeholder="Performance metrics and measurements"
                    rows={2}
                    className="w-full px-4 py-3 text-sm"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                        borderRadius: THEME.borderRadius.input,
                    }}
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <div
                    className="inline-flex items-center gap-2 px-2 py-1 text-xs font-mono"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        borderLeft: `2px solid ${THEME.colors.border.subtle}`,
                        borderRadius: 6,
                        color: saveError ? THEME.colors.text.primary : THEME.colors.status.active,
                        opacity: showNotice || !!saveError ? 0.95 : 0,
                        transform: showNotice || !!saveError ? 'translateY(0px)' : 'translateY(4px)',
                        transition: 'opacity 180ms ease, transform 180ms ease',
                        pointerEvents: showNotice || !!saveError ? 'auto' : 'none',
                    }}
                >
                    {saveError ? `error` : '✓ saved'}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!canSave || saving}
                    className="px-6 py-3 text-sm transition-opacity hover:opacity-70 disabled:opacity-50"
                    style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                    }}
                >
                    {saving ? (isEditMode ? 'Saving…' : 'Creating…') : isEditMode ? 'Save changes' : 'Create ticket'}
                </button>
            </div>
        </div>
    );
}
