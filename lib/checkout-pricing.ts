const DELIVERY_FEE_CENTS = 800;
const DISCOUNT_THRESHOLD_CENTS = 10000;
const SUBSCRIBER_DISCOUNT_CENTS = 1000;

export function priceToCents(price: string) {
  return Math.round(Number.parseFloat(price.replace(/[^0-9.]/g, "")) * 100);
}

export function formatCents(value: number) {
  return `$${(value / 100).toFixed(2)}`;
}

export function calculateCheckoutTotals(subtotalCents: number) {
  const deliveryFeeCents = DELIVERY_FEE_CENTS;
  const discountCents = subtotalCents >= DISCOUNT_THRESHOLD_CENTS ? SUBSCRIBER_DISCOUNT_CENTS : 0;
  const totalCents = subtotalCents + deliveryFeeCents - discountCents;

  return {
    subtotalCents,
    deliveryFeeCents,
    discountCents,
    totalCents,
  };
}