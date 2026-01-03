'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { SectionCard } from '@/components/SectionCard';
import { THEME } from '@/lib/theme';
import { ArrowLeft, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Entry } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TechnologySelector } from '@/components/TechnologySelector';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { AUTH_ENABLED } from '@/lib/auth/config';

import { getTicketDetailBySlug } from '@/lib/api/tickets';
import { createEntry, deleteEntry, getEntriesForTicket, updateEntry } from '@/lib/api/entries';

function toLocalDateOnly(dateStr: string): Date {
    // Supports "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss..." by stripping time.
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
}

function compareDateOnlyDesc(a: string, b: string): number {
    // Sort by date-only (no timezone), newest -> oldest
    const [ay, am, ad] = a.split('T')[0].split('-').map(Number);
    const [by, bm, bd] = b.split('T')[0].split('-').map(Number);

    if (ay !== by) return by - ay;
    if (am !== bm) return bm - am;
    return bd - ad;
}

export default function ManageEntriesPage({ params }: { params: { slug: string } }) {
    const [ticket, setTicket] = useState<{
        id: string;
        slug: string;
        title: string;
    } | null>(null);

    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [entryPendingDelete, setEntryPendingDelete] = useState<Entry | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        technologies: [] as string[],
        isPublic: true,
    });

    const [editFormData, setEditFormData] = useState({
        title: '',
        body: '',
        date: '',
        technologies: [] as string[],
        isPublic: true,
    });

    // notices
    const [createdOk, setCreatedOk] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [editSaving, setEditSaving] = useState(false);
    const [editSaved, setEditSaved] = useState(false);
    const [editSaveError, setEditSaveError] = useState<string | null>(null);

    const [deleteInFlightId, setDeleteInFlightId] = useState<string | null>(null);
    const [deletedOk, setDeletedOk] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [createSaving, setCreateSaving] = useState(false);

    useEffect(() => {
        if (!editSaved) return;
        const t = setTimeout(() => setEditSaved(false), 1500);
        return () => clearTimeout(t);
    }, [editSaved]);

    useEffect(() => {
        if (!deletedOk) return;
        const t = setTimeout(() => setDeletedOk(false), 1500);
        return () => clearTimeout(t);
    }, [deletedOk]);

    useEffect(() => {
        if (!createdOk) return;
        const t = setTimeout(() => setCreatedOk(false), 1500);
        return () => clearTimeout(t);
    }, [createdOk]);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);

                const t = await getTicketDetailBySlug(params.slug);
                if (cancelled) return;

                if (!t) {
                    setTicket(null);
                    setEntries([]);
                    return;
                }

                setTicket({ id: t.id, slug: t.slug, title: t.title });

                const e = await getEntriesForTicket(t.id);
                if (cancelled) return;

                const sorted = [...e].sort((a, b) => compareDateOnlyDesc(a.date, b.date));
                setEntries(sorted);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
        return () => {
            cancelled = true;
        };
    }, [params.slug]);

    const ticketIdNumber = useMemo(() => {
        if (!ticket?.id) return null;
        const n = Number(ticket.id);
        return Number.isFinite(n) ? n : null;
    }, [ticket?.id]);

    const subtleDanger = '#ef4444';

    const handleAddEntry = async () => {
        if (!ticketIdNumber) {
            setCreateError('Invalid ticket id');
            return;
        }

        try {
            setCreateSaving(true);
            setCreateError(null);
            setCreatedOk(false);

            const created = await createEntry({
                ticketId: ticketIdNumber,
                title: formData.title,
                body: formData.body,
                date: formData.date,
                technologies: formData.technologies,
                visibility: formData.isPublic ? 'Public' : 'Private',
            });

            setEntries((prev) => {
                const next = [...prev, created];
                next.sort((a, b) => compareDateOnlyDesc(a.date, b.date));
                return next;
            });

            setCreatedOk(true);
            setDialogOpen(false);

            setFormData({
                title: '',
                body: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                technologies: [],
                isPublic: true,
            });
        } catch (err: any) {
            setCreateError(err?.message ?? 'Failed to create entry');
        } finally {
            setCreateSaving(false);
        }
    };

    const handleEditClick = (entry: Entry) => {
        setEditSaveError(null);
        setEditSaved(false);

        setEditingEntry(entry);

        setEditFormData({
            title: entry.title || '',
            body: entry.body || '',
            date: entry.date ? format(toLocalDateOnly(entry.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            technologies: entry.technologies ?? [],
            isPublic: entry.isPublic,
        });

        setEditDialogOpen(true);
    };

    const handleUpdateEntry = async () => {
        if (!editingEntry) return;
        if (!ticketIdNumber) {
            setEditSaveError('Invalid ticket id');
            return;
        }

        try {
            setEditSaving(true);
            setEditSaveError(null);
            setEditSaved(false);

            const updated = await updateEntry(editingEntry.id, {
                ticketId: ticketIdNumber,
                date: editFormData.date,
                title: editFormData.title,
                body: editFormData.body,
                technologies: editFormData.technologies,
                visibility: editFormData.isPublic ? 'Public' : 'Private',
            });

            setEntries((prev) => {
                const next = prev.map((e) =>
                    e.id === editingEntry.id
                        ? {
                            ...e,
                            title: updated.title,
                            body: updated.body,
                            date: updated.date,
                            technologies: updated.technologies,
                            isPublic: updated.isPublic,
                        }
                        : e
                );

                next.sort((a, b) => compareDateOnlyDesc(a.date, b.date));
                return next;
            });

            setEditSaved(true);
            setEditDialogOpen(false);
            setEditingEntry(null);
        } catch (err: any) {
            setEditSaveError(err?.message ?? 'Failed to update entry');
        } finally {
            setEditSaving(false);
        }
    };

    const handleDeleteClick = (entry: Entry) => {
        setDeleteError(null);
        setDeletedOk(false);
        setEntryPendingDelete(entry);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!entryPendingDelete) return;

        try {
            setDeleteInFlightId(entryPendingDelete.id);
            await deleteEntry(entryPendingDelete.id);

            setEntries((prev) => prev.filter((e) => e.id !== entryPendingDelete.id));
            setDeletedOk(true);

            setDeleteDialogOpen(false);
            setEntryPendingDelete(null);
        } catch (err: any) {
            setDeleteError(err?.message ?? 'Failed to delete entry');
        } finally {
            setDeleteInFlightId(null);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute enabled={AUTH_ENABLED}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center" style={{ color: THEME.colors.text.secondary }}>
                        Loading...
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!ticket) {
        return (
            <ProtectedRoute enabled={AUTH_ENABLED}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <PageHeader title="Ticket not found" subtitle="The ticket you're looking for doesn't exist." />
                    <Link
                        href="/admin/tickets"
                        className="inline-flex items-center gap-2 text-sm font-mono transition-colors hover:opacity-70"
                        style={{ color: THEME.colors.text.secondary }}
                    >
                        <ArrowLeft size={14} />
                        Back to manage tickets
                    </Link>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute enabled={AUTH_ENABLED}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="mb-8">
                    <Link
                        href="/admin/tickets"
                        className="inline-flex items-center gap-2 text-sm font-mono mb-6 transition-colors hover:opacity-70"
                        style={{ color: THEME.colors.text.secondary }}
                    >
                        <ArrowLeft size={14} />
                        Back to manage tickets
                    </Link>

                    <PageHeader title="Manage Entries" subtitle={`${ticket.title} • ${entries.length} entries`} />
                </div>

                <div className="mb-8">
                    <button
                        onClick={() => {
                            setCreateError(null);
                            setDialogOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm transition-opacity hover:opacity-70"
                        style={{
                            backgroundColor: THEME.colors.surface.elevated,
                            color: THEME.colors.text.primary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                        }}
                    >
                        <Plus size={14} />
                        Add new entry
                    </button>

                    <span
                        className={`ml-3 text-xs font-mono transition-opacity duration-300 ${createdOk ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            paddingLeft: 10,
                            borderLeft: `2px solid ${THEME.colors.border.subtle}`,
                            color: THEME.colors.text.secondary,
                        }}
                    >
            ✓ created
          </span>

                    <span
                        className={`ml-3 text-xs font-mono transition-opacity duration-300 ${deletedOk ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            paddingLeft: 10,
                            borderLeft: `2px solid ${THEME.colors.border.subtle}`,
                            color: THEME.colors.text.secondary,
                        }}
                    >
            ✓ deleted
          </span>

                    {deleteError && (
                        <span className="ml-3 text-xs font-mono" style={{ color: THEME.colors.text.secondary }}>
              {deleteError}
            </span>
                    )}
                </div>

                {/* DELETE CONFIRM DIALOG */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setEntryPendingDelete(null);
                    }}
                >
                    <DialogContent
                        className="max-w-lg"
                        style={{
                            backgroundColor: THEME.colors.background.secondary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl font-mono font-semibold" style={{ color: THEME.colors.text.primary }}>
                                Delete entry?
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="text-sm" style={{ color: THEME.colors.text.secondary }}>
                                This cannot be undone.
                            </div>

                            {entryPendingDelete?.title && (
                                <div
                                    className="text-xs font-mono"
                                    style={{
                                        color: THEME.colors.text.secondary,
                                        paddingLeft: 10,
                                        borderLeft: `2px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    {entryPendingDelete.title}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={confirmDelete}
                                    disabled={!entryPendingDelete || deleteInFlightId === entryPendingDelete?.id}
                                    className="px-6 py-3 text-sm transition-opacity hover:opacity-70 disabled:opacity-50"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: subtleDanger,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    {deleteInFlightId === entryPendingDelete?.id ? 'Deleting…' : 'Delete'}
                                </button>

                                <button
                                    onClick={() => setDeleteDialogOpen(false)}
                                    className="px-6 py-3 text-sm transition-opacity hover:opacity-70"
                                    style={{
                                        backgroundColor: THEME.colors.background.secondary,
                                        color: THEME.colors.text.secondary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent
                        className="max-w-2xl max-h-[90vh] overflow-y-auto"
                        style={{
                            backgroundColor: THEME.colors.background.secondary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl md:text-2xl font-mono font-semibold" style={{ color: THEME.colors.text.primary }}>
                                Add New Entry
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 pt-4">
                            {createError && (
                                <div className="text-sm" style={{ color: THEME.colors.text.secondary }}>
                                    {createError}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 text-sm"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                    placeholder="Entry title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 text-sm"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Body
                                </label>
                                <textarea
                                    value={formData.body}
                                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-2 text-sm resize-none whitespace-pre-wrap"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                    placeholder="Describe what you worked on, what you learned, challenges faced, etc."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Technologies
                                </label>
                                <TechnologySelector selectedTechnologies={formData.technologies} onChange={(technologies) => setFormData({ ...formData, technologies })} />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="w-4 h-4"
                                    style={{ accentColor: THEME.colors.text.primary }}
                                />
                                <label htmlFor="isPublic" className="text-sm cursor-pointer" style={{ color: THEME.colors.text.secondary }}>
                                    Make this entry public
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleAddEntry}
                                    disabled={createSaving || !formData.title || !formData.body}
                                    className="flex-1 px-6 py-3 text-sm transition-opacity hover:opacity-70 disabled:opacity-50"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    {createSaving ? 'Creating…' : 'Add Entry'}
                                </button>
                                <button
                                    onClick={() => setDialogOpen(false)}
                                    disabled={createSaving}
                                    className="px-6 py-3 text-sm transition-opacity hover:opacity-70 disabled:opacity-50"
                                    style={{
                                        backgroundColor: THEME.colors.background.secondary,
                                        color: THEME.colors.text.secondary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog (PUT wired) */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent
                        className="max-w-2xl max-h-[90vh] overflow-y-auto"
                        style={{
                            backgroundColor: THEME.colors.background.secondary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl md:text-2xl font-mono font-semibold" style={{ color: THEME.colors.text.primary }}>
                                Edit Entry
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full px-4 py-2 text-sm"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                    placeholder="Entry title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={editFormData.date}
                                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                    className="w-full px-4 py-2 text-sm"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Body
                                </label>
                                <textarea
                                    value={editFormData.body}
                                    onChange={(e) => setEditFormData({ ...editFormData, body: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-2 text-sm resize-none"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                    placeholder="Describe what you worked on, what you learned, challenges faced, etc."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-mono" style={{ color: THEME.colors.text.secondary }}>
                                    Technologies
                                </label>
                                <TechnologySelector selectedTechnologies={editFormData.technologies} onChange={(technologies) => setEditFormData({ ...editFormData, technologies })} />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="editIsPublic"
                                    checked={editFormData.isPublic}
                                    onChange={(e) => setEditFormData({ ...editFormData, isPublic: e.target.checked })}
                                    className="w-4 h-4"
                                    style={{ accentColor: THEME.colors.text.primary }}
                                />
                                <label htmlFor="editIsPublic" className="text-sm cursor-pointer" style={{ color: THEME.colors.text.secondary }}>
                                    Make this entry public
                                </label>
                            </div>

                            {editSaveError && (
                                <div className="text-sm" style={{ color: THEME.colors.text.secondary }}>
                                    {editSaveError}
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={handleUpdateEntry}
                                    disabled={editSaving || !editFormData.title || !editFormData.body}
                                    className="flex-1 px-6 py-3 text-sm transition-opacity hover:opacity-70 disabled:opacity-50"
                                    style={{
                                        backgroundColor: THEME.colors.surface.elevated,
                                        color: THEME.colors.text.primary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    {editSaving ? 'Saving…' : 'Update Entry'}
                                </button>

                                <div
                                    className={`text-xs font-mono transition-opacity duration-300 ${editSaved ? 'opacity-100' : 'opacity-0'}`}
                                    style={{
                                        paddingLeft: 10,
                                        borderLeft: `2px solid ${THEME.colors.border.subtle}`,
                                        color: THEME.colors.text.secondary,
                                    }}
                                >
                                    ✓ saved
                                </div>

                                <button
                                    onClick={() => setEditDialogOpen(false)}
                                    className="px-6 py-3 text-sm transition-opacity hover:opacity-70"
                                    style={{
                                        backgroundColor: THEME.colors.background.secondary,
                                        color: THEME.colors.text.secondary,
                                        border: `1px solid ${THEME.colors.border.subtle}`,
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Entries list */}
                <div className="space-y-6">
                    {entries.map((entry, index) => (
                        <SectionCard key={entry.id}>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="text-base md:text-lg font-mono font-semibold mb-1" style={{ color: THEME.colors.text.primary }}>
                                            {entry.title}
                                        </div>
                                        <div className="text-xs font-mono" style={{ color: THEME.colors.text.secondary }}>
                                            {toLocalDateOnly(entry.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}{' '}
                                            • Entry #{entries.length - index}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEditClick(entry)}
                                            className="text-xs font-mono transition-opacity hover:opacity-70"
                                            style={{ color: THEME.colors.text.secondary }}
                                        >
                                            edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(entry)}
                                            disabled={deleteInFlightId === entry.id}
                                            className="text-xs font-mono transition-opacity hover:opacity-70 disabled:opacity-50"
                                            style={{ color: THEME.colors.text.secondary }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.color = subtleDanger;
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.color = THEME.colors.text.secondary;
                                            }}
                                        >
                                            {deleteInFlightId === entry.id ? 'deleting…' : 'delete'}
                                        </button>
                                    </div>
                                </div>

                                <div className="text-sm leading-relaxed" style={{ color: THEME.colors.text.secondary }}>
                                    {entry.body}
                                </div>

                                {entry.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {entry.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 text-xs font-mono"
                                                style={{
                                                    backgroundColor: THEME.colors.surface.elevated,
                                                    color: THEME.colors.text.secondary,
                                                    border: `1px solid ${THEME.colors.border.subtle}`,
                                                }}
                                            >
                        {tech}
                      </span>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-3" style={{ borderTop: `1px solid ${THEME.colors.border.hairline}` }}>
                                    <div className="text-xs font-mono" style={{ color: THEME.colors.text.muted }}>
                                        Visibility: {entry.isPublic ? 'Public' : 'Private'}
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    ))}

                    {entries.length === 0 && (
                        <SectionCard>
                            <div className="py-8 text-center text-sm" style={{ color: THEME.colors.text.muted }}>
                                No entries yet. Create your first entry to start documenting your progress.
                            </div>
                        </SectionCard>
                    )}
                </div>

                <div className="mt-8">
                    <Link
                        href={`/admin/tickets/${ticket.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-mono transition-opacity hover:opacity-70"
                        style={{ color: THEME.colors.text.secondary }}
                    >
                        Back to ticket details
                    </Link>
                </div>
            </div>
        </ProtectedRoute>
    );
}
