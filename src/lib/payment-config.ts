// Update these to go live. VPA format: name@bankhandle (e.g. frostingfairy@okhdfcbank)
export const UPI_ID = "justforme680@sbi";
export const PAYEE_NAME = "The Frosting Fairy";
export const CURRENCY = "INR";

export function buildUpiUri(params: {
  amount: number;
  orderId: string;
  note?: string;
}) {
  const q = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: params.amount.toFixed(2),
    cu: CURRENCY,
    tn: params.note ?? `Order ${params.orderId}`,
    tr: params.orderId,
  });
  return `upi://pay?${q.toString()}`;
}
