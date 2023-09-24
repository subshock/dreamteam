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

export function formatDateTime(value: string | Date): string {
  if (typeof value === 'string') {
    if (value && value.length > 0 && RegExp(/^\d{4}-\d{2}-\d{2}T.+$/).test(<string>value)) {
      value = new Date(value);
    } else {
      return '';
    }
  }

  if (value instanceof Date) {
    return (<Date>value).toISOString().substring(0, 16);
  }

  return '';
}
