import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'products.html');
const html = fs.readFileSync(sourcePath, 'utf8');
const marker = 'const CATS=';
const markerAt = html.indexOf(marker);
if (markerAt < 0) throw new Error('Could not find product data in products.html');
const start = html.indexOf('[', markerAt + marker.length);
let depth = 0, quote = '', escaped = false, lineComment = false, blockComment = false;
let end = -1;
for (let i = start; i < html.length; i++) {
  const c = html[i], next = html[i + 1];
  if (lineComment) { if (c === '\n') lineComment = false; continue; }
  if (blockComment) { if (c === '*' && next === '/') { blockComment = false; i++; } continue; }
  if (quote) {
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (c === quote) quote = '';
    continue;
  }
  if (c === '/' && next === '/') { lineComment = true; i++; continue; }
  if (c === '/' && next === '*') { blockComment = true; i++; continue; }
  if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
  if (c === '[') depth++;
  if (c === ']' && --depth === 0) { end = i + 1; break; }
}
if (end < 0) throw new Error('Could not parse product data array');
const literal = html.slice(start, end);
if (literal.includes('${')) throw new Error('Product data contains template expressions; refusing to evaluate it');
const categories = vm.runInNewContext(`(${literal})`, Object.create(null), {
  timeout: 1000,
  contextCodeGeneration: { strings: false, wasm: false },
});
if (!Array.isArray(categories) || categories.length === 0) throw new Error('Product data did not parse');

