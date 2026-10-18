export type LedgerKind = 'income' | 'expense';

export interface LedgerEntry {
  id: number;
  entry_date: string; // YYYY-MM-DD
  kind: LedgerKind;
  amount: number;
  counterparty: string;
  memo: string | null;
}

export const DUES_STATUSES = ['paid', 'dormant', 'unpaid'] as const;
export type DuesStatus = (typeof DUES_STATUSES)[number];

export const DUES_STATUS_LABELS: Record<DuesStatus, string> = {
  paid: '납부',
  dormant: '휴면',
  unpaid: '미납',
};

export interface DuesRow {
  year: number;
  member_name: string;
  quarter: number;
  status: DuesStatus;
  sort_order: number;
}

export interface LedgerData {
  openingBalance: number;
  openingDate: string;
  entries: LedgerEntry[];
  dues: DuesRow[];
}

export interface LedgerEntryInput {
  entry_date: string;
  kind: LedgerKind;
  amount: number;
  counterparty: string;
  memo: string;
}
