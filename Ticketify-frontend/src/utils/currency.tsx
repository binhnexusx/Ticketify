// export function formatCurrency(
//   amount: number,
//   currency: string = 'USD',
//   locale: string = 'en-US'
// ): string {
//   return new Intl.NumberFormat(locale, {
//     style: 'currency',
//     currency,
//   }).format(amount);
// }

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  minimumFractionDigits: number = 0
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(amount);
}

export function convertCurrency(amount: number, rate: number): number {
  return Number((amount * rate).toFixed(2));
}
