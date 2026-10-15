/**
 * Safari & WebKit Safe Date Utilities
 * Safari throws RangeError: Invalid time value when parsing SQL timestamp strings like "YYYY-MM-DD HH:mm:ss".
 * These utilities ensure cross-browser parsing across Chrome, Safari, Firefox, Edge, and iOS WebKit.
 */

export function parseSafeDate(val: string | number | Date | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    // 1. Replace space with 'T' for ISO compliance
    const isoString = val.trim().replace(' ', 'T');
    const d = new Date(isoString);
    if (!isNaN(d.getTime())) return d;

    // 2. Fallback to direct parse
    const rawDate = new Date(val);
    if (!isNaN(rawDate.getTime())) return rawDate;
  }
  return null;
}

export function formatSafeDate(val: string | number | Date | null | undefined): string {
  const d = parseSafeDate(val);
  if (!d) return 'Recent';
  try {
    return d.toLocaleDateString();
  } catch {
    return 'Recent';
  }
}

export function formatSafeTime(val: string | number | Date | null | undefined): string {
  const d = parseSafeDate(val);
  if (!d) return 'Just now';
  try {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Just now';
  }
}

export function formatSafeDateTime(val: string | number | Date | null | undefined): string {
  const d = parseSafeDate(val);
  if (!d) return 'Recent';
  try {
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return 'Recent';
  }
}
