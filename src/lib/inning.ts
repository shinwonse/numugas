export function parseInning(
  inn: string | number | null | undefined,
): number {
  if (!inn) return 0;
  const [whole, frac] = String(inn).split('.');
  return Number(whole) + (frac ? Number(frac) / 3 : 0);
}

export function formatInning(decimalInnings: number): string {
  const whole = Math.floor(decimalInnings);
  const fracDec = decimalInnings - whole;
  const thirds = Math.round(fracDec * 3);
  if (thirds === 0) return `${whole}.0`;
  if (thirds === 3) return `${whole + 1}.0`;
  return `${whole}.${thirds}`;
}
