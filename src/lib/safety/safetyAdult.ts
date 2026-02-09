/**
 * StoryLab Adult Safety Validator
 * Content safety for adult content (18+)
 * Allows mature themes but blocks explicit sexual content by default
 *
 * PRIMARY USE CASES:
 * - Business/self-help books
 * - Lead magnets and marketing content
 * - Course materials
 * - Thriller/mystery novels
 * - Romance (non-explicit by default)
 *
 * BLOCKED (always):
 * - Explicit sexual content (unless explicit mode enabled)
 * - Illegal activities/instructions
 * - Hate speech/harassment
 * - IP infringement
 * - Content that violates payment processor ToS
 */

export interface SafetyValidationResult {
  safe: boolean;
  violations: string[];
  warnings?: string[];
  suggestions?: string[];
}

const FORBIDDEN_TERMS_ADULT = [
  // Illegal content
  'child pornography', 'underage', 'minor sexual',
  'terrorist instruction', 'bomb making', 'how to make explosives',
  'drug manufacturing', 'meth recipe', 'how to make drugs',
  'assassination guide', 'murder instructions',

  // Hate speech
  'nazi propaganda', 'white supremacy manifesto',
  'how to commit hate crime',

  // Payment processor violations
  'escort service', 'prostitution guide',
  'counterfeit money', 'credit card fraud',

  // Copyrighted IP (major franchises)
  'harry potter character guide', 'star wars extended universe',
  'marvel cinematic universe guide'
];

const EXPLICIT_CONTENT_TERMS = [
  // Explicit sexual content (blocked unless explicit mode ON)
  'explicit sex scene', 'pornographic', 'hardcore',
  'sexual intercourse description', 'oral sex scene',
  'graphic sexual content'
];

const WARNING_TERMS_ADULT = [
  // Allowed but flagged for review
  'violence', 'murder', 'death', 'blood',
  'drug use', 'alcohol abuse', 'addiction',
  'mental illness', 'suicide', 'self-harm',
  'sexual content', 'romance', 'intimacy'
];

export interface AdultContentSettings {
  explicitMode?: boolean; // OFF by default
  ageVerified?: boolean;  // Required for explicit mode
  contentType?: 'business' | 'fiction' | 'course' | 'marketing';
}

