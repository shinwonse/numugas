// 회계 장부 순수 유틸리티 (외부 import 없음 — tests/ledger-utils.test.mjs에서 직접 로드)

export interface LedgerRow {
  id: number;
  entry_date: string;
  kind: 'income' | 'expense';
  amount: number;
}

/** 날짜 → id 순(통장 순서)으로 정렬 */
export function sortEntries<T extends LedgerRow>(entries: T[]): T[] {
  return [...entries].sort((a, b) =>
    a.entry_date === b.entry_date
      ? a.id - b.id
      : a.entry_date < b.entry_date
        ? -1
        : 1,
  );
}

/** 기초잔액부터 누적한 거래 후 잔액을 붙인다 (정렬된 순서) */
export function withRunningBalance<T extends LedgerRow>(
  openingBalance: number,
  entries: T[],
): (T & { balance: number })[] {
  let balance = openingBalance;
  return sortEntries(entries).map((entry) => {
    balance += entry.kind === 'income' ? entry.amount : -entry.amount;
    return { ...entry, balance };
  });
}

export function summarize(entries: LedgerRow[]): { income: number; expense: number } {
  let income = 0;
  let expense = 0;
  for (const e of entries) {
    if (e.kind === 'income') income += e.amount;
    else expense += e.amount;
  }
  return { income, expense };
}

export function formatWon(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}

export interface LedgerEntryInputLike {
  entry_date?: string;
  kind?: string;
  amount?: number;
  counterparty?: string;
  memo?: string | null;
}

/** 클라이언트·서버 공통 검증. 통과하면 정규화된 값 */
export function validateLedgerEntry(input: LedgerEntryInputLike | undefined):
  | { error: string }
  | {
      value: {
        entry_date: string;
        kind: 'income' | 'expense';
        amount: number;
        counterparty: string;
        memo: string | null;
      };
    } {
  if (!input) return { error: '내역이 없습니다.' };
  const date = input.entry_date ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return { error: '날짜를 선택하세요.' };
  }
  if (input.kind !== 'income' && input.kind !== 'expense') {
    return { error: '입금/출금을 선택하세요.' };
  }
  const amount = input.amount;
  if (
    typeof amount !== 'number' ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    amount > 1_000_000_000
  ) {
    return { error: '금액은 1원 이상의 정수로 입력하세요.' };
  }
  const counterparty = input.counterparty?.trim();
  if (!counterparty) return { error: '내용(입금자/출금처)을 입력하세요.' };
  return {
    value: {
      entry_date: date,
      kind: input.kind,
      amount,
      counterparty,
      memo: input.memo?.trim() || null,
    },
  };
}

/** "184,200" / "184200원" 같은 입력을 정수로. 실패 시 NaN */
export function parseAmount(text: string): number {
  const digits = text.replace(/[,\s원]/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : Number.NaN;
}
