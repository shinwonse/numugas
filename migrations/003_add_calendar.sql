-- Calendar: add year-aware game timestamps to schedule and create club_events.
-- WARNING: This wipes existing schedule rows (their dates have no year and cannot
-- be recovered). Run "경기 일정" refresh in /admin afterwards to re-crawl by season.

-- 1. schedule: season + game_at, new unique key
DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.schedule'::regclass AND contype = 'u'
  LOOP
    EXECUTE format('ALTER TABLE public.schedule DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

DROP INDEX IF EXISTS public.schedule_date_team1_name_team2_name_key;

DELETE FROM public.schedule;

ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS season int;
ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS game_at timestamptz;

ALTER TABLE public.schedule
  ADD CONSTRAINT schedule_game_at_teams_key UNIQUE (game_at, team1_name, team2_name);

CREATE INDEX IF NOT EXISTS schedule_game_at_idx ON public.schedule (game_at);

-- 2. club_events: manually managed team events (public read, server-only write)
CREATE TABLE IF NOT EXISTS public.club_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'etc'
    CHECK (type IN ('training', 'dinner', 'event', 'etc')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  all_day boolean NOT NULL DEFAULT false,
  location text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS club_events_starts_at_idx ON public.club_events (starts_at);

ALTER TABLE public.club_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "club_events public read" ON public.club_events;
CREATE POLICY "club_events public read" ON public.club_events
  FOR SELECT USING (true);
-- No insert/update/delete policies: writes go through /api/admin/events with
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
