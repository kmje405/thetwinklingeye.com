// Category Schema Definition
// This serves as documentation for the Sanity schema structure
// Actual schema should be created in Sanity Studio

export const categorySchema = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: "required",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: "required",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "color",
      title: "Color",
      type: "string",
      description: "Hex color code for category styling",
      validation: (Rule: any) =>
        Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error(
          "Please enter a valid hex color code"
        ),
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
};
