#!/usr/bin/env python3
"""Adds an extra 'applications / what to specify / price' section and extra FAQs to every product page,
and a 'types and how to choose' section to every product category page.
ADD-ONLY and idempotent: existing page text is never changed; pages that already carry data-extra="1" are skipped.
Re-run it after generate-product-pages.mjs if you regenerate the product pages:  python3 add-page-extras.py
"""
import re, glob, html, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
E = html.escape
MARK = 'data-extra="1"'
DRY = '--dry' in sys.argv

L = {  # internal links
 'cmp':('/compression-spring-manufacturer.html','Compression spring manufacturer'),'cmpc':('/compression-spring-calculator.html','Compression spring calculator'),
 'rate':('/guides/spring-rate-formula-compression-spring.html','Spring rate formula'),'ext':('/extension-spring-manufacturer.html','Extension spring manufacturer'),
 'extc':('/extension-spring-calculator.html','Extension spring calculator'),'tor':('/torsion-spring-manufacturer.html','Torsion spring manufacturer'),
 'torc':('/torsion-spring-calculator.html','Torsion spring calculator'),'torf':('/guides/torsion-spring-torque-formula.html','Torsion spring torque formula'),
 'die':('/die-spring-manufacturer.html','Die spring manufacturer'),'diec':('/guides/die-spring-colour-code-chart.html','Die spring colour code guide'),
 'disc':('/disc-spring-manufacturer.html','Disc and wave spring manufacturer'),'circ':('/circlip-snap-ring-manufacturer.html','Circlip and snap ring manufacturer'),
 'wire':('/wire-form-manufacturer.html','Wire form manufacturer'),'fin':('/guides/spring-finishes-and-coatings.html','Spring finishes and coatings'),
 'tramp':('/guides/trampoline-spring-buying-guide.html','Trampoline spring buying guide'),'heavy':('/heavy-duty-spring-manufacturer.html','Heavy duty spring manufacturer'),
 'mat':('/guides/mild-steel-vs-stainless-steel-vs-music-wire-springs.html','Mild steel vs stainless steel vs music wire'),
 'quote':('/guides/custom-spring-cost-and-quote-checklist.html','Custom spring cost and quote checklist'),'meas':('/guides/how-to-measure-a-spring.html','How to measure a spring'),
 'extf':('/guides/extension-spring-load-formula.html','Extension spring load formula'),
}
for h,_ in L.values(): assert os.path.exists(h.lstrip('/')),h

T = {}
def t(key,title,short,apps,spec,tip,links,faq): T[key]=dict(title=title,short=short,apps=apps,spec=spec,tip=tip,links=links,faq=faq)

t('compression','Compression springs','push back when squeezed; used in valves, clutches, press tools and fixtures',
 'Compression springs resist being squeezed. They are used in valves and pumps, clutches and brakes, press tools and fixtures, switchgear, machine guards and general machinery, wherever a part must be pushed back to its position.',
 ['Wire diameter and material','Outside or inside diameter and free length','Number of coils and end type (closed and ground, closed or open)','Load needed at a stated working length','Finish (plain, black, zinc, polished) and quantity'],
 'Do not work a compression spring down to its solid height, and guide a long, slender spring on a rod or in a bore so it cannot buckle sideways.',
 ['cmp','cmpc','rate','meas'],
 [('How do I choose the right compression spring size?','Match the outside or inside diameter to the space, then choose the wire diameter and number of coils to give the load you need at your working length. Our compression spring calculator and spring rate guide help, or send a sample and we will match it.'),
  ('Can {n} be made in stainless steel or another material?','Yes. Material and finish can be changed to suit moisture, chemicals or temperature. Tell us where the spring will work and we will suggest a material.')])
