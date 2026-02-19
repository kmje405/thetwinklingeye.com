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
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
};
