<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title"/> - RSS Feed</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          @font-face {
            font-family: "Malibu Sunday Serif";
            src: url("/fonts/malibu-sunday/MalibuSunday-Serif.woff2") format("woff2"),
                 url("/fonts/malibu-sunday/MalibuSunday-Serif.woff") format("woff");
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: "Averia Serif";
            src: url("/fonts/averia-serif/AveriaSerifLibre-Regular.ttf") format("truetype");
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: "Averia Serif";
            src: url("/fonts/averia-serif/AveriaSerifLibre-Bold.ttf") format("truetype");
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }

          :root {
            --font-header-primary: "Malibu Sunday Serif", serif;
            --font-body: "Averia Serif", serif;
            --color-burgundy-deep: #461121;
            --color-burgundy-brown: #3d2b1e;
            --color-pink-rose: #ec87a5;
            --color-pink-light: #f8d3de;
            --color-yellow-bright: #fbc200;
            --color-cream-warm: #f8f0e5;
            --color-brown-warm: #a37351;
            --color-yellow-golden: #e8d461;
          }

          body {
            font-family: var(--font-body);
            background-image: url('/background.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            color: var(--color-burgundy-brown);
            margin: 0;
            padding: 2rem 0;
            line-height: 1.6;
            position: relative;
            min-height: 100vh;
          }


          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          header {
            text-align: center;
            margin-bottom: 3rem;
          }

          h1 {
            font-family: var(--font-header-primary);
            font-size: 3rem;
            color: var(--color-burgundy-deep);
            margin-bottom: 1rem;
          }

          .subtitle {
            font-family: var(--font-body);
            color: var(--color-burgundy-brown);
            font-size: 1.1rem;
          }

          .rss-info {
            margin-bottom: 3rem;
          }

          h2 {
            font-family: var(--font-header-primary);
            color: var(--color-burgundy-deep);
            font-size: 1.8rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid var(--color-pink-rose);
            padding-bottom: 0.5rem;
          }

          .rss-info p {
            font-family: var(--font-body);
            color: var(--color-burgundy-brown);
            font-size: 1rem;
            line-height: 1.6;
          }

          .rss-info a {
            color: var(--color-burgundy-deep);
            text-decoration: none;
            font-weight: 600;
          }

          .rss-info a:hover {
            text-decoration: underline;
          }

          .feed-items {
            margin-bottom: 3rem;
          }

          .feed-item {
            margin-bottom: 0.75rem;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
          }

          .feed-item h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
          }

          .feed-item h3 a {
            color: var(--color-burgundy-deep);
            text-decoration: none;
            font-family: var(--font-body);
            font-weight: 500;
          }

          .feed-item h3 a:hover {
            text-decoration: underline;
          }

          .feed-meta {
            font-size: 0.9rem;
            color: var(--color-brown-warm);
            margin-bottom: 0.25rem;
          }

          .feed-description {
            color: var(--color-burgundy-brown);
            font-size: 0.95rem;
            line-height: 1.5;
          }

          .categories {
            margin-top: 0.25rem;
          }

          .category-tag {
            background: var(--color-yellow-golden);
            color: var(--color-burgundy-deep);
            padding: 0.1rem 0.4rem;
            border-radius: 8px;
            font-size: 0.8rem;
            margin-right: 0.25rem;
          }

          .footer {
            text-align: center;
            margin-top: 3rem;
          }

          .footer a {
            color: var(--color-burgundy-deep);
            text-decoration: none;
            font-weight: 600;
            margin: 0 1rem;
          }

          .footer a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            body {
              padding: 1rem 0;
            }
            
            .container {
              padding: 0 1rem;
            }
            
            h1 {
              font-size: 2rem;
            }
            
            h2 {
              font-size: 1.4rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1><xsl:value-of select="rss/channel/title"/></h1>
            <p class="subtitle"><xsl:value-of select="rss/channel/description"/></p>
          </header>

          <section class="rss-info">
            <h2>📡 RSS Feed</h2>
            <p>This is an RSS feed. Subscribe by copying the URL from the address bar into your RSS reader. Visit <a href="https://aboutfeeds.com">aboutfeeds.com</a> to learn more about RSS feeds and how to use them.</p>
          </section>

          <section class="feed-items">
            <h2>Recent Posts</h2>
            <xsl:for-each select="rss/channel/item">
              <div class="feed-item">
                <h3>
                  <a href="{link}" target="_blank">
                    📄 <xsl:value-of select="title"/>
                  </a>
                </h3>
                <div class="feed-meta">
                  <xsl:value-of select="pubDate"/>
                  <xsl:if test="author"> • By: <xsl:value-of select="author"/></xsl:if>
                </div>
                <div class="feed-description">
                  <xsl:value-of select="description"/>
                </div>
                <xsl:if test="category">
                  <div class="categories">
                    <xsl:for-each select="category">
                      <span class="category-tag"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </div>
            </xsl:for-each>
          </section>

          <footer class="footer">
            <p>
              <a href="{rss/channel/link}">← Back to The Twinkling Eye</a>
              <a href="/sitemap">View Sitemap</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>