t('extension','Extension (tension) springs','pull parts together and return them; used in doors, return mechanisms and balancing',
 'Extension (tension) springs pull parts together and return them when released. They are used in return mechanisms, doors and gates, balancing systems, agricultural equipment, household products and machinery.',
 ['Wire diameter and material','Outside diameter and length inside the hooks','Hook or loop style','Initial tension, if needed, and the load at a stretched length','Finish and quantity'],
 'The hooks are the weakest part of an extension spring, so avoid over-stretching it, and ask for a full loop or a larger hook radius if the load repeats often.',
 ['ext','extc','extf','meas'],
 [('What is initial tension in an extension spring?','Extension springs are wound with the coils pressed together. Initial tension is the force that holds them together, so the spring does not begin to stretch until the pull is greater than this force.'),
  ('Can you make {n} with a different hook type?','Yes. Machine hook, cross-over hook, side loop, extended hook and full loop styles can be made to your drawing or sample.')])
t('torsion','Torsion springs','twist and push back with torque; used in hinges, latches, clamps and pedal returns',
 'Torsion springs work by twisting and push back with torque. They are used in hinges, latches and locks, clamps and clips, pedal and lever returns, switches and counterbalance mechanisms.',
 ['Wire diameter and material','Outside or inside diameter and number of coils','Leg length, shape and the free angle between the legs','Direction of wind (left or right hand)','Torque needed at a stated working angle, and the rod it works on'],
 'Load a torsion spring in the direction that winds the coil tighter, and support it on a rod so it cannot buckle sideways.',
 ['tor','torc','torf','meas'],
 [('Why does the direction of wind matter?','A torsion spring should be loaded in the direction that winds it tighter. Loading it the other way opens the coil, raises stress and shortens its life, so state left or right hand when ordering.'),
  ('How is the torque of {n} specified?','As torque at a working angle, for example N-mm at 90 degrees, together with the leg length. Our torsion spring calculator and torque formula guide help you work this out.')])
t('die','Die springs','heavy-duty rectangular-wire springs for press tools, dies and moulds',
 'Die springs are heavy-duty rectangular-wire compression springs used in press tools, stamping and blanking dies, plastic and injection moulds, stripper plates and ejector systems.',
 ['Hole (outside) diameter, rod (inside) diameter and free length','Duty level, or the working load and stroke','Material, and whether you need a matched set','Quantity'],
 'Colour codes for duty levels differ between standards, so match by dimensions and duty level, and replace die springs in sets.',
 ['die','diec','cmpc'],
 [('What do die spring colours mean?','Die springs are colour-coded by duty level, but the colour for each level differs between standards and manufacturers. Confirm the duty level and dimensions rather than relying on colour alone.'),
  ('When should die springs be replaced?','When the free length has visibly shortened, the spring is cracked or bent, or the tool no longer holds its load. Replace them in sets to keep the load even.')])
t('disc','Disc (Belleville) springs','very high load in a small axial space with a short stroke',
 'Disc springs (Belleville washers) carry a very high load in a small axial space with a short stroke. They are used in valves, clutches and brakes, bolted joints, bearings, press tools and safety devices.',
 ['Outer diameter, inner diameter, thickness and free height','Load needed at a stated deflection','Stack arrangement (series, parallel or both)','Material, finish and quantity'],
 'Stack discs facing the same way to add load and facing opposite ways to add deflection, guide the stack on a rod or in a bore, and never press a disc past flat.',
 ['disc','fin','mat'],
 [('How do I stack disc springs?','Stack them facing the same way (parallel) to add load, or facing opposite ways (series) to add deflection. A combination of both reaches a given load and travel together.'),
  ('Which material should I choose for {n}?','Spring steel suits general use, stainless steel suits moisture and chemicals, and Inconel X-750 suits high temperature or very corrosive duty.')])
t('wave','Wave springs','flat-wire springs that give force in a very short height',
 'Wave springs are flat-wire springs coiled with waves in them. They give a spring force in a much shorter height than a coil spring, so they are used for bearing preload, seals, clutch packs and gearbox assemblies.',
 ['Inside and outside diameter','Free height and working height, with the load needed at the working height','Number of turns (single or multi-turn)','Material, quantity, and whether a retaining ring is needed'],
 'Wave springs suit short strokes in a ring-shaped space. For a longer stroke at the same force, a coil spring may be the better choice.',
 ['disc','fin','mat'],
 [('What is a wave spring used for?','A wave spring provides axial force, such as bearing preload, in a much shorter height than a coil spring, in a ring-shaped space.'),
  ('Can {n} be made in other sizes?','Yes. Send the inside diameter, outside diameter, free height and the load you need at the working height, or a sample.')])
