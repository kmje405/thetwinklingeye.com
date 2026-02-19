// Interview Schema Definition
// This serves as documentation for the Sanity schema structure
// Actual schema should be created in Sanity Studio

export const interviewSchema = {
  name: "interview",
  title: "Interview",
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Brief description for previews and SEO",
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: "required",
    },
    {
      name: "cardVariant",
      title: "Card Display Style",
      type: "string",
      options: {
        list: [
          { title: "Editorial (Two Column)", value: "editorial" },
          { title: "Full Image (Large Image)", value: "full-image" },
          { title: "Text Only (No Image)", value: "text-only" },
        ],
        layout: "radio",
      },
      initialValue: "full-image",
      description: "How this interview should be displayed in lists",
    },
    {
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      validation: "required",
      description: "Full YouTube video URL",
    },
    {
      name: "thumbnail",
      title: "Custom Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Optional custom thumbnail (will use YouTube thumbnail if not provided)",
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
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
      name: "guest",
      title: "Guest",
      type: "reference",
      to: [{ type: "person" }],
      validation: "required",
    },
    {
      name: "duration",
      title: "Duration (minutes)",
      type: "number",
      description: "Interview duration in minutes",
    },
  ],
  preview: {
    select: {
      title: "title",
      guest: "guest.name",
      media: "thumbnail",
    },
    prepare: ({ title, guest, media }: any) => ({
      title,
      subtitle: guest && `with ${guest}`,
      media,
    }),
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Old",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
};
