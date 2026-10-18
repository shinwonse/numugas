import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = ts.transpileModule(
  readFileSync(new URL('../src/lib/ledger-utils.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;

const module = { exports: {} };
new Function('module', 'exports', source)(module, module.exports);
const utils = module.exports;

const entries = [
  { id: 3, entry_date: '2025-10-01', kind: 'expense', amount: 11000 },
  { id: 1, entry_date: '2025-09-23', kind: 'income', amount: 11000 },
  { id: 2, entry_date: '2025-09-24', kind: 'income', amount: 30000 },
  { id: 4, entry_date: '2025-10-01', kind: 'income', amount: 56000 },
];

test('withRunningBalance sorts by date then id and accumulates from opening', () => {
  const rows = utils.withRunningBalance(1892003, entries);
  assert.deepEqual(
    rows.map((r) => [r.id, r.balance]),
    [
      [1, 1903003],
      [2, 1933003],
      [3, 1922003],
      [4, 1978003],
    ],
  );
});

test('summarize totals income and expense', () => {
  assert.deepEqual(utils.summarize(entries), { income: 97000, expense: 11000 });
});

test('validateLedgerEntry normalizes and rejects bad input', () => {
  assert.deepEqual(
    utils.validateLedgerEntry({
      entry_date: '2026-10-18',
      kind: 'income',
      amount: 30000,
      counterparty: '  신원세 ',
      memo: '  ',
    }),
    {
      value: {
        entry_date: '2026-10-18',
        kind: 'income',
        amount: 30000,
        counterparty: '신원세',
        memo: null,
      },
    },
  );
  assert.ok('error' in utils.validateLedgerEntry({ entry_date: '', kind: 'income', amount: 1, counterparty: 'a' }));
  assert.ok('error' in utils.validateLedgerEntry({ entry_date: '2026-10-18', kind: 'x', amount: 1, counterparty: 'a' }));
  assert.ok('error' in utils.validateLedgerEntry({ entry_date: '2026-10-18', kind: 'income', amount: 0, counterparty: 'a' }));
  assert.ok('error' in utils.validateLedgerEntry({ entry_date: '2026-10-18', kind: 'income', amount: 1.5, counterparty: 'a' }));
  assert.ok('error' in utils.validateLedgerEntry({ entry_date: '2026-10-18', kind: 'income', amount: 1, counterparty: ' ' }));
});

test('parseAmount accepts commas and 원', () => {
  assert.equal(utils.parseAmount('184,200'), 184200);
  assert.equal(utils.parseAmount('30000원'), 30000);
  assert.ok(Number.isNaN(utils.parseAmount('3만')));
  assert.ok(Number.isNaN(utils.parseAmount('')));
});

test('formatWon uses Korean thousands separators', () => {
  assert.equal(utils.formatWon(423855), '423,855원');
});
