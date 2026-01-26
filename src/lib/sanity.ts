import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// Sanity client configuration
export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "",
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  useCdn: import.meta.env.PROD, // Use CDN in production
  apiVersion: "2024-01-01", // Use current date for API version
});

// Image URL builder
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ queries
export const queries = {
  // Site settings
  siteSettings: `*[_type == "siteSettings"][0]{
    title,
    description,
    favicon {
      asset->{
        _id,
        url
      },
      alt
    },
    logo {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    socialMedia,
    siteOwner {
      name,
      callout,
      bio,
      image {
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt
      }
    }
  }`,

  // All blog posts
  allBlogPosts: `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    cardVariant,
    featuredImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt,
      caption
    },
    author->{
      name,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      title,
      slug
    }
  }`,

  // Single blog post
  blogPost: `*[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt,
      caption
    },
    body,
    author->{
      name,
      bio,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      title,
      slug
    },
    seo
  }`,

  // All interviews
  allInterviews: `*[_type == "interview"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    youtubeUrl,
    thumbnail {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    guest->{
      name,
      bio,
      image {
        asset->{
          _id,
          url
        },
        alt,
        caption
      }
    }
  }`,

  // Single interview
  interview: `*[_type == "interview" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    youtubeUrl,
    thumbnail {
      asset->{
        _id,
        url
      },
      alt,
      caption
    },
    description,
    guest->{
      name,
      bio,
      image {
        asset->{
          _id,
          url
        },
        alt,
        caption
      }
    },
    seo
  }`,
};
