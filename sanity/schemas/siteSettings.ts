import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "charset",
      title: "Character Set",
      type: "string",
      initialValue: "UTF-8",
    }),
    defineField({
      name: "viewport",
      title: "Viewport",
      type: "string",
      initialValue: "width=device-width, initial-scale=1",
    }),
    defineField({
      name: "formatDetection",
      title: "Format Detection",
      type: "string",
      initialValue: "telephone=no",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      options: {
        accept: ".ico,.png,.svg",
      },
    }),
    defineField({
      name: "logo",
      title: "Site Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media",
      type: "object",
      fields: [
        {
          name: "twitter",
          title: "Twitter URL",
          type: "url",
        },
        {
          name: "instagram",
          title: "Instagram URL",
          type: "url",
        },
        {
          name: "facebook",
          title: "Facebook URL",
          type: "url",
        },
        {
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
