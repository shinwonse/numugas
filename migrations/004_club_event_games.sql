-- Allow manually added games in club_events (practice/friendly games not on gameone).
-- Additive only: existing rows are unchanged.

ALTER TABLE public.club_events DROP CONSTRAINT IF EXISTS club_events_type_check;
ALTER TABLE public.club_events
  ADD CONSTRAINT club_events_type_check
  CHECK (type IN ('game', 'training', 'dinner', 'event', 'etc'));

ALTER TABLE public.club_events ADD COLUMN IF NOT EXISTS opponent text;
ALTER TABLE public.club_events ADD COLUMN IF NOT EXISTS our_score int;
ALTER TABLE public.club_events ADD COLUMN IF NOT EXISTS their_score int;

-- 경기는 상대팀 필수, 점수는 둘 다 있거나 둘 다 없음
ALTER TABLE public.club_events DROP CONSTRAINT IF EXISTS club_events_game_check;
ALTER TABLE public.club_events
  ADD CONSTRAINT club_events_game_check CHECK (
    (type <> 'game' OR opponent IS NOT NULL)
    AND ((our_score IS NULL) = (their_score IS NULL))
    AND (our_score IS NULL OR (our_score >= 0 AND their_score >= 0))
  );
