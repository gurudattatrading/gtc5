// Builds type-specific calculator landing pages from calculator.html.
// The calculator tool itself (markup + JS) is copied unchanged; only the head tags, hero text,
// JSON-LD and the explanatory section below the tool are replaced with page-specific content.
// Re-run after editing calculator.html:  node generate-calculator-pages.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const base = 'https://industrialspringmanufacturer.com';
const WA = '918454995315';
const src = fs.readFileSync(path.join(root, 'calculator.html'), 'utf8');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const today = new Date().toISOString().slice(0, 10);

// ---------- inline-style helpers (same look as the existing info section) ----------
const card = (h3, inner) => `<div class="si-reveal" style="background:#161b22; border:1px solid #30363d; border-radius:12px; padding:20px 22px;"><h3 style="color:#fff; font-size:16px; font-weight:700; margin:0 0 8px;">${h3}</h3><div style="margin:0; color:#c9d1d9; font-size:14.5px; line-height:1.7;">${inner}</div></div>`;
const h2 = t => `<h2 class="si-reveal" style="text-align:center; font-size:28px; font-weight:800; margin:44px 0 14px; color:#ffffff;">${t}</h2>`;
const para = t => `<p class="si-reveal" style="color:#9da7b3; max-width:760px; margin:0 auto 14px; line-height:1.75; font-size:15.5px;">${t}</p>`;
const grid = (cols, items) => `<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(${cols}px,1fr)); gap:16px; margin-top:18px;">${items.join('')}</div>`;
const formulaBox = lines => `<div class="si-reveal" style="background:#0d1117; border:1px solid #30363d; border-radius:10px; padding:16px 20px; font-family:Consolas,'Courier New',monospace; color:#ffb072; font-size:14px; line-height:2; overflow-x:auto; max-width:760px; margin:0 auto;">${lines.join('<br>')}</div>`;
const tbl = (head, rows) => `<div class="si-reveal" style="overflow-x:auto; max-width:760px; margin:0 auto;"><table style="width:100%; border-collapse:collapse; font-size:14.5px; color:#c9d1d9;"><thead><tr>${head.map(h => `<th style="text-align:left; padding:10px 12px; border-bottom:1px solid #30363d; color:#fff;">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td style="padding:10px 12px; border-bottom:1px solid #21262d; ${i === 0 ? 'color:#9da7b3;' : 'font-weight:600; color:#fff;'}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const pill = 'display:inline-block;padding:9px 16px;border:1px solid #30363d;border-radius:999px;color:#e6edf3;text-decoration:none;font-size:13.5px;background:#161b22;';
const links = items => `<div class="si-reveal" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:14px;">${items.map(([u, t]) => `<a href="${u}" style="${pill}">${t}</a>`).join('')}</div>`;
const steps = list => `<ol class="si-reveal" style="max-width:760px; margin:0 auto; padding-left:22px; color:#c9d1d9; font-size:15px; line-height:1.85;">${list.map(([n, t]) => `<li><b style="color:#fff;">${n}.</b> ${t}</li>`).join('')}</ol>`;
const wa = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;

