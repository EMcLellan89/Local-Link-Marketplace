/**
 * StoryLab Teen Safety Validator
 * Content safety for teen/YA content (ages 13-17)
 * PG-13 equivalent - allows mild peril and romance but no explicit content
 *
 * ALLOWED:
 * - Romance (non-explicit)
 * - Mild peril/conflict
 * - Coming-of-age themes
 * - School/social dynamics
 *
 * BLOCKED:
 * - Explicit sexual content
 * - Graphic violence/gore
 * - Hate speech/harassment
 * - Self-harm glorification
 * - IP infringement
 */

export interface SafetyValidationResult {
  safe: boolean;
  violations: string[];
  warnings?: string[];
  suggestions?: string[];
}

const FORBIDDEN_TERMS_TEEN = [
  // Explicit sexual content
  'explicit', 'pornography', 'sexual intercourse', 'oral sex',
  'masturbation', 'orgasm', 'cum', 'dick', 'pussy', 'cock',

  // Graphic violence
  'dismember', 'decapitate', 'torture', 'mutilate', 'gore', 'eviscerate',
  'disembowel', 'brutal murder', 'massacre', 'slaughter',

  // Self-harm glorification
  'suicide is the answer', 'kill yourself', 'how to commit suicide',
  'cutting feels good', 'anorexia tips', 'pro-ana',

  // Hate speech
  'nazi', 'white supremacy', 'racial slur', 'hate crime',
  'terrorist instruction', 'bomb making',

  // Illegal instructions
  'how to make drugs', 'drug recipe', 'meth recipe',
  'how to hack', 'credit card fraud'
];

const WARNING_TERMS_TEEN = [
  // Requires careful handling
  'suicide', 'depression', 'anxiety', 'mental health',
  'cutting', 'self-harm', 'eating disorder',
  'bullying', 'abuse', 'assault', 'rape',
  'drug use', 'alcohol', 'drinking', 'smoking'
];

const BLOCKED_THEMES_TEEN = [
  'explicit sex', 'pornography', 'graphic violence', 'torture',
  'hate speech', 'terrorism', 'suicide glorification',
  'illegal activities', 'drug manufacturing'
];

export function validateTeenText(text: string): SafetyValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const lowerText = text.toLowerCase();

  // Check for forbidden terms
  for (const term of FORBIDDEN_TERMS_TEEN) {
    if (lowerText.includes(term.toLowerCase())) {
      violations.push(`Contains forbidden term: "${term}"`);
    }
  }

  // Check for warning terms (allowed but flagged)
  for (const term of WARNING_TERMS_TEEN) {
    if (lowerText.includes(term.toLowerCase())) {
      warnings.push(`Sensitive topic detected: "${term}" - ensure responsible handling`);
    }
  }

  // Check for copyrighted content (same as kids)
  const copyrightedNames = [
    'harry potter', 'hermione', 'voldemort', 'hogwarts',
    'katniss', 'hunger games', 'percy jackson',
    'twilight', 'bella swan', 'edward cullen'
  ];

  for (const name of copyrightedNames) {
    if (lowerText.includes(name.toLowerCase())) {
      violations.push(`Copyrighted character/world: "${name}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    warnings: warnings.length > 0 ? warnings : undefined,
    suggestions: violations.length > 0 ? [
      'Teen content can include romance and conflict but must avoid explicit sexual content',
      'Mental health topics allowed if handled responsibly (no glorification)',
      'Use original characters and worlds (no copyrighted IP)'
    ] : undefined
  };
}

export function validateTeenTone(tone: string): SafetyValidationResult {
  const violations: string[] = [];
  const lowerTone = tone.toLowerCase();

  // Check for blocked themes
  for (const theme of BLOCKED_THEMES_TEEN) {
    if (lowerTone.includes(theme.toLowerCase())) {
      violations.push(`Blocked theme: "${theme}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    suggestions: violations.length > 0 ? [
      'Suggested tones: coming-of-age, romantic, adventurous, mysterious, dramatic',
      'Can include conflict and tension but avoid graphic violence'
    ] : undefined
  };
}

export function validateTeenIllustrationPrompt(prompt: string): SafetyValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Check for explicit visual content
  const forbiddenVisuals = [
    'nude', 'naked', 'topless', 'sexual', 'explicit',
    'gore', 'blood splatter', 'dismembered', 'decapitated',
    'graphic violence', 'torture', 'mutilation'
  ];

  for (const visual of forbiddenVisuals) {
    if (lowerPrompt.includes(visual)) {
      violations.push(`Forbidden visual element: "${visual}"`);
    }
  }

  // Warning for mature themes that need careful handling
  const matureVisuals = [
    'kissing', 'romantic embrace', 'blood', 'weapon', 'fight scene'
  ];

  for (const visual of matureVisuals) {
    if (lowerPrompt.includes(visual)) {
      warnings.push(`Mature visual element: "${visual}" - ensure PG-13 appropriate`);
    }
  }

  // Check for copyrighted styles
  const copyrightedStyles = [
    'disney style', 'pixar style', 'anime style from',
    'marvel style', 'dc comics style'
  ];

  for (const style of copyrightedStyles) {
    if (lowerPrompt.includes(style.toLowerCase())) {
      violations.push(`Copyrighted style reference: "${style}"`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    warnings: warnings.length > 0 ? warnings : undefined,
    suggestions: violations.length > 0 ? [
      'Use: "YA book cover art style", "teen fiction illustration"',
      'Romantic scenes should be tasteful (hand-holding, embrace, no nudity)',
      'Action scenes can show conflict but not graphic violence'
    ] : undefined
  };
}

export function validateTeenBookSettings(settings: {
  tone?: string;
  genre?: string;
  maturityRating?: string;
}): SafetyValidationResult {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Validate maturity rating
  const validRatings = ['PG', 'PG-13'];
  if (settings.maturityRating && !validRatings.includes(settings.maturityRating)) {
    violations.push(`Invalid maturity rating. Must be PG or PG-13 for teen content`);
  }

  // Validate genre
  const blockedGenres = ['erotica', 'pornography', 'extreme horror', 'splatterpunk'];
  if (settings.genre) {
    const lowerGenre = settings.genre.toLowerCase();
    for (const blocked of blockedGenres) {
      if (lowerGenre.includes(blocked)) {
        violations.push(`Blocked genre: "${blocked}"`);
      }
    }
  }

  // Validate tone
  if (settings.tone) {
    const toneResult = validateTeenTone(settings.tone);
    violations.push(...toneResult.violations);
  }

  return {
    safe: violations.length === 0,
    violations,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

export function generateSafeTeenPrompt(basePrompt: string): string {
  const safetyPrefix = 'Create a YA (Young Adult) story appropriate for ages 13-17. ';
  const safetySuffix = ' The story should be engaging for teens but maintain PG-13 content standards. Romance and conflict are allowed but no explicit sexual content or graphic violence.';

  return safetyPrefix + basePrompt + safetySuffix;
}

export const TEEN_SAFE_ILLUSTRATION_STYLES = [
  'YA book cover art style',
  'teen fiction illustration',
  'modern digital art for young adults',
  'contemporary book cover design',
  'stylized character art for teens',
  'dramatic young adult illustration'
];

export const ALLOWED_TEEN_GENRES = [
  'Romance',
  'Fantasy',
  'Science Fiction',
  'Dystopian',
  'Mystery',
  'Thriller',
  'Contemporary',
  'Historical Fiction',
  'Paranormal',
  'Adventure',
  'Coming-of-age'
];
