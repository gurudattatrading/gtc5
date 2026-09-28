import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
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
const WA = '918454995315';
const slug = value => value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const imageUrl = value => !value ? '' : (/^(data:|https?:\/\/)/i.test(value) || value.includes('/') ? value : imageBase + encodeURI(value));
const absImage = value => { const u = imageUrl(value); return u.startsWith('/') ? base + u : (u.includes('gurudattatradingcompany.co.in') || !u ? base + '/logo.jpg' : u); };
const plainText = value => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s, n) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';

const catIntro = {
  'steel-spring': 'Steel springs for industrial and engineering use — compression, extension and torsion designs in mild steel and stainless steel, supplied from stock or made to your drawing.',
  'industrial-springs': 'Industrial springs for machinery, automotive, fabrication and OEM applications, in compression, extension, torsion and specialty forms.',
  'steel-hook': 'Steel hooks and S-hooks in mild steel and stainless steel for hanging, fastening, tensioning and general fabrication use.',
  'circlips': 'Circlips and snap rings that retain components on shafts and inside bores, in standard and stainless steel variants.',
  'dowel-pin': 'Dowel pins for accurate alignment and location of machine parts, tooling and assemblies.',
  'wire-form': 'Wire forms and custom-bent wire components made to your sample or drawing.',
  'coil-spring': 'Coil springs for cushioning, suspension and load-bearing uses, made in a range of wire sizes and materials.',
  'mechanical-shaft-seals': 'Mechanical shaft seals and sealing components that help prevent leakage along rotating shafts in pumps and machinery.',
  'compression-spring': 'Compression springs resist a pushing force and return to their original length — used in valves, machinery, mattresses and cushioning.',
  'torsion-spring': 'Torsion springs store and release rotational force — used in hinges, clips and lever mechanisms.',
  'steel-pin': 'Steel pins for fastening, locating and pivot uses in assemblies.',
  'r-pin': 'R-pins (R-clips) are quick-fit retaining pins used to secure shafts, pins and fittings.',
  'locking-items': 'Locking items and retaining hardware that keep assemblies secure.',
  'spring-seal': 'Spring-energised seals that maintain sealing contact under pressure.',
  'die-spring': 'Die springs are heavy-duty rectangular-wire compression springs used in tooling, dies, moulds and press applications.',
  'spiral-spring': 'Spiral (clock-type) flat springs that release stored energy gradually — used in timers, clocks and retractable mechanisms.',
  'tension-spring': 'Tension (extension) springs resist a pulling force and pull back to their original length — used in trampolines, garage doors and trigger mechanisms.',
};

