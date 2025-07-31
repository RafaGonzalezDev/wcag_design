// Constantes de texto para la aplicación WCAG Design

// === MAIN APPLICATION ===
export const APP: any = {
  HEADER: {
    TITLE: 'WCAG Design System',
    SUBTITLE: 'Tools for accessible design and consistent typography'
  },
  MAIN: {
    TITLE: 'WCAG Palette Generator',
    DESCRIPTION: 'Create and verify color palettes that comply with WCAG 2.2 accessibility standards.'
  },
  FOOTER: {
    DESCRIPTION: 'Accessible design system with homogeneous typography and WCAG-compliant palettes'
  }
};

// === COLOR PALETTE GENERATOR ===
export const COLOR_PALETTE_GENERATOR: any = {
  // Main titles and headings
  TITLES: {
    MAIN_TITLE: 'WCAG Contrast Analyzer',
    PREDEFINED_PALETTES: 'Expert Recommended Palettes',
    INTERFACE_SIMULATION: 'Interface Simulation',
    ACCESSIBILITY_PANEL: 'Accessibility Panel',
    ACCESSIBILITY_PANEL_TITLE: 'Accessibility Panel',
    CONTACT_FORM: 'Contact Form',
    MAIN_NAVIGATION: 'Main Navigation',
    CONTENT_CARDS: 'Content Cards',
    TEXT_CONTENT: 'Text Content'
  },

  // Descriptions and subtitles
  DESCRIPTIONS: {
    MAIN_DESCRIPTION: 'Design custom combinations with real-time WCAG validation',
    PREDEFINED_DESCRIPTION: 'Official palettes from government and corporate systems verified to meet WCAG 2.1 AA. Each combination includes recommended usage roles for easy integration.',
    INTERFACE_DESCRIPTION: 'Evaluate the current palette in real user interface contexts',
    CONTEXTUAL_INFO: 'Explore accessible color palettes based on recognized design systems.'
  },

  // Navigation tabs
  TABS: {
    CREATE: 'Create Palette',
    PREDEFINED: 'Recommended Palettes',
    TESTING: 'Tests'
  },

  // Field and control labels
  LABELS: {
    FOREGROUND_COLOR: 'Text Color',
    BACKGROUND_COLOR: 'Background Color',
    CONTRAST_RATIO: 'Contrast Ratio',
    ACCESSIBILITY_COMPLIANCE: 'Accessibility Compliance',
    NORMAL_TEXT: 'Normal Text',
    LARGE_TEXT: 'Large Text'
  },

  // Buttons and actions
  BUTTONS: {
    SWAP_COLORS: 'Swap',
    RANDOM_PALETTE: 'Random Palette',
    COPY_AND_APPLY: 'Copy and Apply',
    RUN_ANALYSIS: 'Run Analysis',
    EXPORT_REPORT: 'Export Report',
    VIEW_HISTORY: 'View History',
    SEND_MESSAGE: 'Send Message',
    UNDERSTOOD: 'Understood',
    SELECT: 'Select',
    SELECTED: 'Selected',
  },

  // WCAG compliance levels
  WCAG_LEVELS: {
    AA_LARGE: 'AA Large',
    AA_NORMAL: 'AA Normal',
    AAA: 'AAA',
    COMPLIES: '✓ Complies',
    NOT_COMPLIES: '✗ Does not comply'
  },

  // Status messages and notifications
  MESSAGES: {
    THEME_APPLIED: 'Theme applied successfully',
    GO_TO_TESTS: 'Go to the tests tab!',
    NO_PALETTES_FOUND: 'No accessible palettes found with the selected base color.',
    TRY_DIFFERENT_COLOR: 'Try a different color or manually adjust the colors.',
    RECOMMENDATIONS_TITLE: '💡 Recommendations'
  },

  // Placeholders and example texts
  PLACEHOLDERS: {
    HEX_BLACK: '#000000',
    HEX_WHITE: '#ffffff',
    ENTER_NAME: 'Enter your name',
    EMAIL_EXAMPLE: 'email@example.com',
    MESSAGE_PLACEHOLDER: 'Write your message here...'
  },

  // Statistics and metrics
  STATS: {
    TESTS_COMPLETED: 'Tests Completed',
    EVALUATIONS_COUNT: '247',
    EVALUATIONS_DESCRIPTION: 'Evaluations completed',
    COMPLIANCE: 'Compliance',
    ACCESSIBILITY_LEVEL: 'Accessibility Level',
    CONTRAST: 'Contrast',
    CURRENT_RATIO: 'Current Ratio'
  },

  // Forms
  FORM_FIELDS: {
    FULL_NAME: 'Full Name',
    EMAIL: 'Email',
    MESSAGE: 'Message'
  },

  // Navigation
  NAVIGATION: {
    HOME: 'Home',
    PRODUCTS: 'Products',
    SERVICES: 'Services',
    CONTACT: 'Contact',
    MENU_DESCRIPTION: 'Navigation menu with active and normal states'
  },

  // Sample content
  SAMPLE_CONTENT: {
    EXAMPLE_TEXT: 'Example Text',
    ALPHABET_SAMPLE: 'Aa Bb Cc',
    FEATURED_ARTICLE: 'Featured Article',
    NOTIFICATION: 'Notification',
    CARD_DESCRIPTION: 'This is an example of how text looks on a content card with the selected palette.',
    IMPORTANT_INFO: 'Important information that needs to be legible and accessible to all users.',
    READ_MORE: 'Read More',
    PARAGRAPH_EXAMPLE: 'This is an example of a normal paragraph showing how running text looks with the selected color palette. It is important that the contrast is sufficient to ensure readability.',
    SECONDARY_TEXT: 'Secondary text with lower opacity to show visual hierarchy while maintaining accessibility.',
    QUOTE: '"Accessibility is not a feature, it is a fundamental right."',
    LIST_ITEMS: [
      'List item that must be legible',
      'Another item with adequate contrast',
      'Third item to complete the example'
    ]
  }
};

