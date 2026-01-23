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
    {
      name: "featured",
      title: "Featured Interview",
      type: "boolean",
      description: "Mark as featured to highlight on homepage",
    },
    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "title",
          title: "SEO Title",
          type: "string",
        },
        {
          name: "description",
          title: "SEO Description",
          type: "text",
          rows: 3,
        },
        {
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
        },
        {
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          description: "Prevent search engines from indexing this page",
        },
      ],
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
