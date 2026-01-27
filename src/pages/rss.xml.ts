import rss from "@astrojs/rss";
import { client, queries } from "../lib/sanity";
import type { BlogPost, InterviewPreview } from "../types/sanity";
import { getSiteConfig } from "../lib/siteConfig";

export async function GET(context: any) {
  try {
    // Get site configuration
    const siteConfig = await getSiteConfig();

    // Fetch blog posts and interviews
    const [blogPosts, interviews] = await Promise.all([
      client.fetch<BlogPost[]>(queries.allBlogPosts),
      client.fetch<InterviewPreview[]>(queries.allInterviews),
    ]);

    // Combine and sort all content by date
    const allContent = [
      ...blogPosts.map((post) => ({
        title: post.title,
        description: post.excerpt || `Read the latest blog post: ${post.title}`,
        link: `/blog/${post.slug.current}`,
        pubDate: new Date(post.publishedAt),
        author: post.author?.name || "The Twinkling Eye",
        categories: post.categories?.map((cat) => cat.title) || [],
        type: "blog",
      })),
      ...interviews.map((interview) => ({
        title: interview.title,
        description:
          interview.excerpt ||
          `Watch our interview with ${interview.guest.name}`,
        link: `/interviews/${interview.slug.current}`,
        pubDate: new Date(interview.publishedAt),
        author: "The Twinkling Eye",
        categories: ["Interview"],
        type: "interview",
      })),
    ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

    return rss({
      title: siteConfig.title,
      description: siteConfig.description,
      site: context.site || "https://thetwinklingeye.com",
      stylesheet: "/rss/styles.xsl",
      items: allContent.map((item) => ({
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: item.pubDate,
        author: item.author,
        categories: item.categories,
      })),
      customData: `<language>en-us</language>
<managingEditor>hello@thetwinklingeye.com (The Twinkling Eye)</managingEditor>
<webMaster>hello@thetwinklingeye.com (The Twinkling Eye)</webMaster>
<copyright>Copyright ${new Date().getFullYear()} The Twinkling Eye</copyright>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<ttl>60</ttl>`,
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