// ---------- page definitions ----------
// Worked-example figures below were produced by running the real calculator (metric, mild steel IS 4454).
const pages = [
  {
    file: 'compression-spring-calculator.html',
    type: 'C',
    title: 'Compression Spring Calculator: Rate, Load & Stress (Free)',
    desc: 'Free compression spring calculator: spring rate, safe load, max deflection, solid length and stress from wire, coil and material. Inch or mm, with 3D preview.',
    kw: 'compression spring calculator, spring rate calculator, compression spring rate, compression spring load calculator, solid height calculator, spring index calculator',
    h1: 'Compression Spring <span>Calculator</span>',
    heroP: 'Free online compression spring calculator — get the spring rate, safe load, maximum deflection and solid length in seconds, with a live 3D preview.',
    heroFeats: ['Spring rate, safe load &amp; deflection', 'Solid length, index &amp; Wahl factor', 'English (inch) &amp; Metric (mm)', 'Live 3D Preview'],
    crumb: 'Compression Spring Calculator',
    appName: 'Compression Spring Calculator by Gurudatta Trading Co.',
    appDesc: 'Free online compression spring calculator. Computes spring rate, safe load, maximum deflection, solid length, spring index and shear stress, with a live 3D preview, in inch or metric units.',
    features: ['Spring rate, safe load and maximum deflection', 'Solid length, spring index, pitch and Wahl factor', 'English (inch) and Metric (mm) units', 'Live 3D spring preview', 'Full specification sheet export to WhatsApp'],
    howName: 'How to Use the Compression Spring Calculator',
    howDesc: 'Calculate the rate, safe load, deflection and solid length of a compression spring in five steps.',
    how: [
      ['Choose units', 'Select English (inch) or Metric (mm). Compression is already selected as the spring type.'],
      ['Enter the dimensions', 'Enter the wire diameter, outside diameter and total number of coils. Free length is optional; if left blank the calculator estimates it.'],
      ['Select material and end type', 'Choose the wire material (music wire, hard drawn, stainless steel, mild steel and more), the end type and the direction of wind.'],
      ['Calculate', 'Enter your name and 10-digit mobile number, then press Calculate.'],
      ['Review and request a quote', 'Check the key results, the full specification sheet and the 3D preview, then send the specification to us on WhatsApp for a quote.'],
    ],
    faq: [
      ['How do I calculate the spring rate of a compression spring?', 'Spring rate k = G·d⁴ / (8·D³·Na), where G is the shear modulus of the wire, d the wire diameter, D the mean coil diameter (outside diameter minus wire diameter) and Na the number of active coils. Enter the dimensions above and the calculator does this for you.'],
      ['What is the safe load shown in the results?', 'It is the load at which the shear stress in the wire reaches the allowable stress the calculator assumes for the chosen material. The allowable values are mid-range estimates, and real allowables also depend on wire size and duty, so treat the figure as a design guide.'],
      ['How many active coils does a compression spring have?', 'Total coils minus the inactive end coils. The calculator uses 0 for open ends, 2 for closed or closed-and-ground ends and 3 for double-closed ends.'],
      ['What spring index should I aim for?', 'Most springs are designed with an index (mean diameter ÷ wire diameter) between about 4 and 12. The calculator warns when the index is below 4 (hard to manufacture) or above 12 (tends to buckle or tangle).'],
      ['Can I use inches as well as millimetres?', 'Yes. Switch between English (inch) and Metric (mm) at the top of the calculator; results follow the unit you choose.'],
      ['How accurate are the results?', 'The calculation uses the standard design formulas. Manufacturing tolerance on wire and coil diameter normally makes a real spring’s rate vary by roughly ±10% from the theoretical value.'],
      ['Can you manufacture the spring I design here?', 'Yes. Send the specification to Gurudatta Trading Co. on WhatsApp from the results page and we will quote and make it to your drawing or sample.'],
    ],
    info: () => [
      `<p class="si-reveal" style="text-align:center; color:#ff7a1a; letter-spacing:2px; font-size:13px; font-weight:700; text-transform:uppercase; margin-bottom:10px;">Free Online Tool</p>`,
      `<h2 class="si-reveal" style="text-align:center; font-size:32px; font-weight:800; margin:0 0 12px; color:#ffffff;">Compression Spring Calculator — What It Works Out</h2>`,
      para('This compression spring calculator turns a few dimensions into a full specification report: spring rate, safe load, maximum deflection, solid length, spring index and shear stress, with a live 3D preview. Enter the wire diameter, outside diameter and total coils, choose the material and end type, and press Calculate. It works in inches or millimetres.'),
      grid(250, [
        card('Spring rate', 'Force per unit of deflection (N/mm or lbf/in) from the wire diameter, mean coil diameter, active coils and the material’s shear modulus.'),
        card('Safe load and max deflection', 'The load at which the shear stress reaches the material’s allowable stress, and the deflection that load produces.'),
        card('Solid length, index and pitch', 'Solid length, spring index, Wahl factor and pitch, plus warnings when the index is below 4 or above 12.'),
      ]),
      h2('The formulas the calculator uses'),
      formulaBox([
        'Mean diameter &nbsp;&nbsp;&nbsp;D = OD − d &nbsp;&nbsp;&nbsp;&nbsp;Spring index &nbsp;C = D ÷ d',
        'Active coils &nbsp;&nbsp;&nbsp;&nbsp;Na = n − dead coils &nbsp;(open 0 · closed or closed &amp; ground 2 · double-closed 3)',
        'Spring rate &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;k = G · d⁴ ÷ (8 · D³ · Na)',
        'Wahl factor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;K = (4C − 1) ÷ (4C − 4) + 0.615 ÷ C',
        'Safe load &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;F = τ(allow) · π · d³ ÷ (8 · K · D)',
        'Max deflection &nbsp;&nbsp;x = F ÷ k &nbsp;&nbsp;&nbsp;&nbsp;Solid length &nbsp;Ls ≈ n · d',
      ]),
      para('<span style="display:block; margin-top:12px;">d = wire diameter, OD = outside diameter, n = total coils, G = shear modulus of the wire. A step-by-step derivation is in our <a href="/guides/spring-rate-formula-compression-spring.html" style="color:#ff9a4d;">spring rate formula guide</a>.</span>'),
      h2('Worked example'),
      para('Entering these values in the calculator above (metric, mild steel, closed ends) gives:'),
      tbl(['Input', 'Value'], [
        ['Wire diameter', '2 mm'], ['Outside diameter', '20 mm'], ['Total coils', '12'], ['End type', 'Closed ends'], ['Material', 'Mild steel IS 4454 (G = 80,000 N/mm²)'],
      ]),
      `<div style="height:16px;"></div>`,
      tbl(['Result', 'Value'], [
        ['Mean diameter / spring index', '18 mm / 9'], ['Active coils', '10'], ['Spring rate', '2.743 N/mm'], ['Wahl factor', '1.1621'], ['Solid length', '24 mm'], ['Safe load', '63.1 N (6.43 kg)'], ['Maximum deflection', '22.99 mm'], ['Shear stress at safe load', '420 N/mm²'],
      ]),
      para('<span style="display:block; margin-top:12px;">Check by hand: k = 80,000 × 2⁴ ÷ (8 × 18³ × 10) = 2.74 N/mm.</span>'),
      h2('How to use the compression spring calculator'),
      steps(pages[0].how),
      h2('Frequently asked questions'),
      `<div style="display:grid; grid-template-columns:1fr; gap:14px; margin-top:18px;">${pages[0].faq.map(([q, a]) => card(esc(q), esc(a))).join('')}</div>`,
      h2('Related springs, guides and tools'),
      links([['/extension-spring-calculator.html', 'Extension Spring Calculator'], ['/torsion-spring-calculator.html', 'Torsion Spring Calculator'], ['/calculator.html', 'All-in-one Spring Calculator'], ['/guides/compression-springs-complete-guide.html', 'Compression Springs Guide'], ['/guides/spring-rate-formula-compression-spring.html', 'Spring Rate Formula'], ['/guides/how-to-measure-a-spring.html', 'How to Measure a Spring'], ['/guides/spring-end-types-explained.html', 'Spring End Types'], ['/compression-spring-manufacturer.html', 'Compression Spring Manufacturer'], ['/products/compression-spring/', 'Compression Spring Products']]),
      `<div class="si-reveal" style="text-align:center; margin-top:36px;"><a href="${wa('Hi, I designed a compression spring on your calculator and need a quote')}" style="display:inline-block; background:#ff7a1a; color:#0d1117; font-weight:800; font-size:15px; padding:14px 32px; border-radius:10px; text-decoration:none;">💬 Get a Free Quote on WhatsApp</a></div>`,
    ],
  },
  {
    file: 'extension-spring-calculator.html',
    type: 'E',
    title: 'Extension Spring Calculator: Rate, Initial Tension & Load',
    desc: 'Free extension spring calculator: spring rate, estimated initial tension, safe load, max extension and hook stress from wire, coil and material. Inch or mm.',
    kw: 'extension spring calculator, tension spring calculator, extension spring rate, initial tension calculator, extension spring load calculator, hook stress',
    h1: 'Extension Spring <span>Calculator</span>',
    heroP: 'Free online extension spring calculator — get the spring rate, estimated initial tension, safe load, maximum extension and hook-stress check in seconds, with a live 3D preview.',
    heroFeats: ['Rate, initial tension &amp; safe load', 'Hook bending &amp; torsion check', 'English (inch) &amp; Metric (mm)', 'Live 3D Preview'],
    crumb: 'Extension Spring Calculator',
    appName: 'Extension Spring Calculator by Gurudatta Trading Co.',
    appDesc: 'Free online extension (tension) spring calculator. Computes spring rate, estimated initial tension, safe load, maximum extension and body and hook stress, with a live 3D preview, in inch or metric units.',
    features: ['Spring rate, estimated initial tension and safe load', 'Maximum extension and maximum length', 'Body shear, hook bending and hook torsion check', 'English (inch) and Metric (mm) units', 'Live 3D spring preview', 'Full specification sheet export to WhatsApp'],
    howName: 'How to Use the Extension Spring Calculator',
    howDesc: 'Calculate the rate, initial tension, safe load and maximum extension of an extension spring in five steps.',
    how: [
      ['Choose units', 'Select English (inch) or Metric (mm). Extension is already selected as the spring type.'],
      ['Enter the dimensions', 'Enter the wire diameter, outside diameter and number of body coils. The length inside the hooks is optional; if left blank the calculator estimates it.'],
      ['Select the material', 'Choose the wire material (music wire, hard drawn, stainless steel, mild steel and more) and the direction of wind.'],
      ['Calculate', 'Enter your name and 10-digit mobile number, then press Calculate.'],
      ['Review and request a quote', 'Check the rate, initial tension, safe load, maximum extension and the stress that governs, then send the specification to us on WhatsApp for a quote.'],
    ],
    faq: [
      ['How do I calculate the load of an extension spring?', 'Load F = Fi + k·x, where Fi is the initial tension, k the spring rate and x the extension beyond the free length inside the hooks. The calculator gives k and Fi; multiply k by your extension and add Fi.'],
      ['What is initial tension and how is it estimated here?', 'Initial tension is the force that holds the coils together at rest; the spring does not begin to stretch until the load exceeds it. The calculator estimates a typical value for the spring index. Your manufactured spring can be made with a different initial tension, so tell us if you need a specific value.'],
      ['Why is the safe load often limited by the hooks?', 'The hooks usually carry the highest stress. The calculator checks the body in shear, the hook in bending (point A) and the hook in torsion (point B), and reports the lowest as the safe load and the governing stress.'],
      ['What is the length inside the hooks?', 'It is the free length of the extension spring measured between the inside of the two hooks. If you leave it blank, the calculator estimates it from the body length and the mean diameter.'],
      ['How do I find the maximum extension?', 'Maximum extension = (safe load − initial tension) ÷ spring rate. The calculator shows it together with the maximum length of the spring.'],
      ['Can I use inches as well as millimetres?', 'Yes. Switch between English (inch) and Metric (mm) at the top of the calculator; results follow the unit you choose.'],
      ['Can you manufacture the extension spring I design here?', 'Yes. Send the specification to Gurudatta Trading Co. on WhatsApp from the results page and we will quote and make it to your drawing or sample, with the hook type you need.'],
    ],
    info: () => [
      `<p class="si-reveal" style="text-align:center; color:#ff7a1a; letter-spacing:2px; font-size:13px; font-weight:700; text-transform:uppercase; margin-bottom:10px;">Free Online Tool</p>`,
      `<h2 class="si-reveal" style="text-align:center; font-size:32px; font-weight:800; margin:0 0 12px; color:#ffffff;">Extension Spring Calculator — What It Works Out</h2>`,
      para('This extension spring calculator (also called a tension spring calculator) turns a few dimensions into a specification report: spring rate, estimated initial tension, safe load, maximum extension and the stress that governs, with a live 3D preview. Enter the wire diameter, outside diameter and number of body coils, choose the material and press Calculate. It works in inches or millimetres.'),
      grid(250, [
        card('Spring rate and initial tension', 'Force per unit of extension from the wire, mean diameter, body coils and shear modulus, plus an estimate of the initial tension that holds the coils together.'),
        card('Safe load and max extension', 'The lowest of the body shear, hook bending and hook torsion limits, and how far the spring can stretch before reaching it.'),
        card('Lengths', 'Body length (close-wound), length inside the hooks and maximum length of the stretched spring.'),
      ]),
      h2('The formulas the calculator uses'),
      formulaBox([
        'Mean diameter &nbsp;&nbsp;&nbsp;D = OD − d &nbsp;&nbsp;&nbsp;&nbsp;Spring index &nbsp;C = D ÷ d',
        'Spring rate &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;k = G · d⁴ ÷ (8 · D³ · Na) &nbsp;&nbsp;(Na = body coils)',
        'Load &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;F = Fi + k · x',
        'Body length &nbsp;&nbsp;&nbsp;&nbsp;Lb = n · d &nbsp;&nbsp;(close-wound)',
        'Max extension &nbsp;&nbsp;xmax = (Fsafe − Fi) ÷ k',
        'Stress checks &nbsp;&nbsp;body shear · hook bending (point A) · hook torsion (point B)',
      ]),
      para('<span style="display:block; margin-top:12px;">d = wire diameter, OD = outside diameter, n = number of body coils, G = shear modulus of the wire, Fi = initial tension. More in our <a href="/guides/extension-spring-load-formula.html" style="color:#ff9a4d;">extension spring load and rate guide</a>.</span>'),
      h2('Worked example'),
      para('Entering these values in the calculator above (metric, mild steel) gives:'),
      tbl(['Input', 'Value'], [
        ['Wire diameter', '1.5 mm'], ['Outside diameter', '15 mm'], ['Body coils', '20'], ['Material', 'Mild steel IS 4454 (G = 80,000 N/mm²)'],
      ]),
      `<div style="height:16px;"></div>`,
      tbl(['Result', 'Value'], [
        ['Mean diameter / spring index', '13.5 mm / 9'], ['Spring rate', '1.029 N/mm'], ['Initial tension (estimated)', '7.5 N'], ['Body length / length inside hooks', '30 mm / 43.5 mm'], ['Safe load', '30.7 N (3.13 kg)'], ['Maximum extension', '22.62 mm'], ['Maximum length', '66.12 mm'], ['Governing stress', 'Hook bending (point A), 700 N/mm²'],
      ]),
      para('<span style="display:block; margin-top:12px;">Check by hand: k = 80,000 × 1.5⁴ ÷ (8 × 13.5³ × 20) = 1.03 N/mm. The load at 10 mm of extension is then about 7.5 + 1.03 × 10 ≈ 17.8 N.</span>'),
      h2('Why hook stress matters'),
      para('In an extension spring the hooks are usually the most highly stressed part, not the body. Where the hook bends away from the coil the wire is loaded in bending (point A), and further round the hook it is loaded in torsion (point B). That is why the safe load shown above is the lowest of three limits. The calculator assumes the hook bend radius equals the mean radius of the coil; a tighter bend raises the stress and lowers the real limit, so send us your drawing for a hook check.'),
      h2('How to use the extension spring calculator'),
      steps(pages[1].how),
      h2('Frequently asked questions'),
      `<div style="display:grid; grid-template-columns:1fr; gap:14px; margin-top:18px;">${pages[1].faq.map(([q, a]) => card(esc(q), esc(a))).join('')}</div>`,
      h2('Related springs, guides and tools'),
      links([['/compression-spring-calculator.html', 'Compression Spring Calculator'], ['/torsion-spring-calculator.html', 'Torsion Spring Calculator'], ['/calculator.html', 'All-in-one Spring Calculator'], ['/extension-spring-manufacturer.html', 'Extension Spring Manufacturer'], ['/guides/extension-spring-load-formula.html', 'Extension Spring Formula'], ['/guides/trampoline-spring-buying-guide.html', 'Trampoline Spring Guide'], ['/guides/how-to-measure-a-spring.html', 'How to Measure a Spring'], ['/guides/spring-finishes-and-coatings.html', 'Finishes and Coatings']]),
      `<div class="si-reveal" style="text-align:center; margin-top:36px;"><a href="${wa('Hi, I designed an extension spring on your calculator and need a quote')}" style="display:inline-block; background:#ff7a1a; color:#0d1117; font-weight:800; font-size:15px; padding:14px 32px; border-radius:10px; text-decoration:none;">💬 Get a Free Quote on WhatsApp</a></div>`,
    ],
  },
  {
    file: 'torsion-spring-calculator.html',
    type: 'T',
    title: 'Torsion Spring Calculator: Rate, Max Torque & Wind Angle',
    desc: 'Free torsion spring calculator: spring rate, max safe torque, max wind angle and bending stress from wire, coil and material. Inch or mm, with 3D preview.',
    kw: 'torsion spring calculator, torsion spring rate calculator, torsion spring torque calculator, torsion spring angle calculator, torsion spring design',
    h1: 'Torsion Spring <span>Calculator</span>',
    heroP: 'Free online torsion spring calculator — get the spring rate, maximum safe torque, maximum wind angle and bending stress in seconds, with a live 3D preview.',
    heroFeats: ['Rate, max torque &amp; wind angle', 'Bending stress &amp; Wahl factor', 'English (inch) &amp; Metric (mm)', 'Live 3D Preview'],
    crumb: 'Torsion Spring Calculator',
    appName: 'Torsion Spring Calculator by Gurudatta Trading Co.',
    appDesc: 'Free online torsion spring calculator. Computes spring rate per revolution, maximum safe torque, maximum wind angle and bending stress, with a live 3D preview, in inch or metric units.',
    features: ['Spring rate in N·mm per revolution', 'Maximum safe torque and maximum wind angle', 'Bending stress and Wahl bending factor', 'English (inch) and Metric (mm) units', 'Live 3D spring preview', 'Full specification sheet export to WhatsApp'],
    howName: 'How to Use the Torsion Spring Calculator',
    howDesc: 'Calculate the rate, maximum safe torque and maximum wind angle of a torsion spring in five steps.',
    how: [
      ['Choose units', 'Select English (inch) or Metric (mm). Torsion is already selected as the spring type.'],
      ['Enter the dimensions', 'Enter the wire diameter, outside diameter and the number of body coils.'],
      ['Select the material and wind direction', 'Choose the wire material (music wire, hard drawn, stainless steel, mild steel and more) and left or right hand wind.'],
      ['Calculate', 'Enter your name and 10-digit mobile number, then press Calculate.'],
      ['Review and request a quote', 'Check the spring rate, maximum torque and wind angle, then send the specification to us on WhatsApp for a quote.'],
    ],
    faq: [
      ['How do I calculate the rate of a torsion spring?', 'Spring rate k = E·d⁴ / (10.8·D·Na), in N·mm per revolution, where E is the modulus of elasticity, d the wire diameter, D the mean coil diameter and Na the number of body coils. Torque = k × wind angle in revolutions; divide k by 360 for the rate per degree.'],
      ['Why does the formula use 10.8?', 'The theoretical constant is about 10.2. The practical value 10.8 is slightly higher to allow for friction between the coils and the arbor, and it is the constant the calculator uses.'],
      ['What is the maximum safe torque?', 'It is the torque at which the bending stress in the wire reaches the allowable bending stress for the chosen material, using the Wahl bending factor Kb. The allowable values are mid-range estimates, so treat the figure as a design guide.'],
      ['Why is a torsion spring stressed in bending and not shear?', 'When the legs rotate, the wire of the coils is bent. In compression and extension springs the wire is twisted, which is why those use shear stress and the shear modulus G instead.'],
      ['Which direction should a torsion spring be loaded?', 'In the direction that winds the coils tighter. Loading it in the unwinding direction raises the stress, so state the direction of wind (left or right hand) when you order.'],
      ['Does the calculator include the legs?', 'It treats every body coil as active and does not add the small extra deflection from the legs, so a real spring with long legs deflects slightly more. It also does not check leg stress or arbor clearance — send us your drawing for that.'],
      ['Can you manufacture the torsion spring I design here?', 'Yes. Send the specification to Gurudatta Trading Co. on WhatsApp from the results page and we will quote and make it to your drawing or sample, with the leg style you need.'],
    ],
    info: () => [
      `<p class="si-reveal" style="text-align:center; color:#ff7a1a; letter-spacing:2px; font-size:13px; font-weight:700; text-transform:uppercase; margin-bottom:10px;">Free Online Tool</p>`,
      `<h2 class="si-reveal" style="text-align:center; font-size:32px; font-weight:800; margin:0 0 12px; color:#ffffff;">Torsion Spring Calculator — What It Works Out</h2>`,
      para('This torsion spring calculator turns a few dimensions into a specification report: spring rate, maximum safe torque, maximum wind angle and the bending stress at that torque, with a live 3D preview. Enter the wire diameter, outside diameter and number of body coils, choose the material and press Calculate. It works in inches or millimetres.'),
      grid(250, [
        card('Spring rate', 'Torque per revolution (N·mm/rev) from the wire diameter, mean coil diameter, body coils and the material’s modulus of elasticity.'),
        card('Max torque and wind angle', 'The torque at which bending stress reaches the material’s allowable stress, and the wind angle that torque produces.'),
        card('Bending stress and index', 'The Wahl bending factor, bending stress at maximum torque and warnings when the spring index is below 4 or above 12.'),
      ]),
      h2('The formulas the calculator uses'),
      formulaBox([
        'Mean diameter &nbsp;&nbsp;&nbsp;D = OD − d &nbsp;&nbsp;&nbsp;&nbsp;Spring index &nbsp;C = D ÷ d',
        'Spring rate &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;k = E · d⁴ ÷ (10.8 · D · Na) &nbsp;&nbsp;(N·mm per revolution; Na = body coils)',
        'Torque &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;T = k · θ &nbsp;&nbsp;(θ in revolutions; k ÷ 360 gives N·mm per degree)',
        'Wahl factor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kb = (4C² − C − 1) ÷ (4C · (C − 1))',
        'Max torque &nbsp;&nbsp;&nbsp;&nbsp;Tmax = σ(allow) · π · d³ ÷ (32 · Kb)',
        'Max wind angle &nbsp;θmax = Tmax ÷ k',
      ]),
      para('<span style="display:block; margin-top:12px;">d = wire diameter, OD = outside diameter, E = modulus of elasticity of the wire. A torsion spring is stressed in bending, so it uses E and the bending factor Kb rather than G and the shear factor. More in our <a href="/guides/torsion-spring-torque-formula.html" style="color:#ff9a4d;">torsion spring torque formula guide</a>.</span>'),
      h2('Worked example'),
      para('Entering these values in the calculator above (metric, mild steel, right-hand wind) gives:'),
      tbl(['Input', 'Value'], [
        ['Wire diameter', '2 mm'], ['Outside diameter', '20 mm'], ['Total coils', '8'], ['Material', 'Mild steel IS 4454 (E = 200,000 N/mm²)'], ['Wind direction', 'Right hand'],
      ]),
      `<div style="height:16px;"></div>`,
      tbl(['Result', 'Value'], [
        ['Mean diameter / spring index', '18 mm / 9'], ['Active coils', '8'], ['Spring rate', '2057.6 N·mm/rev (5.72 N·mm per degree)'], ['Wahl bending factor', '1.0903'], ['Maximum safe torque', '504.3 N·mm (5.14 kgf·cm)'], ['Maximum wind angle', '88.2° (0.245 rev)'], ['Bending stress at maximum torque', '700 N/mm²'], ['Body length', '16 mm'],
      ]),
      para('<span style="display:block; margin-top:12px;">Check by hand: k = 200,000 × 2⁴ ÷ (10.8 × 18 × 8) = 2057.6 N·mm/rev. The torque at a 45° wind is then about 5.72 × 45 ≈ 257 N·mm.</span>'),
      h2('Design notes for torsion springs'),
      para('Load a torsion spring in the direction that tightens the coils. As the spring winds up its coil diameter shrinks and its body gets longer, so it needs a supporting rod (arbor) with clearance. The calculator treats every body coil as active and does not add the small deflection contributed by the legs, nor check leg stress or arbor clearance; send us your drawing for those checks. The form also shows free-length and end-configuration fields because it is shared with the other spring types; for a torsion spring they do not change the rate or torque shown.'),
      h2('How to use the torsion spring calculator'),
      steps(pages[2].how),
      h2('Frequently asked questions'),
      `<div style="display:grid; grid-template-columns:1fr; gap:14px; margin-top:18px;">${pages[2].faq.map(([q, a]) => card(esc(q), esc(a))).join('')}</div>`,
      h2('Related springs, guides and tools'),
      links([['/compression-spring-calculator.html', 'Compression Spring Calculator'], ['/extension-spring-calculator.html', 'Extension Spring Calculator'], ['/calculator.html', 'All-in-one Spring Calculator'], ['/guides/torsion-spring-torque-formula.html', 'Torsion Spring Formula'], ['/guides/how-to-measure-a-spring.html', 'How to Measure a Spring'], ['/guides/mild-steel-vs-stainless-steel-vs-music-wire-springs.html', 'Spring Materials'], ['/products/torsion-spring/', 'Torsion Spring Products']]),
      `<div class="si-reveal" style="text-align:center; margin-top:36px;"><a href="${wa('Hi, I designed a torsion spring on your calculator and need a quote')}" style="display:inline-block; background:#ff7a1a; color:#0d1117; font-weight:800; font-size:15px; padding:14px 32px; border-radius:10px; text-decoration:none;">💬 Get a Free Quote on WhatsApp</a></div>`,
    ],
  },
];

