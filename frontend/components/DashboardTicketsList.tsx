'use client';

import { useState } from 'react';
import Link from 'next/link';
import { THEME } from '@/lib/theme';
import { Ticket, TicketStatus } from '@/lib/types';
import { TicketFilters, TicketSort, bulkUpdateTickets, bulkDeleteTickets } from '@/lib/api/tickets';
import { format } from 'date-fns';
import {
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  RefreshCw,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardTicketsListProps {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  filters: TicketFilters;
  sort: TicketSort;
  onFiltersChange: (filters: TicketFilters) => void;
  onSortChange: (sort: TicketSort) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  defaultFilters?: TicketFilters;
}

export function DashboardTicketsList({
  tickets,
  total,
  page,
  pageSize,
  loading,
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onPageChange,
  onRefresh,
  defaultFilters = {},
}: DashboardTicketsListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const totalPages = Math.ceil(total / pageSize);
  const allSelected = tickets.length > 0 && selectedIds.size === tickets.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tickets.map((t) => t.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput || undefined });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFiltersChange(defaultFilters);
  };

  const handleBulkStatusChange = async (status: TicketStatus) => {
    if (selectedIds.size === 0) return;
    try {
      setBulkActionLoading(true);
      await bulkUpdateTickets(Array.from(selectedIds), { status });
      setSelectedIds(new Set());
      onRefresh();
    } catch (error) {
      console.error('Error updating tickets:', error);
      alert('Failed to update tickets');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} ticket(s)? This cannot be undone.`)) return;

    try {
      setBulkActionLoading(true);
      await bulkDeleteTickets(Array.from(selectedIds));
      setSelectedIds(new Set());
      onRefresh();
    } catch (error) {
      console.error('Error deleting tickets:', error);
      alert('Failed to delete tickets');
    } finally {
      setBulkActionLoading(false);
    }
  };


  const handleSortChange = (field: TicketSort['field']) => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({ field, direction: 'desc' });
    }
  };

  return (
    <div className="mb-12">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h3
            className="text-xs font-mono uppercase tracking-wider"
            style={{ color: THEME.colors.text.secondary }}
          >
            All tickets ({total})
          </h3>

          <div className="flex gap-2 items-center">
            <div className="w-64">
              <Input
                placeholder="Search tickets..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!e.target.value) {
                    onFiltersChange({ ...filters, search: undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="placeholder:text-[#737373] h-9"
                style={{
                  backgroundColor: THEME.colors.surface.elevated,
                  borderColor: THEME.colors.border.subtle,
                  color: THEME.colors.text.primary,
                }}
              />
            </div>
            {(filters.search ||
              filters.status ||
              filters.isPublic !== undefined ||
              JSON.stringify(filters) !== JSON.stringify(defaultFilters)) && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFilters}
                style={{
                  borderColor: THEME.colors.border.subtle,
                  color: THEME.colors.text.secondary,
                }}
              >
                <X size={14} className="mr-2" />
                Clear
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                borderColor: THEME.colors.border.subtle,
                color: THEME.colors.text.secondary,
              }}
            >
              <Filter size={14} className="mr-2" />
              {showFilters ? 'Hide' : 'Filters'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              style={{
                borderColor: THEME.colors.border.subtle,
                color: THEME.colors.text.secondary,
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div
            className="p-4 rounded space-y-3"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              border: `1px solid ${THEME.colors.border.subtle}`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="text-xs font-mono mb-2 block"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Status
                </label>
                <Select
                  value={filters.status || (filters.statusNot ? 'not-active' : 'all')}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      const newFilters = { ...filters };
                      delete newFilters.status;
                      delete newFilters.statusNot;
                      onFiltersChange(newFilters);
                    } else if (value === 'not-active') {
                      const newFilters = { ...filters };
                      delete newFilters.status;
                      newFilters.statusNot = 'ACTIVE';
                      onFiltersChange(newFilters);
                    } else {
                      const newFilters = { ...filters };
                      delete newFilters.statusNot;
                      newFilters.status = value as TicketStatus;
                      onFiltersChange(newFilters);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="not-active">Non-Active</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className="text-xs font-mono mb-2 block"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Visibility
                </label>
                <Select
                  value={
                    filters.isPublic === undefined
                      ? 'all'
                      : filters.isPublic
                      ? 'public'
                      : 'private'
                  }
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      isPublic:
                        value === 'all' ? undefined : value === 'public',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className="text-xs font-mono mb-2 block"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Sort by
                </label>
                <Select
                  value={`${sort.field}-${sort.direction}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split('-') as [
                      TicketSort['field'],
                      'asc' | 'desc'
                    ];
                    onSortChange({ field, direction });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start_date-desc">Newest First</SelectItem>
                    <SelectItem value="start_date-asc">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title A-Z</SelectItem>
                    <SelectItem value="title-desc">Title Z-A</SelectItem>
                    <SelectItem value="status-asc">Status A-Z</SelectItem>
                    <SelectItem value="status-desc">Status Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {selectedIds.size > 0 && (
          <div
            className="p-4 rounded flex items-center justify-between"
            style={{
              backgroundColor: THEME.colors.surface.elevated,
              border: `1px solid ${THEME.colors.border.subtle}`,
            }}
          >
            <span
              className="text-sm font-mono"
              style={{ color: THEME.colors.text.primary }}
            >
              {selectedIds.size} ticket(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleBulkStatusChange('ACTIVE')}
                disabled={bulkActionLoading}
                style={{
                  backgroundColor: THEME.colors.surface.elevated,
                  borderColor: THEME.colors.border.subtle,
                  color: THEME.colors.text.primary,
                }}
              >
                Mark Active
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkStatusChange('COMPLETED')}
                disabled={bulkActionLoading}
                style={{
                  backgroundColor: THEME.colors.surface.elevated,
                  borderColor: THEME.colors.border.subtle,
                  color: THEME.colors.text.primary,
                }}
              >
                Mark Completed
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-0 w-full">
        <div
          className="py-3 grid grid-cols-[auto_1fr_140px_140px_140px] gap-6 items-center"
          style={{
            borderTop: `1px solid ${THEME.colors.border.hairline}`,
            borderBottom: `1px solid ${THEME.colors.border.hairline}`,
          }}
        >
          <div className="flex items-center justify-center pl-4">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all"
            />
          </div>
          <div>
            <button
              onClick={() => handleSortChange('title')}
              className="text-xs font-mono uppercase tracking-wider flex items-center gap-1 hover:opacity-70 p-0 m-0 border-0 bg-transparent"
              style={{ color: THEME.colors.text.secondary }}
            >
              Title
              <ArrowUpDown size={12} />
            </button>
          </div>
          <div>
            <button
              onClick={() => handleSortChange('status')}
              className="text-xs font-mono uppercase tracking-wider flex items-center gap-1 hover:opacity-70 p-0 m-0 border-0 bg-transparent"
              style={{ color: THEME.colors.text.secondary }}
            >
              Status
              <ArrowUpDown size={12} />
            </button>
          </div>
          <div>
            <button
              onClick={() => handleSortChange('start_date')}
              className="text-xs font-mono uppercase tracking-wider flex items-center gap-1 hover:opacity-70 p-0 m-0 border-0 bg-transparent"
              style={{ color: THEME.colors.text.secondary }}
            >
              Date
              <ArrowUpDown size={12} />
            </button>
          </div>
          <div className="flex justify-end">
            <span
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: THEME.colors.text.secondary }}
            >
              Actions
            </span>
          </div>
        </div>

        {loading ? (
          <div
            className="py-12 text-center text-sm font-mono"
            style={{ color: THEME.colors.text.muted }}
          >
            Loading...
          </div>
        ) : tickets.length === 0 ? (
          <div
            className="py-12 text-center text-sm font-mono"
            style={{ color: THEME.colors.text.muted }}
          >
            No tickets found
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="py-4 grid grid-cols-[auto_1fr_140px_140px_140px] gap-6 items-center hover:bg-opacity-50 transition-colors"
              style={{
                borderBottom: `1px solid ${THEME.colors.border.hairline}`,
                backgroundColor: selectedIds.has(ticket.id)
                  ? THEME.colors.surface.elevated
                  : 'transparent',
              }}
            >
              <div className="flex items-center justify-center pl-4">
                <Checkbox
                  checked={selectedIds.has(ticket.id)}
                  onCheckedChange={() => handleSelectOne(ticket.id)}
                  aria-label={`Select ${ticket.title}`}
                />
              </div>

              <div className="min-w-0">
                <div
                  className="font-mono text-sm mb-1 truncate"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {ticket.title}
                </div>
                <div
                  className="text-xs font-mono truncate"
                  style={{ color: THEME.colors.text.muted }}
                >
                  {ticket.slug}
                </div>
              </div>

              <div>
                <span
                  className="text-xs font-mono"
                  style={{
                    color: THEME.colors.text.secondary,
                  }}
                >
                  {ticket.status}
                </span>
              </div>

              <div>
                <div
                  className="text-xs font-mono"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  {format(new Date(ticket.startDate), 'MMM d, yyyy')}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Link
                  href={`/tickets/${ticket.slug}`}
                  className="text-xs font-mono transition-colors hover:opacity-70"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  view
                </Link>
                <Link
                  href={`/admin/tickets/${ticket.id}`}
                  className="text-xs font-mono transition-colors hover:opacity-70"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  edit
                </Link>
                <Link
                  href={`/admin/tickets/${ticket.id}/entries`}
                  className="text-xs font-mono transition-colors hover:opacity-70"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  entries
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
          <div
              className="mt-6 flex items-center justify-between"
              style={{
                paddingTop: '1rem',
                borderTop: `1px solid ${THEME.colors.border.hairline}`,
              }}
          >
            <div
                className="text-xs font-mono"
                style={{ color: THEME.colors.text.secondary }}
            >
              page={page} tickets={total}
            </div>

            <div className="flex gap-2">
              <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPageChange(Math.max(0, page - 1))}
                  disabled={page <= 0 || loading}
                  style={{
                    borderColor: THEME.colors.border.subtle,
                    color: THEME.colors.text.secondary,
                  }}
              >
                <ChevronLeft size={14} />
              </Button>

              <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page + 1 >= totalPages || loading}
                  style={{
                    borderColor: THEME.colors.border.subtle,
                    color: THEME.colors.text.secondary,
                  }}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
      )}
    </div>
  );
}