t('flat','Flat springs','formed from flat strip or wire; used as contact, latch and retaining springs',
 'Flat springs are formed from flat strip or wire. They are used as contact springs in switches and relays, as retaining and latching springs, as detents and as tension springs in machinery.',
 ['Material and thickness','Width and developed length','Bend or form (drawing or sample)','Load needed at a stated deflection, finish and quantity'],
 'A flat spring is designed by thickness and length, so a small change in thickness changes the force a lot.',
 ['quote','fin','mat'],
 [('Can you make a flat spring to my shape?','Yes. Send a drawing, sketch or sample with the bends and the load needed and we will quote.'),
  ('Which material is used for flat springs?','Spring steel is common, and stainless steel is used where corrosion resistance matters. Tell us the environment and we will suggest the material.')])
t('clock','Spiral (clock) springs','flat strip wound in a spiral; store rotational energy in a compact space',
 'Spiral (clock or power) springs are flat strip wound in a spiral. They store rotational energy and are used in retractable reels, counterbalance and return mechanisms, tape and cable retractors, meters, toys and mechanical timers.',
 ['Strip width, thickness and length','Material (spring steel, stainless steel or brass)','Torque and number of turns needed','Arbor and housing diameters, and the end form'],
 'A spiral spring works inside a housing or on an arbor, so the housing size and the number of turns decide how smoothly it winds and unwinds.',
 ['quote','mat','fin'],
 [('What is the difference between a clock spring and a torsion spring?','A clock (spiral) spring is flat strip wound in a spiral and gives torque over many turns in a compact space. A torsion spring is a wire coil with two legs and works over a limited angle.'),
  ('What do you need to make {n}?','The strip width, thickness and length, the material, the torque and turns required, and the arbor and housing sizes, or a sample.')])
t('circlip','Circlips and snap rings','split rings that hold parts on a shaft or in a bore',
 'Circlips (snap rings) sit in a groove on a shaft or in a bore and hold bearings, gears and other parts in place along the axis. They are used in gearboxes, pumps, motors, automotive parts and general machinery.',
 ['Internal or external, and the shaft or bore diameter','Groove width and depth, or the DIN size','Thickness, and the load the ring must hold','Material, finish and quantity'],
 'Use the right circlip plier, do not over-open or over-close the ring, and replace rings that are worn or distorted instead of reusing them.',
 ['circ','fin','mat'],
 [('Is a circlip the same as a snap ring?','Yes. Circlip, snap ring and retaining ring are used for the same kind of part: a split ring that sits in a groove to hold parts in place.'),
  ('How do I choose between an internal and an external circlip?','Use an external circlip for a groove on a shaft and an internal circlip for a groove inside a bore or housing.')])
t('plier','Circlip pliers','tools to fit and remove circlips safely',
 'Circlip pliers open or close a circlip so it can be fitted into, or removed from, its groove safely. Internal circlip pliers are used for rings that sit inside a bore.',
 ['Internal or external circlips','Range of circlip sizes','Tip type (straight or bent) and tip diameter','Quantity'],
 'Match the plier tips to the holes in the circlip and do not open or close the ring more than needed.',
 ['circ'],
 [('Which plier is used for internal circlips?','Internal circlip pliers, which close the ring so it can enter the bore. External circlips are fitted with pliers that open the ring.'),
  ('Can I buy circlips and a plier together?','Yes. Tell us the circlip sizes and we will quote the rings and the right plier.')])
t('synchronizer','Synchronizer snap rings','precision rings used in vehicle gearbox assemblies',
 'Synchronizer snap rings are used in manual gearbox and transmission assemblies in vehicles to hold the synchronizer parts in place.',
 ['Outside and inside diameter and thickness','Groove or fitting details','Material','A sample or OEM drawing, and quantity'],
 'Because these rings are fitted in a precision assembly, a drawing or sample gives a better match than a size alone.',
 ['circ','quote'],
 [('Can you make a synchronizer snap ring from a sample?','Yes. Send the sample or drawing and we will match the size, section and material.'),
  ('What details do you need to quote {n}?','Outside and inside diameter, thickness, material, the application and the quantity.')])