const sharedCss = `
:root{--bg:#0a0a0f;--surface:#111118;--card:#16161f;--border:#252535;--text:#e8e8f0;--muted:#9a9ab0;--P:#ff6b00;--Pd:#e55a00;--navy2:#0d1535;--tm:rgba(255,255,255,.6)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:'Inter',Arial,sans-serif;line-height:1.65;min-height:100vh}
a{color:var(--P)}h1,h2,h3{font-family:'Rajdhani','Montserrat',Arial,sans-serif;line-height:1.2}
nav.top{background:var(--navy2);border-bottom:1px solid rgba(255,255,255,.1);position:sticky;top:0;z-index:50;box-shadow:0 2px 20px rgba(0,0,0,.4)}
.nav-in{max-width:1200px;margin:0 auto;padding:8px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#fff;font:700 14px 'Montserrat',Arial,sans-serif}
.logo img{width:42px;height:42px;border-radius:50%;background:#fff;object-fit:cover}.logo small{display:block;font-size:10px;font-weight:400;color:var(--tm)}
.links{display:flex;align-items:center;gap:2px;flex-wrap:wrap}.links a{color:var(--tm);text-decoration:none;font-size:13px;font-weight:500;padding:6px 12px;border-radius:6px}
.links a:hover{color:#fff;background:rgba(255,255,255,.07)}.links a.act{color:var(--P);background:rgba(255,107,0,.1)}
.links a.wa{background:var(--P);color:#fff;font-weight:700;border-radius:20px;margin-left:6px}
.wrap{max-width:1200px;margin:0 auto;padding:26px 20px 60px}
.crumb{font-size:13px;color:var(--muted);margin-bottom:22px}.crumb a{color:var(--muted);text-decoration:none}.crumb a:hover{color:#fff}.crumb b{color:#fff;font-weight:600}
.hero{background:linear-gradient(135deg,#111118,#1a1208);border:1px solid var(--border);border-radius:16px;padding:28px;margin-bottom:26px}
.hero h1{font-size:clamp(28px,4vw,42px);color:#fff;margin-bottom:8px}.hero p{color:var(--muted);max-width:820px}.eyebrow{color:var(--P);font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.detail{display:grid;grid-template-columns:minmax(260px,.9fr) minmax(0,1.1fr);gap:34px;align-items:start}
.photo{background:#fff;border-radius:16px;min-height:300px;display:grid;place-items:center;padding:18px}.photo img{max-width:100%;max-height:480px;object-fit:contain}.photo .fallback{font-size:64px}
.info h1{font-size:clamp(28px,4vw,40px);color:#fff;margin:6px 0 10px}.tagline{color:var(--muted);font-size:17px;margin-bottom:18px}
.specs{border-collapse:collapse;width:100%;margin:18px 0}.specs td{padding:11px 10px;border-bottom:1px solid var(--border)}.specs td:first-child{color:var(--muted);width:42%}.specs td:last-child{font-weight:600;color:#fff}
.btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.btn{display:inline-flex;align-items:center;gap:8px;background:var(--P);color:#fff;text-decoration:none;border-radius:8px;padding:12px 20px;font-weight:700}
.btn:hover{background:var(--Pd)}.btn.wa{background:#22c55e}.btn.wa:hover{background:#16a34a}
.sec{margin-top:38px}.sec h2{font-size:26px;color:#fff;margin-bottom:12px}.desc h3{font-size:19px;color:#fff;margin:16px 0 6px}.desc p,.desc li{color:#c9c9d8}.desc ul,.trust ul{margin:8px 0 0 20px}
.trust{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px}.trust li{margin:6px 0;color:#c9c9d8}
.faq details{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:10px}.faq summary{cursor:pointer;font-weight:700;color:#fff}.faq p{margin-top:8px;color:#c9c9d8}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px}
.card{display:block;color:inherit;text-decoration:none;border:1px solid var(--border);border-radius:12px;overflow:hidden;background:var(--card)}
.card:hover{border-color:var(--P);transform:translateY(-2px)}.card img,.card .ph{width:100%;height:190px;object-fit:contain;background:#fff;display:grid;place-items:center;font-size:13px;color:#555}.card .ph{font-size:44px}
.card div.b{padding:12px 14px}.card h2,.card h3{font-size:17px;color:#fff;margin-bottom:4px}.card p{color:var(--muted);font-size:13px}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chips a{border:1px solid var(--border);border-radius:20px;padding:6px 14px;font-size:13px;color:var(--text);text-decoration:none;background:var(--card)}.chips a:hover{border-color:var(--P);color:var(--P)}
footer.foot{background:var(--navy2);border-top:1px solid rgba(255,255,255,.1);padding:24px 20px;text-align:center;color:var(--tm);font-size:13px}
footer.foot a{color:#fff;text-decoration:none;margin:0 9px}footer.foot .fl{margin:8px 0}
@media(max-width:760px){.detail{grid-template-columns:1fr}.nav-in{justify-content:center}}
`;
const fontLinks = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Montserrat:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;
const nav = `<nav class="top" aria-label="Main navigation"><div class="nav-in"><a class="logo" href="/"><img src="/logo.jpg" alt="Gurudatta Trading Co. logo" width="42" height="42"><span>GURUDATTA TRADING CO.<small>No.1 Compression · Mumbai, India</small></span></a><div class="links"><a href="/">🏠 Home</a><a href="/calculator.html">⚙️ Calculator</a><a href="/products.html" class="act">🔩 Products</a><a href="/reviews.html">⭐ Reviews</a><a href="/blog.html">📝 Blog</a><a href="/contact.html">📞 Contact</a><a class="wa" href="https://wa.me/${WA}" target="_blank" rel="noopener">📱 WhatsApp</a></div></div></nav>`;
const footer = `<footer class="foot"><strong style="color:#fff">GURUDATTA TRADING CO.</strong><div class="fl"><a href="/products.html">Products</a><a href="/calculator.html">Calculator</a><a href="/blog.html">Blog</a><a href="/guides/spring-wire-gauge-swg-chart.html">SWG Chart</a><a href="/guides/spring-rate-formula-compression-spring.html">Spring Rate Formula</a><a href="/guides/how-to-measure-a-spring.html">Measure a Spring</a><a href="/contact.html">Contact</a><a href="/sitemap.html">Site Map</a><a href="/privacypolicy.html">Privacy Policy</a></div><div>© 2026 Gurudatta Trading Co. · Spring Manufacturer &amp; Supplier, Mumbai, India</div></footer>`;

