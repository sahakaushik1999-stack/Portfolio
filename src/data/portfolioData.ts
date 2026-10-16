import { Project, PlaygroundItem } from '../types/portfolio';

export const PROJECTS: Project[] = [
  {
    id: 'better-candle',
    index: '01',
    title: 'BETTER CANDLE',
    subtitle: 'Made with Fresh Ingredients — Organic Packaging & Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Packaging Designer\nMeta Ads Creative',
    launchDate: 'January 2024',
    recognitions: [
      'Meta Performance Creative Feature',
      'Organic Packaging Design Award',
    ],
    description: 'Tactile organic illustrated box with fluid purple lettering, fresh garden ingredients (tomatoes, carrots, broccoli), and warm sunny fields created for Better Candle.',
    themeColor: '#7c3aed',
    accentColor: '#fb923c',
    category: 'Meta Ads',
    visualType: 'packaging',
    imageUrl: '/projects/better-candle.png',
    caseStudy: {
      overview: 'Engineered high-converting static and carousel Meta Ads for Better Candle, introducing plant-based soy wax candles made with fresh natural ingredients.',
      challenge: 'Standing out in a saturated home fragrance market while communicating organic, food-grade purity without synthetic additives.',
      solution: 'Developed playful fluid lettering intertwined through the box canvas, paired with whimsical vegetable illustrations and warm radiant color palettes.',
      deliverables: ['Box Dieline Engineering', 'Meta Feed Ad Carousels', 'Story & Reel Teasers', 'Product Photography Stills'],
      metrics: [
        { label: 'Return on Ad Spend', value: '4.9x ROAS' },
        { label: 'Click-Through Rate', value: '4.6%' },
        { label: 'Customer Retention', value: '62%' }
      ]
    }
  },
  {
    id: 'harmony-brand-design',
    index: '02',
    title: 'HARMONY',
    subtitle: 'Mobile Music & Soundscape Brand Design & App Interface',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'UI/UX & Brand Identity Designer',
    launchDate: 'February 2024',
    recognitions: [
      'Digital Design Awards Nominee',
      'Dark UI Showcase Feature',
    ],
    description: 'Dark smartphone user interface with glowing electric amber soundwave icon, designed for mindful acoustic sound design and audio immersion.',
    themeColor: '#eab308',
    accentColor: '#facc15',
    category: 'Meta Ads',
    visualType: 'minimal',
    imageUrl: '/projects/harmony-brand-design.png',
    caseStudy: {
      overview: 'Crafted the digital identity and app launch Meta Ads for HARMONY, a mindful sound therapy and acoustic immersion mobile application.',
      challenge: 'Translating intangible sound frequencies and deep acoustic relaxation into a compelling visual language that stops thumbs on social feeds.',
      solution: 'Constructed an all-black AMOLED smartphone frame with a radiant golden waveform glyph that visually pulses against deep ambient shadows.',
      deliverables: ['App Icon & UI Glyphs', 'Meta Launch Video Stills', 'Social Media Carousel Ads', 'Interactive Story Units'],
      metrics: [
        { label: 'App Store Installs', value: '85,000+' },
        { label: 'Engagement Rate', value: '7.8%' },
        { label: 'Return on Ad Spend', value: '4.7x ROAS' }
      ]
    }
  },
  {
    id: 'rebranding-for-biocule',
    index: '03',
    title: 'BIOCULE',
    subtitle: 'Where Science Meets Glamour — Editorial Skincare Campaign',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Creative Director\nBrand Strategist',
    launchDate: 'March 2024',
    recognitions: [
      'Behance Curated in Graphic Design',
      'D&AD Editorial Photography Shortlist',
    ],
    description: 'Prestige skincare brand identity combining clinical scientific efficacy with luxury editorial aesthetics and delicate oval framing.',
    themeColor: '#be185d',
    accentColor: '#f43f5e',
    category: 'Meta Ads',
    visualType: 'cyber',
    imageUrl: '/projects/rebranding-for-biocule.png',
    caseStudy: {
      overview: 'Led the visual rebrand and high-fashion editorial Meta campaign for Biocule, positioning the clean skincare brand where clinical science meets glamour.',
      challenge: 'Bridging technical clinical formulations with the sensuous luxury required to command high D2C price points.',
      solution: 'Combined soft natural daylight portraits with a fine geometric oval orbit frame and bespoke high-contrast serif typography.',
      deliverables: ['Brand Identity Redesign', 'Meta Carousel Ads', 'PR Gift Packaging', 'Lookbook Art Direction'],
      metrics: [
        { label: 'D2C Revenue Growth', value: '+310%' },
        { label: 'Click-Through Rate', value: '5.1%' },
        { label: 'Brand Recall Lift', value: '+68%' }
      ]
    }
  },
  {
    id: 'cha-tea-drops',
    index: '04',
    title: 'CHA TEA FLAVOURING DROPS',
    subtitle: 'Apothecary Drops: Hyderabadi Chai, Delhi Kadak & Elaichi Blend',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Packaging & Editorial Designer',
    launchDate: 'April 2024',
    recognitions: [
      'Meta D2C Creative Showcase',
      'Artisanal Packaging Award',
    ],
    description: 'Artisanal liquid tea drops in amber glass droppers (Hyderabadi Chai, Delhi Kadak, Elaichi Blend, Mumbai Cutting) and single-origin tea leaf packaging.',
    themeColor: '#4d5b24',
    accentColor: '#84cc16',
    category: 'Meta Ads',
    visualType: 'packaging',
    imageUrl: '/projects/cha-tea-drops.png',
    caseStudy: {
      overview: 'Designed tactile product packaging and direct-response Meta Ads for Cha Tea Flavoring Drops, introducing liquid spice flushes to modern tea lovers.',
      challenge: 'Introducing a revolutionary format—single-drop tea essence—to traditional tea drinkers across India.',
      solution: 'Emphasized authentic wooden spice bowls, rustic raw ingredients, amber glass bottles, and regional heritage naming conventions.',
      deliverables: ['Dropper Bottle Labels', 'Outer Box Packaging', 'Meta Static & Video Ads', 'Retail Tasting Display'],
      metrics: [
        { label: 'Units Sold in 90 Days', value: '42,000+' },
        { label: 'Click-Through Rate', value: '4.8%' },
        { label: 'Return on Ad Spend', value: '5.3x ROAS' }
      ]
    }
  },
  {
    id: 'the-trost',
    index: '05',
    title: 'SOLEDITION ARTIST LINEUP',
    subtitle: 'Sneaker & Streetwear Festival Social Posts — Techpanda x Kenzani',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Lead Visual Designer\nEvent Campaign Strategist',
    launchDate: 'May 2024',
    recognitions: [
      'Festival Visual Identity Feature',
      'High-Impact Social Creative Award',
    ],
    description: 'Perforated postage stamp artist announcement tickets spotlighting Techpanda x Kenzani, Victor Ruiz, Skipster, and Nucleya at National Stadium, New Delhi.',
    themeColor: '#059669',
    accentColor: '#10b981',
    category: 'Meta Ads',
    visualType: 'cyber',
    imageUrl: '/projects/the-trost.webp',
    caseStudy: {
      overview: 'Created the official artist lineup announcement creatives and Meta feed campaign for Soledition 2024, Asia’s premier sneaker and streetwear culture festival.',
      challenge: 'Designing an eye-catching festival ticket aesthetic that conveyed multi-day schedules while maintaining street-culture energy.',
      solution: 'Engineered vibrant green perforated postage stamp ticket frames over textured yellow graffiti walls, with clean day-by-day artist cards.',
      deliverables: ['Artist Lineup Posts', 'Social Media Story Teasers', 'Print Wristbands & Badges', 'Stadium Stage Screens'],
      metrics: [
        { label: 'Ticket Sellout Time', value: '72 Hours' },
        { label: 'Social Reach', value: '3.4M+' },
        { label: 'Story Reshares', value: '48,000+' }
      ]
    }
  },
  {
    id: 'all-about-horology',
    index: '06',
    title: 'ALL ABOUT HOROLOGY',
    subtitle: 'Logofolio & Chronometer Monogram Authority Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Brand & Performance Designer',
    launchDate: 'June 2024',
    recognitions: [
      'Logofolio Excellence Selection',
      'Luxury Branding Spotlight',
    ],
    description: 'Precision luxury timepiece monogram and guilloché-inspired mark created for mechanical watch journalism and horological collectors on folded bronze silk.',
    themeColor: '#0f172a',
    accentColor: '#38bdf8',
    category: 'Meta Ads',
    visualType: 'monograph',
    imageUrl: '/projects/all-about-horology.webp',
    caseStudy: {
      overview: 'Engineered an interlocking architectural monogram and brand identity for All About Horology, celebrating the artistry of mechanical watchmaking.',
      challenge: 'Creating a monogram that represents classic chronometer escapements while remaining modern, scalable, and legible at small dial sizes.',
      solution: 'Designed an interlocking AAH monogram in pure geometric symmetry, presented on matte black stationery against warm champagne silk.',
      deliverables: ['Interlocking Monogram', 'Luxury Business Stationery', 'Social Feed Media Kit', 'Embossed Certificate Dielines'],
      metrics: [
        { label: 'Brand Recognition', value: '94%' },
        { label: 'Community Growth', value: '+180%' },
        { label: 'Client Approvals', value: '1st Round' }
      ]
    }
  },
  {
    id: 'superdry-campaign',
    index: '07',
    title: 'SUPERDRY SALE',
    subtitle: 'Flat Half Price & Summer Styles for Less Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Senior Campaign Art Director',
    launchDate: 'July 2024',
    recognitions: [
      'Retail Campaign of the Season',
      'Meta Performance Ad Award',
    ],
    description: 'High-contrast retail campaign featuring 3D glowing neon typography, 48-hour urgency hooks, and contemporary streetwear styling.',
    themeColor: '#ea580c',
    accentColor: '#f97316',
    category: 'Meta Ads',
    visualType: 'silhouette',
    imageUrl: '/projects/superdry-campaign.webp',
    caseStudy: {
      overview: 'Produced the nationwide "Flat Half Price" seasonal sale and "Summer Styles For Less" campaign collateral for Superdry India retail stores and Meta advertising.',
      challenge: 'Cutting through retail discount noise with high-fashion art direction rather than generic red-tag discount graphics.',
      solution: 'Constructed tactile 3D orange neon tube letters for "SALE FLAT HALF PRICE" contrasted against deep moody studio portraits.',
      deliverables: ['In-Store Lightbox Displays', 'Meta Carousel Ads', 'Video Motion Bumpers', 'Mall Facade Banners'],
      metrics: [
        { label: 'Store Footfall Increase', value: '+54%' },
        { label: 'Meta Ads ROAS', value: '6.2x' },
        { label: 'Click-Through Rate', value: '5.8%' }
      ]
    }
  },
  {
    id: 'combine-sports',
    index: '08',
    title: 'COMBINE SPORTS',
    subtitle: 'Logofolio & Urban Stadium Billboard Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Brand Identity & Vector Designer',
    launchDate: 'August 2024',
    recognitions: [
      'Vector Arts International Feature',
      'Sports Identity Showcase 2024',
    ],
    description: 'Sharp aerodynamic chevron logomark on highway billboard alongside gold-seam cricket ball balancing on rugged stone.',
    themeColor: '#1e293b',
    accentColor: '#38bdf8',
    category: 'Meta Ads',
    visualType: 'cyber',
    imageUrl: '/projects/combine-sports.webp',
    caseStudy: {
      overview: 'Created the brand identity system and billboard advertising for Combine Sports, a dynamic performance sports apparel and equipment brand.',
      challenge: 'Developing a sports emblem with extreme velocity and angular energy that works equally well on apparel tags and highway billboards.',
      solution: 'Engineered dual interlocking speed chevrons forming a stylized CS mark, rendered in bold high-contrast monochrome.',
      deliverables: ['Vector Brand Identity', 'Highway Billboard Mockups', 'Athletic Livery Guidelines', 'Social Media Ads'],
      metrics: [
        { label: 'Brand Association Lift', value: '+72%' },
        { label: 'Social Impressions', value: '2.1M' },
        { label: 'Merchandise Inquiries', value: '+140%' }
      ]
    }
  },
  {
    id: 'video-projects',
    index: '09',
    title: 'COMMERCIAL VIDEO PROJECTS',
    subtitle: 'Commercial Showreel & Edits: Soledition, Superdry, Araiya & Moira',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Video Editor & Colorist',
    launchDate: 'September 2024',
    recognitions: [
      'Behance Featured in Motion',
      'Commercial Showreel Selection',
    ],
    description: 'Commercial video reel exploration spanning music festivals, streetwear launches, luxury hospitality resorts, and corporate security spots.',
    themeColor: '#78350f',
    accentColor: '#d97706',
    category: 'Meta Ads',
    visualType: 'cyber',
    imageUrl: '/projects/video-projects.webp',
    caseStudy: {
      overview: 'Curated and edited high-energy commercial reels, music festival recap videos, and fashion campaign teasers for leading industry brands.',
      challenge: 'Synchronizing multi-genre footage (festivals, luxury resorts, apparel) into cohesive, punchy edits under 30 seconds.',
      solution: 'Applied custom cinematic LUTs, speed ramps, beat-matched cuts, and kinetic typography lower thirds.',
      deliverables: ['Master Commercial Reel', 'Instagram Reels & Shorts Variants', 'Sound Design & Audio Mix', 'Cinematic Color Grading'],
      metrics: [
        { label: 'Combined Reel Views', value: '8.4M+' },
        { label: 'Average Watch Time', value: '86%' },
        { label: 'Client Retention', value: '100%' }
      ]
    }
  },
  {
    id: 'cha-tea-apothecary',
    index: '10',
    title: 'CHA BOTANICAL TEA DROPS',
    subtitle: 'Apothecary Bar & Spice Infusion Collection Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Package Designer\nMeta Ads Strategist',
    launchDate: 'October 2024',
    recognitions: [
      'D2C Creative Feature',
      'Culinary & Botanical Showcase',
    ],
    description: 'Apothecary wooden counter display showcasing four distinctive regional Indian tea essences with botanical loose-leaf bowls.',
    themeColor: '#365314',
    accentColor: '#65a30d',
    category: 'Meta Ads',
    visualType: 'packaging',
    imageUrl: '/projects/cha-tea-drops.webp',
    caseStudy: {
      overview: 'Structured multi-card collection ads showcasing all regional botanical drops, allowing users to swipe through and build custom wellness gift sets.',
      challenge: 'Maximizing carousel completion rate across all product cards on Instagram mobile.',
      solution: 'Created a continuous panoramic card background where the wooden apothecary bar spans seamlessly across all swipeable slides.',
      deliverables: ['Panoramic Carousel Ads', 'Single Flavor Focus Stills', 'Gift Bundle Ad Units', 'Dynamic Retargeting Feed'],
      metrics: [
        { label: 'Swipe-Through Rate', value: '31%' },
        { label: 'Average Order Value', value: '$74' },
        { label: 'Return on Ad Spend', value: '5.1x ROAS' }
      ]
    }
  },
  {
    id: 'lookbook-themonk',
    index: '11',
    title: 'THEMONK LOOKBOOK',
    subtitle: 'Editorial Streetwear Lookbook Publication Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Art Director\nEditorial Designer',
    launchDate: 'November 2024',
    recognitions: [
      'Editorial Design Award',
      'Swiss Grid Typographic Selection',
    ],
    description: 'Clean editorial catalog spread exploring asymmetric Swiss grid systems, ample white space, and bilingual typography for contemporary streetwear.',
    themeColor: '#451a03',
    accentColor: '#b45309',
    category: 'Meta Ads',
    visualType: 'editorial',
    imageUrl: '/projects/lookbook-themonk.webp',
    caseStudy: {
      overview: 'Designed the official editorial print and digital lookbook publication for TheMonk’s 2024-2025 capsule collection.',
      challenge: 'Balancing raw Japanese streetwear aesthetics with timeless editorial minimalism for an international fashion audience.',
      solution: 'Employed high-contrast serif headlines, delicate Japanese katakana subtitle accents, and generous tonal margins.',
      deliverables: ['Print Lookbook (Hardcover)', 'Digital PDF Wholesale Catalog', 'Meta Story Carousels', 'E-Commerce Hero Banners'],
      metrics: [
        { label: 'Wholesale Orders', value: '+120%' },
        { label: 'Catalog Downloads', value: '14,000+' },
        { label: 'Editorial Awards', value: '2 Wins' }
      ]
    }
  },
  {
    id: 'masala-synergy',
    index: '12',
    title: 'MASALA SYNERGY',
    subtitle: 'Culinary Identity, Botanical Spice Pattern & Apparel Branding',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Brand & Packaging Designer',
    launchDate: 'December 2024',
    recognitions: [
      'Sustainable Brand Campaign Award',
      'Botanical Illustration Showcase',
    ],
    description: 'Deep emerald culinary apron embroidery, storefront signage, and custom hand-drawn Indian botanical spice patterns.',
    themeColor: '#0f766e',
    accentColor: '#14b8a6',
    category: 'Meta Ads',
    visualType: 'packaging',
    imageUrl: '/projects/masala-synergy.webp',
    caseStudy: {
      overview: 'Created an evocative visual identity and textile patterns for Masala Synergy, a modern culinary brand celebrating whole Indian spices.',
      challenge: 'Modernizing traditional Indian spice motifs into a luxury gastronomic brand without losing cultural authenticity.',
      solution: 'Crafted intricate botanical illustrations of star anise, cardamom, whole cinnamon, and red chili over deep ocean teal backgrounds.',
      deliverables: ['Custom Botanical Pattern', 'Barista Aprons & Uniforms', 'Exterior Storefront Signage', 'Spice Tin Packaging'],
      metrics: [
        { label: 'Retail Distribution', value: '45+ Stores' },
        { label: 'Social Engagement', value: '+190%' },
        { label: 'Packaging Award', value: 'Gold Winner' }
      ]
    }
  },
  {
    id: 'shuchi-beltings',
    index: '13',
    title: 'SHUCHI BELTINGS',
    subtitle: 'Industrial Conveyor Belt Signage & Logofolio Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Corporate Identity Designer',
    launchDate: 'January 2025',
    recognitions: [
      'Industrial Corporate Identity Award',
      'Large Scale Signage Feature',
    ],
    description: 'Heavy industrial conveyor belt logotype with gear-tooth perimeter branding, installed on modern factory brick facade.',
    themeColor: '#991b1b',
    accentColor: '#ef4444',
    category: 'Meta Ads',
    visualType: 'architecture',
    imageUrl: '/projects/shuchi-beltings.webp',
    caseStudy: {
      overview: 'Redesigned the corporate identity and architectural factory signage for Shuchi Beltings, a leading manufacturer of industrial conveyor systems.',
      challenge: 'Giving a heavy industrial manufacturing firm a sharp, modern, engineered identity that commands authority in B2B supply chains.',
      solution: 'Created a pill-shaped continuous belt loop emblem with red cog teeth framing clean engineered sans-serif letterforms.',
      deliverables: ['Factory Architectural Signage', 'Fleet & Livery Design', 'Corporate Stationery & Specs', 'B2B Trade Catalog'],
      metrics: [
        { label: 'B2B Inquiries', value: '+85%' },
        { label: 'Contract Closures', value: '+42%' },
        { label: 'Brand Authority Rating', value: '98%' }
      ]
    }
  },
  {
    id: 'cha-brochure',
    index: '14',
    title: 'CHA "UNLEASH THE MAGIC" BROCHURE',
    subtitle: 'Tactile Editorial Storybook & Retail Presentation Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Brochure Designer\nVisual Direction',
    launchDate: 'February 2025',
    recognitions: [
      'Editorial Print & Social Award',
      'Packaging Storybook Selection',
    ],
    description: 'Tactile retail foldout brochure and catalog on weathered timber coffee tables ("Unleash the magic in your cup! With just a drop, turn ordinary tea into an extraordinary experience").',
    themeColor: '#713f12',
    accentColor: '#eab308',
    category: 'Meta Ads',
    visualType: 'editorial',
    imageUrl: '/projects/cha-brochure.webp',
    caseStudy: {
      overview: 'Engineered a multi-fold retail storybook brochure and Meta Ads creative for Cha Tea Flavoring Drops to demonstrate product usage in 3 seconds.',
      challenge: 'Educating consumers on how liquid drops transform hot water into aromatic artisanal chai with high sensory immersion.',
      solution: 'Pairing appetizing overhead tea bowl macro photography with step-by-step droplet ritual guides and rich coffee-table styling.',
      deliverables: ['Foldout Retail Brochure', 'Meta Carousel Ads', 'Video Usage Demos', 'In-Store POP Displays'],
      metrics: [
        { label: 'Retail Wholesale Orders', value: '25,000+' },
        { label: 'Brochure Pickup Rate', value: '92%' },
        { label: 'Return on Ad Spend', value: '5.2x ROAS' }
      ]
    }
  },
  {
    id: 'the-world-collection-tokyo',
    index: '15',
    title: 'THE WORLD COLLECTION: TOKYO',
    subtitle: 'TheMonk Frameless Titanium Eyewear Lookbook Meta Ads',
    client: 'The Trost',
    agency: 'Culture Boat',
    role: 'Editorial Designer\nProduct Specialist',
    launchDate: 'March 2025',
    recognitions: [
      'Luxury Eyewear Design Feature',
      'Lookbook Layout of the Year',
    ],
    description: 'Minimalist Japanese katakana eyewear catalog presenting ultra-lightweight frameless titanium frames, presentation cases, and colorways.',
    themeColor: '#854d0e',
    accentColor: '#eab308',
    category: 'Meta Ads',
    visualType: 'cyber',
    imageUrl: '/projects/the-world-collection-tokyo.webp',
    caseStudy: {
      overview: 'Art directed the product catalog and Meta Ads for TheMonk’s "The World Collection: Tokyo", featuring ultra-lightweight frameless titanium sunglasses.',
      challenge: 'Spotlighting intricate frame hinge engineering and colorway variations (Gold with Black, Silver with Blue, Rose Gold) on mobile screens.',
      solution: 'Designed multi-panel catalog spreads with Japanese katakana headers (ザ・モンク), structured specs, and red presentation gift cases.',
      deliverables: ['Digital & Print Catalog', 'Product Detail Carousels', 'Retail Counter Foldout Posts', 'Omnichannel Catalog Ads'],
      metrics: [
        { label: 'Catalog Downloads', value: '18,500+' },
        { label: 'Wholesale Inquiries', value: '+160%' },
        { label: 'Return on Ad Spend', value: '5.6x ROAS' }
      ]
    }
  }
];

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: 'pg-1',
    index: '01',
    title: 'SOLEDITION 2024 ARTIST LINEUP',
    category: '3D & Motion',
    year: '2024',
    aspect: 'portrait',
    theme: '#e62b1e',
    description: 'Festival stage announcement poster featuring Victor Ruiz and Techpanda x Kenzani with brutalist distressed type.',
    tags: ['Festival Identity', 'Lineup Poster', 'Photoshop', 'Typography']
  },
  {
    id: 'pg-2',
    index: '02',
    title: 'THEMONK TOKYO LOOKBOOK SPREAD',
    category: 'Editorial',
    year: '2024',
    aspect: 'landscape',
    theme: '#2563eb',
    description: 'Editorial layout celebrating raw Japanese denim, silver metallic accents, and Swiss grid systems.',
    tags: ['Lookbook', 'Fashion Editorial', 'Print', 'Typography']
  },
  {
    id: 'pg-3',
    index: '03',
    title: 'SUPERDRY STREETWEAR MOTION CUT',
    category: '3D & Motion',
    year: '2024',
    aspect: 'square',
    theme: '#e11d48',
    description: 'Rhythm-matched fast-cut video teaser combining urban neon lighting with streetwear garment closeups.',
    tags: ['Premiere Pro', 'Motion Cut', 'Streetwear', 'Reel']
  },
  {
    id: 'pg-4',
    index: '04',
    title: 'ALL ABOUT HOROLOGY MONOGRAM',
    category: 'Typography',
    year: '2024',
    aspect: 'portrait',
    theme: '#0f172a',
    description: 'Mathematical golden-ratio timepiece monogram study inspired by tourbillon escapements and chronometers.',
    tags: ['Logofolio', 'Horology', 'Vector', 'Monogram']
  },
  {
    id: 'pg-5',
    index: '05',
    title: 'NAUKRI.COM "ONE CLICK" CAMPAIGN',
    category: 'Experiments',
    year: '2025',
    aspect: 'wide',
    theme: '#2563eb',
    description: 'High-conversion social media campaign card with bold contrast typography for modern job seekers.',
    tags: ['Social Campaign', 'Naukri', 'Digital Media', 'Marketing']
  },
  {
    id: 'pg-6',
    index: '06',
    title: 'ICICI CITIZEN WEALTH EDITORIAL',
    category: 'Editorial',
    year: '2024',
    aspect: 'portrait',
    theme: '#991b1b',
    description: 'Prestige corporate print spread structuring complex wealth portfolios and retirement solutions.',
    tags: ['Brochure', 'Editorial', 'Corporate', 'Layout']
  },
  {
    id: 'pg-7',
    index: '07',
    title: 'VPROTECT KINETIC ANIMATION',
    category: '3D & Motion',
    year: '2024',
    aspect: 'square',
    theme: '#059669',
    description: 'Security & protection motion design package with kinetic vector transitions created in After Effects.',
    tags: ['After Effects', 'Animation', 'Kinetic', 'Corporate']
  },
  {
    id: 'pg-8',
    index: '08',
    title: 'COMBINE SPORTS ATHLETIC REEL',
    category: '3D & Motion',
    year: '2024',
    aspect: 'landscape',
    theme: '#ea580c',
    description: 'High-energy sportswear video promo cut with custom motion lower thirds and speed ramps.',
    tags: ['Video Editing', 'Sports', 'Reel', 'Sound Sync']
  },
  {
    id: 'pg-9',
    index: '09',
    title: 'CHA BOTANICAL TEA PACKAGING',
    category: 'Editorial',
    year: '2024',
    aspect: 'portrait',
    theme: '#15803d',
    description: 'Tactile artisanal tea pouch and tin labeling system featuring single-origin Darjeeling leaf illustrations.',
    tags: ['Packaging', 'Botanical', 'Tea', 'Artisan']
  },
  {
    id: 'pg-10',
    index: '10',
    title: 'MASALA SYNERGY SPICE LABELS',
    category: 'Experiments',
    year: '2024',
    aspect: 'square',
    theme: '#b45309',
    description: 'Color-coded geometric spice blossom label hierarchy for authentic regional Indian culinary blends.',
    tags: ['Packaging', 'Spices', 'Color System', 'Branding']
  },
  {
    id: 'pg-11',
    index: '11',
    title: 'SHUCHI BELTINGS TECHNICAL VECTOR',
    category: 'Typography',
    year: '2023',
    aspect: 'landscape',
    theme: '#475569',
    description: 'Precision CAD-inspired technical vector diagrams and industrial conveyor brand typography.',
    tags: ['Industrial', 'Vector', 'Technical', 'Identity']
  },
  {
    id: 'pg-12',
    index: '12',
    title: 'ARAIYA LUXURY HOSPITALITY REEL',
    category: '3D & Motion',
    year: '2024',
    aspect: 'portrait',
    theme: '#d97706',
    description: 'Cinematic color grade and resort experience edit for Araiya Hotels & Resorts across Indian destinations.',
    tags: ['Hospitality', 'Color Grade', 'Cinematic', 'Premiere Pro']
  }
];

