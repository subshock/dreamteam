export function formatDateOnly(value: string | Date): string | Date {
  if (value instanceof Date) {
    value.setHours(0, 0, 0, 0);
    return value;
  }

  if (value == null || value.length === 0) { return value; }

  if (!new RegExp(/^\d{4}-\d{2}-\d{2}T.+$/).test(value)) { return value; }

  return value.substring(0, value.indexOf('T'));
}

export function isNumber(val: number) {
  return Number.isSafeInteger(val);
}
