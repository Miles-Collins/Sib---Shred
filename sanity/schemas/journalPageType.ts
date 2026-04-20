import { defineField, defineType } from "sanity";

export const journalPageType = defineType({
  name: "journalPage",
  title: "Journal Page",
  type: "document",
  fields: [
    defineField({ name: "listKicker", title: "List Kicker", type: "string" }),
    defineField({ name: "listTitle", title: "List Title", type: "string" }),
    defineField({ name: "listDescription", title: "List Description", type: "text", rows: 4 }),
    defineField({ name: "readArticleLabel", title: "Read Article Label", type: "string" }),
    defineField({ name: "fallbackExcerpt", title: "Fallback Excerpt", type: "string" }),
    defineField({ name: "detailBackLabel", title: "Detail Back Label", type: "string" }),
    defineField({ name: "detailEmptyBodyMessage", title: "Detail Empty Body Message", type: "string" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Journal Page",
        subtitle: "Journal list/detail labels",
      };
    },
  },
});
