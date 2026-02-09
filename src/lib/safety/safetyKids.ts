/**
 * StoryLab Kids Safety Validator
 * Enforces strict content safety for children's content (ages 3-12)
 *
 * MUST NOT INCLUDE:
 * - Gore, horror, threats, violence
 * - Self-harm, weapons, abuse
 * - Romance/sexual content
 * - Illegal instructions
 * - Copyrighted characters/worlds
 * - Real person depiction
 * - Scary/disturbing themes
 */

export interface SafetyValidationResult {
  safe: boolean;
  violations: string[];
  suggestions?: string[];
}

const FORBIDDEN_TERMS_KIDS = [
  // Violence & scary
  'kill', 'death', 'die', 'blood', 'gore', 'murder', 'weapon', 'gun', 'knife', 'sword',
  'attack', 'hurt', 'pain', 'scream', 'terror', 'horror', 'scary', 'nightmare', 'monster',
  'ghost', 'zombie', 'vampire', 'demon', 'evil', 'dark magic', 'curse', 'haunted',

  // Self-harm & abuse
  'suicide', 'self-harm', 'cut', 'abuse', 'bully', 'hit', 'punch', 'kick', 'slap',

  // Inappropriate content
  'sex', 'sexy', 'kiss', 'romance', 'boyfriend', 'girlfriend', 'date', 'love story',
  'nude', 'naked', 'body', 'private parts',

  // Illegal/dangerous
  'drug', 'alcohol', 'beer', 'wine', 'cigarette', 'smoke', 'vape', 'steal', 'rob',

  // Copyrighted properties (examples - not exhaustive)
  'mickey mouse', 'disney', 'marvel', 'spiderman', 'batman', 'superman', 'star wars',
  'harry potter', 'pokemon', 'minecraft', 'fortnite', 'sonic', 'mario', 'zelda',
  'frozen', 'elsa', 'anna', 'toy story', 'buzz lightyear',

  // Real people
  'president', 'celebrity', 'actor', 'singer', 'youtuber', 'influencer'
];

const FORBIDDEN_THEMES_KIDS = [
  'violence', 'death', 'horror', 'scary', 'fear', 'abuse', 'bullying',
  'romance', 'dating', 'sexuality', 'weapons', 'drugs', 'alcohol',
  'self-harm', 'suicide', 'depression', 'anxiety', 'mental illness'
];

const REQUIRED_TONE_KEYWORDS = [
  'friendly', 'warm', 'gentle', 'kind', 'fun', 'playful', 'happy',
  'joyful', 'cheerful', 'bright', 'positive', 'uplifting', 'cozy', 'safe'
];

export function validateKidsText(text: string): SafetyValidationResult {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();

  // Check for forbidden terms
  for (const term of FORBIDDEN_TERMS_KIDS) {
    if (lowerText.includes(term.toLowerCase())) {
      violations.push(`Contains forbidden term: "${term}"`);
    }
  }

  // Check length (kids stories should be concise)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 150) {
    violations.push('Page text too long (max 150 words for kids)');
  }

  return {
    safe: violations.length === 0,
    violations,
    suggestions: violations.length > 0 ? [
      'Use gentle, age-appropriate language',
      'Focus on friendship, kindness, and learning',
      'Avoid conflict resolution through violence',
      'Keep themes light and positive'
    ] : undefined
  };
}

export function validateKidsTone(tone: string): SafetyValidationResult {
  const violations: string[] = [];
  const lowerTone = tone.toLowerCase();

  // Check for forbidden themes
  for (const theme of FORBIDDEN_THEMES_KIDS) {
    if (lowerTone.includes(theme.toLowerCase())) {
      violations.push(`Forbidden theme: "${theme}"`);
    }
  }

  // Encourage positive tones
  const hasPositiveTone = REQUIRED_TONE_KEYWORDS.some(keyword =>
    lowerTone.includes(keyword.toLowerCase())
  );

  if (!hasPositiveTone) {
    violations.push('Tone should be warm, gentle, or playful');
  }

  return {
    safe: violations.length === 0,
    violations,
    suggestions: violations.length > 0 ? [
      'Suggested tones: warm, playful, gentle, cheerful, cozy',
      'Focus on positive emotions and learning moments'
    ] : undefined
  };
}

export function validateKidsIllustrationPrompt(prompt: string): SafetyValidationResult {
  const violations: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Check for forbidden visual content
  const forbiddenVisuals = [
    'scary', 'dark', 'creepy', 'monster', 'ghost', 'demon', 'evil',
    'weapon', 'gun', 'knife', 'blood', 'gore', 'violent',
    'nude', 'naked', 'sexy', 'revealing',
    'realistic', 'photorealistic', 'photograph' // prefer illustrated style
  ];

  for (const visual of forbiddenVisuals) {
    if (lowerPrompt.includes(visual)) {
      violations.push(`Forbidden visual element: "${visual}"`);
    }
  }

  // Check for copyrighted style references
  const copyrightedStyles = [
    'disney style', 'pixar style', 'dreamworks', 'studio ghibli',
    'marvel', 'dc comics', 'pokemon style', 'cartoon network'
  ];

  for (const style of copyrightedStyles) {
    if (lowerPrompt.includes(style.toLowerCase())) {
      violations.push(`Copyrighted style reference: "${style}"`);
    }
  }

  // Enforce soft, child-friendly style
  const hasSafeStyle = [
    'watercolor', 'soft', 'gentle', 'pastel', 'children\'s book illustration',
    'friendly', 'whimsical', 'colorful', 'bright'
  ].some(style => lowerPrompt.includes(style.toLowerCase()));

  if (!hasSafeStyle) {
    violations.push('Prompt should specify child-friendly illustration style (watercolor, soft, gentle, etc.)');
  }

  return {
    safe: violations.length === 0,
    violations,
    suggestions: violations.length > 0 ? [
      'Use: "watercolor children\'s book illustration"',
      'Add: "soft colors", "gentle", "friendly characters"',
      'Avoid copyrighted styles and realistic depictions'
    ] : undefined
  };
}

export function validateKidsBookSettings(settings: {
  ageRange?: string;
  tone?: string;
  pageCount?: number;
}): SafetyValidationResult {
  const violations: string[] = [];

  // Validate age range
  const validAgeRanges = ['3-5', '6-8', '9-12'];
  if (settings.ageRange && !validAgeRanges.includes(settings.ageRange)) {
    violations.push(`Invalid age range. Must be one of: ${validAgeRanges.join(', ')}`);
  }

  // Validate page count
  if (settings.pageCount && settings.pageCount > 24) {
    violations.push('Kids books should not exceed 24 pages');
  }

  // Validate tone
  if (settings.tone) {
    const toneResult = validateKidsTone(settings.tone);
    violations.push(...toneResult.violations);
  }

  return {
    safe: violations.length === 0,
    violations
  };
}

export function generateSafeKidsPrompt(basePrompt: string): string {
  // Add safety prefixes to ensure kid-friendly output
  const safetyPrefix = 'Create a gentle, age-appropriate children\'s story that is warm and friendly. ';
  const safetySuffix = ' The story should be positive, educational, and completely appropriate for young children ages 3-12. No scary, violent, or inappropriate content.';

  return safetyPrefix + basePrompt + safetySuffix;
}

export const KIDS_SAFE_ILLUSTRATION_STYLES = [
  'watercolor children\'s book illustration',
  'soft pastel digital art for kids',
  'gentle cartoon illustration',
  'whimsical storybook art',
  'colorful children\'s illustration',
  'friendly character design for kids',
  'bright and cheerful artwork'
];
