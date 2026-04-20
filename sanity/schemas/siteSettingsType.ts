import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "topRibbonText", title: "Top Ribbon Text", type: "string" }),
    defineField({ name: "brandName", title: "Brand Name", type: "string" }),
    defineField({ name: "brandSubtitle", title: "Brand Subtitle", type: "string" }),
    defineField({
      name: "primaryNavLinks",
      title: "Primary Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "headerCtaPrimary",
      title: "Header CTA Primary Label",
      type: "string",
    }),
    defineField({
      name: "headerCtaSecondary",
      title: "Header CTA Secondary Label",
      type: "string",
    }),
    defineField({ name: "footerTagline", title: "Footer Tagline", type: "string" }),
    defineField({
      name: "footerCompanyLinks",
      title: "Footer Company Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "openInNewTab", title: "Open In New Tab", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "footerMenuLinks",
      title: "Footer Menu Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "supportPhone", title: "Support Phone", type: "string" }),
    defineField({ name: "supportEmail", title: "Support Email", type: "string" }),
    defineField({ name: "footerCopyright", title: "Footer Copyright", type: "string" }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global header/footer/navigation content",
      };
    },
  },
});