const shell = ({ title, description, canonical, body, jsonLd, image, robots = 'index,follow,max-image-preview:large' }) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}"><meta name="robots" content="${robots}"><meta name="theme-color" content="#0d1535"><link rel="icon" href="/logo.jpg"><meta property="og:type" content="website"><meta property="og:site_name" content="Gurudatta Trading Co."><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(image || base + '/logo.jpg')}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image || base + '/logo.jpg')}">${fontLinks}<style>${sharedCss}</style>${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>` : ''}</head><body>${nav}<main class="wrap">${body}</main>${footer}</body></html>`;

const orgLd = { '@type': ['Organization','LocalBusiness'], '@id': base + '/#business', name: 'Gurudatta Trading Co.', url: base + '/', logo: base + '/logo.jpg', telephone: '+91 84549 95315', email: 'connect.gtc5@gmail.com', foundingDate: '2000', sameAs: ["https://www.indiamart.com/gurudattatradingco/", "https://www.exportersindia.com/gurudattatradingco/", "https://www.youtube.com/@GURUDATTATRADINGCOMPANY-n1e", "https://share.google/o4efhslVwgSXRJ4IE", "https://in.linkedin.com/in/gurudatta-trading-company-49b166136", "https://www.tradeindia.com/gurudatta-trading-company-103372649/"], areaServed: 'IN', address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' } };
const crumbLd = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })) });
const categoryChips = current => `<div class="chips">${categories.filter(c => slug(c.name) !== current).map(c => `<a href="/products/${slug(c.name)}/">${esc(c.name)}</a>`).join('')}</div>`;
const cardHtml = (categorySlug, product, tag = 'h2') => {
  const img = imageUrl(product.img);
  return `<a class="card" href="/products/${categorySlug}/${slug(product.name)}.html">${img ? `<img src="${esc(img)}" alt="${esc(product.name)}" loading="lazy" width="230" height="190" referrerpolicy="no-referrer">` : '<div class="ph">🔩</div>'}<div class="b"><${tag}>${esc(product.name)}</${tag}><p>${esc(clip(plainText(product.tagline || product.desc || ''), 90))}</p></div></a>`;
};