export function validateAdultText(
  text: string,
  settings: AdultContentSettings = {}
): SafetyValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const lowerText = text.toLowerCase();

  // Always block forbidden terms
  for (const term of FORBIDDEN_TERMS_ADULT) {
    if (lowerText.includes(term.toLowerCase())) {
      violations.push(`Contains forbidden term: "${term}"`);
    }
  }

  // Check explicit content (blocked unless explicit mode enabled)
  if (!settings.explicitMode) {
    for (const term of EXPLICIT_CONTENT_TERMS) {
      if (lowerText.includes(term.toLowerCase())) {
        violations.push(`Explicit sexual content detected. Enable explicit mode if intended for adult romance.`);
      }
    }
  }

  // Warning terms (allowed but flagged)
  for (const term of WARNING_TERMS_ADULT) {
    if (lowerText.includes(term.toLowerCase())) {
      warnings.push(`Mature content detected: "${term}"`);
    }
  }

  // Check for copyrighted content
  const copyrightedContent = [
    'harry potter', 'lord of the rings', 'star wars', 'marvel',
    'game of thrones', 'breaking bad', 'the office'
  ];

  for (const content of copyrightedContent) {
    if (lowerText.includes(content.toLowerCase())) {
      violations.push(`Copyrighted content: "${content}". Use original content only.`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    warnings: warnings.length > 0 ? warnings : undefined,
    suggestions: violations.length > 0 ? [
      'Adult content allows mature themes but explicit sexual content is OFF by default',
      'Business/marketing content: focus on value, education, transformation',
      'Fiction: thriller, mystery, and romance (non-explicit) are recommended',
      'Always use original characters and worlds (no copyrighted IP)'
    ] : undefined
  };
}

export function validateAdultTone(tone: string): SafetyValidationResult {
  const violations: string[] = [];
  const lowerTone = tone.toLowerCase();

  // Block illegal themes
  const blockedThemes = [
    'illegal', 'terrorism', 'hate speech', 'child exploitation',
    'fraud', 'scam', 'counterfeit'
  ];

  for (const theme of blockedThemes) {
    if (lowerTone.includes(theme)) {
      violations.push(`Blocked theme: "${theme}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations
  };
}

export function validateAdultIllustrationPrompt(
  prompt: string,
  settings: AdultContentSettings = {}
): SafetyValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Always block these
  const forbiddenVisuals = [
    'nude child', 'underage', 'minor',
    'explicit sex', 'pornographic', 'hardcore',
    'graphic violence', 'gore', 'mutilation',
    'hate symbol', 'nazi', 'white supremacy'
  ];

  for (const visual of forbiddenVisuals) {
    if (lowerPrompt.includes(visual)) {
      violations.push(`Forbidden visual element: "${visual}"`);
    }
  }

  // Mature content warnings
  if (!settings.explicitMode) {
    const matureVisuals = ['nude', 'naked', 'topless', 'sexual'];
    for (const visual of matureVisuals) {
      if (lowerPrompt.includes(visual)) {
        violations.push(`Explicit visual content requires explicit mode to be enabled`);
      }
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    warnings: warnings.length > 0 ? warnings : undefined,
    suggestions: violations.length > 0 ? [
      'For business books: use professional cover design, charts, graphs',
      'For fiction: dramatic cover art, character portraits (clothed)',
      'For marketing: benefit-focused imagery, transformation visuals'
    ] : undefined
  };
}

export function validateAdultBookSettings(settings: {
  contentType?: string;
  genre?: string;
  explicitMode?: boolean;
  ageVerified?: boolean;
}): SafetyValidationResult {
  const violations: string[] = [];

  // If explicit mode requested, age verification required
  if (settings.explicitMode && !settings.ageVerified) {
    violations.push('Age verification required for explicit mode');
  }

  // Validate genre
  const blockedGenres = [
    'child exploitation', 'illegal activities', 'terrorism',
    'hate speech', 'fraud guide'
  ];

  if (settings.genre) {
    const lowerGenre = settings.genre.toLowerCase();
    for (const blocked of blockedGenres) {
      if (lowerGenre.includes(blocked)) {
        violations.push(`Blocked genre: "${blocked}"`);
      }
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    suggestions: violations.length > 0 ? [
      'Recommended: Keep explicit mode OFF for better payment processing compatibility',
      'Focus on business, self-help, or non-explicit fiction'
    ] : undefined
  };
}

export function generateSafeAdultPrompt(
  basePrompt: string,
  settings: AdultContentSettings = {}
): string {
  const contentTypePrefix = {
    business: 'Create a professional business/self-help book that provides actionable value. ',
    fiction: 'Create an engaging adult fiction story with mature themes (non-explicit). ',
    course: 'Create educational course material for adult learners. ',
    marketing: 'Create compelling marketing content focused on transformation and results. '
  };

  const prefix = settings.contentType
    ? contentTypePrefix[settings.contentType]
    : 'Create engaging content for adult readers. ';

  const safetySuffix = settings.explicitMode
    ? ' Content may include mature themes and situations appropriate for adults.'
    : ' Content should be professional and avoid explicit sexual content to maintain broad compatibility.';

  return prefix + basePrompt + safetySuffix;
}

export const ADULT_SAFE_ILLUSTRATION_STYLES = [
  'professional book cover design',
  'business book cover art',
  'modern thriller book cover',
  'sophisticated romance cover (non-explicit)',
  'self-help book design',
  'course material graphics',
  'marketing visual design',
  'contemporary fiction cover art'
];

export const RECOMMENDED_ADULT_CONTENT_TYPES = [
  {
    type: 'business',
    description: 'Business books, how-to guides, strategy',
    examples: 'Leadership, Marketing, Sales, Productivity'
  },
  {
    type: 'self-help',
    description: 'Personal development, wellness, growth',
    examples: 'Mindset, Health, Relationships, Finance'
  },
  {
    type: 'course',
    description: 'Educational content, training materials',
    examples: 'Skills training, Certification prep, Tutorials'
  },
  {
    type: 'marketing',
    description: 'Lead magnets, reports, guides',
    examples: 'Ebooks, Whitepapers, Case studies'
  },
  {
    type: 'fiction',
    description: 'Novels, short stories (non-explicit)',
    examples: 'Thriller, Mystery, Contemporary Romance'
  }
];

export const PAYMENT_PROCESSOR_SAFE_GUIDELINES = [
  'Avoid explicit sexual content (better payment processing)',
  'No illegal activities or instructions',
  'No hate speech or discrimination',
  'No violence that glorifies harm',
  'Use original content only (no IP infringement)'
];
