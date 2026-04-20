import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "portraitImage", title: "Portrait image", type: "image", options: { hotspot: true } }),
    defineField({ name: "introKicker", title: "Intro kicker", type: "string" }),
    defineField({ name: "introHeadline", title: "Intro headline", type: "text", rows: 3 }),
    defineField({ name: "introBody1", title: "Intro body 1", type: "text", rows: 4 }),
    defineField({ name: "introBody2", title: "Intro body 2", type: "text", rows: 4 }),
    defineField({ name: "whoAmIBody", title: "Who I am body", type: "text", rows: 5 }),
    defineField({ name: "whyStartBody", title: "Why did I start body", type: "text", rows: 5 }),
    defineField({ name: "whoForBody", title: "Who is this for body", type: "text", rows: 5 }),
    defineField({
      name: "howItWorksSteps",
      title: "How it works steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "pillars",
      title: "Pillars",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "contactHeadline", title: "Contact headline", type: "string" }),
    defineField({ name: "contactButtonLabel", title: "Contact button label", type: "string" }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
        subtitle: "About page content",
      };
    },
  },
});
