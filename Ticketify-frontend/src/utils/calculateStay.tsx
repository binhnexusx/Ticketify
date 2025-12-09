 export function calculateNights(checkInDateStr: string, checkOutDateStr: string): number {
  if (!checkInDateStr || !checkOutDateStr) return 0;

  const checkInDate = new Date(checkInDateStr);
  const checkOutDate = new Date(checkOutDateStr);

  checkInDate.setHours(14, 0, 0, 0);

  checkOutDate.setHours(12, 0, 0, 0);

  const diffDays = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));

  const isCheckoutAfter12 = new Date(checkOutDateStr).getHours() >= 12;

  return diffDays + (isCheckoutAfter12 ? 1 : 0);
}