t('suspension','Suspension coil springs','carry vehicle load and absorb road shock',
 'Suspension coil springs carry vehicle load and absorb road shock. They are used in cars, light vehicles, trolleys and heavy equipment.',
 ['Wire diameter and outside diameter','Free length and number of coils','Spring rate, or the load at ride height','Material, finish and quantity (usually in pairs)'],
 'Springs on the same axle should be replaced as a pair so the load and ride height stay even.',
 ['cmp','rate','meas'],
 [('Should suspension springs be replaced in pairs?','Yes. Springs on the same axle should be replaced together so the load and ride height stay even.'),
  ('What do you need to make {n}?','Wire diameter, outside diameter, free length, number of coils and the load or rate needed, or a sample of the old spring.')])
t('clutch','Clutch and pressure plate springs','press the clutch plates together so the clutch grips',
 'Clutch springs and pressure plate springs press the clutch plates together so that the clutch grips and transmits power. They are used in motorcycles, scooters, cars and industrial clutches.',
 ['Wire diameter, outside diameter and free length','Number of coils and end type','Load at the installed height','Number of springs per set, and quantity'],
 'Replace clutch springs as a complete set. Weak or uneven springs can cause the clutch to slip.',
 ['cmp','rate','meas'],
 [('When should clutch springs be replaced?','When the clutch slips, the springs have shortened or the loads are uneven. Replace the whole set together.'),
  ('Can you match {n} from a sample?','Yes. Send the old spring, ideally with the vehicle or clutch model, and we will match the dimensions and load.')])
t('heavy','Heavy-duty coil springs','thick-wire springs for high loads and shocks',
 'Heavy-duty coil springs are made from thick wire and carry high loads and shocks. They are used in stone crushers, mining and construction equipment, screens, vibrating machines and heavy machinery.',
 ['Wire diameter, outside diameter and free length','Number of coils and end type','Load or rate required, and the shock or vibration involved','Material and heat treatment, and quantity'],
 'For heavy or shock loads, tell us the working load and duty so we can recommend a suitable alloy steel and heat treatment.',
 ['heavy','cmp','rate'],
 [('Can you make heavy-duty springs for crushers and mining equipment?','Yes. Send the dimensions or a sample with the load and duty, and we will quote a spring suited to the work.'),
  ('What affects the life of a heavy-duty spring?','The working stress, how often it is loaded, shock loads, the material, the heat treatment and the surface finish all affect life.')])
t('inconel','Inconel X-750 springs','high-temperature and corrosive duty',
 'Inconel X-750 is a nickel-chromium alloy that keeps its strength at high temperature and resists corrosion. Springs in this alloy are used in high-temperature and corrosive duty, such as furnaces, valves and process equipment.',
 ['Working temperature and environment','Wire diameter, outside diameter and free length','Load required at a stated length','Quantity'],
 'The working temperature and the load together decide whether this alloy is the right choice, so share both with us.',
 ['mat','cmp','disc'],
 [('When should I use an Inconel spring?','When the spring must work at high temperature or in a corrosive environment where steel or ordinary stainless steel would lose strength or corrode.'),
  ('Can other spring types be made in Inconel X-750?','Spring forms can be quoted in this alloy to your drawing. Send the details and the working conditions.')])
t('precision','Precision coil springs','tight-tolerance springs for instruments and medical equipment',
 'Precision coil springs are made to tight tolerances for instruments, medical and scientific equipment, electronics and small mechanisms where force and size must be exact.',
 ['Wire diameter and material (for example stainless steel or music wire)','Outside diameter, free length and number of coils','Tolerance on load and on dimensions','Quantity'],
 'Tell us which dimensions and loads are critical. Tight tolerances cost more, so tighten only the ones that matter.',
 ['quote','mat','meas'],
 [('Can you make springs with tight tolerances?','Yes. Tell us the critical dimensions and the load requirement and we will confirm what can be held.'),
  ('Which material is used for medical or scientific springs?','Stainless steel is common where corrosion resistance matters. The right grade depends on the application, so tell us the use.')])
