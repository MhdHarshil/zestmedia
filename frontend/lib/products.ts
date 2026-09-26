export type ProductOption = {
  id: string
  label: string
  choices: string[]
}

export type Product = {
  slug: string
  name: string
  category: string
  tagline: string
  summary: string
  description: string[]
  image: string
  images?: string[]
  features: string[]
  audiences: string[]
  turnaround: string
  options: ProductOption[]
}

export const products: Product[] = [
  {
    slug: 'visiting-cards',
    name: 'Visiting Cards',
    category: 'Stationery',
    tagline: 'A first impression you can hold.',
    summary: 'Premium business cards on thick stock with matte, gloss or textured finishes.',
    description: [
      'Your business card is often the first tangible thing a client keeps. We print on heavyweight stocks with crisp color and clean edges so every hand-off feels considered.',
      'Choose from matte, soft-touch, gloss or textured cotton stocks, with optional spot finishes for a genuinely premium feel.',
    ],
    image: '/images/visiting-cards.png',
    features: ['300–600 gsm premium stocks', 'Matte, gloss & soft-touch options', 'Rounded corners available', 'Double-sided full color'],
    audiences: ['Local businesses', 'Freelancers', 'Small businesses'],
    turnaround: '2–3 days',
    options: [
      { id: 'stock', label: 'Paper stock', choices: ['Matte 350gsm', 'Soft-touch 400gsm', 'Gloss 350gsm', 'Textured cotton 600gsm'] },
      { id: 'sides', label: 'Printing', choices: ['Single sided', 'Double sided'] },
      { id: 'corners', label: 'Corners', choices: ['Square', 'Rounded'] },
      { id: 'quantity', label: 'Quantity', choices: ['100', '250', '500', '1000'] },
    ],
  },
  {
    slug: 'flex-banners',
    name: 'Flex & Banners',
    category: 'Large Format',
    tagline: 'Get seen, indoors and out.',
    summary: 'Weatherproof flex banners and roll-up standees for shops, stalls and events.',
    description: [
      'From shop fronts to exhibition stalls, our large-format banners are printed on durable flex media with rich, fade-resistant color that holds up outdoors.',
      'We finish with eyelets, hemming or stands so your banner is ready to hang the moment it arrives.',
    ],
    image: '/images/flex-banners.png',
    features: ['Weatherproof outdoor flex', 'High-resolution large format', 'Eyelets & hemming included', 'Roll-up stands available'],
    audiences: ['Local businesses', 'Event organizers', 'Small businesses'],
    turnaround: '2–4 days',
    options: [
      { id: 'type', label: 'Banner type', choices: ['Flex banner', 'Vinyl banner', 'Roll-up standee', 'Backdrop'] },
      { id: 'size', label: 'Size', choices: ['3 x 2 ft', '6 x 3 ft', '8 x 4 ft', 'Custom size'] },
      { id: 'finish', label: 'Finishing', choices: ['Eyelets', 'Hemming', 'Stand included'] },
      { id: 'quantity', label: 'Quantity', choices: ['1', '2–5', '6–10', '10+'] },
    ],
  },
  {
    slug: 't-shirt-printing',
    name: 'T-Shirt Printing',
    category: 'Apparel',
    tagline: 'Wearable branding, done right.',
    summary: 'Screen and DTG printing on soft cotton tees for teams, events and merch.',
    description: [
      'Whether it is team uniforms, event merch or a one-off design, we print on soft, quality cotton with vivid, long-lasting results.',
      'Screen printing for bigger runs, direct-to-garment for detailed and full-color artwork — we help you pick the right method.',
    ],
    image: '/images/tshirt-printing.png',
    features: ['Screen & DTG printing', 'Soft premium cotton', 'Front, back & sleeve prints', 'Bulk & single orders'],
    audiences: ['Students', 'Event organizers', 'Local businesses'],
    turnaround: '3–5 days',
    options: [
      { id: 'method', label: 'Print method', choices: ['Screen print', 'DTG (full color)', 'Vinyl transfer'] },
      { id: 'color', label: 'Shirt color', choices: ['White', 'Black', 'Cream', 'Custom'] },
      { id: 'placement', label: 'Print placement', choices: ['Front only', 'Back only', 'Front & back', 'Front & sleeve'] },
      { id: 'sizes', label: 'Size range', choices: ['S–XL', 'XS–XXL', 'Kids sizes', 'Mixed'] },
      { id: 'quantity', label: 'Quantity', choices: ['1–5', '6–20', '21–50', '50+'] },
    ],
  },
  {
    slug: 'stickers',
    name: 'Stickers',
    category: 'Small Format',
    tagline: 'Small format, big personality.',
    summary: 'Die-cut, kiss-cut and sheet stickers in matte, gloss and transparent vinyl.',
    description: [
      'Stickers are the easiest way to spread a brand. We cut to any shape on durable vinyl that survives water bottles, laptops and packaging.',
      'Pick matte, gloss, holographic or transparent finishes — perfect for product labels, giveaways and personal projects.',
    ],
    image: '/images/stickers.png',
    features: ['Die-cut to any shape', 'Waterproof vinyl', 'Matte, gloss & holographic', 'Sheets or singles'],
    audiences: ['Students', 'Small businesses', 'Individuals'],
    turnaround: '2–3 days',
    options: [
      { id: 'cut', label: 'Cut style', choices: ['Die-cut', 'Kiss-cut', 'Sheet', 'Roll'] },
      { id: 'finish', label: 'Finish', choices: ['Matte', 'Gloss', 'Holographic', 'Transparent'] },
      { id: 'size', label: 'Size', choices: ['2 in', '3 in', '4 in', 'Custom'] },
      { id: 'quantity', label: 'Quantity', choices: ['50', '100', '250', '500+'] },
    ],
  },
  {
    slug: 'posters',
    name: 'Posters',
    category: 'Large Format',
    tagline: 'Make a statement on the wall.',
    summary: 'Gallery-grade posters in A-sizes and custom formats on premium paper.',
    description: [
      'From gig posters to shop promotions and dorm-room art, we print rich, saturated posters that look sharp up close and bold from across the room.',
      'Available on matte, satin and heavyweight art papers, in standard A-sizes or fully custom dimensions.',
    ],
    image: '/images/posters.png',
    features: ['A3 to A0 & custom sizes', 'Matte, satin & art papers', 'Vivid archival inks', 'Indoor display ready'],
    audiences: ['Students', 'Event organizers', 'Individuals'],
    turnaround: '2–3 days',
    options: [
      { id: 'size', label: 'Size', choices: ['A3', 'A2', 'A1', 'A0', 'Custom'] },
      { id: 'paper', label: 'Paper', choices: ['Matte', 'Satin', 'Heavyweight art'] },
      { id: 'quantity', label: 'Quantity', choices: ['1', '5', '10', '25+'] },
    ],
  },
  {
    slug: 'brochures',
    name: 'Brochures',
    category: 'Stationery',
    tagline: 'Tell your story, folded neatly.',
    summary: 'Bi-fold, tri-fold and booklet brochures on coated and uncoated stocks.',
    description: [
      'Brochures give your business room to explain itself. We handle folding, scoring and binding so the finish is crisp and professional.',
      'Choose bi-fold, tri-fold, or a stitched booklet, on coated or natural uncoated paper.',
    ],
    image: '/images/brochures.png',
    features: ['Bi-fold, tri-fold & booklets', 'Precise scoring & folding', 'Coated & uncoated stocks', 'Saddle-stitch binding'],
    audiences: ['Local businesses', 'Event organizers', 'Small businesses'],
    turnaround: '3–4 days',
    options: [
      { id: 'fold', label: 'Format', choices: ['Bi-fold', 'Tri-fold', 'Z-fold', 'Booklet'] },
      { id: 'size', label: 'Size', choices: ['A5', 'A4', 'DL', 'Square'] },
      { id: 'paper', label: 'Paper', choices: ['Gloss coated', 'Silk coated', 'Uncoated natural'] },
      { id: 'quantity', label: 'Quantity', choices: ['50', '100', '250', '500+'] },
    ],
  },
  {
    slug: 'invitations',
    name: 'Invitations',
    category: 'Stationery',
    tagline: 'Set the tone before the day.',
    summary: 'Wedding and event invitations with foil, deckled edges and matching envelopes.',
    description: [
      'Invitations are the first glimpse of your event. We craft them with careful finishing — foil stamping, deckled edges, and coordinated envelopes.',
      'Perfect for weddings, milestone celebrations and formal events where the details matter.',
    ],
    image: '/images/invitations.png',
    features: ['Gold, silver & rose foil', 'Deckled & painted edges', 'Matching envelopes', 'Luxury textured stocks'],
    audiences: ['Individuals', 'Event organizers'],
    turnaround: '4–6 days',
    options: [
      { id: 'type', label: 'Occasion', choices: ['Wedding', 'Birthday', 'Corporate event', 'Other'] },
      { id: 'finish', label: 'Finish', choices: ['Foil stamped', 'Letterpress', 'Standard print'] },
      { id: 'envelope', label: 'Envelopes', choices: ['Include matching', 'Cards only'] },
      { id: 'quantity', label: 'Quantity', choices: ['25', '50', '100', '150+'] },
    ],
  },
  {
    slug: 'custom-branding',
    name: 'Custom Printing & Branding',
    category: 'Branding',
    tagline: 'A whole identity, made cohesive.',
    summary: 'Full brand kits, packaging and bespoke print projects, designed and produced together.',
    description: [
      'When you need more than one thing, we bring it all together — logo application, stationery, packaging, signage and merch in one consistent system.',
      'Tell us about your project and we will scope the pieces, materials and finishes with you before printing.',
    ],
    image: '/images/custom-branding.png',
    features: ['Brand identity kits', 'Custom packaging', 'Coordinated collateral', 'Design support available'],
    audiences: ['Local businesses', 'Small businesses', 'Event organizers'],
    turnaround: 'Project based',
    options: [
      { id: 'scope', label: 'What you need', choices: ['Brand identity kit', 'Packaging', 'Signage', 'Mixed collateral'] },
      { id: 'design', label: 'Design status', choices: ['I have final artwork', 'I need design help', 'Somewhere in between'] },
      { id: 'timeline', label: 'Timeline', choices: ['Flexible', 'Within 2 weeks', 'Urgent'] },
    ],
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export const productCategories = ['All', 'Stationery', 'Large Format', 'Apparel', 'Small Format', 'Branding'] as const
