import { defineArrayMember, defineField, defineType } from "sanity";

export const plansPageType = defineType({
  name: "plansPage",
  title: "Plans Page",
  type: "document",
  fields: [
    defineField({ name: "heroKicker", title: "Hero Kicker", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", rows: 4 }),
    defineField({
      name: "valueCards",
      title: "Top Value Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "savingsKicker", title: "Savings Kicker", type: "string" }),
    defineField({ name: "whyKicker", title: "Why Section Kicker", type: "string" }),
    defineField({ name: "whyTitle", title: "Why Section Title", type: "string" }),
    defineField({ name: "whyDescription", title: "Why Section Description", type: "text", rows: 4 }),
    defineField({
      name: "whyCards",
      title: "Why Section Cards",
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
    defineField({ name: "faqKicker", title: "FAQ Kicker", type: "string" }),
    defineField({ name: "faqTitle", title: "FAQ Title", type: "string" }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    defineField({ name: "bottomCtaKicker", title: "Bottom CTA Kicker", type: "string" }),
    defineField({ name: "bottomCtaTitle", title: "Bottom CTA Title", type: "string" }),
    defineField({ name: "bottomCtaButtonLabel", title: "Bottom CTA Button Label", type: "string" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Plans Page",
        subtitle: "Plans and pricing page copy",
      };
    },
  },
});
