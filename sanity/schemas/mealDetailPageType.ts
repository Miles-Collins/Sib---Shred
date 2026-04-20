import { defineArrayMember, defineField, defineType } from "sanity";

export const mealDetailPageType = defineType({
  name: "mealDetailPage",
  title: "Meal Detail Page",
  type: "document",
  fields: [
    defineField({ name: "nutritionKicker", title: "Nutrition Kicker", type: "string" }),
    defineField({ name: "nutritionTitle", title: "Nutrition Title", type: "string" }),
    defineField({ name: "nutritionFootnote", title: "Nutrition Footnote", type: "string" }),
    defineField({ name: "ingredientsTitle", title: "Ingredients Title", type: "string" }),
    defineField({ name: "allergensPrefix", title: "Allergens Prefix", type: "string" }),
    defineField({
      name: "autoDietaryTags",
      title: "Auto-appended Dietary Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Tags always shown in addition to meal dietary tags (e.g. CALORIE SMART).",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Meal Detail Page",
        subtitle: "Shared meal detail labels",
      };
    },
  },
});
