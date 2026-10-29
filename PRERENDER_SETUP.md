# Prerender.io integration (not active until configured)

The website already serves most product pages as static HTML. This optional
Cloudflare Worker sends supported search/AI crawler requests for the JavaScript-rendered
`/products.html` catalogue shell to Prerender.io. Static product URLs and legacy
query-string URLs pass through to GitHub Pages unchanged.

## Before deploying

1. Create a Prerender.io account and copy its token.
2. The domain must be added to Cloudflare DNS and proxied through Cloudflare.
   If you currently use another DNS provider, do not change nameservers until
   all existing DNS records (including email/MX records) are copied correctly.
3. In the GitHub repository, open Settings -> Secrets and variables -> Actions
   and add these repository secrets:
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
   - PRERENDER_TOKEN
4. The Cloudflare API token needs permission to deploy Workers and manage
   Worker Routes for the industrialspringmanufacturer.com zone.
5. Open Actions -> Deploy Prerender.io Worker -> Run workflow.

## Important

- Do not paste the Prerender or Cloudflare tokens into source code, issues, or chat.
- This integration does not submit URLs to Google or AI providers. Sitemap and
  internal links help crawlers discover pages; Prerender supplies rendered HTML
  when eligible crawlers request pages.
- It does not guarantee that Google will index a page or that an AI provider will
  use the page.
- If the domain is not on Cloudflare, the Worker route cannot become active until
  DNS/zone setup is completed.
- Rollback: disable/remove the Worker Routes in Cloudflare and delete the Worker.
