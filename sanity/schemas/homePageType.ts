import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "trustedHeadline", title: "Trusted headline", type: "string" }),
    defineField({ name: "trustedCtaLabel", title: "Trusted CTA label", type: "string" }),
    defineField({ name: "kitchenKicker", title: "Kitchen kicker", type: "string" }),
    defineField({ name: "kitchenHeadline", title: "Kitchen headline", type: "string" }),
    defineField({ name: "kitchenDescription", title: "Kitchen description", type: "text", rows: 4 }),
    defineField({
      name: "kitchenCards",
      title: "Kitchen cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "categoryHighlights",
      title: "Category highlights",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "mealPrepSteps",
      title: "Meal prep steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "whyHeadline", title: "Why section headline", type: "string" }),
    defineField({ name: "whyDescription", title: "Why section description", type: "text", rows: 3 }),
    defineField({
      name: "goals",
      title: "Goal badges",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "valueBlocks",
      title: "Value blocks",
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
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
    }),
    defineField({ name: "startCtaKicker", title: "Start CTA kicker", type: "string" }),
    defineField({ name: "startCtaHeadline", title: "Start CTA headline", type: "string" }),
    defineField({ name: "startCtaButtonLabel", title: "Start CTA button label", type: "string" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage",
        subtitle: "Landing page content",
      };
    },
  },
});
