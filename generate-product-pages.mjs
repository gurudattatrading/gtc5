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

const pillarPage = {
  'compression-spring': { url: base + '/compression-spring-manufacturer.html', label: 'our full Compression Spring Manufacturer guide' },
  'industrial-springs': { url: base + '/industrial-spring-manufacturer-mumbai.html', label: 'our full Industrial Spring Manufacturer guide' },
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

.foot .fl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px}.foot .fl a{margin:0;white-space:nowrap}
.ft-cols{display:grid;grid-template-columns:1.7fr 1fr;gap:30px;max-width:1000px;margin:20px auto 16px;text-align:left;padding:0 20px}.ft-col{border-top:1px solid rgba(255,255,255,.12);padding-top:12px}
.ft-col summary{list-style:none;cursor:pointer;font:700 13px 'Montserrat',Arial,sans-serif;color:#fff;display:flex;justify-content:space-between;align-items:center;letter-spacing:.03em}.ft-col summary::-webkit-details-marker{display:none}
.ft-col ul{list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:7px 18px}.ft-col.guides ul{grid-template-columns:1fr}
footer.foot .ft-col a{color:rgba(255,255,255,.6);margin:0;font-size:12.5px}footer.foot .ft-col a:hover{color:#fff}
@media(min-width:769px){.ft-col summary{pointer-events:none}}
@media(max-width:768px){.ft-cols{grid-template-columns:1fr;gap:0;padding:0 16px}.ft-col{padding:13px 0}.ft-col summary{font-size:14px}.ft-col summary::after{content:'+';color:var(--P);font-size:20px}.ft-col[open] summary::after{content:'\\2013'}.ft-col ul{grid-template-columns:1fr 1fr;gap:10px 14px}footer.foot .ft-col a{font-size:13px}}
.mcta-bar{display:none}
@media(max-width:768px){.mcta-bar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:999;gap:1px;background:rgba(255,255,255,.1)}.mcta-bar a{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 10px;font:700 14px 'Montserrat',Arial,sans-serif;text-decoration:none;color:#fff}.mcta-bar a.call{background:#1b2a3d}.mcta-bar a.wa{background:#22c55e}body{padding-bottom:50px}}
@media(max-width:760px){.detail{grid-template-columns:1fr}.nav-in{justify-content:center}}
`;
const fontLinks = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Montserrat:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;
const nav = `<nav class="top" aria-label="Main navigation"><div class="nav-in"><a class="logo" href="/"><img src="/logo.jpg" alt="Gurudatta Trading Co. logo" width="42" height="42"><span>GURUDATTA TRADING CO.<small>No.1 Compression · Mumbai, India</small></span></a><div class="links"><a href="/">🏠 Home</a><a href="/calculator.html">⚙️ Calculator</a><a href="/products.html" class="act">🔩 Products</a><a href="/reviews.html">⭐ Reviews</a><a href="/blog.html">📝 Blog</a><a href="/contact.html">📞 Contact</a><a class="wa" href="https://wa.me/${WA}" target="_blank" rel="noopener">📱 WhatsApp</a></div></div></nav>`;
const guideNav = [['spring-wire-gauge-swg-chart','SWG Chart'],['spring-rate-formula-compression-spring','Spring Rate Formula'],['extension-spring-load-formula','Extension Spring Formula'],['torsion-spring-torque-formula','Torsion Spring Formula'],['how-to-measure-a-spring','How to Measure a Spring'],['spring-end-types-explained','Spring End Types'],['mild-steel-vs-stainless-steel-vs-music-wire-springs','Material Comparison'],['spring-finishes-and-coatings','Finishes &amp; Coatings'],['custom-spring-cost-and-quote-checklist','Custom Spring Cost']];
const footer = `<footer class="foot"><strong style="color:#fff">GURUDATTA TRADING CO.</strong><div class="fl"><a href="/how-it-works.html">How It Works</a><a href="/calculator.html">Calculator</a><a href="/products.html">Products</a><a href="/blog.html">Blog</a><a href="/contact.html">Contact</a><a href="/sitemap.html">Site Map</a><a href="/privacypolicy.html">Privacy Policy</a></div><div class="ft-cols"><details class="ft-col" open><summary>Product categories</summary><ul>${categories.map(c => `<li><a href="/products/${slug(c.name)}/">${esc(c.name)}</a></li>`).join('')}</ul></details><details class="ft-col guides" open><summary>Spring guides</summary><ul>${guideNav.map(([s, n]) => `<li><a href="/guides/${s}.html">${n}</a></li>`).join('')}</ul></details></div><script>if(matchMedia("(max-width:768px)").matches)document.querySelectorAll(".ft-col").forEach(function(d){d.removeAttribute("open")})</script><div>© 2026 Gurudatta Trading Co. · Spring Manufacturer &amp; Supplier, Mumbai, India</div></footer>`;

const shell = ({ title, description, canonical, body, jsonLd, image, robots = 'index,follow,max-image-preview:large' }) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}"><meta name="robots" content="${robots}"><meta name="theme-color" content="#0d1535"><link rel="icon" href="/logo.jpg"><meta property="og:type" content="website"><meta property="og:site_name" content="Gurudatta Trading Co."><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(image || base + '/logo.jpg')}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image || base + '/logo.jpg')}">${fontLinks}<style>${sharedCss}</style>${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/<\//g, '<\\/')}</script>` : ''}</head><body>${nav}<main class="wrap">${body}</main>${footer}<div class="mcta-bar"><a class="call" href="tel:+918454995315">📞 Call Now</a><a class="wa" href="https://wa.me/${WA}" target="_blank" rel="noopener">💬 WhatsApp</a></div></body></html>`;

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
  const pillar = pillarPage[categorySlug];
  const catFaq = [
    [`Do you make custom ${category.name.toLowerCase()} products?`, `Yes. Gurudatta Trading Co. makes to your drawing, sample or working parameters, and also supplies standard sizes from stock. Share your requirement on WhatsApp (+91 84549 95315) for a quote.`],
    [`Do you deliver ${category.name.toLowerCase()} across India?`, `Yes — we deliver PAN India from Mumbai, and we are IEC registered for export enquiries.`],
    [`How quickly can I get a quote?`, `Typically within 24 hours by WhatsApp, email (connect.gtc5@gmail.com) or phone.`],
  ];
  const catBody = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/products.html">Products</a> › <b>${esc(category.name)}</b></nav><section class="hero"><div class="eyebrow">Product category</div><h1>${esc(category.name)} Manufacturer &amp; Supplier in Mumbai</h1><p>${esc(intro)} Gurudatta Trading Co. has been manufacturing and supplying since 2000, with ISO 9001:2015 quality management and PAN India delivery.</p><div class="btns"><a class="btn" href="/contact.html">📞 Enquire Now</a><a class="btn wa" href="https://wa.me/${WA}?text=${encodeURIComponent('Hi, I am interested in ' + category.name)}" target="_blank" rel="noopener">WhatsApp Quote</a></div>${pillar ? `<p style="margin-top:14px"><a href="${pillar.url}">Read ${pillar.label} →</a></p>` : ''}</section><section class="grid" aria-label="${esc(category.name)} product catalogue">${category.products.map(p => cardHtml(categorySlug, p)).join('')}</section><section class="sec faq"><h2>${esc(category.name)} — FAQs</h2>${catFaq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section><section class="sec"><h2>Explore other product categories</h2>${categoryChips(categorySlug)}</section>`;
  const catLd = { '@context': 'https://schema.org', '@graph': [ orgLd,
    { '@type': 'CollectionPage', name: `${category.name} Products`, description: catDesc, url: categoryUrl, isPartOf: { '@type': 'WebSite', name: 'Gurudatta Trading Co.', url: base + '/' },
      mainEntity: { '@type': 'ItemList', numberOfItems: category.products.length, itemListElement: category.products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${categoryUrl}${slug(p.name)}.html`, name: p.name })) } },
    crumbLd([['Home', base + '/'], ['Products', base + '/products.html'], [category.name, categoryUrl]]),
    { '@type': 'FAQPage', mainEntity: catFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] };
  const catCanonical = pillar ? pillar.url : categoryUrl;
  const catTitle = pillar ? clip(`${category.name} Products — Browse the Range | Gurudatta Trading`, 65) : clip(`${category.name} Manufacturer & Supplier Mumbai | Gurudatta Trading`, 65);
  fs.writeFileSync(path.join(categoryDir, 'index.html'), shell({ title: catTitle, description: catDesc, canonical: catCanonical, body: catBody, jsonLd: catLd, image: absImage(category.products[0]?.img) }));

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
const e = (() => { const d = 1.5, OD = 15, D = OD - d, Na = 20, F0 = 5, x = 20, k = G * d ** 4 / (8 * D ** 3 * Na); return { d, OD, D, Na, F0, x, k, F: F0 + k * x }; })();
const t = (() => { const d = 2, D = 18, N = 8, E = 207000; return { d, D, N, E, k: E * d ** 4 / (64 * D * N) }; })();
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
 { file: 'extension-spring-load-formula', title: 'Extension Spring Load and Rate Formula with Example', h1: 'Extension Spring Load & Rate Formula (with worked example)',
   desc: 'How to calculate extension (tension) spring rate and load: F = F0 + k·x. Worked example, initial tension explained, and a free spring calculator.',
   answer: 'Extension spring load is F = F0 + k·x, where F0 is initial tension, k the spring rate (same formula as a compression spring) and x the extension beyond free length.',
   body: `<div class="sec desc"><h2>The formulas</h2><p><b>k = G · d⁴ / (8 · D³ · Na)</b> &nbsp;and&nbsp; <b>F = F0 + k · x</b></p><ul><li><b>F0</b> — initial tension: the force needed to start separating the coils</li><li><b>k</b> — spring rate (N/mm), where Na is the number of body coils</li><li><b>x</b> — extension beyond free length (mm)</li></ul><h2>Worked example</h2><p>Steel spring, d = ${e.d} mm, outer diameter ${e.OD} mm (D = ${e.D} mm), ${e.Na} body coils, G = ${G} MPa: k ≈ <b>${f2(e.k)} N/mm</b>. With an initial tension of ${e.F0} N, the load at ${e.x} mm extension is ${e.F0} + ${f2(e.k)} × ${e.x} ≈ <b>${f2(e.F)} N</b>.</p><p>Initial tension depends on how the spring is coiled and cannot be reduced below what the wire and diameter allow; hooks are usually the highest-stress area. Use the <a href="/calculator.html">free Spring Rate Calculator</a> for a design check, and see the <a href="/guides/spring-rate-formula-compression-spring.html">compression spring formula</a> for background.</p></div>${cta}`,
   faq: [['What is initial tension in an extension spring?', 'It is the force that holds the coils together; the spring does not begin to extend until the applied load exceeds it.'], ['How do I calculate the load of an extension spring?', 'Load equals initial tension plus spring rate times extension: F = F0 + k·x.'], ['Is the extension spring rate formula the same as for compression springs?', 'Yes, the rate formula is the same, using the number of body coils.']] },
 { file: 'torsion-spring-torque-formula', title: 'Torsion Spring Torque and Rate Formula with Example', h1: 'Torsion Spring Torque & Rate Formula (with worked example)',
   desc: 'How to calculate torsion spring rate and torque: k = E·d⁴ / (64·D·N) per radian. Worked example, leg and winding notes, and a free calculator.',
   answer: 'Torsion spring rate is k = E·d⁴ / (64·D·N) in N·mm per radian, where E is the modulus of elasticity, d wire diameter, D mean coil diameter and N active coils; torque = k × angle.',
   body: `<div class="sec desc"><h2>The formula</h2><p><b>k = E · d⁴ / (64 · D · N)</b> &nbsp;(N·mm per radian) &nbsp;and&nbsp; <b>T = k · θ</b></p><ul><li><b>E</b> — modulus of elasticity (steel is about 207,000 MPa)</li><li><b>d</b> — wire diameter, <b>D</b> — mean coil diameter, <b>N</b> — active coils</li><li><b>θ</b> — deflection angle in radians (degrees × π / 180)</li></ul><h2>Worked example</h2><p>d = ${t.d} mm, D = ${t.D} mm, N = ${t.N}, E = ${t.E} MPa: k ≈ <b>${f2(t.k)} N·mm/rad</b> (about ${f2(t.k * Math.PI / 180)} N·mm per degree). A 90° deflection gives a torque of ≈ ${f2(t.k * Math.PI / 2)} N·mm.</p><p>Practical designs often use a correction factor because of friction and leg effects, and a torsion spring should be loaded in the direction that tightens the coils. Use the <a href="/calculator.html">calculator</a> to check stress, and compare with the <a href="/guides/spring-rate-formula-compression-spring.html">compression spring formula</a>.</p></div>${cta}`,
   faq: [['What is the formula for torsion spring rate?', 'k = E·d⁴ / (64·D·N) in N·mm per radian, using the modulus of elasticity E, wire diameter d, mean diameter D and active coils N.'], ['How do I convert torsion spring rate from radians to degrees?', 'Multiply the per-radian value by π/180 to get the rate per degree.'], ['Which way should a torsion spring be loaded?', 'In the direction that winds the coils tighter, so the wire is in bending as designed.']] },
 { file: 'spring-end-types-explained', title: 'Spring End Types Explained: Closed, Ground, Open', h1: 'Spring End Types Explained — Closed, Ground and Open Ends',
   desc: 'Compare compression spring end types (open, closed, closed and ground) and extension/torsion spring ends, and how ends change active coils and solid height.',
   answer: 'Compression springs commonly have open, closed, or closed-and-ground ends; closed and ground ends sit flat and square for the best stability, and closed ends typically add two inactive coils (total coils = active coils + 2).',
   body: `<div class="sec desc"><h2>Compression spring ends</h2><div style="overflow-x:auto"><table class="specs"><thead><tr><td><b>End type</b></td><td><b>Description</b></td><td><b>Effect</b></td></tr></thead><tbody><tr><td>Open (not ground)</td><td>Coil ends left untouched</td><td>Total coils ≈ active coils; can be less stable</td></tr><tr><td>Closed (not ground)</td><td>End coil is turned in to touch the next coil</td><td>Typically total coils = active + 2</td></tr><tr><td>Closed and ground</td><td>Closed ends, then ground flat</td><td>Sits square on a surface; best load alignment</td></tr></tbody></table></div><h2>Extension and torsion spring ends</h2><ul><li><b>Extension:</b> machine hook, full loop, side hook or extended hook — hooks carry the highest stress, so hook type matters for life.</li><li><b>Torsion:</b> straight, bent or hooked legs, with legs positioned to suit the mounting.</li></ul><p>Choose ends from how the spring is mounted and how squarely it must load. State your end type when you enquire, and see <a href="/guides/how-to-measure-a-spring.html">how to measure a spring</a> to record the other details.</p></div>${cta}`,
   faq: [['What is a closed and ground spring end?', 'The end coil is closed against the next coil and then ground flat so the spring sits square on a surface.'], ['How many extra coils do closed ends add?', 'Closed ends typically add two inactive coils, so total coils = active coils + 2.'], ['Which spring end type is best?', 'Closed and ground ends give the best squareness and stability; open ends are simpler and cheaper where alignment is less critical.']] },
 { file: 'spring-finishes-and-coatings', title: 'Spring Finishes and Coatings: Zinc, Black Oxide, Powder Coat', h1: 'Spring Finishes & Coatings — Zinc, Black Oxide, Powder Coat, Passivation',
   desc: 'Guide to spring finishes: zinc plating, black oxide, powder coating, oiling and stainless passivation — what each protects against and when to choose it.',
   answer: 'Zinc plating and powder coating protect carbon steel springs from rust, black oxide gives light protection, and stainless steel springs are passivated; high-strength plated springs may need baking to reduce hydrogen embrittlement risk.',
   body: `<div class="sec desc"><h2>Common spring finishes</h2><div style="overflow-x:auto"><table class="specs"><thead><tr><td><b>Finish</b></td><td><b>Protection</b></td><td><b>Notes</b></td></tr></thead><tbody><tr><td>Zinc plating</td><td>Good general corrosion protection</td><td>High-strength springs may need baking after plating to reduce hydrogen embrittlement risk</td></tr><tr><td>Black oxide</td><td>Light protection</td><td>Usually combined with oil; suits dry, indoor use</td></tr><tr><td>Powder coat / paint</td><td>Thicker barrier, colour options</td><td>Adds thickness; check fit on rods and in bores</td></tr><tr><td>Oiling / plain</td><td>Temporary</td><td>Lowest cost for short-term protection</td></tr><tr><td>Passivation (stainless)</td><td>Improves corrosion resistance</td><td>Removes surface iron; not a coating</td></tr></tbody></table></div><h2>How to choose</h2><p>Match the finish to the environment (indoor, outdoor, wet, chemical), the working stress and any fit tolerances. Coating thickness can change the spring's outer diameter slightly, so mention it when tolerances are tight. See also <a href="/guides/mild-steel-vs-stainless-steel-vs-music-wire-springs.html">material comparison</a>.</p></div>${cta}`,
   faq: [['Which coating is best for spring corrosion protection?', 'Zinc plating and powder coating are common for carbon steel; stainless steel springs rely on the material and passivation.'], ['Can plating make a spring brittle?', 'High-strength steel springs can suffer hydrogen embrittlement from plating, which is why baking after plating is often specified.'], ['Does powder coating change spring dimensions?', 'Yes, it adds a small thickness, so tell the manufacturer if fit tolerances are tight.']] },
 { file: 'is-4454-spring-wire-grades-explained', title: 'IS 4454 Spring Wire Standard Explained (Parts 1, 2 & 4)', h1: 'IS 4454 Spring Wire Standard Explained',
   desc: 'What IS 4454 covers for spring steel wire in India: Part 1 (cold drawn unalloyed), Part 2 (oil hardened & tempered) and Part 4/2018 (stainless steel), with duty grades explained.',
   answer: 'IS 4454 is the Indian Standard for spring steel wire, split into parts by process: Part 1 covers cold-drawn unalloyed wire (grades by static or dynamic duty), Part 2 covers oil-hardened and tempered wire, and Part 4 (now IS 4454:2018) covers stainless steel spring wire for corrosion resistance.',
   body: `<div class="sec desc"><h2>What each part covers</h2><div style="overflow-x:auto"><table class="specs"><thead><tr><td><b>Part</b></td><td><b>Wire type</b></td><td><b>Typical use</b></td></tr></thead><tbody><tr><td>Part 1</td><td>Cold-drawn unalloyed steel wire</td><td>General-purpose springs, static and dynamic duty</td></tr><tr><td>Part 2</td><td>Oil-hardened and tempered wire</td><td>Higher-duty springs where OHT wire suits the design</td></tr><tr><td>Part 4 (IS 4454:2018)</td><td>Stainless steel wire (austenitic/martensitic)</td><td>Corrosive, wet, hygienic or moderately hot environments</td></tr></tbody></table></div><h2>Duty grades under Part 1</h2><p>Part 1 groups wire by tensile-strength duty: low tensile strength (grade SL) for lighter static use, medium tensile strength (grades SM for static duty, DM for dynamic duty) and high tensile strength (SH static, DH dynamic), each specified over a wire-diameter range. The right grade depends on the load, whether the spring is statically or dynamically loaded, and the wire diameter — exact tensile values are set out in the standard for each grade and diameter, so we check the current edition against your application rather than quoting a single number here.</p><h2>Why it matters for a quote</h2><p>Telling us the applicable IS 4454 part (or an equivalent grade you already use) — along with wire diameter, spring type and environment — helps us select the right wire the first time. If you are unsure, describe the application and environment (indoor/outdoor, wet, chemical, temperature) and we will recommend a suitable wire.</p></div>${cta}`,
   faq: [['What is IS 4454 used for?', 'It is the Indian Standard specifying steel wire for mechanical springs, split into parts for cold-drawn unalloyed wire, oil-hardened and tempered wire, and stainless steel wire.'], ['Which IS 4454 part covers stainless steel spring wire?', 'Part 4, now published as IS 4454:2018, covers stainless steel wire for springs used in corrosive or hygienic environments.'], ['Do I need to know the exact IS 4454 grade to get a quote?', 'No — describe your load, environment and application and we will recommend a suitable wire and confirm the grade.']] },
 { file: 'die-spring-colour-code-chart', title: 'Die Spring Colour Code Chart: Light to Extra-Heavy Duty', h1: 'Die Spring Colour Code Chart — Light, Medium, Heavy & Extra-Heavy',
   desc: 'How die spring colour coding works (ISO 10243 style): four duty levels — light, medium, heavy and extra-heavy — and why the exact colour-to-duty mapping can vary by manufacturer.',
   answer: 'Die springs are colour-coded by duty (load) level — commonly light, medium, heavy and extra-heavy — but the exact colour used for each duty level is not identical across every standard or manufacturer, so always confirm against the specific catalogue rather than colour alone.',
   body: `<div class="sec desc"><h2>The four duty levels</h2><p>Die springs (rectangular-wire compression springs used in press tools, dies and moulds) are grouped into four duty levels based on how much load they carry for a given amount of compression:</p><ul><li><b>Light duty</b> — lowest spring rate for the size, used where minimal force is needed</li><li><b>Medium duty</b> — the most common general-purpose rating</li><li><b>Heavy duty</b> — higher force for the same envelope size</li><li><b>Extra-heavy duty</b> — highest force, for compact, high-tonnage tooling</li></ul><h2>Why we don't print a single universal colour table</h2><p>Different die spring standards and manufacturers (ISO 10243, JIS B5012, and various oval-wire/American systems) use different colours for the same duty level, and even within ISO-style ranges, catalogues vary — for example, medium duty is widely shown as blue and heavy duty as red, but light and extra-heavy are shown differently across sources. Relying on colour alone across different suppliers can lead to fitting the wrong spring. The reliable approach is to match by <b>duty level and dimensions</b> (hole diameter, rod diameter, free length) shown in the specific catalogue or stamped on the spring, not colour alone.</p><h2>What to send us</h2><p>Tell us the hole/bore diameter, rod diameter, free length and the required duty level (or the working load if you know it), and we will match or manufacture the correct die spring.</p></div>${cta}`,
   faq: [['Does die spring colour mean the same thing for every brand?', 'Not always — colour-to-duty mapping can differ between standards and manufacturers, so confirm the duty level and dimensions rather than relying on colour alone.'], ['What does medium duty mean for a die spring?', 'It is a mid-range spring rate for a given size, suited to general press-tool use, between light and heavy duty options.'], ['How do I order a die spring without knowing its colour code?', 'Send the hole diameter, rod diameter, free length and required duty or working load — we can match or manufacture from those dimensions.']] },
 { file: 'trampoline-spring-buying-guide', title: 'Trampoline Spring Buying Guide: Size, Count & Replacement', h1: 'Trampoline Spring Buying Guide — Size, Count & Replacement Tips',
   desc: 'How to choose replacement trampoline springs: measuring length and hook type, matching spring count to your trampoline, and signs it is time to replace them.',
   answer: 'To replace trampoline springs, measure the free length of an existing spring end-to-end (including hooks), count how many springs your trampoline uses, and match both the length and the hook style — most residential trampolines use springs roughly 140–230 mm long.',
   body: `<div class="sec desc"><h2>How to measure your existing springs</h2><ul><li><b>Length:</b> measure hook-to-hook on an unstretched spring lying flat.</li><li><b>Hook style:</b> note whether ends are open hooks, closed loops, or a specific shape that matches your frame's V-rings.</li><li><b>Wire thickness:</b> thicker wire generally gives a firmer bounce for the same length.</li><li><b>Count:</b> count the total number of springs on the trampoline — larger trampolines use more springs, and all springs on one trampoline are normally the same size.</li></ul><h2>When to replace trampoline springs</h2><ul><li>Visible rust, pitting or a stretched/bent coil</li><li>A spring that stays elongated after use, or has lost tension compared to the others</li><li>Uneven bounce or a sagging mat centre</li><li>A cracked or deformed hook</li></ul><p>Replace springs as a full set where possible so tension stays even across the mat, and always match the size and hook style rather than mixing different springs. Gurudatta Trading Co. supplies galvanised trampoline springs from stock or made to your measurement — send a sample or the measurements above for a quote.</p></div>${cta}`,
   faq: [['How do I know what size trampoline spring I need?', 'Measure an existing spring end-to-end including the hooks, note the hook style and wire thickness, and match those on the replacement.'], ['How many springs does a trampoline usually need?', 'It depends on trampoline size — count the springs currently fitted, since all springs on one trampoline are normally the same size and the full set is usually replaced together.'], ['How often should trampoline springs be replaced?', 'Inspect periodically for rust, stretching or bent hooks; replace as soon as a spring looks visibly worn or the bounce feels uneven.']] },
];
const guideDir = path.join(root, 'guides');
fs.mkdirSync(guideDir, { recursive: true });
for (const gd of guideList) {
  const url = `${base}/guides/${gd.file}.html`;
  const stepsHtml = gd.steps ? `<div class="sec desc"><h2>Steps</h2><ol style="margin:8px 0 0 22px">${gd.steps.map(([n, t]) => `<li><b>${esc(n)}.</b> ${esc(t)}</li>`).join('')}</ol><p style="margin-top:12px">Then check the numbers in our <a href="/calculator.html">spring rate calculator</a>.</p></div>${cta}` : '';
  const body = `<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog.html">Guides</a> › <b>${esc(gd.h1)}</b></nav><section class="hero"><div class="eyebrow">Spring guide</div><h1>${esc(gd.h1)}</h1><p><b>Quick answer:</b> ${esc(gd.answer)}</p><p style="margin-top:10px;font-size:13px">By Gurudatta Trading Co., Mumbai · Updated ${today}</p></section>${gd.body}${stepsHtml}<section class="sec faq"><h2>FAQs</h2>${gd.faq.map(([q, a]) => `<details open><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section><section class="sec"><h2>More spring guides</h2><div class="chips">${guideList.filter(o => o !== gd).map(o => `<a href="/guides/${o.file}.html">${esc(o.h1.split(' (')[0].split(' — ')[0])}</a>`).join('')}</div></section><section class="sec"><h2>Explore products</h2>${categoryChips('')}</section>`;
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
