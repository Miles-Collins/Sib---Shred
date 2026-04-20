import { defineArrayMember, defineField, defineType } from "sanity";

export const checkoutPageType = defineType({
  name: "checkoutPage",
  title: "Checkout Page",
  type: "document",
  fields: [
    defineField({
      name: "progressSteps",
      title: "Progress Steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "headerKicker", title: "Header Kicker", type: "string" }),
    defineField({ name: "headerTitle", title: "Header Title", type: "string" }),
    defineField({ name: "headerDescription", title: "Header Description", type: "text", rows: 4 }),
    defineField({
      name: "checkoutSteps",
      title: "Checkout Steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "successKicker", title: "Success Kicker", type: "string" }),
    defineField({ name: "successMessage", title: "Success Message", type: "text", rows: 3 }),
    defineField({ name: "missingFieldsError", title: "Missing Fields Error", type: "string" }),
    defineField({ name: "emptyCartError", title: "Empty Cart Error", type: "string" }),
    defineField({ name: "invalidCartError", title: "Invalid Cart Error", type: "string" }),
    defineField({ name: "retentionKicker", title: "Retention Kicker", type: "string" }),
    defineField({
      name: "retentionCards",
      title: "Retention Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Checkout Page",
        subtitle: "Checkout page copy",
      };
    },
  },
});
