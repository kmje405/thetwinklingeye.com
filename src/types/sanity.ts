// Base Sanity types
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  caption?: string;
}

export interface SanityImageWithMetadata {
  _type: "image";
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
  caption?: string;
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SanityReference {
  _ref: string;
  _type: "reference";
}

// Portable Text types
export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style?: string;
  children: PortableTextSpan[];
  markDefs?: any[];
}

export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}

export type PortableText = (PortableTextBlock | any)[];

// Site Settings
export interface SiteSettings extends SanityDocument {
  _type: "siteSettings";
  title: string;
  description: string;
  favicon?: SanityImage;
  logo?: SanityImage;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  siteOwner?: {
    name: string;
    callout?: string;
    bio?: PortableText;
    image?: SanityImageWithMetadata;
  };
}

// Author/Person
export interface Person extends SanityDocument {
  _type: "person";
  name: string;
  slug: SanitySlug;
  bio?: PortableText;
  image?: SanityImageWithMetadata;
  email?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// Category
export interface Category extends SanityDocument {
  _type: "category";
  title: string;
  slug: SanitySlug;
  description?: string;
  color?: string;
}

// SEO
export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: SanityImage;
  noIndex?: boolean;
}

// Blog Post
export interface BlogPost extends SanityDocument {
  _type: "blogPost";
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt: string;
  cardVariant?: "editorial" | "full-image" | "text-only";
  featuredImage?: SanityImageWithMetadata;
  body: PortableText;
  author: Person;
  categories?: Category[];
  tags?: string[];
  seo?: SEO;
  featured?: boolean;
}

// Interview
export interface Interview extends SanityDocument {
  _type: "interview";
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt: string;
  cardVariant?: "editorial" | "full-image" | "text-only";
  youtubeUrl: string;
  thumbnail?: SanityImage;
  description?: PortableText;
  guest: Person;
  duration?: number;
  seo?: SEO;
  featured?: boolean;
}

// API Response types
export interface BlogPostPreview {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt: string;
  cardVariant?: "editorial" | "full-image" | "text-only";
  featuredImage?: SanityImageWithMetadata;
  author: {
    name: string;
    image?: SanityImageWithMetadata;
  };
  categories?: {
    title: string;
    slug: SanitySlug;
  }[];
}

export interface InterviewPreview {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt: string;
  cardVariant?: "editorial" | "full-image" | "text-only";
  youtubeUrl: string;
  thumbnail?: SanityImageWithMetadata;
  guest: {
    name: string;
    bio?: PortableText;
    image?: SanityImageWithMetadata;
  };
}
