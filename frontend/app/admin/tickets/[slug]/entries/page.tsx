// frontend/app/admin/tickets/[slug]/entries/page.tsx
"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SectionCard } from "@/components/SectionCard";
import { THEME } from "@/lib/theme";
import { ArrowLeft, Plus } from "lucide-react";
import { format } from "date-fns";
import type { Entry } from "@/lib/types";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TechnologySelector } from "@/components/TechnologySelector";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { AUTH_ENABLED } from "@/lib/auth/config";

import { getTicketDetailBySlug } from "@/lib/api/tickets";
import { getEntriesForTicket } from "@/lib/api/entries";

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

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    date: format(new Date(), "yyyy-MM-dd"),
    technologies: [] as string[],
    isPublic: true,
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    body: "",
    date: "",
    technologies: [] as string[],
    isPublic: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);

        // 1) load ticket by slug
        const ticketDetail = await getTicketDetailBySlug(params.slug);

        if (cancelled) return;

        if (!ticketDetail) {
          setTicket(null);
          setEntries([]);
          return;
        }

        const t = {
          id: ticketDetail.id,
          slug: ticketDetail.slug,
          title: ticketDetail.title,
        };
        setTicket(t);

        // 2) load entries by ticket id
        const entriesForTicket = await getEntriesForTicket(t.id);

        if (cancelled) return;

        setEntries(entriesForTicket);
      } catch (e) {
        console.error("Error loading entries page:", e);
        if (!cancelled) {
          setTicket(null);
          setEntries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  const handleAddEntry = () => {
    if (!ticket) return;

    const newEntry: Entry = {
      id: `mock-${Date.now()}`,
      ticketName: ticket.title,
      ticketSlug: ticket.slug,
      date: formData.date,
      title: formData.title,
      body: formData.body,
      technologies: formData.technologies,
      isPublic: formData.isPublic,
    };

    setEntries((prev) => [...prev, newEntry]);
    setDialogOpen(false);
    setFormData({
      title: "",
      body: "",
      date: format(new Date(), "yyyy-MM-dd"),
      technologies: [],
      isPublic: true,
    });
  };

  const handleEditClick = (entry: Entry) => {
    setEditingEntry(entry);
    setEditFormData({
      title: entry.title || "",
      body: entry.body || "",
      date: entry.date ? String(entry.date).slice(0, 10) : "",
      technologies: entry.technologies ?? [],
      isPublic: entry.isPublic,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateEntry = () => {
    if (!editingEntry) return;

    setEntries((prev) =>
        prev.map((e) =>
            e.id === editingEntry.id
                ? {
                  ...e,
                  title: editFormData.title,
                  body: editFormData.body,
                  date: editFormData.date,
                  technologies: editFormData.technologies,
                  isPublic: editFormData.isPublic,
                }
                : e
        )
    );

    setEditDialogOpen(false);
    setEditingEntry(null);
    setEditFormData({
      title: "",
      body: "",
      date: "",
      technologies: [],
      isPublic: true,
    });
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
                onClick={() => setDialogOpen(true)}
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
          </div>

          {/* Add dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                style={{
                  backgroundColor: THEME.colors.background.secondary,
                  border: `1px solid ${THEME.colors.border.subtle}`,
                }}
            >
              <DialogHeader>
                <DialogTitle
                    className="text-xl md:text-2xl font-mono font-semibold"
                    style={{ color: THEME.colors.text.primary }}
                >
                  Add New Entry
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
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
                  <TechnologySelector
                      selectedTechnologies={formData.technologies}
                      onChange={(technologies) => setFormData({ ...formData, technologies })}
                  />
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
                      disabled={!formData.title || !formData.body}
                      className="flex-1 px-6 py-3 text-sm transition-opacity hover:opacity-70 disabled:opacity-50"
                      style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                      }}
                  >
                    Add Entry
                  </button>
                  <button
                      onClick={() => setDialogOpen(false)}
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

          {/* Edit dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                style={{
                  backgroundColor: THEME.colors.background.secondary,
                  border: `1px solid ${THEME.colors.border.subtle}`,
                }}
            >
              <DialogHeader>
                <DialogTitle
                    className="text-xl md:text-2xl font-mono font-semibold"
                    style={{ color: THEME.colors.text.primary }}
                >
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
                  <TechnologySelector
                      selectedTechnologies={editFormData.technologies}
                      onChange={(technologies) => setEditFormData({ ...editFormData, technologies })}
                  />
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
                  <label
                      htmlFor="editIsPublic"
                      className="text-sm cursor-pointer"
                      style={{ color: THEME.colors.text.secondary }}
                  >
                    Make this entry public
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                      onClick={handleUpdateEntry}
                      disabled={!editFormData.title || !editFormData.body}
                      className="flex-1 px-6 py-3 text-sm transition-opacity hover:opacity-70 disabled:opacity-50"
                      style={{
                        backgroundColor: THEME.colors.surface.elevated,
                        color: THEME.colors.text.primary,
                        border: `1px solid ${THEME.colors.border.subtle}`,
                      }}
                  >
                    Update Entry
                  </button>
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

          <div className="space-y-6">
            {entries.map((entry, index) => (
                <SectionCard key={entry.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div
                            className="text-base md:text-lg font-mono font-semibold mb-1"
                            style={{ color: THEME.colors.text.primary }}
                        >
                          {entry.title}
                        </div>
                        <div className="text-xs font-mono" style={{ color: THEME.colors.text.secondary }}>
                          {format(new Date(entry.date), "MMMM d, yyyy")} • Entry #{entries.length - index}
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
                            className="text-xs font-mono transition-opacity hover:opacity-70"
                            style={{ color: THEME.colors.text.secondary }}
                            onClick={() => {
                              // We'll wire DELETE next — leaving placeholder so UI doesn’t lie.
                              alert("Delete wiring next (DELETE /api/v1/entries/{id})");
                            }}
                        >
                          delete
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
                        Visibility: {entry.isPublic ? "Public" : "Private"}
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