function must(cond, msg) { if (!cond) throw new Error('Anchor not found: ' + msg); }

function build(p) {
  let h = src;
  const url = `${base}/${p.file}`;
  const rep = (re, to, label) => { must(re.test(h), label); h = h.replace(re, () => to); };

  rep(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`, 'title');
  rep(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(p.desc)}">`, 'description');
  rep(/<meta name="keywords" content="[^"]*"\s*\/?>/, `<meta name="keywords" content="${esc(p.kw)}">`, 'keywords');
  rep(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}">`, 'canonical');
  rep(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(p.title)}">`, 'og:title');
  rep(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(p.desc)}">`, 'og:description');
  rep(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}">`, 'og:url');
  if (/<meta name="twitter:title" content="[^"]*"\s*\/?>/.test(h)) h = h.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, () => `<meta name="twitter:title" content="${esc(p.title)}">`);
  if (/<meta name="twitter:description" content="[^"]*"\s*\/?>/.test(h)) h = h.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, () => `<meta name="twitter:description" content="${esc(p.desc)}">`);

  // hero
  rep(/<h1>Spring Rate <span>Calculator<\/span><\/h1>/, `<h1>${p.h1}</h1>`, 'h1');
  must(/(<h1>[\s\S]*?<\/h1>\s*)<p>[\s\S]*?<\/p>/.test(h), 'hero p');
  h = h.replace(/(<h1>[\s\S]*?<\/h1>\s*)<p>[\s\S]*?<\/p>/, (m, a) => `${a}<p>${p.heroP}</p>`);
  rep(/<div class="hero-feats">[\s\S]*?<\/div>/, `<div class="hero-feats">\n    ${p.heroFeats.map(f => `<span class="hf">${f}</span>`).join('\n    ')}\n  </div>`, 'hero feats');

  // JSON-LD: adapt nodes
  must((src.match(/<script type="application\/ld\+json">/g) || []).length === 1, 'exactly one ld+json block');
  rep(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '@@LD@@', 'ld+json');
  const ldMatch = src.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const ld = JSON.parse(ldMatch[1]);
  ld['@graph'] = ld['@graph'].map(n => {
    switch (n['@type']) {
      case 'SoftwareApplication':
        return { ...n, '@id': `${url}#calculator`, name: p.appName, url, description: p.appDesc, dateModified: today, featureList: p.features };
      case 'HowTo':
        return { ...n, '@id': `${url}#howto`, name: p.howName, description: p.howDesc, step: p.how.map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })) };
      case 'FAQPage':
        return { ...n, mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
      case 'BreadcrumbList':
        return { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: base + '/' }, { '@type': 'ListItem', position: 2, name: 'Spring Calculator', item: base + '/calculator.html' }, { '@type': 'ListItem', position: 3, name: p.crumb, item: url }] };
      case 'WebPage':
        return { ...n, '@id': url, url, name: p.title, description: p.desc };
      default:
        return n;
    }
  });
  h = h.replace('@@LD@@', () => `<script type="application/ld+json">\n${JSON.stringify(ld).replace(/<\//g, '<\\/')}\n</script>`);

  // explanatory section below the tool
  const secReInside = /(<section class="spring-info-section"[^>]*>\s*<div style="max-width: 960px; margin: 0 auto;">)[\s\S]*?(<\/div>\s*<\/section>\s*<\/div><!-- \/page -->)/;
  const secReOutside = /(<section class="spring-info-section"[^>]*>\s*<div style="max-width: 960px; margin: 0 auto;">)[\s\S]*?(<\/div>\s*<\/section>)/;
  const infoHtml = `\n\n    ${p.info().join('\n    ')}\n\n  </div>\n</section>`;
  if (secReInside.test(h)) {
    // section still inside the two-column .page grid: close the grid before it
    h = h.replace(secReInside, (m, a) => `</div><!-- /page -->\n${a}${infoHtml}`);
  } else {
    must(secReOutside.test(h), 'spring-info-section');
    h = h.replace(secReOutside, (m, a) => `${a}${infoHtml}`);
  }

  // preselect the spring type once the page has loaded
  const sel = p.type === 'C' ? '' : `<script>window.addEventListener('load',function(){try{setType('${p.type}');}catch(e){}});</script>\n`;
  must(h.includes('</body>'), 'body end');
  h = h.replace('</body>', () => `${sel}</body>`);

  fs.writeFileSync(path.join(root, p.file), h);
  return url;
}

const urls = pages.map(build);

// sitemap entries
const smPath = path.join(root, 'sitemap.xml');
if (fs.existsSync(smPath)) {
  let sm = fs.readFileSync(smPath, 'utf8');
  for (const u of urls) {
    if (!sm.includes(u)) sm = sm.replace('</urlset>', `<url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n</urlset>`);
  }
  fs.writeFileSync(smPath, sm);
}
console.log('Generated:', urls.join(', '));
