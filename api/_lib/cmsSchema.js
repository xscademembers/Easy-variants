/**
 * Single source of truth for CMS field definitions.
 * Used by API validation and the admin content editor.
 */

function cardFields(prefix, count, labels) {
  const fields = [];
  for (let i = 0; i < count; i += 1) {
    const n = i + 1;
    const label = labels?.[i] || `Item ${n}`;
    fields.push(
      { key: `${prefix}.${i}.title`, label: `${label} — title`, type: 'text' },
      { key: `${prefix}.${i}.description`, label: `${label} — description`, type: 'textarea' }
    );
  }
  return fields;
}

function statFields(prefix, count) {
  const fields = [];
  for (let i = 0; i < count; i += 1) {
    fields.push(
      { key: `${prefix}.${i}.value`, label: `Stat ${i + 1} value`, type: 'text' },
      { key: `${prefix}.${i}.label`, label: `Stat ${i + 1} label`, type: 'text' }
    );
  }
  return fields;
}

function linkFields(prefix, items) {
  const fields = [];
  items.forEach((item, i) => {
    fields.push(
      { key: `${prefix}.${i}.label`, label: `${item.label} — label`, type: 'text', default: item.label },
      { key: `${prefix}.${i}.href`, label: `${item.label} — link`, type: 'text', default: item.href }
    );
  });
  return fields;
}

function sectionHeader(prefix, sectionName, defaults = {}) {
  return {
    section: sectionName,
    fields: [
      { key: `${prefix}.eyebrow`, label: 'Eyebrow', type: 'text', default: defaults.eyebrow || '' },
      { key: `${prefix}.title`, label: 'Heading', type: 'text', default: defaults.title || '' },
      { key: `${prefix}.description`, label: 'Description', type: 'textarea', default: defaults.description || '' },
    ],
  };
}