const base = 'https://industrialspringmanufacturer.com';
const imageBase = 'https://gurudattatradingcompany.co.in/admin/uploads/product/cat_pd_image/';
const slug = value => value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const imageUrl = value => !value ? '' : (/^(data:|https?:\/\/)/i.test(value) || value.includes('/') ? value : imageBase + encodeURI(value));
const plainText = value => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const sharedCss = `
:root{--ink:#10243a;--blue:#164f78;--orange:#f47721;--muted:#5e7080;--line:#dce5ec;--paper:#f6f8fa}
*{box-sizing:border-box}body{margin:0;color:var(--ink);font:16px/1.65 Arial,Helvetica,sans-serif;background:#fff}
a{color:var(--blue)}.top{background:#102b43;color:#fff;padding:14px max(20px,calc((100% - 1160px)/2));display:flex;align-items:center;justify-content:space-between;gap:22px;flex-wrap:wrap}.brand{color:#fff;text-decoration:none;font-weight:800;letter-spacing:.04em}.brand small{display:block;font-size:12px;font-weight:400;opacity:.8}.nav{display:flex;gap:18px;flex-wrap:wrap}.nav a{color:#fff;text-decoration:none;font-size:14px}.wrap{width:min(1120px,calc(100% - 36px));margin:28px auto 60px}.crumb{font-size:14px;color:var(--muted);margin-bottom:20px}.crumb a{text-decoration:none}.hero{background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:26px;margin-bottom:24px}.hero h1{margin:0 0 8px;font-size:clamp(26px,4vw,40px);line-height:1.15}.hero p{margin:0;color:var(--muted)}.detail{display:grid;grid-template-columns:minmax(240px, .85fr) minmax(0,1.15fr);gap:30px;align-items:start}.photo{background:var(--paper);border:1px solid var(--line);border-radius:16px;min-height:300px;display:grid;place-items:center;padding:18px}.photo img{max-width:100%;max-height:460px;object-fit:contain}.photo .fallback{font-size:64px}.tag{color:var(--orange);font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:.08em}.tagline{font-size:18px;color:var(--muted);margin:0 0 20px}.specs{border-collapse:collapse;width:100%;margin:20px 0}.specs td{padding:10px 12px;border-bottom:1px solid var(--line)}.specs td:first-child{font-weight:700;width:42%}.desc{margin:26px 0}.btn{display:inline-block;background:var(--orange);color:#fff;text-decoration:none;border-radius:8px;padding:11px 18px;font-weight:700}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.card{display:block;color:inherit;text-decoration:none;border:1px solid var(--line);border-radius:12px;padding:14px;background:#fff}.card:hover{border-color:var(--orange);box-shadow:0 8px 24px #10243a14}.card img{width:100%;height:170px;object-fit:contain;background:var(--paper);border-radius:8px}.card h2{font-size:17px;line-height:1.3}.card p{color:var(--muted);font-size:14px}.foot{background:#102b43;color:#dce5ec;padding:22px;text-align:center}.foot a{color:#fff}.footlinks{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin:8px 0}.foot small{opacity:.8}@media(max-width:720px){.detail{grid-template-columns:1fr}.top{align-items:flex-start}.nav{gap:12px}.photo{min-height:220px}}
`;
const nav = `<header class="top"><a class="brand" href="/"><span>GURUDATTA TRADING CO.</span><small>No.1 Compression · Mumbai, India</small></a><nav class="nav" aria-label="Main navigation"><a href="/">Home</a><a href="/calculator.html">Calculator</a><a href="/products.html">Products</a><a href="/reviews.html">Reviews</a><a href="/blog.html">Blog</a><a href="/contact.html">Contact</a></nav></header>`;
const footer = `<footer class="foot"><strong>GURUDATTA TRADING CO.</strong><div class="footlinks"><a href="/products.html">Products</a><a href="/calculator.html">Calculator</a><a href="/contact.html">Contact</a><a href="/privacypolicy.html">Privacy Policy</a></div><small>© 2026 Gurudatta Trading Co. · Mumbai, India</small></footer>`;
const shell = (title, description, canonical, body, jsonLd) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta name="robots" content="index,follow"><style>${sharedCss}</style><script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script></head><body>${nav}<main class="wrap">${body}</main>${footer}</body></html>`;
let productsWritten = 0;
for (const category of categories) {
  const categorySlug = slug(category.name);
  const categoryUrl = `${base}/products/${categorySlug}/`;
  const categoryDir = path.join(root, 'products', categorySlug);
  fs.mkdirSync(categoryDir, { recursive: true });
  const cards = category.products.map(product => {
    const productSlug = slug(product.name);
    const url = `/products/${categorySlug}/${productSlug}.html`;
    const img = imageUrl(product.img);
    return `<a class="card" href="${url}">${img ? `<img src="${esc(img)}" alt="${esc(product.name)}" loading="lazy">` : ''}<h2>${esc(product.name)}</h2><p>${esc(product.tagline || product.desc || '')}</p></a>`;
  }).join('');
  const catDesc = `Browse ${category.products.length} ${category.name} products from Gurudatta Trading Co., Mumbai. View specifications and request a custom quote.`;
  const catBody = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/products.html">Products</a> › ${esc(category.name)}</nav><section class="hero"><h1>${esc(category.name)} Products</h1><p>${esc(catDesc)}</p></section><section class="grid" aria-label="${esc(category.name)} product catalogue">${cards}</section>`;
  const catLd = {'@context':'https://schema.org','@type':'CollectionPage',name:`${category.name} Products`,description:catDesc,url:categoryUrl,mainEntity:{'@type':'ItemList',numberOfItems:category.products.length,itemListElement:category.products.map((p,i)=>({'@type':'ListItem',position:i+1,url:`${categoryUrl}${slug(p.name)}.html`,name:p.name}))}};
  fs.writeFileSync(path.join(categoryDir, 'index.html'), shell(`${category.name} Products | Gurudatta Trading Co.`, catDesc, categoryUrl, catBody, catLd));

  for (const product of category.products) {
    const productSlug = slug(product.name);
    const productUrl = `${base}/products/${categorySlug}/${productSlug}.html`;
    const img = imageUrl(product.img);
    const description = (plainText(product.tagline || product.desc) || `${product.name} from Gurudatta Trading Co., Mumbai.`).slice(0, 300);
    const specs = Array.isArray(product.specs) ? product.specs.map(([key,value])=>`<tr><td>${esc(key)}</td><td>${esc(value)}</td></tr>`).join('') : '';
    const image = img ? `<img src="${esc(img)}" alt="${esc(product.name)}" loading="eager">` : `<span class="fallback" aria-hidden="true">🔩</span>`;
    const descHtml = product.desc ? `<section class="desc">${product.desc}</section>` : '';
    const body = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/products.html">Products</a> › <a href="/products/${categorySlug}/">${esc(category.name)}</a> › ${esc(product.name)}</nav><article><div class="detail"><div class="photo">${image}</div><div><div class="tag">${esc(category.name)}</div><h1>${esc(product.name)}</h1><p class="tagline">${esc(product.tagline || description)}</p>${specs ? `<table class="specs"><tbody>${specs}</tbody></table>` : ''}<a class="btn" href="/contact.html">Request a quote</a></div></div>${descHtml}<section><h2>More ${esc(category.name)} products</h2><a href="/products/${categorySlug}/">Browse the full ${esc(category.name)} catalogue</a></section></article>`;
    const productLd = {'@context':'https://schema.org','@type':'WebPage',name:product.name,description,url:productUrl,about:{'@type':'Thing',name:product.name}};
    fs.writeFileSync(path.join(categoryDir, `${productSlug}.html`), shell(`${product.name} | Gurudatta Trading Co.`, description, productUrl, body, productLd));
    productsWritten++;
  }
}
const sitemapPath = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = fs.readFileSync(sitemapPath, 'utf8').replace(/<url>[\s\S]*?<\/url>/g, block => {
    if (!/<loc>https:\/\/industrialspringmanufacturer\.com\/products(?:\.html|\/)/.test(block)) return block;
    if (/<lastmod>/.test(block)) return block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`);
    return block.replace('</url>', `<lastmod>${today}</lastmod></url>`);
  });
  fs.writeFileSync(sitemapPath, sitemap);
}
console.log(`Generated ${categories.length} category pages and ${productsWritten} product pages.`);
