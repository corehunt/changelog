import { supabase } from '../supabase';
import { Entry } from '../types';

export interface EntryFilters {
  ticketId?: string;
  technologies?: string[];
  isPublic?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface EntrySort {
  field: 'date' | 'title' | 'created_at';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface EntriesResponse {
  entries: Entry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getEntries(
  filters?: EntryFilters,
  sort?: EntrySort,
  pagination?: PaginationParams
): Promise<EntriesResponse> {
  let query = supabase.from('entries').select('*', { count: 'exact' });

  if (filters?.ticketId) {
    query = query.eq('ticket_id', filters.ticketId);
  }

  if (filters?.isPublic !== undefined) {
    query = query.eq('is_public', filters.isPublic);
  }

  if (filters?.technologies && filters.technologies.length > 0) {
    query = query.contains('technologies', filters.technologies);
  }

  if (filters?.dateFrom) {
    query = query.gte('date', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('date', filters.dateTo);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,body.ilike.%${filters.search}%`
    );
  }

  const sortField = sort?.field || 'date';
  const sortDirection = sort?.direction || 'desc';
  query = query.order(sortField, { ascending: sortDirection === 'asc' });

  const page = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const entries: Entry[] = (data || []).map((row) => ({
    id: row.id,
    ticketId: row.ticket_id,
    date: row.date,
    title: row.title || undefined,
    body: row.body || undefined,
    technologies: row.technologies,
    isPublic: row.is_public,
  }));

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    entries,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getEntryById(id: string): Promise<Entry | null> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    ticketId: data.ticket_id,
    date: data.date,
    title: data.title || undefined,
    body: data.body || undefined,
    technologies: data.technologies,
    isPublic: data.is_public,
  };
}

export async function getEntriesForTicket(ticketId: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    ticketId: row.ticket_id,
    date: row.date,
    title: row.title || undefined,
    body: row.body || undefined,
    technologies: row.technologies,
    isPublic: row.is_public,
  }));
}

export async function createEntry(entry: Omit<Entry, 'id'>): Promise<Entry> {
  const { data, error } = await supabase
    .from('entries')
    .insert({
      ticket_id: entry.ticketId,
      date: entry.date,
      title: entry.title || null,
      body: entry.body || null,
      technologies: entry.technologies,
      is_public: entry.isPublic,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    ticketId: data.ticket_id,
    date: data.date,
    title: data.title || undefined,
    body: data.body || undefined,
    technologies: data.technologies,
    isPublic: data.is_public,
  };
}

export async function updateEntry(id: string, updates: Partial<Entry>): Promise<Entry> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.title !== undefined) updateData.title = updates.title || null;
  if (updates.body !== undefined) updateData.body = updates.body || null;
  if (updates.technologies !== undefined) updateData.technologies = updates.technologies;
  if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

  const { data, error } = await supabase
    .from('entries')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    ticketId: data.ticket_id,
    date: data.date,
    title: data.title || undefined,
    body: data.body || undefined,
    technologies: data.technologies,
    isPublic: data.is_public,
  };
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from('entries').delete().eq('id', id);
  if (error) throw error;
}

export async function bulkUpdateEntries(ids: string[], updates: Partial<Entry>): Promise<void> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

  const { error } = await supabase
    .from('entries')
    .update(updateData)
    .in('id', ids);

  if (error) throw error;
}

export async function bulkDeleteEntries(ids: string[]): Promise<void> {
  const { error } = await supabase.from('entries').delete().in('id', ids);
  if (error) throw error;
}
