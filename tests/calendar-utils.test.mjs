import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = ts.transpileModule(
  readFileSync(new URL('../src/lib/calendar-utils.ts', import.meta.url), 'utf8'),
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

test('parseGameDate attaches season year and KST offset', () => {
  assert.equal(
    utils.parseGameDate('11월21일(토) 09:00', 2026),
    '2026-11-21T09:00:00+09:00',
  );
  assert.equal(
    utils.parseGameDate('03월01일(토) 07:30', 2025),
    '2025-03-01T07:30:00+09:00',
  );
});

test('parseGameDate rolls into next year when weekday label only fits season + 1', () => {
  // 겨울 리그: 2021 시즌 목록에 실린 2022-02-12(토) 경기
  assert.equal(
    utils.parseGameDate('02월12일(토) 07:30', 2021),
    '2022-02-12T07:30:00+09:00',
  );
  // 시즌 연도와 요일이 맞으면 그대로
  assert.equal(
    utils.parseGameDate('11월20일(토) 07:20', 2021),
    '2021-11-20T07:20:00+09:00',
  );
  // 어느 쪽도 맞지 않으면 시즌 연도 유지
  assert.equal(
    utils.parseGameDate('02월12일(월) 07:30', 2021),
    '2021-02-12T07:30:00+09:00',
  );
});

test('parseGameDate defaults missing time to midnight', () => {
  assert.equal(utils.parseGameDate('5월9일(토)', 2026), '2026-05-09T00:00:00+09:00');
});

test('parseGameDate rejects garbage and impossible dates', () => {
  assert.equal(utils.parseGameDate('', 2026), null);
  assert.equal(utils.parseGameDate('미정', 2026), null);
  assert.equal(utils.parseGameDate('02월30일(토) 09:00', 2026), null);
});

test('getGameOutcome reads score from our side regardless of position', () => {
  const asTeam1 = utils.getGameOutcome({
    team1_name: '담장NUMUGAS',
    team1_score: '6',
    team2_name: '캐롯브라더스',
    team2_score: '3',
  });
  assert.deepEqual(asTeam1, {
    opponent: '캐롯브라더스',
    score: { ours: 6, theirs: 3 },
    result: '승',
  });

  const asTeam2 = utils.getGameOutcome({
    team1_name: '선데이모닝',
    team1_score: '9',
    team2_name: '담장NUMUGAS',
    team2_score: '2',
  });
  assert.equal(asTeam2.opponent, '선데이모닝');
  assert.equal(asTeam2.result, '패');

  const draw = utils.getGameOutcome({
    team1_name: '담장NUMUGAS',
    team1_score: '6',
    team2_name: 'X',
    team2_score: '6',
  });
  assert.equal(draw.result, '무');
});

test('getGameOutcome has no result before the game', () => {
  const pending = utils.getGameOutcome({
    team1_name: '담장NUMUGAS',
    team1_score: '',
    team2_name: 'X',
    team2_score: '',
  });
  assert.equal(pending.result, null);
  assert.equal(pending.score, null);
});

test('month helpers handle year boundaries', () => {
  assert.deepEqual(utils.shiftMonth(2026, 12, 1), { year: 2027, month: 1 });
  assert.deepEqual(utils.shiftMonth(2026, 1, -1), { year: 2025, month: 12 });
  assert.deepEqual(utils.getMonthRange(2026, 12), {
    start: '2026-12-01T00:00:00+09:00',
    end: '2027-01-01T00:00:00+09:00',
  });
  assert.deepEqual(utils.parseMonthParam('2026-10'), { year: 2026, month: 10 });
  assert.equal(utils.parseMonthParam('2026-13'), null);
  assert.equal(utils.parseMonthParam('abc'), null);
});

test('KST conversion crosses UTC date boundary', () => {
  // 2026-10-15 07:00 KST == 2026-10-14 22:00 UTC
  assert.equal(utils.toKstDateKey('2026-10-14T22:00:00Z'), '2026-10-15');
  assert.equal(utils.toKstTime('2026-10-14T22:00:00Z'), '07:00');
});

test('buildMonthGrid starts on Sunday and pads to full weeks', () => {
  // 2026-10-01 is a Thursday
  const grid = utils.buildMonthGrid(2026, 10);
  assert.deepEqual(grid[0], [null, null, null, null, '2026-10-01', '2026-10-02', '2026-10-03']);
  assert.ok(grid.every((week) => week.length === 7));
  assert.equal(grid.flat().filter(Boolean).length, 31);
  // 2026-09-30 is a Wednesday, so the last week is padded
  assert.deepEqual(utils.buildMonthGrid(2026, 9).at(-1).slice(3), ['2026-09-30', null, null, null]);
});

test('resultFromScore decides win/loss/draw from our side', () => {
  assert.equal(utils.resultFromScore(7, 3), '승');
  assert.equal(utils.resultFromScore(2, 9), '패');
  assert.equal(utils.resultFromScore(4, 4), '무');
});
