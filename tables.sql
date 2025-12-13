/*
  # Create tickets and entries tables

  1. New Tables
    - `tickets`
      - `id` (uuid, primary key)
      - `slug` (text, unique, indexed for fast lookups)
      - `title` (text)
      - `status` (text, check constraint for ACTIVE/COMPLETED)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz, nullable)
      - `background` (text, nullable)
      - `technologies` (text array)
      - `learned` (text, nullable)
      - `roadblocks_summary` (text, nullable)
      - `metrics_summary` (text, nullable)
      - `is_public` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `entries`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, foreign key to tickets)
      - `date` (timestamptz)
      - `title` (text, nullable)
      - `body` (text, nullable)
      - `technologies` (text array)
      - `is_public` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to public tickets/entries
    - Add policies for full access (for now, can be restricted later with auth)

  3. Indexes
    - Add index on tickets.slug for fast lookups
    - Add index on entries.ticket_id for fast joins
    - Add index on tickets.status for filtering
    - Add index on tickets.start_date for sorting
*/

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED')),
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  background text,
  technologies text[] DEFAULT '{}',
  learned text,
  roadblocks_summary text,
  metrics_summary text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  date timestamptz NOT NULL DEFAULT now(),
  title text,
  body text,
  technologies text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tickets_slug ON tickets(slug);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_start_date ON tickets(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_entries_ticket_id ON entries(ticket_id);
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date DESC);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Tickets policies
CREATE POLICY "Public tickets are viewable by everyone"
  ON tickets FOR SELECT
  USING (is_public = true);

CREATE POLICY "Allow all access to tickets for now"
  ON tickets FOR ALL
  USING (true)
  WITH CHECK (true);

-- Entries policies
CREATE POLICY "Public entries are viewable by everyone"
  ON entries FOR SELECT
  USING (is_public = true);

CREATE POLICY "Allow all access to entries for now"
  ON entries FOR ALL
  USING (true)
  WITH CHECK (true);