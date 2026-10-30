// Generates Maharashtra city landing pages (Nashik, Solapur, Chhatrapati Sambhajinagar, Nagpur, Kolhapur)
// Frame (head, nav, footer, shared CSS/JS) = spring-manufacturer-pune.html. Each page gets its own copy:
// intro, industries, springs commonly ordered, areas, logistics and FAQ. Run: node generate-city-pages.mjs
import fs from 'fs';

const BASE = 'https://industrialspringmanufacturer.com';
const TODAY = new Date().toISOString().slice(0, 10);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const enc = encodeURIComponent;
const COIL = '<svg class="coil-mark" viewBox="0 0 26 14" aria-hidden="true"><path d="M0,7 C3,0 5,0 6.5,7 C8,14 10,14 11.5,7 C13,0 15,0 16.5,7 C18,14 20,14 21.5,7 C23,0 25,0 26,7"/></svg>';

const CITIES = [
  {
    slug: 'spring-manufacturer-nashik', name: 'Nashik', short: 'Nashik',
    title: 'Industrial Spring Manufacturer for Nashik | Gurudatta Trading',
    desc: 'Industrial spring manufacturer supplying Nashik: compression, extension & torsion springs for Ambad, Satpur & Sinnar MIDC. Made in Mumbai, 24-hr quote.',
    eyebrow: 'Nashik Spring Supply Guide',
    h1: 'Industrial Spring Manufacturer for Nashik: Compression, Extension &amp; Torsion Springs Delivered to Ambad, Satpur &amp; Sinnar',
    sub: "Gurudatta Trading Co. makes precision springs at its Goregaon (Mumbai) factory and supplies Nashik's engineering, electrical and agro-processing units, from Ambad and Satpur MIDC to Sinnar, Igatpuri and Nashik Road.",
    distance: 'about 170 km by road',
    intro: "Nashik's industrial base is a mix of auto-component and engineering shops in Ambad and Satpur, electrical and switchgear makers around Sinnar and Gonde, and processing plants built around the district's grape, onion and food industry. Every one of them has moving parts that rely on a spring: a return spring in a press tool, a contact spring inside a control panel, a compression spring in a sorting or packing machine. We have manufactured these springs for over 30 years from Mumbai and dispatch them to Nashik on the same specification, batch after batch, so a replacement matches the original.",
    industries: [
      ['🚗', 'Auto Components &amp; Engineering', 'Ambad and Satpur MIDC units source clutch springs, return springs, valve springs and wire forms for auto components and general engineering work.'],
      ['⚡', 'Electrical &amp; Switchgear', 'Switchgear, meter and control-panel makers around Sinnar and Satpur typically need small compression, torsion and contact springs in stainless steel or phosphor bronze.'],
      ['🍇', 'Agro &amp; Food Processing', "Packing, sorting and processing machinery used for Nashik's grape, onion and food industry runs on compression and extension springs, often in stainless steel."],
      ['🔧', 'Workshops &amp; Repair', 'Garages, fabrication shops and hardware stores in Nashik city and Nashik Road order single replacement springs for gates, vehicles and tools.'],
    ],
    ordered: [
      ['Compression springs', 'The default spring for press tools, machine guards and packing lines.', '/compression-spring-manufacturer.html', 'How to choose a compression spring manufacturer'],
      ['Torsion springs', 'Used in switchgear mechanisms, levers and clamps where a twisting load is needed.', '/products/torsion-spring/', 'Torsion spring range'],
      ['Die springs', 'High-load springs for press tools and fixtures at Ambad and Satpur job-shops.', '/products/die-spring/', 'Die spring range'],
      ['Wire forms', 'Custom bent wire parts and clips made from a sample or drawing.', '/products/wire-form/', 'Wire form range'],
    ],
    regions: [
      ['Industrial Estates (MIDC)', ['Ambad MIDC', 'Satpur MIDC', 'Sinnar', 'Gonde', 'Igatpuri', 'Dindori']],
      ['Nashik City &amp; Nearby', ['Nashik Road', 'Panchavati', 'CIDCO', 'Deolali', 'Ozar']],
    ],
    logistics: "Our factory is in Goregaon East, Mumbai, about 170 km by road from Nashik. Finished springs are packed to the order size and sent by road transport or courier with a GST invoice, and we share a dispatch estimate when the order is confirmed.",
    faqs: [
      ['Which Nashik industrial areas do you deliver springs to?', 'We dispatch to Ambad MIDC, Satpur MIDC, Sinnar, Gonde and Igatpuri as well as Nashik city and Nashik Road. Share your location on WhatsApp for a dispatch estimate.'],
      ['How are springs sent from Mumbai to Nashik?', 'Our factory is in Goregaon East, Mumbai, about 170 km by road from Nashik. Orders go by road transport or courier, packed to the order size, with a GST invoice.'],
      ['Can I order a few springs for a machine repair in Nashik?', 'Yes. There is no minimum order quantity. Send the worn spring or its wire diameter, outer diameter, free length and number of coils on WhatsApp and we will quote.'],
      ['Do you make small springs for electrical and switchgear parts?', 'Yes. We make compression, torsion and extension springs in hard-drawn steel, stainless steel and phosphor bronze. Send a drawing or sample and the working load.'],
    ],
    near: ['spring-manufacturer-pune', 'spring-manufacturer-chhatrapati-sambhajinagar'],
  },
  {
    slug: 'spring-manufacturer-solapur', name: 'Solapur', short: 'Solapur',
    title: 'Industrial Spring Manufacturer for Solapur | Gurudatta Trading',
    desc: 'Industrial spring manufacturer supplying Solapur: compression, extension & torsion springs for loom, sugar and engineering units. Made in Mumbai, GST invoice.',
    eyebrow: 'Solapur Spring Supply Guide',
    h1: 'Industrial Spring Manufacturer for Solapur: Springs for Looms, Sugar Mills &amp; Engineering Units',
    sub: "Gurudatta Trading Co. makes compression, extension and torsion springs in Mumbai and supplies Solapur's textile, sugar and engineering industry, including Akkalkot Road and Chincholi MIDC, Barshi, Pandharpur and Akluj.",
    distance: 'about 400 km by road',
    intro: "Solapur is known for its terry-towel and textile mills, and its district is full of sugar mills, oil mills and engineering workshops. All of that machinery depends on springs that wear: tension springs on loom mechanisms, compression springs in mill machinery, return springs on gates and valves. Instead of waiting weeks for a local trader to source a part, Solapur buyers can send a worn sample or a drawing to our Mumbai factory and receive a spring made to the same dimensions and material, with a GST invoice.",
    industries: [
      ['🧵', 'Textile &amp; Towel Mills', 'Loom and textile machinery use extension, compression and torsion springs that wear with constant cycling and need exact replacements.'],
      ['🍬', 'Sugar &amp; Agro Processing', 'Sugar mills and agro-processing plants across Solapur district order heavy compression springs and valve springs for crushing and processing machinery.'],
      ['🏭', 'Engineering &amp; Foundry Workshops', 'Akkalkot Road and Chincholi MIDC workshops need die springs, return springs and custom wire forms for tools and fixtures.'],
      ['🚜', 'Vehicle &amp; Farm Machinery Repair', 'Repair shops serving tractors, pumps and farm equipment order single springs by sample for quick replacement.'],
    ],
    ordered: [
      ['Extension springs', 'Common on loom mechanisms, return linkages and gates.', '/extension-spring-manufacturer.html', 'Extension spring manufacturer guide'],
      ['Heavy-duty compression springs', 'For mill machinery and presses carrying large loads.', '/heavy-duty-spring-manufacturer.html', 'Heavy-duty spring manufacturer'],
      ['Torsion springs', 'For levers, clamps and guards on machinery.', '/products/torsion-spring/', 'Torsion spring range'],
      ['Wire forms &amp; hooks', 'Custom-bent wire parts made from a worn sample.', '/products/wire-form/', 'Wire form range'],
    ],
    regions: [
      ['Industrial Areas', ['Akkalkot Road MIDC', 'Chincholi MIDC', 'Hotgi Road']],
      ['Solapur District Towns', ['Barshi', 'Pandharpur', 'Akluj', 'Solapur city']],
    ],
    logistics: "Solapur is about 400 km by road from our Goregaon East factory in Mumbai. Springs are packed to the order size and sent by road transport or courier, and we confirm the route and dispatch estimate when the order is finalised. A GST invoice is included.",
    faqs: [
      ['Do you supply springs for loom and textile machinery in Solapur?', 'Yes. Send the worn spring or a drawing with the working load, and we will make a matching compression, extension or torsion spring in a suitable wire grade.'],
      ['How are springs delivered to Solapur?', 'Solapur is about 400 km by road from our Mumbai factory. We send orders by road transport or courier with a GST invoice and share a dispatch estimate once the order is confirmed.'],
      ['Which parts of Solapur district do you cover?', 'Akkalkot Road MIDC, Chincholi MIDC, Hotgi Road, Barshi, Pandharpur, Akluj and Solapur city. Share your location on WhatsApp if your area is not listed.'],
      ['Can you make a spring from a broken sample without a drawing?', 'Yes. Send the broken or worn spring (or a clear photo with measurements) and a brief note on how it is used, and we will work out the dimensions and recommend a material.'],
    ],
    near: ['spring-manufacturer-pune', 'spring-manufacturer-kolhapur'],
  },
  {
    slug: 'spring-manufacturer-chhatrapati-sambhajinagar', name: 'Chhatrapati Sambhajinagar', short: 'Chhatrapati Sambhajinagar (Aurangabad)',
    title: 'Spring Manufacturer for Aurangabad (Sambhajinagar) | Gurudatta',
    desc: 'Industrial spring manufacturer for Chhatrapati Sambhajinagar (Aurangabad): springs for Waluj, Chikalthana & Shendra MIDC units. Made in Mumbai, GST invoice.',
    eyebrow: 'Chhatrapati Sambhajinagar Spring Supply Guide',
    h1: 'Industrial Spring Manufacturer for Chhatrapati Sambhajinagar (Aurangabad): Springs for Waluj, Chikalthana &amp; Shendra MIDC',
    sub: 'Gurudatta Trading Co. makes precision compression, extension and torsion springs in Mumbai and supplies auto-ancillary, pharma-packaging, electrical and engineering units in Chhatrapati Sambhajinagar, formerly Aurangabad.',
    distance: 'about 330 km by road',
    intro: "Chhatrapati Sambhajinagar, still searched for as Aurangabad by many buyers, is one of Maharashtra's main auto-ancillary and consumer-durables belts, with large industrial areas at Waluj, Chikalthana and Shendra. These plants run on assembly lines, presses and packaging machines where a spring that is a few millimetres off in length or a different wire grade shows up as a quality or downtime problem. We manufacture springs to a drawing or sample from our Mumbai factory and dispatch them to Chhatrapati Sambhajinagar so replacements match the original.",
    industries: [
      ['🚗', 'Auto &amp; Auto-Ancillary', 'Waluj and Chikalthana units use clutch springs, return springs, valve springs and wire forms on assembly and test equipment.'],
      ['💊', 'Pharma &amp; Packaging Machinery', 'Filling, capping and packaging lines at Shendra and Chikalthana plants need stainless steel compression and die springs.'],
      ['📺', 'Consumer Durables &amp; Electricals', 'Appliance and electrical manufacturers order small compression, torsion and extension springs for latches, hinges and switches.'],
      ['🔧', 'Engineering Job Shops', 'Tool rooms and machine shops need die springs and custom wire forms for presses, jigs and fixtures.'],
    ],
    ordered: [
      ['Compression springs', 'For assembly equipment, presses and packaging lines.', '/compression-spring-manufacturer.html', 'Compression spring manufacturer guide'],
      ['Stainless steel springs', 'For pharma, food and washdown machinery.', '/guides/mild-steel-vs-stainless-steel-vs-music-wire-springs.html', 'Steel vs stainless vs music wire springs'],
      ['Die springs', 'High-load springs for press tools and fixtures.', '/products/die-spring/', 'Die spring range'],
      ['Torsion springs', 'For hinges, latches and spring-loaded levers.', '/products/torsion-spring/', 'Torsion spring range'],
    ],
    regions: [
      ['Industrial Estates (MIDC)', ['Waluj MIDC', 'Chikalthana MIDC', 'Shendra MIDC', 'Chitegaon', 'Paithan']],
      ['City &amp; Nearby', ['Chhatrapati Sambhajinagar city', 'CIDCO', 'Jalna Road', 'Aurangabad (old name)']],
    ],
    logistics: "Chhatrapati Sambhajinagar is about 330 km by road from our Goregaon East factory in Mumbai. Springs are packed to the order size and sent by road transport or courier with a GST invoice. We share a dispatch estimate when the order is confirmed.",
    faqs: [
      ['Is Chhatrapati Sambhajinagar the same as Aurangabad?', 'Yes. The city was formerly called Aurangabad. We supply springs for both names, and the same Waluj, Chikalthana and Shendra MIDC areas are covered.'],
      ['Do you deliver to Waluj, Chikalthana and Shendra MIDC?', 'Yes. We dispatch to all three MIDC areas as well as Chitegaon, Paithan and the city. Share your location on WhatsApp for a dispatch estimate.'],
      ['What springs do auto-ancillary units usually ask for?', 'Most orders are compression springs, return springs and wire forms in hard-drawn steel or music wire. Send the drawing or sample with the load requirement and we will quote.'],
      ['How quickly will I get a quotation?', 'Send your requirement on WhatsApp and our team usually replies with pricing and lead time within 24 hours.'],
    ],
    near: ['spring-manufacturer-nashik', 'spring-manufacturer-pune'],
  },
  {
    slug: 'spring-manufacturer-nagpur', name: 'Nagpur', short: 'Nagpur',
    title: 'Industrial Spring Manufacturer for Nagpur | Gurudatta Trading',
    desc: 'Industrial spring manufacturer supplying Nagpur: heavy-duty compression, extension & torsion springs for Hingna, Butibori & MIHAN. Made in Mumbai, GST invoice.',
    eyebrow: 'Nagpur Spring Supply Guide',
    h1: 'Industrial Spring Manufacturer for Nagpur: Heavy-Duty &amp; Precision Springs for Hingna, Butibori &amp; MIHAN',
    sub: "Gurudatta Trading Co. makes compression, extension, torsion and heavy-duty springs in Mumbai and supplies Vidarbha's engineering, power and mining-equipment units, from Hingna and Butibori MIDC to MIHAN, Kalmeshwar and Kamptee.",
    distance: 'over 800 km by road',
    intro: "Nagpur sits at the centre of Vidarbha's coal, power and heavy-engineering belt, with industrial areas at Hingna, Butibori and Kalmeshwar and the MIHAN project on its outskirts. Equipment in that region works hard and breaks springs: heavy compression springs in mining and material-handling equipment, valve and return springs in power-plant auxiliaries, precision springs in fabrication and assembly units. Because Nagpur is far from the Mumbai factory, getting the specification right the first time matters, so we ask for a drawing or sample up front and confirm material and dimensions before we dispatch.",
    industries: [
      ['⛏️', 'Mining &amp; Material Handling', 'Equipment used around the Vidarbha coal belt often needs heavy-duty compression springs in alloy or hard-drawn wire.'],
      ['⚡', 'Power &amp; Electrical', 'Power-plant auxiliaries and electrical equipment makers use valve springs, return springs and contact springs.'],
      ['🏭', 'Heavy Engineering &amp; Fabrication', 'Hingna and Butibori MIDC units order die springs, compression springs and wire forms for machines and fixtures.'],
      ['✈️', 'MIHAN &amp; Precision Vendors', 'Precision vendor units in the MIHAN area may need tightly specified springs; send the drawing and tolerance for a quote.'],
    ],
    ordered: [
      ['Heavy-duty compression springs', 'For mining, material-handling and press equipment.', '/heavy-duty-spring-manufacturer.html', 'Heavy-duty spring manufacturer'],
      ['Die springs', 'High-load rectangular-wire springs for tooling.', '/products/die-spring/', 'Die spring range'],
      ['Extension springs', 'For gates, linkages and counterbalance mechanisms.', '/extension-spring-manufacturer.html', 'Extension spring manufacturer guide'],
      ['Custom wire forms', 'Bent wire parts made to a drawing or sample.', '/products/wire-form/', 'Wire form range'],
    ],
    regions: [
      ['Industrial Estates (MIDC)', ['Hingna MIDC', 'Butibori MIDC', 'Kalmeshwar MIDC', 'MIHAN', 'Kamptee']],
      ['Nagpur City', ['Nagpur city', 'Wadi', 'Mankapur', 'Katol Road']],
    ],
    logistics: "Nagpur is over 800 km by road from our Goregaon East factory in Mumbai. Springs are packed for long-distance transport and sent by road transport or courier with a GST invoice. We confirm the transport route and a dispatch estimate when the order is finalised, rather than quoting a fixed delivery time up front.",
    faqs: [
      ['Do you deliver springs to Nagpur and MIHAN?', 'Yes. We dispatch to Nagpur city, Hingna, Butibori, Kalmeshwar, Kamptee and the MIHAN area. Share your location and quantity on WhatsApp for a dispatch estimate.'],
      ['How long does delivery to Nagpur take?', 'Nagpur is over 800 km from our Mumbai factory, so we confirm the transport route and dispatch estimate when the order is finalised instead of promising a fixed time in advance.'],
      ['Can you supply heavy-duty springs for mining and industrial machinery?', 'Yes. We make heavy-duty compression and die springs. Send the load, free length, outer diameter and working conditions, or the worn spring, and we will quote.'],
      ['Do you provide a GST invoice for Nagpur orders?', 'Yes. Every order is supplied with a GST invoice, and we are an ISO 9001:2015 certified, GST-registered and Udyam-recognised manufacturer.'],
    ],
    near: ['spring-manufacturer-chhatrapati-sambhajinagar', 'spring-manufacturer-nashik'],
  },
  {
    slug: 'spring-manufacturer-kolhapur', name: 'Kolhapur', short: 'Kolhapur',
    title: 'Industrial Spring Manufacturer for Kolhapur | Gurudatta Trading',
    desc: 'Industrial spring manufacturer for Kolhapur: springs for foundry, machine-shop and textile units at Shiroli, Gokul Shirgaon & Ichalkaranji. Made in Mumbai.',
    eyebrow: 'Kolhapur Spring Supply Guide',
    h1: 'Industrial Spring Manufacturer for Kolhapur: Springs for Foundries, Machine Shops &amp; Textile Units',
    sub: "Gurudatta Trading Co. makes compression, extension and torsion springs in Mumbai and supplies Kolhapur's foundry, machine-tool and textile industry, including Shiroli and Gokul Shirgaon MIDC, Udyam Nagar and Ichalkaranji.",
    distance: 'about 380 km by road',
    intro: "Kolhapur is best known for its foundry and casting cluster, and around it sit machine-tool makers, auto-component shops, pump manufacturers and the textile units of Ichalkaranji. Foundry and machine-shop equipment such as moulding machines, presses and fixtures uses heavy compression and die springs, while textile machinery relies on extension and torsion springs. We make these springs from our Mumbai factory in the wire grade and dimensions you specify and send them to Kolhapur by road with a GST invoice, whether you need a single replacement or a regular batch.",
    industries: [
      ['🏭', 'Foundry &amp; Casting', 'Moulding machines, shake-out equipment and fixtures use heavy compression springs and die springs that take repeated shock loads.'],
      ['⚙️', 'Machine Tools &amp; Auto Components', 'Shiroli, Gokul Shirgaon and Udyam Nagar machine shops order die springs, return springs and custom wire forms.'],
      ['🧵', 'Textile Units (Ichalkaranji)', 'Power-loom and textile machinery use extension, compression and torsion springs that wear with constant cycling.'],
      ['🌾', 'Sugar &amp; Agro Processing', 'Processing equipment in the Kolhapur and Sangli belt needs compression and extension springs, often in stainless steel.'],
    ],
    ordered: [
      ['Heavy-duty compression springs', 'For foundry equipment, presses and shock-load applications.', '/heavy-duty-spring-manufacturer.html', 'Heavy-duty spring manufacturer'],
      ['Die springs', 'For press tools, jigs and fixtures in machine shops.', '/products/die-spring/', 'Die spring range'],
      ['Extension springs', 'For loom mechanisms and return linkages.', '/extension-spring-manufacturer.html', 'Extension spring manufacturer guide'],
      ['Stainless steel springs', 'For food, sugar and washdown machinery.', '/guides/mild-steel-vs-stainless-steel-vs-music-wire-springs.html', 'Steel vs stainless vs music wire springs'],
    ],
    regions: [
      ['Industrial Areas', ['Udyam Nagar', 'Shiroli MIDC', 'Gokul Shirgaon MIDC', 'Kagal-Hatkanangale MIDC']],
      ['Nearby Towns', ['Ichalkaranji', 'Sangli', 'Kolhapur city']],
    ],
    logistics: "Kolhapur is about 380 km by road from our Goregaon East factory in Mumbai. Springs are packed to the order size and sent by road transport or courier with a GST invoice, and we confirm the route and dispatch estimate when the order is finalised.",
    faqs: [
      ['Do you supply springs to Kolhapur foundries and machine shops?', 'Yes. Foundry and machine-shop equipment usually needs heavy compression or die springs. Send the load, free length and outer diameter, or the worn spring, and we will quote.'],
      ['Which Kolhapur areas do you deliver to?', 'Udyam Nagar, Shiroli MIDC, Gokul Shirgaon MIDC, Kagal-Hatkanangale MIDC, Ichalkaranji, Sangli and Kolhapur city. Share your location on WhatsApp if your area is not listed.'],
      ['Can you make stainless steel springs for food or sugar processing equipment?', 'Yes. We work in stainless steel for corrosive and washdown conditions. Tell us the operating environment and load and we will recommend a grade.'],
      ['What details do you need for a quote?', 'Wire diameter, outer diameter, free length, total coils, material and quantity. If you do not have them, send the worn spring or a clear photo with measurements.'],
    ],
    near: ['spring-manufacturer-solapur', 'spring-manufacturer-pune'],
  },
  {
    slug: 'spring-manufacturer-vasai-virar-palghar', name: 'Vasai-Virar and Palghar', short: 'Vasai-Virar and Palghar',
    title: 'Spring Manufacturer Vasai-Virar & Palghar | Gurudatta Trading',
    desc: 'Spring manufacturer for Vasai-Virar & Palghar: compression, extension & torsion springs for Waliv, Sativali & Boisar–Tarapur. Made in Mumbai, 24-hr quote.',
    eyebrow: 'Vasai–Palghar Spring Supply Guide',
    h1: 'Spring Manufacturer for Vasai-Virar and Palghar: Compression, Extension &amp; Torsion Springs Delivered to Waliv, Sativali &amp; Boisar–Tarapur',
    sub: "Gurudatta Trading Co. makes precision springs at its Goregaon (Mumbai) factory and supplies engineering, chemical and pharma units in Vasai East, Palghar and the Boisar–Tarapur MIDC belt, a short run up the western highway.",
    distance: 'roughly 40 to 100 km by road, depending on the area',
    intro: "North of Mumbai, the Vasai-Virar and Palghar belt is a mix of small engineering and fabrication shops in Vasai East, process-equipment and chemical plants in the Boisar–Tarapur MIDC, and packaging and pharma units spread across the Palghar district. Every one of them has moving parts that rely on a spring: a return spring in a press tool, a stainless compression spring in a dosing valve, an extension spring in a packing machine. We have manufactured these springs for over 30 years from Mumbai, and because our factory is only about 40 to 100 km away, replacements reach Vasai-Virar and Palghar on the same specification, batch after batch, so a replacement matches the original.",
    industries: [
      ['🏭', 'Engineering &amp; Fabrication', 'Machine shops and fabricators in Waliv, Sativali and Gokhiware (Vasai East) source die springs, return springs and wire forms for tooling, fixtures and small machines.'],
      ['🧪', 'Chemical &amp; Process Equipment', 'Plants around Boisar–Tarapur use valves, actuators and dosing equipment that need corrosion-resistant stainless steel compression and torsion springs.'],
      ['💊', 'Pharma &amp; Packaging', 'Filling, capping and packing machines use small stainless steel compression and extension springs where cleanliness and consistent force matter.'],
      ['🔧', 'Workshops &amp; Repair', 'Garages, fabrication shops and hardware stores in Vasai, Virar and Nallasopara order single replacement springs for gates, vehicles and tools.'],
    ],
    ordered: [
      ['Compression springs', 'The default spring for press tools, machine guards and packing lines.', '/compression-spring-manufacturer.html', 'How to choose a compression spring manufacturer'],
      ['Torsion springs', 'Used in valve actuators, latches and clamps where a twisting load is needed.', '/products/torsion-spring/', 'Torsion spring range'],
      ['Die springs', 'High-load springs for press tools and fixtures at Vasai East job-shops.', '/products/die-spring/', 'Die spring range'],
      ['Wire forms', 'Custom bent wire parts and clips made from a sample or drawing.', '/products/wire-form/', 'Wire form range'],
    ],
    regions: [
      ['Industrial Estates', ['Waliv', 'Sativali', 'Gokhiware', 'Boisar–Tarapur MIDC', 'Palghar MIDC']],
      ['Towns &amp; Nearby', ['Vasai', 'Virar', 'Nallasopara', 'Naigaon', 'Palghar', 'Boisar']],
    ],
    logistics: "Our factory is in Goregaon East, Mumbai, roughly 40 to 100 km by road from Vasai-Virar and Palghar, depending on the area. Finished springs are packed to the order size and sent by road transport or courier with a GST invoice, and we share a dispatch estimate when the order is confirmed.",
    faqs: [
      ['Which Vasai-Virar and Palghar areas do you deliver springs to?', 'We dispatch to Waliv, Sativali and Gokhiware in Vasai East, Boisar–Tarapur MIDC and Palghar MIDC, as well as Vasai, Virar and Nallasopara. Share your location on WhatsApp for a dispatch estimate.'],
      ['How are springs sent from Mumbai to Vasai-Virar and Palghar?', 'Our factory is in Goregaon East, Mumbai, roughly 40 to 100 km by road from this belt. Orders go by road transport or courier, packed to the order size, with a GST invoice.'],
      ['Can I order a few springs for a machine repair in Vasai?', 'Yes. There is no minimum order quantity. Send the worn spring or its wire diameter, outer diameter, free length and number of coils on WhatsApp and we will quote.'],
      ['Do you make stainless steel springs for chemical or process equipment?', 'Yes. We make compression, extension and torsion springs in stainless steel as well as hard-drawn steel. Send a drawing or sample, the working load and details of the operating environment.'],
    ],
    near: ['spring-manufacturer-bhiwandi-taloja-thane', 'spring-manufacturer-nashik'],
  },
  {
    slug: 'spring-manufacturer-raigad-panvel-khopoli', name: 'Raigad', short: 'Raigad',
    title: 'Spring Manufacturer for Raigad & Panvel | Gurudatta Trading',
    desc: 'Spring manufacturer supplying Raigad: compression, extension & torsion springs for Patalganga, Khopoli, Roha & Mahad MIDC. Made in Mumbai, 24-hr quote.',
    eyebrow: 'Raigad Spring Supply Guide',
    h1: 'Spring Manufacturer for Raigad: Compression, Extension &amp; Torsion Springs Delivered to Panvel, Patalganga, Khopoli &amp; Roha',
    sub: "Gurudatta Trading Co. makes precision springs at its Goregaon (Mumbai) factory and supplies Raigad's chemical, steel and engineering units, from Panvel and Patalganga to Khopoli, Roha and Mahad MIDC.",
    distance: 'roughly 50 to 180 km by road (Panvel is nearest, Mahad is furthest)',
    intro: "South-east of Mumbai, Raigad district is one of Maharashtra's heaviest industrial belts: chemical and process plants at Patalganga, Roha and Mahad, steel and heavy engineering around Khopoli and Dolvi–Pen, and warehousing and port-linked units around Panvel and Uran. Every one of them has moving parts that rely on a spring: a stainless torsion spring in a valve actuator, a heavy compression spring in a hopper or press, an extension spring on a dock gate. We have manufactured these springs for over 30 years from Mumbai, and Raigad is on the same highway corridor as our factory, so replacements arrive on the same specification, batch after batch.",
    industries: [
      ['⚗️', 'Chemical &amp; Process Industry', 'Plants at Patalganga, Roha and Mahad MIDC run pumps, valves and dosing equipment that need corrosion-resistant stainless steel compression and torsion springs.'],
      ['🏗️', 'Steel &amp; Heavy Engineering', 'Fabrication and engineering units around Khopoli, Rasayani and Dolvi–Pen need heavy compression springs, die springs and wire forms for presses, hoppers and handling equipment.'],
      ['🚛', 'Logistics &amp; Port-Linked Units', 'Warehouses and dock equipment around Panvel and Uran use extension and compression springs on gates, ramps, conveyors and latches.'],
      ['🔧', 'Workshops &amp; Repair', 'Garages, fabrication shops and hardware stores in Panvel, Pen and Alibag order single replacement springs for gates, vehicles and tools.'],
    ],
    ordered: [
      ['Compression springs', 'The default spring for press tools, machine guards and handling equipment.', '/compression-spring-manufacturer.html', 'How to choose a compression spring manufacturer'],
      ['Torsion springs', 'Used in valve actuators, latches and clamps where a twisting load is needed.', '/products/torsion-spring/', 'Torsion spring range'],
      ['Die springs', 'High-load springs for press tools and fixtures at Khopoli and Rasayani job-shops.', '/products/die-spring/', 'Die spring range'],
      ['Wire forms', 'Custom bent wire parts and clips made from a sample or drawing.', '/products/wire-form/', 'Wire form range'],
    ],
    regions: [
      ['Industrial Estates (MIDC)', ['Patalganga MIDC', 'Rasayani', 'Khopoli', 'Roha MIDC', 'Mahad MIDC', 'Dolvi–Pen']],
      ['Towns &amp; Nearby', ['Panvel', 'Uran', 'Pen', 'Alibag', 'Karjat', 'Khalapur']],
    ],
    logistics: "Our factory is in Goregaon East, Mumbai, roughly 50 to 180 km by road from Raigad locations (Panvel is nearest, Mahad is furthest). Finished springs are packed to the order size and sent by road transport or courier with a GST invoice, and we share a dispatch estimate when the order is confirmed.",
    faqs: [
      ['Which Raigad industrial areas do you deliver springs to?', 'We dispatch to Patalganga MIDC, Rasayani, Khopoli, Roha MIDC and Mahad MIDC as well as Panvel, Uran and Pen. Taloja is covered on our Bhiwandi, Taloja and Thane page. Share your location on WhatsApp for a dispatch estimate.'],
      ['How are springs sent from Mumbai to Raigad?', 'Our factory is in Goregaon East, Mumbai, roughly 50 to 180 km by road from Raigad locations. Orders go by road transport or courier, packed to the order size, with a GST invoice.'],
      ['Can I order a few springs for a machine repair in Panvel or Khopoli?', 'Yes. There is no minimum order quantity. Send the worn spring or its wire diameter, outer diameter, free length and number of coils on WhatsApp and we will quote.'],
      ['Do you make stainless steel springs for chemical plants?', 'Yes. We make compression, extension and torsion springs in stainless steel as well as hard-drawn steel. Send a drawing or sample, the working load and details of the operating environment.'],
    ],
    near: ['spring-manufacturer-bhiwandi-taloja-thane', 'spring-manufacturer-pune'],
  },
  {
    slug: 'spring-manufacturer-satara-sangli-karad', name: 'Satara and Sangli', short: 'Satara, Sangli and Karad',
    title: 'Spring Manufacturer for Satara & Sangli | Gurudatta Trading',
    desc: 'Spring manufacturer supplying Satara, Sangli & Karad: compression, extension & torsion springs for Satara and Kupwad MIDC. Made in Mumbai, 24-hr quote.',
    eyebrow: 'Satara–Sangli Spring Supply Guide',
    h1: 'Spring Manufacturer for Satara, Sangli and Karad: Compression, Extension &amp; Torsion Springs Delivered to Satara MIDC, Kupwad &amp; Miraj',
    sub: "Gurudatta Trading Co. makes precision springs at its Goregaon (Mumbai) factory and supplies the engineering, sugar-machinery and agro-processing units of Satara, Karad and Sangli-Miraj along the Pune–Bengaluru highway.",
    distance: 'roughly 280 to 400 km by road, depending on the location',
    intro: "Along the Pune–Bengaluru highway, the Satara, Karad and Sangli-Miraj belt is built around foundries and engineering job-shops in the Satara and Kupwad MIDC, machine builders serving the region's sugar and farm sector, and processing units for turmeric, grapes and other local produce. Every one of them has moving parts that rely on a spring: a heavy compression spring in an implement or crusher, a die spring in a press tool, an extension spring on a feeder or gate. We have manufactured these springs for over 30 years from Mumbai and dispatch them to Satara, Karad and Sangli on the same specification, batch after batch, so a replacement matches the original.",
    industries: [
      ['🚜', 'Agri &amp; Sugar Machinery', 'Workshops and machine builders around Karad, Sangli and Miraj need heavy compression springs, extension springs and wire forms for implements, feeders and handling equipment.'],
      ['🏭', 'Foundry &amp; Engineering', 'Job-shops in Satara MIDC and Kupwad MIDC (Sangli–Miraj) source die springs, return springs and compression springs for tooling, fixtures and small machines.'],
      ['🌶️', 'Food &amp; Agro Processing', 'Sorting, grading and packing machinery for turmeric, grapes and other local produce runs on compression and extension springs, often in stainless steel.'],
      ['🔧', 'Workshops &amp; Repair', 'Garages, fabrication shops and hardware stores in Satara, Karad and Sangli order single replacement springs for gates, vehicles and tools.'],
    ],
    ordered: [
      ['Compression springs', 'The default spring for press tools, machine guards and farm machinery.', '/compression-spring-manufacturer.html', 'How to choose a compression spring manufacturer'],
      ['Extension springs', 'Used on feeders, gates and return mechanisms where a pulling load is needed.', '/extension-spring-manufacturer.html', 'Extension spring manufacturer guide'],
      ['Die springs', 'High-load springs for press tools and fixtures at Satara and Kupwad job-shops.', '/products/die-spring/', 'Die spring range'],
      ['Wire forms', 'Custom bent wire parts and clips made from a sample or drawing.', '/products/wire-form/', 'Wire form range'],
    ],
    regions: [
      ['Industrial Estates (MIDC)', ['Satara MIDC', 'Kupwad MIDC', 'Sangli–Miraj', 'Karad']],
      ['Towns &amp; Nearby', ['Satara', 'Karad', 'Sangli', 'Miraj', 'Wai', 'Islampur']],
    ],
    logistics: "Our factory is in Goregaon East, Mumbai, roughly 280 to 400 km by road from Satara, Karad and Sangli, depending on the location. Finished springs are packed to the order size and sent by road transport or courier with a GST invoice, and we share a dispatch estimate when the order is confirmed.",
    faqs: [
      ['Which Satara, Sangli and Karad areas do you deliver springs to?', 'We dispatch to Satara MIDC, Kupwad MIDC and the Sangli–Miraj belt, Karad, Wai and Islampur. Share your location on WhatsApp for a dispatch estimate.'],
      ['How are springs sent from Mumbai to Satara and Sangli?', 'Our factory is in Goregaon East, Mumbai, roughly 280 to 400 km by road from this belt. Orders go by road transport or courier, packed to the order size, with a GST invoice.'],
      ['Can I order a few springs for a machine repair in Satara or Sangli?', 'Yes. There is no minimum order quantity. Send the worn spring or its wire diameter, outer diameter, free length and number of coils on WhatsApp and we will quote.'],
      ['Do you make heavy springs for agricultural and sugar machinery?', 'Yes. We make heavy compression and extension springs in hard-drawn steel and other grades. Send a drawing or sample and the working load so the spring can be matched to the machine.'],
    ],
    near: ['spring-manufacturer-pune', 'spring-manufacturer-kolhapur'],
  },
];

