import { createClient } from '@supabase/supabase-js';
import { mockTickets, mockEntries } from './mockData';

export async function seedDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  try {
    console.log('Starting database seed...');

    console.log('Deleting existing data...');
    await supabase.from('entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Inserting tickets...');
    const ticketIdMap: Record<string, string> = {};

    for (const ticket of mockTickets) {
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

      if (error) {
        console.error('Error inserting ticket:', error);
        throw error;
      }

      ticketIdMap[ticket.id] = data.id;
    }

    console.log(`Inserted ${mockTickets.length} tickets`);

    console.log('Inserting entries...');
    for (const entry of mockEntries) {
      const newTicketId = ticketIdMap[entry.ticketId];
      if (!newTicketId) {
        console.warn(`Skipping entry ${entry.id}: ticket ${entry.ticketId} not found`);
        continue;
      }

      const { error } = await supabase
        .from('entries')
        .insert({
          ticket_id: newTicketId,
          date: entry.date,
          title: entry.title || null,
          body: entry.body || null,
          technologies: entry.technologies,
          is_public: entry.isPublic,
        });

      if (error) {
        console.error('Error inserting entry:', error);
        throw error;
      }
    }

    console.log(`Inserted ${mockEntries.length} entries`);
    console.log('Database seed completed successfully!');

    return { success: true };
  } catch (error) {
    console.error('Database seed failed:', error);
    return { success: false, error };
  }
}
