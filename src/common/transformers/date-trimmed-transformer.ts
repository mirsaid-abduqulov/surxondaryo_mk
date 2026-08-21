export function dateOrUndefined({ value }: { value: unknown }) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' || trimmed === 'null' || trimmed === 'undefined'
    ? undefined
    : trimmed;
}