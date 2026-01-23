import { client, queries } from "./sanity";
import type { SiteSettings } from "../types/sanity";

// Default/fallback site configuration
const defaultSiteConfig = {
  title: "The Twinkling Eye",
  description: "Personal Brand & Blog",
  charset: "UTF-8",
  viewport: "width=device-width, initial-scale=1",
  formatDetection: "telephone=no",

  // Contact information
  phone: "",
  email: "drallison20@gmail.com",

  // Content strings
  comingSoonMessage: "Website Coming Soon!",
  buttonText: "EMAIL",

  // Alt text for images
  logoAltText: "The twinkling eye logo",
  backgroundAltText:
    "decorative two toned yellow background with various flora and fauna depicted with a cream color card",

  // Meta tags
  generator: "Astro",

  // Social media (empty by default)
  socialMedia: {
    twitter: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  },
};

// Function to get site settings from Sanity with fallbacks
export async function getSiteConfig() {
  try {
    // Only attempt to fetch from Sanity if environment variables are set
    if (!import.meta.env.PUBLIC_SANITY_PROJECT_ID) {
      console.warn("Sanity not configured, using default site config");
      return defaultSiteConfig;
    }

    const sanitySettings = await client.fetch<SiteSettings>(
      queries.siteSettings
    );

    if (!sanitySettings) {
      console.warn("No site settings found in Sanity, using defaults");
      return defaultSiteConfig;
    }

    // Merge Sanity data with defaults
    return {
      ...defaultSiteConfig,
      title: sanitySettings.title || defaultSiteConfig.title,
      description: sanitySettings.description || defaultSiteConfig.description,
      charset: sanitySettings.charset || defaultSiteConfig.charset,
      viewport: sanitySettings.viewport || defaultSiteConfig.viewport,
      formatDetection:
        sanitySettings.formatDetection || defaultSiteConfig.formatDetection,
      socialMedia: {
        twitter: sanitySettings.socialMedia?.twitter || "",
        instagram: sanitySettings.socialMedia?.instagram || "",
        facebook: sanitySettings.socialMedia?.facebook || "",
        linkedin: sanitySettings.socialMedia?.linkedin || "",
      },
      sanityData: sanitySettings, // Include raw Sanity data for components that need it
    };
  } catch (error) {
    console.error("Error fetching site settings from Sanity:", error);
    return defaultSiteConfig;
  }
}

// Synchronous version for components that can't use async
export const siteConfig = defaultSiteConfig;

// Helper function to check if Sanity is configured
export function isSanityConfigured(): boolean {
  return !!(
    import.meta.env.PUBLIC_SANITY_PROJECT_ID &&
    import.meta.env.PUBLIC_SANITY_DATASET
  );
}
