'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { THEME } from '@/lib/theme';
import { Ticket } from '@/lib/types';
import { TicketFilters, TicketSort } from '@/lib/api/tickets';
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox'; // V2: bulk select + actions
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

function toLocalDateOnly(dateStr: string): Date {
    const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatTicketStartDate(dateStr: string): string {
    return toLocalDateOnly(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function hasAnyFilters(filters: TicketFilters, defaultFilters: TicketFilters) {
    return (
        !!filters.search ||
        !!filters.status ||
        !!filters.statusNot ||
        filters.isPublic !== undefined ||
        !!filters.visibility ||
        JSON.stringify(filters) !== JSON.stringify(defaultFilters)
    );
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
    // V2: selection + bulk actions
    // const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    // const [bulkActionLoading, setBulkActionLoading] = useState(false);

    useEffect(() => {
        setSearchInput(filters.search || '');
    }, [filters.search]);

    const totalPages = Math.ceil(total / pageSize);

    const handleSearch = () => {
        onFiltersChange({ ...filters, search: searchInput || undefined });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        onFiltersChange(defaultFilters);
    };

    const handleResetView = () => {
        setShowFilters(false);
        setSearchInput('');
        onRefresh();
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

    const filtersActive = hasAnyFilters(filters, defaultFilters);

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

                        {filtersActive && (
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
                            onClick={handleResetView}
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
                                    value={filters.status ?? (filters.statusNot ? 'not-active' : 'all')}
                                    onValueChange={(value) => {
                                        const newFilters: TicketFilters = { ...filters };

                                        if (value === 'all') {
                                            delete newFilters.status;
                                            delete newFilters.statusNot;
                                            onFiltersChange(newFilters);
                                            return;
                                        }

                                        if (value === 'not-active') {
                                            delete newFilters.status;
                                            newFilters.statusNot = 'ACTIVE';
                                            onFiltersChange(newFilters);
                                            return;
                                        }

                                        if (value === 'ACTIVE' || value === 'COMPLETED' || value === 'ARCHIVED') {
                                            delete newFilters.statusNot;
                                            newFilters.status = value;
                                            onFiltersChange(newFilters);
                                            return;
                                        }

                                        delete newFilters.status;
                                        delete newFilters.statusNot;
                                        onFiltersChange(newFilters);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                        {/* Optional if you want the mode back later:
                        <SelectItem value="not-active">Not Active</SelectItem>
                    */}
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
                                            visibility:
                                                value === 'all'
                                                    ? undefined
                                                    : value === 'public'
                                                        ? 'Public'
                                                        : 'Private',
                                            isPublic: undefined,
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

                {/* V2: bulk actions bar */}
                {/* {selectedIds.size > 0 && (...)} */}
            </div>

            <div className="space-y-0 w-full">
                {/* Header */}
                <div
                    className="py-3 grid grid-cols-[1fr_140px_140px_140px] gap-6 items-center"
                    style={{
                        borderTop: `1px solid ${THEME.colors.border.hairline}`,
                        borderBottom: `1px solid ${THEME.colors.border.hairline}`,
                    }}
                >
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
                            Start Date
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

                {/* Body (relative so overlay doesn't cover header) */}
                <div className="relative">
                    {tickets.length === 0 && !loading ? (
                        <div
                            className="py-12 text-center text-sm font-mono"
                            style={{ color: THEME.colors.text.muted }}
                        >
                            No tickets found
                        </div>
                    ) : (
                        <>
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="py-4 grid grid-cols-[1fr_140px_140px_140px] gap-6 items-center hover:bg-opacity-50 transition-colors"
                                    style={{
                                        borderBottom: `1px solid ${THEME.colors.border.hairline}`,
                                        backgroundColor: 'transparent',
                                    }}
                                >
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
                  style={{ color: THEME.colors.text.secondary }}
              >
                {ticket.status}
              </span>
                                    </div>

                                    <div>
                                        <div
                                            className="text-xs font-mono"
                                            style={{ color: THEME.colors.text.secondary }}
                                        >
                                            {formatTicketStartDate(ticket.startDate)}
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
                                            href={`/admin/tickets/${ticket.slug}`}
                                            className="text-xs font-mono transition-colors hover:opacity-70"
                                            style={{ color: THEME.colors.text.secondary }}
                                        >
                                            edit
                                        </Link>
                                        <Link
                                            href={`/admin/tickets/${ticket.slug}/entries`}
                                            className="text-xs font-mono transition-colors hover:opacity-70"
                                            style={{ color: THEME.colors.text.secondary }}
                                        >
                                            entries
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Initial load (no rows yet) */}
                    {tickets.length === 0 && loading && (
                        <div
                            className="py-12 text-center text-sm font-mono"
                            style={{ color: THEME.colors.text.muted }}
                        >
                            Loading…
                        </div>
                    )}

                    {/* Overlay ONLY over body */}
                    {tickets.length > 0 && loading && (
                        <div
                            className="absolute inset-0 z-10 pointer-events-none"
                            style={{
                                backgroundColor: `${THEME.colors.surface.primary}66`,
                            }}
                        />
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div
                    className="mt-6 flex items-center justify-between"
                    style={{
                        paddingTop: '1rem',
                        borderTop: `1px solid ${THEME.colors.border.hairline}`,
                    }}
                >
                    <div className="text-xs font-mono" style={{ color: THEME.colors.text.secondary }}>
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
