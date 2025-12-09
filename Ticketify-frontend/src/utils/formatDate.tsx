// utils/date.ts

export function formatDate(date: Date, format: string = 'DD/MM/YYYY'): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return format.replace('DD', day).replace('MM', month).replace('YYYY', String(year));
}

export const convertExpiryToDate = (expiry: string): string => {
  const [mm, yy] = expiry.split('/').map((s) => s.trim());
  const year = parseInt(yy.length === 2 ? '20' + yy : yy);
  const month = parseInt(mm);
  return `${year}-${String(month).padStart(2, '0')}-01`;
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  try {
    const end = new Date(endDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return `Valid until ${end}`;
  } catch {
    return 'Invalid date';
  }
};

