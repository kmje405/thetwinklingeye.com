import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief description for previews and SEO',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cardVariant',
      title: 'Card Display Style',
      type: 'string',
      options: {
        list: [
          {title: 'Editorial (Two Column)', value: 'editorial'},
          {title: 'Full Image (Large Image)', value: 'full-image'},
          {title: 'Text Only (No Image)', value: 'text-only'},
        ],
        layout: 'radio',
      },
      initialValue: 'full-image',
      description: 'How this interview should be displayed in lists',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
      description: 'Full YouTube video URL',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional custom thumbnail (will use YouTube thumbnail if not provided)',
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'guest',
      title: 'Guest',
      type: 'reference',
      to: [{type: 'person'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (minutes)',
      type: 'number',
      description: 'Interview duration in minutes',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Interview',
      type: 'boolean',
      description: 'Mark as featured to highlight on homepage',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      guest: 'guest.name',
      media: 'thumbnail',
    },
    prepare({title, guest, media}) {
      return {
        title,
        subtitle: guest && `with ${guest}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
})