// === PREDEFINED PALETTE CATEGORIES ===
export const PALETTE_CATEGORIES: any = {
  WARM_NEUTRALS: 'Warm Neutrals',
  MODERN_PASTELS: 'Modern Pastels',
  SOFT_EARTH_TONES: 'Soft Earth Tones',
  MINIMALIST_BLUES_GRAYS: 'Minimalist Blues and Grays',
  BLACK_WHITE_ACCENT: 'Black/White with Accent'
};

// === WCAG RESULTS ===
export const WCAG_RESULTS: any = {
  // Titles
  TITLE: 'WCAG Results',
  
  // Compliance statuses
  STATUS: {
    EXCELLENT_AAA: 'Excellent - Complies AAA',
    GOOD_AA: 'Good - Complies AA',
    NOT_ACCESSIBLE: 'Not Accessible',
    UNKNOWN: 'Unknown'
  },

  // Informative messages
  MESSAGES: {
    FAIL_DESCRIPTION: 'This combination does not meet minimum WCAG accessibility standards.',
    RATIO_LABEL: 'Ratio:',
    NOTE_TITLE: 'Note:',
    WCAG_INFO: 'WCAG 2.2 standards require a minimum contrast of 4.5:1 for normal text and 3:1 for large text (AA level). For AAA level, 7:1 and 4.5:1 respectively are required.'
  },

  // Section labels
  SECTIONS: {
    NORMAL_TEXT: 'Normal Text',
    LARGE_TEXT: 'Large Text',
    RECOMMENDATIONS: '💡 Recommendations'
  }
};

// === PALETTE GRID ===
export const PALETTE_GRID: any = {
  // States
  CURRENT: 'Current',
  
  // Labels
  LABELS: {
    CONTRAST: 'Contrast',
    TEXT: 'Text',
    BACKGROUND: 'Background'
  },

  // Empty state messages
  EMPTY_STATE: {
    NO_PALETTES: 'No accessible palettes found with the selected base color.',
    TRY_DIFFERENT: 'Try a different color or manually adjust the colors.'
  }
};

// === PREDEFINED PALETTES ===
export const PREDEFINED_PALETTES: any = {
  'Warm Neutrals': [
    { name: 'Wood for Winter', foreground: '#DCCCBD', background: '#021825' },
    { name: 'La Renard', foreground: '#CCBCAD', background: '#383931' },
    { name: 'Library Leather', foreground: '#F7E7CE', background: '#59372B' },
    { name: 'Put It in Neutral', foreground: '#EDE3D9', background: '#1C2915' },
    { name: 'Champagne Crystal', foreground: '#D6CFBF', background: '#4E4D49' },
    { name: 'Taupe Minimal', foreground: '#C8BFB8', background: '#4E311D' },
  ],
  'Modern Pastels': [
    { name: 'Lavender Meadow', foreground: '#EBE6F5', background: '#463769' },
    { name: 'Coastal Breeze', foreground: '#F8F9FA', background: '#0A2E4E' },
    { name: 'Twilight Garden', foreground: '#FFF4E0', background: '#3D3232' },
    { name: 'Tropical Morning', foreground: '#F9F9F1', background: '#354E67' },
    { name: 'Blossoms', foreground: '#F7F7EE', background: '#2F4027' },
    { name: 'Serenity', foreground: '#F5F1E1', background: '#7D6754' },
  ],
  'Soft Earth Tones': [
    { name: 'Bohemian Sun', foreground: '#FFF8F0', background: '#685555' },
    { name: 'Nautilus Fossil', foreground: '#CBC7BB', background: '#42201F' },
    { name: 'Vintage Vault', foreground: '#CECDC9', background: '#180B02' },
    { name: 'Gray + Gold Gears', foreground: '#F6EEE3', background: '#3F3832' },
    { name: 'Oatmeal Sweater', foreground: '#F1E3BC', background: '#574748' },
    { name: 'Slug Bug', foreground: '#D3DCDB', background: '#2B3029' },
  ],
  'Minimalist Blues and Grays': [
    { name: 'Forest Mist', foreground: '#EEF3F9', background: '#001B2E' },
    { name: 'La Luna', foreground: '#E9E8EE', background: '#101B39' },
    { name: 'Muted Grays & Blues', foreground: '#000000', background: '#B3CDD7' },
    { name: 'Blue Gray Scheme', foreground: '#FFFFFF', background: '#003B6D' },
    { name: 'UVA Cool Contrast', foreground: '#F1F1EF', background: '#232D4B' },
    { name: 'Muted Grey Blue', foreground: '#000000', background: '#BFDFE7' },
  ],
  'Black/White with Accent': [
    { name: 'Urban Chic', foreground: '#000000', background: '#FFFFFF' },
    { name: 'Frosted Noir', foreground: '#FFFFFF', background: '#000000' },
    { name: 'Classic Contrast', foreground: '#000000', background: '#C0C0C0' },
    { name: 'Vintage Film', foreground: '#000000', background: '#D9D9D9' },
    { name: 'Minimal Brass Accent', foreground: '#1C1C1C', background: '#FEFDFB' },
    { name: 'Powerful B&W', foreground: '#FFFFFF', background: '#000000' },
  ],
};