export const ABOUT_DATA = {
  name: 'Kaushik Saha',
  title: 'Graphic Designer',
  phone: '+91 98705 81517',
  email: 'sahakaushik1999@gmail.com',
  location: 'New Delhi, India',
  experience: '6+ Years Experience',
  behanceUrl: 'https://www.behance.net/gallery/207168461/Portfolio',
  bio: 'Senior Graphic designer with 6+ years across brand identity, performance creative, and impactful reels. Currently leading full creative output team for a Health & Wellness brand: directing Meta ad campaigns for a consistent ROAS around 3.5 - 6x from last year, scaling monthly content output by 3x, and launching a new product with end-to-end creative. Expert in translating business objectives into visual systems that perform as well as they look, with deep fluency across the Adobe Creative Suite.',
  summary: 'Senior Graphic designer with 6+ years across brand identity, performance creative, and impactful reels. Currently leading full creative output team for a Health & Wellness brand: directing Meta ad campaigns for a consistent ROAS around 3.5 - 6x from last year, scaling monthly content output by 3x, and launching a new product with end-to-end creative. Expert in translating business objectives into visual systems that perform as well as they look, with deep fluency across the Adobe Creative Suite.',
  skills: [
    'Creative Direction',
    'Brand Strategy',
    'Campaign Concepting',
    'Art Direction',
    'Visual Storytelling'
  ],
  education: [
    {
      degree: 'Diploma in Animation & Multimedia',
      institution: 'Arena Animation',
      period: 'Arena Animation'
    },
    {
      degree: 'Bachelor of Commerce',
      institution: 'Sri Aurobindo College',
      period: 'Sri Aurobindo College, University of Delhi'
    }
  ],
  employment: [
    {
      role: 'Sr. Graphic Designer',
      company: 'The Trost',
      period: '2025 – Present',
      bullets: [
        'Lead an in-house creative team for a Health & Wellness B2C brand, managing creative strategy and execution across all channels.',
        'Built and optimized Meta ad creative systems, consistently delivering 3.5–6x ROAS across Facebook, Instagram, and WhatsApp.',
        'Scaled monthly creative output by 3x and reduced production time by ~40% through AI-powered workflows.',
        'Led end-to-end creative for a product launch that sold out its first batch within one week.',
        'Developed retention creatives that contributed to a 22% uplift in repeat purchase rate.',
        'Partner closely with marketing and growth teams to align creative decisions with acquisition and retention KPIs.'
      ],
      highlights: 'Leading in-house creative output team, directing Meta ad campaigns for consistent 3.5–6x ROAS, scaling monthly content output by 3x, and launching sold-out products.'
    },
    {
      role: 'Communication Designer',
      company: 'Cultre Boat',
      period: 'Sep 2024 – Apr 2025',
      bullets: [
        'Delivered 50+ digital and print assets weekly for fashion and lifestyle brands including Masala Synergy, Vasansi Jaipur, and The Box Boutique.',
        'Led end-to-end brand identity development for two client brands, spanning logo systems, typography, colour palettes, stationery, and uniforms.',
        'Directed motion-led social creatives that achieved 3.6x higher engagement than static content.',
        'Reduced client revision cycles by 30% by developing stronger creative briefs and trend-driven promotional assets.'
      ],
      highlights: 'Delivered 50+ weekly digital/print assets for fashion/lifestyle brands (Masala Synergy, Vasansi Jaipur, The Box Boutique), 3.6x higher engagement motion creatives.'
    },
    {
      role: 'Graphic Designer',
      company: 'Abstract Reality Studios',
      period: 'Jan 2024 – Sep 2024',
      bullets: [
        'Designed brand identities, logo systems, and motion teasers for diverse clients.'
      ],
      highlights: 'Brand identity systems, typography, and motion-led promotional collateral.'
    },
    {
      role: 'Graphic Designer',
      company: 'Fortune Studios',
      period: 'Aug 2020 – Dec 2023',
      bullets: [
        'Designed brand identity systems, product packaging dielines, and coordinated multi-channel client deliveries.'
      ],
      highlights: 'Brand identity systems, product packaging, and print pre-press coordination across 3+ years.'
    }
  ],
  tools: [
    { name: 'Adobe Photoshop', level: 'Expert', desc: 'Photo manipulation, digital campaign graphics, retouching' },
    { name: 'Adobe Illustrator', level: 'Expert', desc: 'Vector logos, packaging dielines, typography, monograph grids' },
    { name: 'Adobe Premiere Pro', level: 'Advanced', desc: 'Video editing, multi-cam cuts, audio synchronization, speed ramps' },
    { name: 'Adobe After Effects', level: 'Advanced', desc: 'Kinetic typography, logo animation, motion teasers, lower thirds' }
  ],
  disciplines: [
    'Creative Direction',
    'Brand Strategy',
    'Campaign Concepting',
    'Art Direction',
    'Visual Storytelling',
    'Performance Meta Ads (3.5–6x ROAS)',
    'Motion-Led Social Creatives & Reels'
  ]
};
