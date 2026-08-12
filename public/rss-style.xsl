<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" encoding="UTF-8" />

    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <title>Complexity Clarified — RSS Feed</title>

                <style>
                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        font-family:
                            -apple-system,
                            BlinkMacSystemFont,
                            "Segoe UI",
                            Roboto,
                            Helvetica,
                            Arial,
                            sans-serif;
                        color: #212529;
                        background: #f8f9fa;
                        line-height: 1.6;
                    }

                    a {
                        color: inherit;
                    }

                    .header {
                        background: #212529;
                        color: #ffffff;
                        padding: 4rem 1.5rem;
                    }

                    .container {
                        width: 100%;
                        max-width: 960px;
                        margin: 0 auto;
                    }

                    .site-name {
                        margin: 0 0 0.75rem 0;
                        font-size: 2.5rem;
                        line-height: 1.15;
                        font-weight: 700;
                        letter-spacing: -0.03em;
                    }

                    .site-description {
                        margin: 0;
                        max-width: 700px;
                        font-size: 1.1rem;
                        color: #ced4da;
                    }

                    main {
                        padding: 3rem 1.5rem 5rem;
                    }

                    .feed-intro {
                        margin-bottom: 2.5rem;
                    }

                    .feed-label {
                        margin: 0 0 0.5rem 0;
                        font-size: 0.8rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                        color: #6c757d;
                    }

                    .feed-title {
                        margin: 0 0 0.75rem 0;
                        font-size: 1.75rem;
                        line-height: 1.25;
                    }

                    .feed-explanation {
                        margin: 0;
                        max-width: 700px;
                        color: #495057;
                    }

                    .feed-url {
                        margin-top: 1.25rem;
                        padding: 1rem 1.25rem;
                        background: #ffffff;
                        border: 1px solid #dee2e6;
                        border-radius: 0.75rem;
                        font-family:
                            SFMono-Regular,
                            Menlo,
                            Monaco,
                            Consolas,
                            "Liberation Mono",
                            monospace;
                        font-size: 0.9rem;
                        overflow-wrap: anywhere;
                    }

                    .articles {
                        display: grid;
                        gap: 1rem;
                    }

                    .article {
                        display: block;
                        padding: 1.75rem;
                        background: #ffffff;
                        border: 1px solid #dee2e6;
                        border-radius: 1rem;
                        text-decoration: none;
                        transition:
                            transform 0.15s ease,
                            box-shadow 0.15s ease,
                            border-color 0.15s ease;
                    }

                    .article:hover {
                        transform: translateY(-2px);
                        border-color: #adb5bd;
                        box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.06);
                    }

                    .article-title {
                        margin: 0 0 0.75rem 0;
                        font-size: 1.35rem;
                        line-height: 1.3;
                        font-weight: 650;
                    }

                    .article-description {
                        margin: 0;
                        color: #495057;
                    }

                    .article-date {
                        display: block;
                        margin-top: 1rem;
                        font-size: 0.85rem;
                        color: #6c757d;
                    }

                    .read-more {
                        display: block;
                        margin-top: 0.75rem;
                        font-size: 0.9rem;
                        font-weight: 600;
                        color: #212529;
                    }

                    .footer {
                        padding: 2rem 1.5rem;
                        border-top: 1px solid #dee2e6;
                        background: #ffffff;
                        color: #6c757d;
                        font-size: 0.9rem;
                    }

                    .footer p {
                        margin: 0;
                    }

                    .footer a {
                        color: #212529;
                        font-weight: 600;
                        text-decoration: none;
                    }

                    .footer a:hover {
                        text-decoration: underline;
                    }

                    @media (max-width: 600px) {
                        .header {
                            padding-top: 3rem;
                            padding-bottom: 3rem;
                        }

                        .site-name {
                            font-size: 2rem;
                        }

                        main {
                            padding-top: 2rem;
                        }

                        .article {
                            padding: 1.4rem;
                        }
                    }
                </style>
            </head>

            <body>

                <header class="header">
                    <div class="container">

                        <h1 class="site-name">
                            Complexity Clarified
                        </h1>

                        <p class="site-description">
                            Ideas about decision-making, leadership, technology
                            and change for organisations navigating complexity.
                        </p>

                    </div>
                </header>

                <main>
                    <div class="container">

                        <section class="feed-intro">

                            <p class="feed-label">
                                RSS Feed
                            </p>

                            <h2 class="feed-title">
                                Subscribe to Complexity Clarified
                            </h2>

                            <p class="feed-explanation">
                                This is the RSS feed for Complexity Clarified.
                                Add the feed address below to your preferred RSS
                                reader to receive new articles when they are published.
                            </p>

                            <div class="feed-url">
                                https://complexityclarified.co.uk/rss.xml
                            </div>

                        </section>

                        <section class="articles">

                            <xsl:for-each select="/rss/channel/item">

                                <a class="article">
                                    <xsl:attribute name="href">
                                        <xsl:value-of select="link" />
                                    </xsl:attribute>

                                    <h2 class="article-title">
                                        <xsl:value-of select="title" />
                                    </h2>

                                    <p class="article-description">
                                        <xsl:value-of select="description" />
                                    </p>

                                    <span class="article-date">
                                        <xsl:value-of select="substring(pubDate, 6, 11)" />
                                    </span>

                                    <span class="read-more">
                                        Read article →
                                    </span>

                                </a>

                            </xsl:for-each>

                        </section>

                    </div>
                </main>

                <footer class="footer">
                    <div class="container">
                        <p>
                            <a href="https://complexityclarified.co.uk/">
                                Complexity Clarified
                            </a>
                            — Helping organisations navigate complexity.
                        </p>
                    </div>
                </footer>

            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>