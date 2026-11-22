const SOURCES = [
  { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "DW World", url: "https://rss.dw.com/rdf/rss-en-world" }
];
function decode(value) {
  return String(value || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
}
function tag(block, name) {
  const match = block.match(new RegExp("<(?:[\\w-]+:)?" + name + "\\b[^>]*>([\\s\\S]*?)<\\/(?:[\\w-]+:)?" + name + ">", "i"));
  return match ? decode(match[1]).replace(/<[^>]+>/g, "").trim() : "";
}
function extractLink(block) {
  // RSS 2.0 commonly uses a plain-text <link> element without a closing tag.
  const textLink = block.match(/<link\b[^>]*>\s*([^<\s][^<]*?)\s*(?:<\/link\s*>|(?=<))/i);
  if (textLink) return decode(textLink[1]).trim();
  // Atom-style feeds may encode the URL in an href attribute.
  const hrefLink = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i);
  return hrefLink ? decode(hrefLink[1]).trim() : "";
}
function parseItems(xml, source) {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return blocks.map(block => ({
    source,
    title: tag(block, "title"),
    link: extractLink(block),
    description: tag(block, "description").slice(0, 360),
    publishedAt: tag(block, "pubDate")
  })).filter(item => item.title && /^https:\/\//i.test(item.link));
}
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=1800");
  const results = await Promise.all(SOURCES.map(async source => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(source.url, {
        signal: controller.signal,
        headers: { "User-Agent": "TITAN-AI-World-Updates/1.0" }
      });
      if (!response.ok) throw new Error("Feed unavailable");
      const xml = await response.text();
      return parseItems(xml, source.name);
    } catch (error) {
      console.warn("World Updates feed unavailable:", source.name, error.message);
      return [];
    } finally {
      clearTimeout(timer);
    }
  }));
  const items = results.flat().sort((a, b) => {
    const da = Date.parse(a.publishedAt) || 0;
    const db = Date.parse(b.publishedAt) || 0;
    return db - da;
  }).slice(0, 30);
  return res.status(200).json({
    items,
    updatedAt: new Date().toISOString(),
    sources: SOURCES.map(source => source.name)
  });
}