t('trampoline','Trampoline springs','extension springs built for repeated stretching',
 'Trampoline springs are extension springs that pull the mat towards the frame. They need a long fatigue life under repeated stretching and good protection against rust.',
 ['Spring length and wire diameter','Hook or loop style','Working load or weight rating','Material and corrosion protection, and quantity'],
 'Because trampoline springs are stretched thousands of times, fatigue life and rust protection matter more than the lowest price.',
 ['tramp','ext','extc'],
 [('How long do trampoline springs last?','Life depends on the load, how often the springs are stretched and the corrosion protection. Springs made for repeated stretching and protected from rust last longer.'),
  ('Can you supply {n} in bulk?','Yes. Send the length, wire size, hook style and quantity and we will quote.')])
t('wireform','Wire forms','shapes bent from wire; used as clips, hooks, brackets and supports',
 'Wire forms are shapes bent from wire without coiling. They are used as clips, hooks, brackets, retainers and supports in machinery, vehicles, electrical items and household products.',
 ['A sample, drawing or sketch','Wire diameter and material','Finish and any welding or end details','Critical dimensions, and quantity'],
 'Avoid very sharp bends, allow for spring-back in hard wire, and mark the dimensions that must be tight.',
 ['wire','fin','quote'],
 [('Can you make a wire form from a sample?','Yes. Send the sample or a clear photo with measurements and we will confirm the wire, bends and tolerances.'),
  ('What materials are used for wire forms?','Mild steel for general use, stainless steel for wet, medical or corrosive conditions, and spring steel where the part must spring back.')])
t('hook','Steel hooks','S, C, U and spring hooks for hanging and linking',
 'Steel hooks (S, C, U and spring hooks) are used for hanging, linking chains and parts, and securing loads in workshops, kitchens, marine places and general industry.',
 ['Hook type (S, C, U or spring hook)','Wire diameter and opening size','Material (mild steel or SS 304)','Working load, and quantity'],
 'Do not use a hook for lifting people or overhead loads unless it is specified and tested for that. Tell us the working load so we can advise on wire size and material.',
 ['wire','fin','mat'],
 [('Which material is best for hooks?','Mild steel suits general use. Stainless steel, such as SS 304, suits food, marine and wet places.'),
  ('Can you make {n} to my size?','Yes. Send the wire size, opening and shape, or a sample.')])
t('rpin','R pins (hairpin cotters)','quick-release pins that lock clevis pins and shafts',
 'R pins (hairpin cotters) are quick-release locking pins. They hold clevis pins, hitch pins and shafts in place and are used in agricultural implements, trailers, machinery and general fabrication.',
 ['Pin or hole diameter it must lock','Wire diameter and length','Material (stainless steel or zinc-plated steel)','Quantity or assortment'],
 'An R pin is fitted and removed by hand and can be reused. Choose the wire size to suit the hole so the pin is firm but not forced.',
 ['fin','mat'],
 [('What is an R pin used for?','An R pin, or hairpin cotter, locks a clevis pin or shaft in place. One leg goes through the hole and the curved leg springs around the outside of the pin.'),
  ('Are stainless steel R pins reusable?','Yes. They can be removed and refitted by hand, as long as they are not bent out of shape.')])
t('cotter','Split (cotter) pins','lock nuts, clevis pins and shafts so they cannot work loose',
 'Split pins (cotter pins) lock castle nuts, clevis pins and shafts so they cannot work loose. They are used in vehicles, machinery and fabricated assemblies.',
 ['Nominal diameter and length','Material (stainless steel or steel)','Standard required, such as DIN 94','Quantity'],
 'Fit a split pin through the hole and bend its legs back. Use a new pin each time, because the bent legs weaken.',
 ['fin','mat'],
 [('Can I reuse a split pin?','It is best not to. The legs are bent when the pin is fitted and weaken, so use a new pin each time.'),
  ('Which standard do split pins follow?','Split pins are commonly made to DIN 94. Tell us the size and standard you need and we will confirm.')])
