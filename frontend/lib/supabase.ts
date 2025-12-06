import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      tickets: {
        Row: {
          id: string;
          slug: string;
          title: string;
          status: 'ACTIVE' | 'COMPLETED';
          start_date: string;
          end_date: string | null;
          background: string | null;
          technologies: string[];
          learned: string | null;
          roadblocks_summary: string | null;
          metrics_summary: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          status: 'ACTIVE' | 'COMPLETED';
          start_date?: string;
          end_date?: string | null;
          background?: string | null;
          technologies?: string[];
          learned?: string | null;
          roadblocks_summary?: string | null;
          metrics_summary?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          status?: 'ACTIVE' | 'COMPLETED';
          start_date?: string;
          end_date?: string | null;
          background?: string | null;
          technologies?: string[];
          learned?: string | null;
          roadblocks_summary?: string | null;
          metrics_summary?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      entries: {
        Row: {
          id: string;
          ticket_id: string;
          date: string;
          title: string | null;
          body: string | null;
          technologies: string[];
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          date?: string;
          title?: string | null;
          body?: string | null;
          technologies?: string[];
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          date?: string;
          title?: string | null;
          body?: string | null;
          technologies?: string[];
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
