-- Run before deploying the Drive gallery. Existing players remain unchanged.
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS drive_folder_id text;
COMMENT ON COLUMN public.players.drive_folder_id IS
  'Public Google Drive gallery folder ID (not a full URL). NULL hides the gallery.';
