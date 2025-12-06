import { supabase } from '../supabase';
import { Ticket, TicketStatus } from '../types';

export interface TicketFilters {
  status?: TicketStatus;
  statusNot?: TicketStatus;
  technologies?: string[];
  isPublic?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
}

export interface TicketSort {
  field: 'title' | 'start_date' | 'status' | 'created_at';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface TicketsResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getTickets(
  filters?: TicketFilters,
  sort?: TicketSort,
  pagination?: PaginationParams
): Promise<TicketsResponse> {
  let query = supabase.from('tickets').select('*', { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.statusNot) {
    query = query.neq('status', filters.statusNot);
  }

  if (filters?.isPublic !== undefined) {
    query = query.eq('is_public', filters.isPublic);
  }

  if (filters?.technologies && filters.technologies.length > 0) {
    query = query.contains('technologies', filters.technologies);
  }

  if (filters?.startDateFrom) {
    query = query.gte('start_date', filters.startDateFrom);
  }

  if (filters?.startDateTo) {
    query = query.lte('start_date', filters.startDateTo);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,background.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`
    );
  }

  const sortField = sort?.field || 'start_date';
  const sortDirection = sort?.direction || 'desc';
  query = query.order(sortField, { ascending: sortDirection === 'asc' });

  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const tickets: Ticket[] = (data || []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status as TicketStatus,
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    background: row.background || undefined,
    technologies: row.technologies,
    learned: row.learned || undefined,
    roadblocksSummary: row.roadblocks_summary || undefined,
    metricsSummary: row.metrics_summary || undefined,
    isPublic: row.is_public,
  }));

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    tickets,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: data.status as TicketStatus,
    startDate: data.start_date,
    endDate: data.end_date || undefined,
    background: data.background || undefined,
    technologies: data.technologies,
    learned: data.learned || undefined,
    roadblocksSummary: data.roadblocks_summary || undefined,
    metricsSummary: data.metrics_summary || undefined,
    isPublic: data.is_public,
  };
}

export async function getTicketBySlug(slug: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: data.status as TicketStatus,
    startDate: data.start_date,
    endDate: data.end_date || undefined,
    background: data.background || undefined,
    technologies: data.technologies,
    learned: data.learned || undefined,
    roadblocksSummary: data.roadblocks_summary || undefined,
    metricsSummary: data.metrics_summary || undefined,
    isPublic: data.is_public,
  };
}

export async function createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      slug: ticket.slug,
      title: ticket.title,
      status: ticket.status,
      start_date: ticket.startDate,
      end_date: ticket.endDate || null,
      background: ticket.background || null,
      technologies: ticket.technologies,
      learned: ticket.learned || null,
      roadblocks_summary: ticket.roadblocksSummary || null,
      metrics_summary: ticket.metricsSummary || null,
      is_public: ticket.isPublic,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: data.status as TicketStatus,
    startDate: data.start_date,
    endDate: data.end_date || undefined,
    background: data.background || undefined,
    technologies: data.technologies,
    learned: data.learned || undefined,
    roadblocksSummary: data.roadblocks_summary || undefined,
    metricsSummary: data.metrics_summary || undefined,
    isPublic: data.is_public,
  };
}

export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.slug !== undefined) updateData.slug = updates.slug;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate || null;
  if (updates.background !== undefined) updateData.background = updates.background || null;
  if (updates.technologies !== undefined) updateData.technologies = updates.technologies;
  if (updates.learned !== undefined) updateData.learned = updates.learned || null;
  if (updates.roadblocksSummary !== undefined) updateData.roadblocks_summary = updates.roadblocksSummary || null;
  if (updates.metricsSummary !== undefined) updateData.metrics_summary = updates.metricsSummary || null;
  if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

  const { data, error } = await supabase
    .from('tickets')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: data.status as TicketStatus,
    startDate: data.start_date,
    endDate: data.end_date || undefined,
    background: data.background || undefined,
    technologies: data.technologies,
    learned: data.learned || undefined,
    roadblocksSummary: data.roadblocks_summary || undefined,
    metricsSummary: data.metrics_summary || undefined,
    isPublic: data.is_public,
  };
}

export async function deleteTicket(id: string): Promise<void> {
  const { error } = await supabase.from('tickets').delete().eq('id', id);
  if (error) throw error;
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'COMPLETED') {
    updateData.end_date = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('tickets')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: data.status as TicketStatus,
    startDate: data.start_date,
    endDate: data.end_date || undefined,
    background: data.background || undefined,
    technologies: data.technologies,
    learned: data.learned || undefined,
    roadblocksSummary: data.roadblocks_summary || undefined,
    metricsSummary: data.metrics_summary || undefined,
    isPublic: data.is_public,
  };
}

export async function bulkUpdateTickets(ids: string[], updates: Partial<Ticket>): Promise<void> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.status !== undefined) {
    updateData.status = updates.status;
    if (updates.status === 'COMPLETED') {
      updateData.end_date = new Date().toISOString();
    }
  }
  if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

  const { error } = await supabase
    .from('tickets')
    .update(updateData)
    .in('id', ids);

  if (error) throw error;
}

export async function bulkDeleteTickets(ids: string[]): Promise<void> {
  const { error } = await supabase.from('tickets').delete().in('id', ids);
  if (error) throw error;
}
