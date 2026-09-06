export function formatDate(input, opts = {}) {
  const d = new Date(typeof input === 'string' ? input + 'T00:00:00' : input);
  if (Number.isNaN(d.getTime())) return String(input ?? '');
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

export function formatDateLong(input) {
  return formatDate(input, { month: 'long', year: 'numeric' });
}