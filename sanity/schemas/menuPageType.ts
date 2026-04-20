import { defineArrayMember, defineField, defineType } from "sanity";

export const menuPageType = defineType({
  name: "menuPage",
  title: "Menu Page",
  type: "document",
  fields: [
    defineField({ name: "progressKicker", title: "Progress Kicker", type: "string" }),
    defineField({
      name: "progressSteps",
      title: "Progress Steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "headerKicker", title: "Header Kicker", type: "string" }),
    defineField({ name: "headerTitle", title: "Header Title", type: "string" }),
    defineField({
      name: "headerDescription",
      title: "Header Description",
      type: "text",
      rows: 4,
      description: "Max 150 characters.",
      validation: (rule) => rule.max(150),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Menu Page",
        subtitle: "Menu listing page copy",
      };
    },
  },
});
