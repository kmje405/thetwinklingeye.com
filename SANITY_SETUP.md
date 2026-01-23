# Sanity CMS Integration Setup

This project is set up to work with Sanity CMS for content management. Follow
these steps to get everything working.

## 🚀 Quick Start

### 1. Create a Sanity Project

1. Go to [sanity.io](https://sanity.io) and create a new project
2. Choose a project name and dataset name (usually 'production')
3. Note your **Project ID** from the project dashboard

### 2. Environment Variables

1. Copy `.env.example` to `.env`
2. Add your Sanity credentials:

```env
PUBLIC_SANITY_PROJECT_ID=your_project_id_here
PUBLIC_SANITY_DATASET=production
```

### 3. Create Sanity Studio Schemas

In your Sanity Studio, create the following document types using the schema
definitions in the `sanity/schemas/` folder:

#### Required Schemas:

- **siteSettings** (singleton) - Global site configuration
- **person** - Authors and interview guests
- **category** - Blog post categories
- **blogPost** - Blog articles
- **interview** - Interview content with YouTube integration

### 4. Initial Content Setup

Create at least one document of each type:

1. **Site Settings**: One document with your site title, description, etc.
2. **Person**: At least one author for blog posts
3. **Category**: A few categories for organizing blog posts
4. **Blog Post**: Sample blog posts
5. **Interview**: Sample interviews with YouTube URLs

## 📁 Project Structure

```
src/
├── lib/
│   ├── sanity.ts          # Sanity client and queries
│   └── siteConfig.ts      # Site configuration with Sanity integration
├── types/
│   └── sanity.ts          # TypeScript types for Sanity data
├── pages/
│   ├── blog/
│   │   ├── index.astro    # Blog feed page
│   │   └── [slug].astro   # Individual blog post (to be created)
│   └── interviews/
│       ├── index.astro    # Interview feed page
│       └── [slug].astro   # Individual interview (to be created)
└── components/
    └── BlogFeedCard.astro # Updated to work with Sanity data

sanity/
└── schemas/               # Schema documentation and reference
    ├── index.ts
    ├── siteSettings.ts
    ├── blogPost.ts
    ├── interview.ts
    ├── person.ts
    └── category.ts
```

## 🔧 Features

### Robust Fallback System

- Works without Sanity configured (shows placeholder content)
- Graceful error handling if Sanity is unavailable
- Clear setup instructions displayed when not configured

### Content Types

#### Blog Posts

- Rich text content with Portable Text
- Featured images with alt text and captions
- Author references
- Category tagging
- SEO metadata
- Featured post flagging

#### Interviews

- YouTube URL integration
- Automatic thumbnail extraction
- Custom thumbnail override option
- Guest information
- Rich text descriptions
- SEO metadata

#### Site Settings

- Global site configuration
- Social media links
- Logo and favicon management
- Meta tag configuration

### TypeScript Support

- Fully typed Sanity data structures
- Type-safe queries and responses
- IntelliSense support for all content types

## 🎨 Styling

The integration maintains your existing design aesthetic:

- Uses your custom CSS variables and fonts
- Maintains the editorial grid layout
- Responsive design patterns
- Consistent color scheme (#f8f0e5, #461121, #a37351)

## 📝 Content Management Workflow

1. **Create content** in Sanity Studio
2. **Publish** when ready
3. **Deploy** your Astro site to see changes
4. Content is **cached** for performance (CDN in production)

## 🔍 GROQ Queries

Pre-built queries are available in `src/lib/sanity.ts`:

- `siteSettings` - Global site configuration
- `allBlogPosts` - All blog posts with preview data
- `blogPost` - Single blog post with full content
- `allInterviews` - All interviews with preview data
- `interview` - Single interview with full content

## 🚨 Troubleshooting

### No content showing?

1. Check environment variables are set correctly
2. Verify Sanity project ID and dataset name
3. Ensure content is published in Sanity Studio
4. Check browser console for error messages

### TypeScript errors?

1. Ensure all required fields are present in Sanity documents
2. Check that schema types match TypeScript interfaces
3. Verify image fields have proper alt text

### Images not loading?

1. Check that images are uploaded to Sanity
2. Verify image URLs are being generated correctly
3. Ensure images have proper alt text for accessibility

## 🔄 Next Steps

After basic setup, consider:

1. Creating individual blog post and interview pages (`[slug].astro`)
2. Adding search functionality
3. Implementing pagination for large content sets
4. Adding RSS feeds
5. Setting up preview mode for draft content
6. Adding more content types as needed

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Astro Sanity Integration](https://docs.astro.build/en/guides/cms/sanity/)
- [Portable Text](https://www.sanity.io/docs/portable-text)
