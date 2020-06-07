export function normalizeNumber(value: number): number {
  value = parseFloat(
    value.toFixed(2)
  );

  return isNaN(value) ? 0 : value;
}

export function parseNumber(value: any): number {
  if (typeof value === 'number') {
    return value;
  }

  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