const frame = fs.readFileSync('spring-manufacturer-pune.html', 'utf8');
const mainStart = frame.indexOf('<main');
const mainEnd = frame.indexOf('</main>') + '</main>'.length;
const mainHtml = frame.slice(mainStart, mainEnd);
const parts = mainHtml.split(/(?=<section )/);
const heroHtml = parts[0];
const find = (needle) => parts.find((p) => p.includes(needle));
const typesSec = find('Types of Springs We Manufacture');
const certSec = find('Certified &amp; Verified');
const finalSec = find('final-cta');
const orderSec = find('How to Order Custom Springs');
if (!typesSec || !certSec || !finalSec || !orderSec) throw new Error('Pune frame sections not found');
const NAMES = Object.fromEntries(CITIES.map((c) => [c.slug, c.short]));
// every Maharashtra service-area page, in display order (used for the chips on each city page)
const ALL_AREAS = [['spring-manufacturer-mumbai', 'Mumbai'], ['spring-manufacturer-bhiwandi-taloja-thane', 'Bhiwandi, Taloja &amp; Thane'], ['spring-manufacturer-vasai-virar-palghar', 'Vasai-Virar &amp; Palghar'], ['spring-manufacturer-raigad-panvel-khopoli', 'Raigad (Panvel, Khopoli)'], ['spring-manufacturer-pune', 'Pune'], ['spring-manufacturer-nashik', 'Nashik'], ['spring-manufacturer-solapur', 'Solapur'], ['spring-manufacturer-satara-sangli-karad', 'Satara, Sangli &amp; Karad'], ['spring-manufacturer-kolhapur', 'Kolhapur'], ['spring-manufacturer-chhatrapati-sambhajinagar', 'Chhatrapati Sambhajinagar'], ['spring-manufacturer-nagpur', 'Nagpur']];
NAMES['spring-manufacturer-pune'] = 'Pune';
NAMES['spring-manufacturer-mumbai'] = 'Mumbai';
NAMES['spring-manufacturer-bhiwandi-taloja-thane'] = 'Bhiwandi, Taloja and Thane';
const swapPune = (h, c) => h.replace(/Pune/g, c.name === 'Chhatrapati Sambhajinagar' ? 'Chhatrapati Sambhajinagar' : c.name);

