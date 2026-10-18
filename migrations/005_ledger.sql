-- Club ledger (회계 장부) and membership dues status.
-- Private data: RLS is enabled with NO policies, so the anon key can neither read
-- nor write. All access goes through server actions using the service role key
-- after checking TEAM_SECRET (read) or ADMIN_SECRET (write).

CREATE TABLE IF NOT EXISTS public.ledger_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  opening_balance bigint NOT NULL,
  opening_date date NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ledger_entries (
  -- id order breaks ties within the same date (keeps the bank statement order)
  id bigserial PRIMARY KEY,
  entry_date date NOT NULL,
  kind text NOT NULL CHECK (kind IN ('income', 'expense')),
  amount bigint NOT NULL CHECK (amount > 0),
  counterparty text NOT NULL,
  memo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ledger_entries_date_idx
  ON public.ledger_entries (entry_date, id);

CREATE TABLE IF NOT EXISTS public.dues_status (
  year smallint NOT NULL,
  member_name text NOT NULL,
  quarter smallint NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  status text NOT NULL CHECK (status IN ('paid', 'dormant', 'unpaid')),
  -- 시트의 행 순서를 유지하기 위한 정렬 키
  sort_order smallint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (year, member_name, quarter)
);

-- Failed secret attempts for simple brute-force throttling
CREATE TABLE IF NOT EXISTS public.access_attempts (
  id bigserial PRIMARY KEY,
  client_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS access_attempts_client_idx
  ON public.access_attempts (client_key, created_at);

ALTER TABLE public.ledger_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dues_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_attempts ENABLE ROW LEVEL SECURITY;
