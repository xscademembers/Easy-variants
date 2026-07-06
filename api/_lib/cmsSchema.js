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
        { label: 'Instagram', href: '#' },
        { label: 'Youtube', href: '#' },
        { label: 'facebook', href: '#' },
        { label: 'Twitter', href: '#' },
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
