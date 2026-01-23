// Person Schema Definition (for authors and interview guests)
// This serves as documentation for the Sanity schema structure
// Actual schema should be created in Sanity Studio

export const personSchema = {
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: "required",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: "required",
    },
    {
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      name: "image",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    },
    {
      name: "email",
      title: "Email",
      type: "email",
    },
    {
      name: "website",
      title: "Website",
      type: "url",
    },
    {
      name: "socialMedia",
      title: "Social Media",
      type: "object",
      fields: [
        {
          name: "twitter",
          title: "Twitter Handle",
          type: "string",
          description: "Without the @ symbol",
        },
        {
          name: "instagram",
          title: "Instagram Handle",
          type: "string",
          description: "Without the @ symbol",
        },
        {
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
};
