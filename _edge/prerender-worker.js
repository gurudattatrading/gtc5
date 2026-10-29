/**
 * Cloudflare Worker integration for Prerender.io.
 *
 * This does not crawl or submit URLs. It returns a rendered HTML snapshot
 * when a supported search/AI crawler requests a URL. Human visitors continue
 * to GitHub Pages unchanged.
 */
const BOT_UA = /googlebot|bingbot|yahoo|baiduspider|yandex|duckduckbot|applebot|googleother|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-web|anthropic-ai|perplexitybot|perplexity-user|ccbot|bytespider|cohere-ai|amazonbot|meta-externalagent|facebookexternalhit|twitterbot|linkedinbot|slackbot|redditbot|pinterest|whatsapp|embedly|quora link preview/i;

const STATIC_FILE = /\.(?:avif|css|csv|eot|gif|ico|jpe?g|js|json|map|mp[34]|pdf|png|svg|ttf|webm|webp|woff2?)$/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only render public HTML page requests. Never send assets to Prerender.
    if (request.method !== "GET") return fetch(request);
    if (url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml") {
      return fetch(request);
    }
    if (STATIC_FILE.test(url.pathname)) return fetch(request);

    // Avoid loops if a request is explicitly marked by Prerender.
    const prerenderHeader = (request.headers.get("X-Prerender") || "").toLowerCase();
    if (prerenderHeader === "1" || prerenderHeader === "true") return fetch(request);

    const userAgent = request.headers.get("User-Agent") || "";
    if (!BOT_UA.test(userAgent)) return fetch(request);

    // Fail open: if the token isn't configured, keep the original site working.
    if (!env.PRERENDER_TOKEN) return fetch(request);

    const snapshotUrl = "https://service.prerender.io/" + url.href;
    return fetch(snapshotUrl, {
      method: "GET",
      headers: {
        "X-Prerender-Token": env.PRERENDER_TOKEN,
        "X-Prerender-Int-Type": "cloudflare-worker"
      }
    });
  }
};
