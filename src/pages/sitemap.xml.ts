import { client, queries } from "../lib/sanity";
import type { BlogPost, InterviewPreview } from "../types/sanity";

export async function GET(context: any) {
  try {
    const baseUrl = context.site || "https://thetwinklingeye.com";

    // Fetch all blog posts and interviews
    const [blogPosts, interviews] = await Promise.all([
      client.fetch<BlogPost[]>(queries.allBlogPosts),
      client.fetch<InterviewPreview[]>(queries.allInterviews),
    ]);

    // Static pages
    const staticPages = [
      {
        url: "",
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "1.0",
      },
      {
        url: "/deep-dives",
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "0.9",
      },
      {
        url: "/interviews",
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "0.9",
      },
      {
        url: "/contact",
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: "0.7",
      },
      {
        url: "/about",
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: "0.8",
      },
    ];

    // Dynamic blog post pages
    const blogPages = blogPosts.map((post) => ({
      url: `/deep-dives/${post.slug.current}`,
      lastmod: new Date(post._updatedAt || post.publishedAt).toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    }));

    // Dynamic interview pages
    const interviewPages = interviews.map((interview) => ({
      url: `/interviews/${interview.slug.current}`,
      lastmod: new Date(interview.publishedAt).toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    }));

    // Combine all pages
    const allPages = [...staticPages, ...blogPages, ...interviewPages];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