t('dowel','Dowel pins','keep two parts accurately aligned',
 'Dowel pins keep two parts accurately aligned. Precision, taper and spring (slotted) dowels are used in dies, fixtures, gearboxes, machine assemblies and tools.',
 ['Diameter and length','Type (plain, taper or spring)','Material (steel or stainless steel) and tolerance','Hole size and fit, and quantity'],
 'A dowel pin only aligns well if the hole is reamed to the right size, so choose the pin and the hole fit together.',
 ['quote','mat','meas'],
 [('What is the difference between a dowel pin and a taper pin?','A dowel pin is a straight, precisely ground pin pressed into holes to align parts. A taper pin has a taper and seats firmly as it is driven in, which makes it self-locking.'),
  ('What is a spring dowel pin?','A hollow slotted pin that compresses when driven into a hole and then grips it, so the hole needs less precision.')])
t('pin','Steel pins','alignment, fastening and hinge pins',
 'Steel pins are used for alignment, fastening, hinging and locating parts in assemblies, in machinery, fixtures and fabricated products.',
 ['Diameter and length','Material (steel or stainless steel)','Tolerance and end form','Quantity'],
 'Tell us how the pin is used, as a locating pin, a hinge pin or a fastening pin, so we can suggest the right tolerance and material.',
 ['quote','mat','fin'],
 [('Can you make pins to my size?','Yes. Send the diameter, length, material and end form, or a sample, and we will quote.'),
  ('Which material should I choose for {n}?','Stainless steel suits moisture and corrosive places, and steel suits general dry use. Tell us where it will be used.')])
t('mech_seal','Mechanical seals','stop liquid leaking along a rotating shaft',
 'Mechanical seals stop liquid leaking along a rotating shaft. They are used in pumps, agitators and mixers, compressors and process equipment.',
 ['Shaft diameter, and the pump or machine make and model','Fluid, temperature and pressure','Seal type (single or double) and the face and elastomer materials','Quantity'],
 'The fluid decides the face and elastomer materials, and a wrong match causes early leakage, so always tell us what is being sealed.',
 ['mat','quote'],
 [('What details do you need to supply a mechanical seal?','The shaft diameter, the pump or machine make and model, the fluid, temperature and pressure, or a sample of the old seal.'),
  ('How long does a mechanical seal last?','Life depends on the fluid, temperature, pressure, speed, correct fitting and whether the pump runs dry. Dry running damages the seal faces quickly.')])
t('lip_seal','Rotary shaft (lip) seals','keep oil in and dirt out around a rotating shaft',
 'Rotary shaft seals (lip seals) keep oil or grease in and dirt out around a rotating shaft. They are used in gearboxes, motors, pumps, axles and wheel hubs.',
 ['Shaft diameter, bore diameter and width','Lip material (for example NBR or FKM) to suit the fluid and temperature','Shaft speed and working temperature','Quantity'],
 'Keep the shaft surface smooth and free of burrs, and fit the seal square in the bore so the lip is not damaged.',
 ['quote','meas'],
 [('Which lip seal material should I choose?','NBR suits many oils and greases at moderate temperature, and FKM is used for higher temperature and more aggressive fluids. Tell us the fluid and temperature.'),
  ('Can you supply {n} to my size?','Yes. Send the shaft diameter, bore diameter and width, or the old seal.')])
t('conical_seal','Spring seals','spring-assisted sealing parts',
 'A conical spring seal combines a conical spring with a sealing action, for assemblies where a compact spring-loaded seal is needed.',
 ['Size, with a drawing or sample','Material','Working conditions','Quantity'],
 'Send a sample or drawing, because the dimensions and the spring action decide how well it seals.',
 ['quote','cmp'],
 [('Can you make {n} from a sample?','Yes. Send the sample or drawing and we will match it.'),
  ('What details do you need to quote?','Size, material, the working conditions and the quantity.')])
t('lynch','Lynch pins','tool-free locking pins for hitches and shafts',
 'Lynch pins with a coil loop are tool-free locking pins used on tractor and trailer hitches, implements and machinery shafts.',
 ['Pin diameter and usable length','Loop or ring type','Material and finish','Quantity'],
 'Choose the usable length to match the thickness of the part it passes through so the pin sits fully home.',
 ['fin','mat'],
 [('What is a lynch pin used for?','A lynch pin passes through a hole in a shaft or hitch pin and is held by a loop or ring, so it can be fitted and removed without tools.'),
  ('Can you supply {n} in bulk?','Yes. Send the diameter, length and quantity and we will quote.')])