function build(c) {
  const url = `${BASE}/${c.slug}.html`;
  const wa = `https://wa.me/918454995315?text=${enc(`Hello, I need a spring quote in ${c.short}.`)}`;
  // hero
  let hero = heroHtml
    .replace(/<a href="blog\.html">Blog<\/a>/, '<a href="spring-manufacturer-maharashtra.html">Maharashtra</a>')
    .replace(/<span class="cur">[^<]*<\/span>/, `<span class="cur">Spring Manufacturer for ${c.short}</span>`)
    .replace(/(<div class="ph-eyebrow">)[^<]*(<\/div>)/, `$1${c.eyebrow}$2`)
    .replace(/(<h1 class="ph-title">)[\s\S]*?(<\/h1>)/, `$1${c.h1}$2`)
    .replace(/(<p class="ph-sub">)[\s\S]*?(<\/p>)/, `$1${esc(c.sub)}$2`)
    .replace(/https:\/\/wa\.me\/918454995315\?text=[^"]*/g, wa)
    .replace(/Try the Free Spring Rate Calculator/, 'Try the Free Spring Calculator');
  const intro = `<section class="section reveal"><p class="sec-p" style="max-width:820px;font-size:.95rem;color:var(--text)">${esc(c.intro)}</p></section>`;
  const industries = `<section class="section-full-alt"><div class="section reveal"><div class="sec-eyebrow">Industrial Context</div><h2 class="sec-h2">Who We Supply Around ${c.short}</h2><p class="sec-p">Springs used by ${c.name} industry tend to fall into four groups:</p><div class="cluster-grid">${c.industries.map(([i, h, p]) => `<div class="ci-item"><div class="ci-icon">${i}</div><div><div class="ci-h">${h}</div><div class="ci-p">${p}</div></div></div>`).join('')}</div></div></section>`;
  const types = swapPune(typesSec, c);
  const ordered = `<section class="section reveal"><div class="sec-eyebrow">Common Requests</div><h2 class="sec-h2">Springs ${c.name} Buyers Order Most</h2><p class="sec-p">These are the springs we are most often asked for by buyers in and around ${c.short}. Each links to the matching product or guide page.</p><div class="spring-grid">${c.ordered.map(([n, d, href, label]) => `<div class="cat-card">${COIL}<div class="cat-name">${n}</div><div class="cat-desc">${d} <a href="${href}">${label}</a>.</div></div>`).join('')}</div></section>`;
  const areas = `<section class="section-full-alt"><div class="section reveal"><div class="sec-eyebrow">Delivery Coverage</div><h2 class="sec-h2">${c.short} Areas &amp; Industrial Belts We Deliver To</h2><p class="sec-p">${esc(c.logistics)}</p>${c.regions.map(([h, tags]) => `<div class="region-group"><div class="region-h">${h}</div><div class="tag-list">${tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div></div>`).join('')}<p class="sec-p" style="margin-top:.4rem;margin-bottom:0">Don't see your area listed? <a href="${wa}" style="color:var(--P)" target="_blank" rel="noopener">Message us on WhatsApp</a> and we will confirm delivery.</p></div></section>`;
  const order = swapPune(orderSec, c).replace(/dispatch to [^<]*? and across Maharashtra/, `dispatch to ${c.short} and across Maharashtra`);
  const faq = `<section class="section reveal"><div class="sec-eyebrow">FAQ</div><h2 class="sec-h2">Frequently Asked Questions</h2><div class="faq" style="margin-top:1rem">${c.faqs.map(([q, a]) => `<details><summary>${esc(q)}<span></span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
  const rel = [
    ['spring-manufacturer-maharashtra', 'Regional Guide', 'Spring Manufacturer in Maharashtra', 'Delivery coverage across Pune, Nashik, Nagpur, Kolhapur &amp; more.'],
    ['spring-manufacturer-mumbai', 'City Guide', 'Spring Manufacturer in Mumbai', 'Goregaon to Borivali and every Mumbai suburb, plus our free calculator.'],
    ...c.near.map((s) => [s, 'City Guide', `Spring Manufacturer for ${NAMES[s]}`, `Springs delivered to ${NAMES[s]} industrial areas from our Mumbai factory.`]),
    ['calculator', 'Free Tool', 'Free Spring Calculator', 'Spring rate, load, solid height and stress for compression, extension and torsion springs.'],
  ];
  const related = `<section class="section reveal"><div class="sec-eyebrow">Keep Reading</div><h2 class="sec-h2">Related Guides &amp; City Pages</h2><div class="related-grid">${rel.map(([s, l, h, p]) => `<a href="${s}.html"><div class="rel-label">${l}</div><h4 aria-level="3">${h}</h4><p>${p}</p></a>`).join('')}</div><div class="sec-eyebrow" style="margin-top:1.6rem">More Maharashtra Service Areas</div><div class="tag-list">${ALL_AREAS.filter(([s]) => s !== c.slug).map(([s, n]) => `<a class="tag" href="${s}.html" style="text-decoration:none">${n}</a>`).join('')}</div></section>`;
  const final = swapPune(finalSec, c).replace(/https:\/\/wa\.me\/918454995315\?text=[^"]*/g, wa).replace(/anywhere in [A-Za-z ]+\./, `anywhere in ${c.short}.`);
  const main = hero + intro + industries + types + ordered + areas + order + certSec + faq + related + final;
  // head
  let out = frame.slice(0, mainStart).replace(/spring-manufacturer-pune\.html/g, `${c.slug}.html`) + main + frame.slice(mainEnd);
  const setMeta = (re, v) => { out = out.replace(re, (m, a, b) => a + v + b); };
  setMeta(/(<title>)[^<]*(<\/title>)/, esc(c.title));
  setMeta(/(<meta name="description" content=")[^"]*(")/, esc(c.desc));
  setMeta(/(<meta property="og:description" content=")[^"]*(")/, esc(c.desc));
  setMeta(/(<meta name="twitter:description" content=")[^"]*(")/, esc(c.desc));
  setMeta(/(<meta property="og:title" content=")[^"]*(")/, esc(`Industrial Spring Manufacturer for ${c.short} | Gurudatta Trading Co.`));
  setMeta(/(<meta name="twitter:title" content=")[^"]*(")/, esc(`Industrial Spring Manufacturer for ${c.short} | Gurudatta Trading Co.`));
  setMeta(/(<meta name="keywords" content=")[^"]*(")/, `industrial spring manufacturer ${c.name}, spring manufacturers in ${c.name}, spring supplier ${c.name}, compression spring ${c.name}, extension spring ${c.name}, torsion spring ${c.name}`);
  setMeta(/(<meta name="geo\.placename" content=")[^"]*(")/, `${c.name}, Maharashtra, India`);
  // JSON-LD
  out = out.replace(/(<script type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (m, a, body, z) => {
    const j = JSON.parse(body);
    const fix = (n) => {
      if (n['@type'] === 'BreadcrumbList') {
        n.itemListElement = [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
          { '@type': 'ListItem', position: 2, name: 'Spring Manufacturer in Maharashtra', item: `${BASE}/spring-manufacturer-maharashtra.html` },
          { '@type': 'ListItem', position: 3, name: `Spring Manufacturer for ${c.short}`, item: url }];
      } else if (n['@type'] === 'LocalBusiness') {
        n.areaServed = [{ '@type': 'City', name: c.name }, ...c.regions.flatMap(([, tags]) => tags).slice(0, 8).map((t) => ({ '@type': 'Place', name: t.replace(/&amp;/g, '&') }))];
      } else if (n['@type'] === 'BlogPosting' || n['@type'] === 'Article') {
        n.headline = c.h1.replace(/&amp;/g, '&').slice(0, 110); n.description = c.desc; n.datePublished = TODAY; n.dateModified = TODAY;
        n.mainEntityOfPage = url; if (n.url) n.url = url;
      } else if (n['@type'] === 'FAQPage') {
        n.mainEntity = c.faqs.map(([q, ans]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans } }));
      }
    };
    if (j['@graph']) j['@graph'].forEach(fix); else fix(j);
    return a + JSON.stringify(j).replace(/<\//g, '<\\/') + z;
  });
  fs.writeFileSync(`${c.slug}.html`, out);
  return url;
}

const made = CITIES.map(build);

// sitemap
let sm = fs.readFileSync('sitemap.xml', 'utf8');
for (const u of made) {
  if (!sm.includes(`<loc>${u}</loc>`)) sm = sm.replace('</urlset>', `<url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>`);
}
fs.writeFileSync('sitemap.xml', sm);
console.log('Generated city pages:', made.length);