export const CMS_SCHEMA = {
  home: [
    {
      section: 'Header navigation',
      fields: [
        { key: 'header.cta.label', label: 'Nav demo button label', type: 'text', default: 'Get Your Demo Today' },
        { key: 'header.cta.href', label: 'Nav demo button link', type: 'text', default: 'contactus.html' },
      ],
    },
    {
      section: 'Hero',
      fields: [
        { key: 'hero.eyebrow', label: 'Eyebrow', type: 'text', default: 'Design Automation Platform' },
        { key: 'hero.title.line1', label: 'Headline line 1', type: 'text', default: 'Speed & Precision' },
        { key: 'hero.title.line2', label: 'Headline line 2', type: 'text', default: '10× Amplified' },
        {
          key: 'hero.description',
          label: 'Description',
          type: 'textarea',
          default:
            'Engineered for high-volume manufacturing through automated placement zones, color blocks, and decoration-specific instructions. Standardize complex text contours with optical-fit precision to generate hundreds of variants complete with precise factory application specs from a single template in minutes.',
        },
        { key: 'hero.cta.primary.label', label: 'Primary CTA label', type: 'text', default: 'Request a Demo Today' },
        { key: 'hero.cta.primary.href', label: 'Primary CTA link', type: 'text', default: 'contactus.html' },
        { key: 'hero.cta.secondary.label', label: 'Secondary CTA label', type: 'text', default: 'Watch Explainer' },
        { key: 'hero.cta.secondary.href', label: 'Secondary CTA link', type: 'text', default: '#demos' },
        {
          key: 'hero.image',
          label: 'Hero image',
          type: 'image',
          default: { src: '/images/EasyVariants application.jpg.jpeg', alt: 'EasyVariants application interface' },
        },
      ],
    },
    sectionHeader('meet', 'Meet EasyVariants', {
      eyebrow: 'Explore',
      title: 'Meet EasyVariants',
      description:
        'Designed for enterprise production teams handling complex assortments. Orchestrate colorways, logo systems, and placement rules at scale without manual rework.',
    }),
    {
      section: 'Meet EasyVariants · Media',
      fields: [
        {
          key: 'meet.video',
          label: 'Explainer video (MP4 path or URL)',
          type: 'video',
          default: {
            src: '/images/YTDown_YouTube_EasyVariants-Explainer-Video_Media_2Zl_BkN9L6w_002_720p.mp4',
          },
        },
      ],
    },
    sectionHeader('problem', 'The Problem', {
      eyebrow: 'The Problem',
      title: 'The Design Bottleneck',
      description:
        "Manual variant creation isn't just time-consuming  it's a bottleneck that drains your team's creativity and slows your market speed.",
    }),
    {
      section: 'The Problem · Cards',
      fields: cardFields('problem.cards', 4, [
        'Repetitive Work',
        'Consistency Challenges',
        'Slow Time-to-Market',
        'Limited Personalization',
      ]),
    },
    sectionHeader('advantage', 'The EasyVariants Advantage', {
      eyebrow: 'The EasyVariants Advantage',
      title: '10X Speed, Guarantee Brand Consistency',
      description:
        'Generate hundreds, even thousands, of error-free design variants in minutes  not hours or days. Fuel your innovation.',
    }),
    {
      section: 'Advantage · Cards',
      fields: cardFields('advantage.cards', 4, [
        'Boost Output 10X',
        'Guaranteed Consistency',
        'Faster Time-to-Market',
        'Scalable Personalization',
      ]),
    },
    sectionHeader('inside', 'Inside EasyVariants', {
      eyebrow: 'Inside EasyVariants',
      title: 'Generate Team Variants Faster Inside Illustrator',
      description:
        'EasyVariants helps designers automate team-based product variants using smart placement zones, color blocks, dynamic text variables, and centralized team assets  all directly inside Adobe Illustrator.',
    }),
    {
      section: 'Inside EasyVariants · Features & CTA',
      fields: [
        { key: 'inside.features.0', label: 'Feature 1', type: 'text', default: 'Placement Zones' },
        { key: 'inside.features.1', label: 'Feature 2', type: 'text', default: 'Color Blocks' },
        { key: 'inside.features.2', label: 'Feature 3', type: 'text', default: 'Team Asset Mapping' },
        { key: 'inside.features.3', label: 'Feature 4', type: 'text', default: 'Embroidery Support' },
        { key: 'inside.features.4', label: 'Feature 5', type: 'text', default: 'Template Versioning' },
        { key: 'inside.features.5', label: 'Feature 6', type: 'text', default: 'Variant Generation' },
        { key: 'inside.cta.label', label: 'CTA button label', type: 'text', default: 'Explore Workflow' },
        { key: 'inside.cta.href', label: 'CTA button link', type: 'text', default: '#how-it-works' },
        {
          key: 'inside.image.main',
          label: 'Main image',
          type: 'image',
          default: { src: '/images/EasyVariants.jpg.jpeg', alt: 'EasyVariants Plugin Interface' },
        },
        {
          key: 'inside.image.overlap',
          label: 'Overlap image (desktop)',
          type: 'image',
          default: { src: '/images/EasyVariants application.jpg.jpeg', alt: 'EasyVariants Application' },
        },
      ],
    },
    sectionHeader('solution', 'Our Solution', {
      eyebrow: 'Our Solution',
      title: 'Smart Automation System',
      description:
        'One Illustrator template powers unlimited variants. Define rules once, map your data, and ship production-ready outputs at scale.',
    }),
    {
      section: 'Our Solution · Stats',
      fields: statFields('solution.stats', 3),
    },
    {
      section: 'Our Solution · Feature cards',
      fields: cardFields('solution.cards', 4, [
        'Variable Control',
        'Intelligent Generation',
        'Layer Management',
        'Export Anywhere',
      ]),
    },
    sectionHeader('workflow', 'Workflow', {
      eyebrow: 'Workflow',
      title: 'Automate in 5 Steps',
      description: 'Streamlined workflow that turns raw inputs into hundreds of production-ready variants.',
    }),
    {
      section: 'Workflow · Steps',
      fields: cardFields('workflow.steps', 5, [
        'Upload PLM Colorways',
        'Load Ai Template',
        'Define Variables',
        'Map Elements',
        'Generate Variants',
      ]),
    },
    sectionHeader('deepdive', 'Platform Deep Dive', {
      eyebrow: 'Platform',
      title: 'The System Behind the Scale',
      description: 'Variables, craft, and workflow — how EasyVariants turns one hero design into a full league.',
    }),
    {
      section: 'Platform Deep Dive · Tab labels',
      fields: [
        { key: 'deepdive.tabs.0.label', label: 'Tab 1 label', type: 'text', default: 'Building Blocks' },
        { key: 'deepdive.tabs.0.sub', label: 'Tab 1 subtitle', type: 'text', default: 'The Variable System' },
        { key: 'deepdive.tabs.1.label', label: 'Tab 2 label', type: 'text', default: 'Craft That Scales' },
        { key: 'deepdive.tabs.2.label', label: 'Tab 3 label', type: 'text', default: 'Four Steps' },
        { key: 'deepdive.tabs.2.sub', label: 'Tab 3 subtitle', type: 'text', default: 'How It Works' },
      ],
    },
    {
      section: 'Platform Deep Dive · Variable System intro',
      fields: [
        {
          key: 'deepdive.variables.intro',
          label: 'Variable system intro',
          type: 'textarea',
          default:
            'Designers already think "the front logo goes here" and "the crown is the primary color." EasyVariants gives those existing concepts a home in the interface — rather than forcing a new abstraction on them. Variable types cover everything that changes from team to team; treatments such as effects run across all of them.',
        },
      ],
    },
    {
      section: 'Platform Deep Dive · Variable cards',
      fields: [
        ...['Placement Zones', 'Color Blocks', 'Embroidery Zones', 'Dimensions', 'Text', 'Treatments & Effects'].flatMap(
          (label, i) => [
            { key: `deepdive.variables.${i}.title`, label: `${label} — title`, type: 'text' },
            { key: `deepdive.variables.${i}.description`, label: `${label} — description`, type: 'textarea' },
            { key: `deepdive.variables.${i}.why`, label: `${label} — why it matters`, type: 'textarea' },
          ]
        ),
      ],
    },
    {
      section: 'Platform Deep Dive · Craft That Scales',
      fields: [
        {
          key: 'deepdive.craft.p1',
          label: 'Paragraph 1',
          type: 'textarea',
          default:
            "Licensed apparel doesn't win on color alone; it wins on finish. The wash on a vintage tee, the stitch, the weathered edge of a heritage crest, and the way a texture sits inside a wordmark instead of behind it — these are the details that separate a real licensed program from a printed logo. They are also, until now, what made scale impossible, because every finish had to be rebuilt by hand, one team at a time.",
        },
        {
          key: 'deepdive.craft.p2',
          label: 'Paragraph 2',
          type: 'textarea',
          default:
            'EasyVariants changes the economics of craft. You author the finish once, on the hero, and it travels across the whole program exactly as you made it.',
        },
        {
          key: 'deepdive.craft.p3',
          label: 'Paragraph 3 (masking)',
          type: 'textarea',
          default:
            'It starts with masking. Upload any image and it becomes a mask for a logo, a wordmark, or a fill. Then you make one decision about how it should behave. Fit it, and the mask locks to the exact bounds of whatever lands inside. Scale it, and it resizes as the content changes, covering a four-letter city as cleanly as a twelve-letter one. Tile it, and the mask repeats across the shape, so a pattern or print fills the letterform edge to edge at any size. One choice on the template, and every variant gets the right result.',
        },
        {
          key: 'deepdive.craft.p4',
          label: 'Paragraph 4 (texture)',
          type: 'textarea',
          default:
            "Texture layers on top of that. Any surface a brand can picture — whether it's a canvas weave, a cracked vintage print, a woven twill, or a soft grain — can be applied to any region and carried as part of the design itself. It isn't pasted onto one team's artwork; it's built into the slot, so it reproduces with the same fidelity across the entire roster while every element still resolves to its own team color.",
        },
        {
          key: 'deepdive.craft.p5',
          label: 'Paragraph 5 (type)',
          type: 'textarea',
          default:
            "Change the font on the fly and every variant follows. Split a wordmark into parts — whether that's an established year set as 19 and 69 on either side of a crest, a two-letter city broken and placed apart, or a team name divided across the chest — and each fragment becomes its own placement with its own position, size, and treatment. The name stops being a fixed string; it becomes a system that reflows for every team, whatever the length and whatever the shape.",
        },
        {
          key: 'deepdive.craft.p6',
          label: 'Paragraph 6 (effects)',
          type: 'textarea',
          default:
            "Then come the effects. Once the type is set, the mask applied, and the texture chosen, the full depth of the appearance stack is yours on any layer. A drop shadow for dimension. A grain for wear. A zig-zag for a torn edge, a blur for a fade, a warp for a contoured surface. Each effect targets exactly the layer you point it at, whether that's a single fill or the whole object, and it holds its place while the color underneath changes from one team to the next. Stack them, save the look, and the whole treatment travels together: mask, texture, type, and effect as one.",
        },
        {
          key: 'deepdive.craft.p7',
          label: 'Paragraph 7 (closing)',
          type: 'textarea',
          default:
            "This is the difference between a tool that copies artwork and a platform that reproduces design. A designer sets the intent once — from the mask behavior to the texture, to the type system, to the finish — and EasyVariants carries that intent faithfully across the full breadth of a license. The craft stays in the designer's hands; the multiplication becomes the machine's.",
        },
        {
          key: 'deepdive.craft.tagline',
          label: 'Tagline',
          type: 'text',
          default: 'Build it once, at full craft. Ship it to the whole league!',
        },
      ],
    },
    {
      section: 'Platform Deep Dive · Four Steps',
      fields: [
        {
          key: 'deepdive.steps.intro',
          label: 'Steps intro',
          type: 'text',
          default: 'From hero artwork to a full league.',
        },
        ...cardFields('deepdive.steps', 4, [
          'Migrate the Logo Library',
          'Start From the Hero',
          'Turn the Hero Into a Template',
          'Link and Generate',
        ]),
      ],
    },
    sectionHeader('demos', 'Demo Videos', {
      eyebrow: 'Seeing is Believing',
      title: 'Demo Videos',
      description:
        'Explore enterprise-ready design automation flows built for high-volume manufacturing environments.',
    }),
    {
      section: 'Demo Videos · YouTube list',
      fields: [
        {
          key: 'demos.videos',
          label: 'Demo videos (YouTube)',
          type: 'list',
          listItemLabel: 'Video',
          itemFields: [
            { key: 'youtubeId', label: 'YouTube video ID', type: 'text' },
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'label', label: 'Short label', type: 'text' },
          ],
          default: [
            { youtubeId: 'Mrj4YI_RQzA', title: 'EasyVariants Demo  Product Variants', label: 'Product Variants' },
            { youtubeId: 'Kd0Olg1cE-s', title: 'EasyVariants Demo  Cap Variants', label: 'Cap Variants' },
            { youtubeId: '2Zl_BkN9L6w', title: 'EasyVariants Explainer Video', label: 'Explainer Video' },
            { youtubeId: 'ETiWWJaoaZM', title: 'EasyVariants Demo  Sweatshirt Variants', label: 'Sweatshirt Variants' },
            { youtubeId: 'l5tyQAdNiEY', title: 'EasyVariants Demo  Shoe Variants', label: 'Shoe Variants' },
          ],
        },
      ],
    },
    sectionHeader('fits', 'Where It Fits', {
      eyebrow: 'Applications',
      title: 'Where EasyVariants Fits',
      description:
        "EasyVariants was born in headwear, but the variable system doesn't care what the silhouette is. Anywhere a single approved design has to be reproduced across a roster of teams – with team logos, team colors, team-specific text and production-accurate embroidery – the same engine applies.",
    }),
    {
      section: 'Where It Fits · Product types',
      fields: cardFields('fits.products', 6, [
        'Headwear',
        'Jerseys',
        'T-shirts & Tees',
        'Polos & Performance',
        'Jackets & Outerwear',
        'Accessories',
      ]),
    },
    {
      section: 'Where It Fits · Use cases',
      fields: cardFields('fits.usecases', 3, ['Seasonal Lines', 'Evergreen Product', 'Prototypes & Customs']),
    },
    {
      section: 'Final CTA',
      fields: [
        { key: 'cta.title', label: 'Heading', type: 'text', default: 'Ready to Design Smarter?' },
        {
          key: 'cta.description',
          label: 'Description',
          type: 'textarea',
          default:
            'Reduce production-cycle bottlenecks, scale variant output across factories, and enforce brand consistency across every product line.',
        },
        { key: 'cta.button.label', label: 'Button label', type: 'text', default: 'Request a Demo Today' },
        { key: 'cta.button.href', label: 'Button link', type: 'text', default: 'contactus.html' },
        { key: 'cta.footer', label: 'Footer line', type: 'text', default: "Let's automate your product variants." },
      ],
    },
    {
      section: 'Footer',
      fields: [
        {
          key: 'footer.brand.description',
          label: 'Brand description',
          type: 'textarea',
          default:
            'Enterprise design automation for large manufacturers. Scale product variants across global operations with controlled, repeatable workflows.',
        },
        { key: 'footer.support.title', label: 'Support card title', type: 'text', default: 'Dedicated Support' },
        {
          key: 'footer.support.text',
          label: 'Support card text',
          type: 'text',
          default: 'Our team is here to help you every step of the way.',
        },
        { key: 'footer.copyright', label: 'Copyright line', type: 'text', default: '© 2026 EasyVariants. All Rights Reserved.' },
        {
          key: 'footer.disclaimer',
          label: 'Disclaimer',
          type: 'text',
          default: 'Adobe Illustrator® is a trademark of Adobe Inc. EasyVariants is not affiliated.',
        },
      ],
    },
    {
      section: 'Footer · Menu links',
      fields: linkFields('footer.menu', [
        { label: 'Home', href: '#home' },
        { label: 'Our Solution', href: '#solution' },
        { label: 'Workflow', href: '#how-it-works' },
        { label: 'Demo Videos', href: '#demos' },
      ]),
    },
    {
      section: 'Footer · Social links',
      fields: linkFields('footer.social', [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/xinthe-technologies/' },
        { label: 'Youtube', href: 'https://www.youtube.com/@xinthetechnologies6321' },
        { label: 'facebook', href: 'https://facebook.com/xintheemployees' },
        { label: 'X', href: 'https://x.com/xinthetech' },
      ]),
    },
  ],
  contact: [
    {
      section: 'Page header',
      fields: [
        { key: 'contact.badge', label: 'Badge', type: 'text', default: 'Request a Demo' },
        { key: 'contact.title.line1', label: 'Title line 1', type: 'text', default: "Let's Build" },
        { key: 'contact.title.line2', label: 'Title line 2', type: 'text', default: 'Something Great' },
        {
          key: 'contact.description',
          label: 'Intro description',
          type: 'textarea',
          default:
            'See how EasyVariants can automate your design workflow, save time, and scale your product variants effortlessly.',
        },
      ],
    },
    {
      section: 'Contact form',
      fields: [
        { key: 'contact.form.title', label: 'Form heading', type: 'text', default: 'Send us a message' },
        {
          key: 'contact.form.subtitle',
          label: 'Form subtitle',
          type: 'text',
          default: 'Fill out the form and our team will get back to you within 24 hours.',
        },
      ],
    },
    {
      section: 'Info cards',
      fields: [
        { key: 'contact.info.0.title', label: 'Email card title', type: 'text', default: 'Email Us' },
        { key: 'contact.info.0.description', label: 'Email card text', type: 'text', default: 'hello@easyvariants.com' },
        { key: 'contact.info.1.title', label: 'Response time title', type: 'text', default: 'Response Time' },
        {
          key: 'contact.info.1.description',
          label: 'Response time text',
          type: 'textarea',
          default: 'We typically respond within 24 hours on business days.',
        },
        { key: 'contact.info.2.title', label: 'Live demo title', type: 'text', default: 'Live Demo' },
        {
          key: 'contact.info.2.description',
          label: 'Live demo text',
          type: 'textarea',
          default: 'Get a personalized walkthrough of the platform, tailored to your use case.',
        },
        { key: 'contact.info.3.title', label: 'Support title', type: 'text', default: 'Dedicated Support' },
        {
          key: 'contact.info.3.description',
          label: 'Support text',
          type: 'textarea',
          default: 'Our team is here to help you every step of the way.',
        },
      ],
    },
    {
      section: 'Quick stats',
      fields: [
        { key: 'contact.stats.0.value', label: 'Stat 1 value', type: 'text', default: '500+' },
        { key: 'contact.stats.0.label', label: 'Stat 1 label', type: 'text', default: 'Teams Served' },
        { key: 'contact.stats.1.value', label: 'Stat 2 value', type: 'text', default: '24hr' },
        { key: 'contact.stats.1.label', label: 'Stat 2 label', type: 'text', default: 'Avg Reply' },
      ],
    },
  ],
};

/** Flatten schema defaults into { key: block } for seeding / form prefill. */
export function schemaDefaults(page) {
  const sections = CMS_SCHEMA[page] || [];
  const blocks = {};
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.default === undefined) continue;
      if (field.type === 'image' || field.type === 'video') {
        blocks[field.key] = { type: field.type, value: field.default };
      } else if (field.type === 'list') {
        blocks[field.key] = { type: 'list', value: field.default };
      } else {
        blocks[field.key] = { type: 'text', value: String(field.default) };
      }
    }
  }
  return blocks;
}

export function getAllowedKeysForPage(page) {
  const keys = new Set();
  for (const section of CMS_SCHEMA[page] || []) {
    for (const field of section.fields) {
      keys.add(field.key);
    }
  }
  return keys;
}

export const ALLOWED_CMS_KEYS = {
  home: getAllowedKeysForPage('home'),
  contact: getAllowedKeysForPage('contact'),
};

export function getFieldDef(page, key) {
  for (const section of CMS_SCHEMA[page] || []) {
    const field = section.fields.find((f) => f.key === key);
    if (field) return field;
  }
  return null;
}
