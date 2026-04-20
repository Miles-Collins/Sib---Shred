import { defineField, defineType } from "sanity";

export const orderReceiptPageType = defineType({
  name: "orderReceiptPage",
  title: "Order Receipt Page",
  type: "document",
  fields: [
    defineField({ name: "receiptKicker", title: "Receipt Kicker", type: "string" }),
    defineField({ name: "totalLabel", title: "Total Label", type: "string" }),
    defineField({ name: "paymentStatusPrefix", title: "Payment Status Prefix", type: "string" }),
    defineField({ name: "subtotalLabel", title: "Subtotal Label", type: "string" }),
    defineField({ name: "deliveryFeeLabel", title: "Delivery Fee Label", type: "string" }),
    defineField({ name: "discountLabel", title: "Discount Label", type: "string" }),
    defineField({ name: "totalSummaryLabel", title: "Total Summary Label", type: "string" }),
    defineField({ name: "orderAgainLabel", title: "Order Again Button Label", type: "string" }),
    defineField({ name: "backToCheckoutLabel", title: "Back To Checkout Button Label", type: "string" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Order Receipt Page",
        subtitle: "Receipt page labels",
      };
    },
  },
});
