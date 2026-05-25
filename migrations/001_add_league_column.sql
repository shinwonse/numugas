-- Drop and recreate batter_stats / pitcher_stats with league column.
-- WARNING: This wipes all existing rows. Re-crawl after running.

DROP TABLE IF EXISTS batter_stats;
DROP TABLE IF EXISTS pitcher_stats;

CREATE TABLE batter_stats (
  id BIGSERIAL PRIMARY KEY,
  season text NOT NULL,
  league text NOT NULL,
  name text NOT NULL,
  back_number text,
  avg text,
  games text,
  plateappearances text,
  atbats text,
  runs text,
  hits text,
  singles text,
  doubles text,
  triples text,
  homeruns text,
  totalbases text,
  rbi text,
  stolenbases text,
  caughtstealing text,
  sacrificehits text,
  sacrificeflies text,
  walks text,
  intentionalwalks text,
  hitbypitch text,
  strikeouts text,
  doubleplays text,
  sluggingpercentage text,
  onbasepercentage text,
  UNIQUE (season, name, league)
);

CREATE TABLE pitcher_stats (
  id BIGSERIAL PRIMARY KEY,
  season text NOT NULL,
  league text NOT NULL,
  name text NOT NULL,
  back_number text,
  era numeric,
  games numeric DEFAULT 0,
  wins numeric DEFAULT 0,
  losses numeric DEFAULT 0,
  saves numeric DEFAULT 0,
  holds numeric DEFAULT 0,
  winrate numeric,
  batters numeric DEFAULT 0,
  atbats numeric DEFAULT 0,
  pitches numeric DEFAULT 0,
  innings text,
  hits numeric DEFAULT 0,
  homeruns numeric DEFAULT 0,
  sacrificehits numeric DEFAULT 0,
  sacrificeflies numeric DEFAULT 0,
  walks numeric DEFAULT 0,
  intentionalwalks numeric DEFAULT 0,
  hitbypitch numeric DEFAULT 0,
  strikeouts numeric DEFAULT 0,
  wildpitches numeric DEFAULT 0,
  balks numeric DEFAULT 0,
  runs numeric DEFAULT 0,
  earnedruns numeric DEFAULT 0,
  whip numeric,
  opponent_avg numeric,
  strikeout_rate numeric,
  UNIQUE (season, name, league)
);

-- Disable RLS so anon key (used by crawl + read) can access.
-- Tighten with policies later if needed.
ALTER TABLE batter_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE pitcher_stats DISABLE ROW LEVEL SECURITY;
