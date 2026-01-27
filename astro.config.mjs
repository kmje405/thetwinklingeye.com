import astroConsent from "astro-consent";
// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroConsent({
      siteName: "The Twinkling Eye",
      policyUrl: "https://thetwinklingeye.com/privacy-policy",
      title: "Cookie Consent",
      consent: {
        days: 365,
        storageKey: "twinkling-eye-consent",
      },
      categories: {
        analytics: true,
        marketing: true,
      },
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
