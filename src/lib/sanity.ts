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
    charset,
    viewport,
    formatDetection,
    favicon,
    logo,
    socialMedia
  }`,

  // All blog posts
  allBlogPosts: `*[_type == "blogPost"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage,
    author->{
      name,
      image
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
    featuredImage,
    body,
    author->{
      name,
      bio,
      image
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
    thumbnail,
    guest->{
      name,
      bio,
      image
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
    thumbnail,
    description,
    guest->{
      name,
      bio,
      image
    },
    seo
  }`,
};