let productsWritten = 0;
for (const category of categories) {
  const categorySlug = slug(category.name);
  const categoryUrl = `${base}/products/${categorySlug}/`;
  const categoryDir = path.join(root, 'products', categorySlug);
  fs.mkdirSync(categoryDir, { recursive: true });
  const intro = catIntro[categorySlug] || `Browse our ${category.name} range.`;
  const catDesc = clip(`${category.name} manufacturer & supplier in Mumbai — ${category.products.length} products. ${intro} ISO 9001:2015, PAN India delivery. Get a quote.`, 158);
  const catFaq = [
    [`Do you make custom ${category.name.toLowerCase()} products?`, `Yes. Gurudatta Trading Co. makes to your drawing, sample or working parameters, and also supplies standard sizes from stock. Share your requirement on WhatsApp (+91 84549 95315) for a quote.`],
    [`Do you deliver ${category.name.toLowerCase()} across India?`, `Yes — we deliver PAN India from Mumbai, and we are IEC registered for export enquiries.`],
    [`How quickly can I get a quote?`, `Typically within 24 hours by WhatsApp, email (connect.gtc5@gmail.com) or phone.`],
  ];
  const catBody = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/products.html">Products</a> › <b>${esc(category.name)}</b></nav><section class="hero"><div class="eyebrow">Product category</div><h1>${esc(category.name)} Manufacturer &amp; Supplier in Mumbai</h1><p>${esc(intro)} Gurudatta Trading Co. has been manufacturing and supplying since 2000, with ISO 9001:2015 quality management and PAN India delivery.</p><div class="btns"><a class="btn" href="/contact.html">📞 Enquire Now</a><a class="btn wa" href="https://wa.me/${WA}?text=${encodeURIComponent('Hi, I am interested in ' + category.name)}" target="_blank" rel="noopener">WhatsApp Quote</a></div></section><section class="grid" aria-label="${esc(category.name)} product catalogue">${category.products.map(p => cardHtml(categorySlug, p)).join('')}</section><section class="sec faq"><h2>${esc(category.name)} — FAQs</h2>${catFaq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section><section class="sec"><h2>Explore other product categories</h2>${categoryChips(categorySlug)}</section>`;
  const catLd = { '@context': 'https://schema.org', '@graph': [ orgLd,
    { '@type': 'CollectionPage', name: `${category.name} Products`, description: catDesc, url: categoryUrl, isPartOf: { '@type': 'WebSite', name: 'Gurudatta Trading Co.', url: base + '/' },
      mainEntity: { '@type': 'ItemList', numberOfItems: category.products.length, itemListElement: category.products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${categoryUrl}${slug(p.name)}.html`, name: p.name })) } },
    crumbLd([['Home', base + '/'], ['Products', base + '/products.html'], [category.name, categoryUrl]]),
    { '@type': 'FAQPage', mainEntity: catFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] };
  fs.writeFileSync(path.join(categoryDir, 'index.html'), shell({ title: clip(`${category.name} Manufacturer & Supplier Mumbai | Gurudatta Trading`, 65), description: catDesc, canonical: categoryUrl, body: catBody, jsonLd: catLd, image: absImage(category.products[0]?.img) }));

  category.products.forEach((product, idx) => {
    const productSlug = slug(product.name);
    const productUrl = `${base}/products/${categorySlug}/${productSlug}.html`;
    const img = imageUrl(product.img);
    const tagline = plainText(product.tagline) || plainText(product.desc) || `${product.name} from Gurudatta Trading Co., Mumbai.`;
    const description = clip(`${tagline} Made in Mumbai by Gurudatta Trading Co. — ISO 9001:2015, PAN India delivery. Get a quote on WhatsApp.`, 158);
    const specsArr = Array.isArray(product.specs) ? product.specs : [];
    const specs = specsArr.map(([key, value]) => `<tr><td>${esc(key)}</td><td>${esc(value)}</td></tr>`).join('');
    const image = img ? `<img src="${esc(img)}" alt="${esc(product.name)}" width="460" height="460" loading="eager" referrerpolicy="no-referrer">` : `<span class="fallback" aria-hidden="true">🔩</span>`;
    const faq = [
      [`Can you make ${product.name} to my specification?`, `Yes. We manufacture to your drawing, sample or working parameters, and can also supply standard sizes from stock. Send details on WhatsApp (+91 84549 95315) or through the contact page.`],
      [`Do you deliver ${product.name} across India?`, `Yes, we deliver PAN India from Mumbai and are IEC registered for export enquiries.`],
      [`How do I get a quote for ${product.name}?`, `Tap “Enquire Now” or message us on WhatsApp. We typically respond within 24 hours.`],
    ];
    const related = [1, 2, 3, 4].map(k => category.products[(idx + k) % category.products.length]).filter((p, i, a) => p !== product && a.indexOf(p) === i);
    const body = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/products.html">Products</a> › <a href="/products/${categorySlug}/">${esc(category.name)}</a> › <b>${esc(product.name)}</b></nav>
<article><div class="detail"><div class="photo">${image}</div><div class="info"><div class="eyebrow">${esc(category.icon || '')} ${esc(category.name)}</div><h1>${esc(product.name)}</h1><p class="tagline">${esc(tagline)}</p>${specs ? `<table class="specs"><tbody>${specs}</tbody></table>` : ''}<div class="btns"><a class="btn" href="/contact.html">📞 Enquire Now</a><a class="btn wa" href="https://wa.me/${WA}?text=${encodeURIComponent('Hi, I am interested in ' + product.name)}" target="_blank" rel="noopener">WhatsApp</a></div></div></div>
${product.desc ? `<section class="sec desc"><h2>About ${esc(product.name)}</h2>${product.desc}</section>` : ''}
<section class="sec trust"><h2>Why buy from Gurudatta Trading Co.</h2><ul><li>Manufacturer in Mumbai, operating since 2000 (25+ years)</li><li>ISO 9001:2015 quality management · GST, IEC and Udyam registered</li><li>Made to your drawing or sample, or supplied from stock</li><li>PAN India delivery, with export enquiries welcome</li><li>Quote typically within 24 hours on WhatsApp, email or phone</li></ul></section>
<section class="sec faq"><h2>${esc(product.name)} — FAQs</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>
${related.length ? `<section class="sec"><h2>More ${esc(category.name)} products</h2><div class="grid">${related.map(p => cardHtml(categorySlug, p, 'h3')).join('')}</div><p style="margin-top:14px"><a href="/products/${categorySlug}/">Browse the full ${esc(category.name)} catalogue →</a></p></section>` : ''}
<section class="sec"><h2>Explore other categories</h2>${categoryChips(categorySlug)}</section></article>`;
    const productLd = { '@context': 'https://schema.org', '@graph': [ orgLd,
      { '@type': 'WebPage', name: product.name, description, url: productUrl, inLanguage: 'en-IN', primaryImageOfPage: { '@type': 'ImageObject', url: absImage(product.img) },
        about: { '@type': 'Thing', name: product.name, description: tagline }, isPartOf: { '@type': 'WebSite', name: 'Gurudatta Trading Co.', url: base + '/' } },
      crumbLd([['Home', base + '/'], ['Products', base + '/products.html'], [category.name, `${base}/products/${categorySlug}/`], [product.name, productUrl]]),
      { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ] };
    const t = `${product.name} Manufacturer in Mumbai | Gurudatta Trading Co.`;
    fs.writeFileSync(path.join(categoryDir, `${productSlug}.html`), shell({ title: t.length <= 70 ? t : `${product.name} | Gurudatta Trading Co., Mumbai`, description, canonical: productUrl, body, jsonLd: productLd, image: absImage(product.img) }));
    productsWritten++;
  });
}


// ---------- Guides (AEO/GEO: direct answers, tables, HowTo/FAQ/Article schema) ----------
const today = new Date().toISOString().slice(0, 10);
const swg = [[8,4.064],[9,3.658],[10,3.251],[11,2.945],[12,2.642],[13,2.337],[14,2.032],[15,1.829],[16,1.626],[17,1.422],[18,1.219],[19,1.016],[20,0.914],[21,0.813],[22,0.711],[23,0.610],[24,0.559],[25,0.508],[26,0.457],[27,0.417],[28,0.376],[29,0.345],[30,0.315]];
const G = 79300, d = 2, OD = 20, Na = 10, Dm = OD - d, k = G * d ** 4 / (8 * Dm ** 3 * Na), Hs = (Na + 2) * d;
const f2 = n => n.toFixed(2);
const cta = `<section class="sec trust"><h2>Need springs made to your specification?</h2><p>Gurudatta Trading Co. (Mumbai, since 2000, ISO 9001:2015) manufactures compression, extension and torsion springs to drawing or sample. Use the <a href="/calculator.html">free Spring Rate Calculator</a> or <a href="https://wa.me/${WA}" target="_blank" rel="noopener">message us on WhatsApp</a>.</p></section>`;
const guideList = [
 { file: 'spring-wire-gauge-swg-chart', title: 'Spring Wire Gauge (SWG) Chart: SWG to mm and inch', h1: 'Spring Wire Gauge (SWG) Chart — SWG to mm & inch',
   desc: 'Standard Wire Gauge (SWG) chart for spring wire: SWG 8 to 30 converted to millimetres and inches, with how to pick a wire diameter for springs.',
   answer: 'SWG (Standard Wire Gauge) is a wire-size scale where a higher number means thinner wire — for example SWG 14 is 2.032 mm (0.080 in) and SWG 20 is 0.914 mm (0.036 in).',
   body: `<div class="sec desc"><h2>SWG to mm and inch table</h2><div style="overflow-x:auto"><table class="specs"><thead><tr><td><b>SWG</b></td><td><b>mm</b></td><td><b>inch</b></td></tr></thead><tbody>${swg.map(([n, mm]) => `<tr><td>${n}</td><td>${mm.toFixed(3)}</td><td>${(mm / 25.4).toFixed(4)}</td></tr>`).join('')}</tbody></table></div><h2>How to use this chart for springs</h2><p>Spring drawings normally state wire diameter in mm. Measure the wire with a micrometer, then match it to the nearest SWG value above. Wire diameter directly controls spring stiffness: because rate depends on the fourth power of wire diameter, a small change in gauge changes load a lot. Check your design in our <a href="/calculator.html">spring rate calculator</a>.</p><p>SWG differs from AWG and Birmingham (BWG) gauges, so always confirm the gauge system, or better, state the diameter in millimetres.</p></div>${cta}`,
   faq: [['What is SWG 14 in mm?', 'SWG 14 is 2.032 mm (0.080 inch).'], ['Is a higher SWG number thicker or thinner?', 'Thinner. As the SWG number increases, wire diameter decreases.'], ['Is SWG the same as AWG?', 'No. SWG (British Standard Wire Gauge) and AWG (American Wire Gauge) use different diameters for the same number, so specify wire size in mm.']] },
 { file: 'spring-rate-formula-compression-spring', title: 'Compression Spring Rate Formula with Worked Example', h1: 'Compression Spring Rate Formula (with worked example)',
   desc: 'How to calculate compression spring rate: k = G·d⁴ / (8·D³·N). Worked example, spring index and solid height, plus a free online calculator.',
   answer: 'Compression spring rate is k = G·d⁴ / (8·D³·Na), where G is the shear modulus, d the wire diameter, D the mean coil diameter and Na the number of active coils.',
   body: `<div class="sec desc"><h2>The formula</h2><p><b>k = G · d⁴ / (8 · D³ · Na)</b></p><ul><li><b>k</b> — spring rate (N/mm)</li><li><b>G</b> — shear modulus of the wire (steel is about 79,300 MPa; check your material data)</li><li><b>d</b> — wire diameter (mm)</li><li><b>D</b> — mean coil diameter = outer diameter − d (mm)</li><li><b>Na</b> — active coils (total coils minus the end coils that do not deflect)</li></ul><h2>Worked example</h2><p>Steel spring, wire d = ${d} mm, outer diameter ${OD} mm, so D = ${Dm} mm, with ${Na} active coils:</p><p>k = ${G} × ${d}⁴ / (8 × ${Dm}³ × ${Na}) ≈ <b>${f2(k)} N/mm</b>. Force at 10 mm deflection ≈ ${f2(k * 10)} N.</p><p>Spring index C = D/d = ${Dm / d}. Springs with an index of roughly 4 to 12 are generally easier to manufacture consistently. With closed and ground ends, total coils = Na + 2 = ${Na + 2}, so solid height ≈ ${Na + 2} × ${d} = ${Hs} mm.</p><p>These are theoretical values; end conditions, tolerances and set removal affect real springs. For extension and torsion springs or exact stress checks, use the <a href="/calculator.html">free Spring Rate Calculator</a>.</p></div>${cta}`,
   faq: [['What is the formula for compression spring rate?', 'k = G·d⁴ / (8·D³·Na), with G the shear modulus, d wire diameter, D mean coil diameter and Na active coils.'], ['How do I calculate the mean coil diameter?', 'Mean diameter D equals the outer diameter minus the wire diameter.'], ['What is spring index?', 'Spring index C is mean coil diameter divided by wire diameter (D/d). A value of about 4 to 12 is common in practice.']] },
 { file: 'how-to-measure-a-spring', title: 'How to Measure a Spring (Wire Diameter, OD, Free Length, Coils)', h1: 'How to Measure a Spring for Replacement or a Quote',
   desc: 'Step-by-step guide to measure a compression, extension or torsion spring: wire diameter, outer diameter, free length, coil count, ends and winding direction.',
   answer: 'To measure a spring, record wire diameter, outer diameter, free length, number of coils, end type, winding direction and material — with these a manufacturer can quote or reproduce it.',
   steps: [['Measure wire diameter', 'Use a micrometer or vernier caliper on the bare wire, at two or three points, and average the readings.'], ['Measure outer diameter', 'Measure across the widest part of the coil. Inner diameter can be measured too if the spring runs over a rod.'], ['Measure free length', 'Measure the unloaded length of a compression spring; for an extension spring measure inside the hooks.'], ['Count the coils', 'Count total coils and note which end coils are closed or ground; active coils are the rest.'], ['Note ends, winding direction and material', 'Record end style (closed, ground, hooks, legs), left or right hand winding, and whether it is mild steel, stainless steel or music wire.'], ['Send the details', 'Send measurements plus photos and the load or working requirement to get a quote.']],
   body: '', faq: [['What measurements are needed to reorder a spring?', 'Wire diameter, outer diameter, free length, number of coils, end type, winding direction and material.'], ['Can I get a spring made from a sample?', 'Yes. Gurudatta Trading Co. can manufacture to a sample or drawing; share photos and measurements on WhatsApp.']] },
 { file: 'mild-steel-vs-stainless-steel-vs-music-wire-springs', title: 'Mild Steel vs Stainless Steel vs Music Wire Springs', h1: 'Mild Steel vs Stainless Steel vs Music Wire Springs — Which to Choose?',
   desc: 'Compare mild (carbon) steel, stainless steel and music wire springs: corrosion resistance, cost, strength and typical uses, with tips to choose the right spring material.',
   answer: 'Choose stainless steel when corrosion resistance matters, music wire for high strength and fatigue life in dry conditions, and mild (carbon) steel for the lowest cost in general machinery — usually with a protective coating.',
   body: `<div class="sec desc"><h2>Comparison</h2><div style="overflow-x:auto"><table class="specs"><thead><tr><td><b>Material</b></td><td><b>Corrosion resistance</b></td><td><b>Relative cost</b></td><td><b>Typical use</b></td></tr></thead><tbody><tr><td>Mild / carbon steel</td><td>Low — needs zinc, black oxide or paint</td><td>Lowest</td><td>General machinery, furniture, mattresses, cushioning</td></tr><tr><td>Stainless steel (302/304, 316)</td><td>High — 316 is better in chloride and marine conditions</td><td>Higher</td><td>Food, pharma, chemical, marine, outdoor</td></tr><tr><td>Music wire (high-carbon)</td><td>Low unless coated</td><td>Moderate</td><td>Precision, high-stress and fatigue duty, small springs</td></tr></tbody></table></div><h2>How to choose</h2><ul><li><b>Environment:</b> damp, washdown, food or chemical contact points to stainless steel.</li><li><b>Load and fatigue:</b> music wire generally gives higher strength and fatigue life than plain carbon steel for the same size.</li><li><b>Stiffness:</b> stainless steel has a lower shear modulus than carbon steel, so the same geometry gives a slightly lower spring rate — confirm in the <a href="/calculator.html">calculator</a>.</li><li><b>Temperature:</b> high or low temperatures may need special alloys; share the operating range when you enquire.</li><li><b>Budget:</b> carbon steel with a coating is often the most economical for dry, indoor use.</li></ul><p>These are general guidelines; exact properties depend on the grade and supplier, so confirm your requirement with us.</p></div>${cta}`,
   faq: [['Is stainless steel or mild steel better for springs?', 'Stainless steel resists corrosion, so it suits wet, food or chemical environments. Mild steel is cheaper but needs a protective coating.'], ['What is music wire used for in springs?', 'Music wire is high-carbon steel wire with high tensile strength, used for precision and high-stress springs in dry conditions.'], ['Does stainless steel give a softer spring?', 'For the same dimensions, stainless steel has a lower shear modulus than carbon steel, so the spring rate is a little lower.']] },
 { file: 'custom-spring-cost-and-quote-checklist', title: 'Custom Spring Cost in India: Price Factors and Quote Checklist', h1: 'Custom Spring Cost: What Affects the Price and What to Send for a Quote',
   desc: 'What drives the price of custom springs in India — material, wire size, quantity, tolerances, finishing — plus a checklist of details to send for a fast, accurate quote.',
   answer: 'Custom spring price depends mainly on wire material and size, spring type and complexity, quantity, tolerances and testing, and finishing — send full specifications to get an accurate quote.',
   body: `<div class="sec desc"><h2>What affects the price</h2><ul><li><b>Wire material and diameter:</b> stainless steel and thicker wire cost more than thin carbon steel wire.</li><li><b>Spring type and ends:</b> ground ends, hooks, legs and special forms add operations.</li><li><b>Quantity:</b> setup time is spread over more pieces in larger batches, so unit cost usually falls.</li><li><b>Tolerances and load testing:</b> tight tolerances or load-tested springs need more inspection.</li><li><b>Finishing:</b> zinc plating, powder coating, passivation or oiling add cost.</li><li><b>Packing and delivery:</b> location and packing needs influence the final quote.</li></ul><h2>Quote checklist</h2><ol style="margin:8px 0 0 22px"><li>Spring type (compression, extension, torsion or other)</li><li>Wire diameter, outer diameter, free length and number of coils — see <a href="/guides/how-to-measure-a-spring.html">how to measure a spring</a></li><li>Material and finish</li><li>Load or working requirement</li><li>Quantity and delivery location</li><li>Drawing, sample or photos</li></ol><p style="margin-top:10px">Gurudatta Trading Co. typically responds within 24 hours by WhatsApp, email or phone.</p></div>${cta}`,
   faq: [['How much does a custom spring cost?', 'It depends on material, wire size, spring type, quantity, tolerances and finish. Share your specification for an exact quote.'], ['What details do I need to send for a spring quote?', 'Spring type, wire diameter, outer diameter, free length, coil count, material, finish, load requirement, quantity and delivery location.'], ['Do you make springs in small quantities?', 'Yes. Gurudatta Trading Co. supplies from single prototype springs up to bulk industrial orders.']] },
];
const guideDir = path.join(root, 'guides');
fs.mkdirSync(guideDir, { recursive: true });
for (const gd of guideList) {
  const url = `${base}/guides/${gd.file}.html`;
  const stepsHtml = gd.steps ? `<div class="sec desc"><h2>Steps</h2><ol style="margin:8px 0 0 22px">${gd.steps.map(([n, t]) => `<li><b>${esc(n)}.</b> ${esc(t)}</li>`).join('')}</ol><p style="margin-top:12px">Then check the numbers in our <a href="/calculator.html">spring rate calculator</a>.</p></div>${cta}` : '';
  const body = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog.html">Guides</a> › <b>${esc(gd.h1)}</b></nav><section class="hero"><div class="eyebrow">Spring guide</div><h1>${esc(gd.h1)}</h1><p><b>Quick answer:</b> ${esc(gd.answer)}</p><p style="margin-top:10px;font-size:13px">By Gurudatta Trading Co., Mumbai · Updated ${today}</p></section>${gd.body}${stepsHtml}<section class="sec faq"><h2>FAQs</h2>${gd.faq.map(([q, a]) => `<details open><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section><section class="sec"><h2>Explore products</h2>${categoryChips('')}</section>`;
  const ld = { '@context': 'https://schema.org', '@graph': [ orgLd,
    { '@type': 'Article', headline: gd.h1, description: gd.desc, url, mainEntityOfPage: url, datePublished: today, dateModified: today, inLanguage: 'en-IN', author: { '@id': base + '/#business' }, publisher: { '@id': base + '/#business' } },
    crumbLd([['Home', base + '/'], ['Guides', base + '/blog.html'], [gd.h1, url]]),
    ...(gd.steps ? [{ '@type': 'HowTo', name: gd.h1, step: gd.steps.map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n, text: t })) }] : []),
    { '@type': 'FAQPage', mainEntity: gd.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } ] };
  fs.writeFileSync(path.join(guideDir, `${gd.file}.html`), shell({ title: clip(gd.title + ' | Gurudatta Trading', 66), description: gd.desc, canonical: url, body, jsonLd: ld }));
}
// llms-full.txt: complete catalogue in plain text for AI/answer engines
const llms = [`# Gurudatta Trading Co. — full catalogue`, `Mumbai-based spring manufacturer and supplier since 2000. ISO 9001:2015. PAN India delivery. WhatsApp +91 84549 95315, connect.gtc5@gmail.com. Site: ${base}/`, ``, `## Guides`, ...guideList.map(gd => `- ${gd.h1}: ${base}/guides/${gd.file}.html — ${gd.answer}`), ``, `## Products by category`];
for (const c of categories) { llms.push(``, `### ${c.name} (${base}/products/${slug(c.name)}/)`, catIntro[slug(c.name)] || ''); for (const p of c.products) llms.push(`- ${p.name}: ${plainText(p.tagline || p.desc)} ${(Array.isArray(p.specs) ? p.specs.map(([a, b]) => `${a}: ${b}`).join('; ') : '')} — ${base}/products/${slug(c.name)}/${slug(p.name)}.html`); }
fs.writeFileSync(path.join(root, 'llms-full.txt'), llms.join('\n') + '\n');

// Branded 404 page (GitHub Pages serves /404.html for unknown URLs)
fs.writeFileSync(path.join(root, '404.html'), shell({ title: 'Page not found | Gurudatta Trading Co.', description: 'This page could not be found. Browse our spring products or contact Gurudatta Trading Co., Mumbai.', canonical: base + '/404.html', robots: 'noindex,follow',
  body: `<section class="hero" style="text-align:center"><div class="eyebrow">Error 404</div><h1>Page not found</h1><p style="margin:0 auto 18px">The page you are looking for may have moved. Try our product catalogue or contact us directly.</p><div class="btns" style="justify-content:center"><a class="btn" href="/products.html">Browse Products</a><a class="btn wa" href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp Us</a></div></section><section class="sec"><h2>Product categories</h2>${categoryChips('')}</section>` }));

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
if (fs.existsSync(sitemapPath)) { let sm = fs.readFileSync(sitemapPath, 'utf8'); for (const gd of guideList) { const u = `${base}/guides/${gd.file}.html`; if (!sm.includes(u)) sm = sm.replace('</urlset>', `<url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`); } fs.writeFileSync(sitemapPath, sm); }
console.log(`Generated ${categories.length} category pages and ${productsWritten} product pages + 404.html.`);