t('clip','Locking clips','hold pins, shafts and rods in place',
 'Stamped steel locking clips hold pins, shafts and rods in place in machinery, fixtures and fabricated assemblies.',
 ['Pin or groove diameter','Clip thickness and form','Material and finish','Quantity'],
 'Match the clip to the pin or groove size so it holds firmly without being forced on.',
 ['fin','mat','quote'],
 [('Can you make {n} to my size?','Yes. Send the pin or groove size and the form, or a sample, and we will quote.'),
  ('Which material is used for locking clips?','Spring steel for general use and stainless steel where moisture or corrosion is a concern.')])
t('spring','Springs','store and release energy; made to drawing or sample',
 'Springs store and release energy and are used across machinery, vehicles, tools and household products.',
 ['Type of spring and material','Wire diameter and the main dimensions','Load needed at a stated length or angle','Finish and quantity'],
 'A drawing, a sample or the load and space available is enough for us to start.',
 ['quote','mat','meas'],
 [('Can you make {n} to my specification?','Yes. Send a drawing, sample or the working load and space and we will quote.'),
  ('Which material should I choose?','Music wire or steel wire for dry general use, stainless steel for moisture and chemicals, and alloy steels for high stress.')])

RULES = [  # (regex on lower-case "name", key)
 (r'plier','plier'),(r'rotary shaft seal|lip seal','lip_seal'),(r'mechanical|shaft seal','mech_seal'),(r'conical spring seal','conical_seal'),
 (r'synchron','synchronizer'),(r'circlip|snap ring','circlip'),(r'belleville|disc spring','disc'),(r'wave spring','wave'),
 (r'clock|ribbon|spiral torsion','clock'),(r'die spring|dai spring','die'),(r'inconel','inconel'),(r'flat spring','flat'),
 (r'trampoline','trampoline'),(r'suspension','suspension'),(r'clutch|pressure plate','clutch'),(r'stone crusher','heavy'),
 (r'precision coil','precision'),(r'torsion','torsion'),(r'extension','extension'),(r'compression|wire springs','compression'),
 (r'wire form','wireform'),(r'hook','hook'),(r'\br[- ]?pins?\b','rpin'),(r'cotter|split pin','cotter'),(r'lynch','lynch'),
 (r'locking clip','clip'),(r'dowel','dowel'),(r'pins?$','pin'),
]
def type_of(name, tag=''):
    n=name.lower()
    for rx,k in RULES:
        if re.search(rx,n): return k
    if re.search(r'clutch',tag.lower()): return 'clutch'
    return 'spring'

def price_para(n):
    return (f'The price of {E(n)} depends on size, material, finish and quantity, so we quote per piece after we see your requirement. '
            'We keep prices competitive, with better rates for bulk and regular orders. We deliver PAN India and supply export orders (IEC registered). '
            'Send your size and quantity on WhatsApp for the best price.')
def links_html(keys):
    return ' · '.join(f'<a href="{L[k][0]}">{L[k][1]}</a>' for k in keys)

def product_extra(n, rows, key):
    d=T[key]; r=dict(rows); parts=[]
    if r.get('Application'): parts.append(f'This listing is intended for {E(r["Application"].lower())} use.')
    m=r.get('Material')
    if m: parts.append(f'It is listed in {E(m.lower())}; other materials and finishes can be quoted.')
    sz=r.get('Size') or r.get('Wire Diameter')
    if sz: parts.append(f'Size shown on this page: {E(sz)}.')
    pk=r.get('Pack Qty')
    if pk: parts.append(f'It is listed as a {E(pk.lower())} pack; for single sizes or production quantities we make to order.')
    if not parts: parts.append('Tell us your size and quantity and we will quote it, or make it to your drawing or sample.')
    secA=(f'<section class="sec desc" {MARK}><h2>Where {E(n)} is used</h2><p>{E(d["apps"])}</p><p>{" ".join(parts)}</p>'
          f'<h2>What to specify when you order</h2><ul>{"".join(f"<li>{E(x)}</li>" for x in d["spec"])}</ul><p>{E(d["tip"])}</p>'
          f'<h2>{E(n)} price and bulk orders</h2><p>{price_para(n)}</p><p>Related: {links_html(d["links"])}</p></section>')
    faqs=[(q.replace('{n}',n),a) for q,a in d['faq']]+[(f'What is the price of {n}?',
          'The price depends on size, material, finish and quantity. Message us your requirement on WhatsApp and we will quote a competitive per-piece price, with lower rates for bulk orders.')]
    secB=(f'<section class="sec faq" {MARK}><h2>More about {E(n)}</h2>'+''.join(f'<details><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q,a in faqs)+'</section>')
    return secA,secB

stats={'product':0,'category':0,'skipped':0}; typemap={}
for f in sorted(glob.glob('products/*/*.html')):
    s=open(f,encoding='utf-8').read()
    if MARK in s: stats['skipped']+=1; continue
    cat=f.split('/')[1]
    if f.endswith('/index.html'):
        # ---- category page
        names=re.findall(r'<div class="b"><h2>(.*?)</h2><p>(.*?)</p>',s)
        keys=[]
        for nm,tg in names:
            k=type_of(html.unescape(nm),html.unescape(tg))
            if k not in keys: keys.append(k)
        cname=html.unescape(re.search(r'<h1[^>]*>(.*?)</h1>',s,re.S).group(1)).replace(' Manufacturer & Supplier in Mumbai','').replace(' Manufacturer &amp; Supplier in Mumbai','')
        cname=re.sub(r'<[^>]+>','',cname).strip()
        shown=keys[:5]
        body=''.join(f'<h3>{E(T[k]["title"])}</h3><p>{E(T[k]["apps"])}</p>' for k in shown)
        main_k=shown[0]
        allkeys=[]
        for k in shown:
            for lk in T[k]['links']:
                if lk not in allkeys: allkeys.append(lk)
        sec=(f'<section class="sec desc" {MARK}><h2>{E(cname)}: types and how to choose</h2>{body}'
             f'<h2>What to specify when you order</h2><ul>{"".join(f"<li>{E(x)}</li>" for x in T[main_k]["spec"])}</ul><p>{E(T[main_k]["tip"])}</p>'
             f'<h2>Price and bulk orders</h2><p>Prices depend on size, material, finish and quantity, so we quote per piece after we see your requirement. We keep prices competitive, with better rates for bulk and regular orders, and deliver PAN India and for export. '
             f'<a href="https://wa.me/918454995315" target="_blank" rel="noopener">Send your size and quantity on WhatsApp</a> for the best price.</p><p>Related: {links_html(allkeys[:6])}</p></section>')
        assert s.count('<section class="sec faq">')==1,f
        out=s.replace('<section class="sec faq">',sec+'<section class="sec faq">',1)
        stats['category']+=1
    else:
        h1=re.search(r'<h1[^>]*>(.*?)</h1>',s,re.S); n=html.unescape(re.sub(r'<[^>]+>','',h1.group(1))).strip()
        tag=html.unescape((re.search(r'class="tagline">(.*?)</p>',s,re.S) or [0,''])[1])
        rows=[(html.unescape(a),html.unescape(b)) for a,b in re.findall(r'<tr><td>(.*?)</td><td>(.*?)</td></tr>',s)]
        key=type_of(n,tag); typemap[f]=(n,key)
        secA,secB=product_extra(n,rows,key)
        m1=re.search(r'<section class="sec desc">.*?</section>',s,re.S); m2=re.search(r'<section class="sec faq">.*?</section>',s,re.S)
        assert m1 and m2 and m1.end()<m2.start(),f
        out=s[:m1.end()]+secA+s[m1.end():m2.end()]+secB+s[m2.end():]
        stats['product']+=1
    if not DRY: open(f,'w',encoding='utf-8').write(out)
if DRY:
    for f,(n,k) in typemap.items(): print(f'{k:12} {n}')
print(stats)
