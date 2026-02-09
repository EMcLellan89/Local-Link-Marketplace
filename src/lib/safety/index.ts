/**
 * StoryLab Safety System
 * Routes safety validation to appropriate vertical validator
 */

import {
  validateKidsText,
  validateKidsTone,
  validateKidsIllustrationPrompt,
  validateKidsBookSettings,
  generateSafeKidsPrompt,
  KIDS_SAFE_ILLUSTRATION_STYLES
} from './safetyKids';

import {
  validateTeenText,
  validateTeenTone,
  validateTeenIllustrationPrompt,
  validateTeenBookSettings,
  generateSafeTeenPrompt,
  TEEN_SAFE_ILLUSTRATION_STYLES,
  ALLOWED_TEEN_GENRES
} from './safetyTeen';

import {
  validateAdultText,
  validateAdultTone,
  validateAdultIllustrationPrompt,
  validateAdultBookSettings,
  generateSafeAdultPrompt,
  ADULT_SAFE_ILLUSTRATION_STYLES,
  RECOMMENDED_ADULT_CONTENT_TYPES,
  PAYMENT_PROCESSOR_SAFE_GUIDELINES,
  type AdultContentSettings
} from './safetyAdult';

export type VerticalKey = 'kids' | 'teen' | 'adult';

export interface SafetyValidationResult {
  safe: boolean;
  violations: string[];
  warnings?: string[];
  suggestions?: string[];
}

export class StoryLabSafetyValidator {
  private vertical: VerticalKey;

  constructor(vertical: VerticalKey) {
    this.vertical = vertical;
  }

  validateText(text: string, settings?: any): SafetyValidationResult {
    switch (this.vertical) {
      case 'kids':
        return validateKidsText(text);
      case 'teen':
        return validateTeenText(text);
      case 'adult':
        return validateAdultText(text, settings);
      default:
        return { safe: false, violations: ['Invalid vertical'] };
    }
  }

  validateTone(tone: string): SafetyValidationResult {
    switch (this.vertical) {
      case 'kids':
        return validateKidsTone(tone);
      case 'teen':
        return validateTeenTone(tone);
      case 'adult':
        return validateAdultTone(tone);
      default:
        return { safe: false, violations: ['Invalid vertical'] };
    }
  }

  validateIllustrationPrompt(prompt: string, settings?: any): SafetyValidationResult {
    switch (this.vertical) {
      case 'kids':
        return validateKidsIllustrationPrompt(prompt);
      case 'teen':
        return validateTeenIllustrationPrompt(prompt);
      case 'adult':
        return validateAdultIllustrationPrompt(prompt, settings);
      default:
        return { safe: false, violations: ['Invalid vertical'] };
    }
  }

  validateBookSettings(settings: any): SafetyValidationResult {
    switch (this.vertical) {
      case 'kids':
        return validateKidsBookSettings(settings);
      case 'teen':
        return validateTeenBookSettings(settings);
      case 'adult':
        return validateAdultBookSettings(settings);
      default:
        return { safe: false, violations: ['Invalid vertical'] };
    }
  }

  generateSafePrompt(basePrompt: string, settings?: any): string {
    switch (this.vertical) {
      case 'kids':
        return generateSafeKidsPrompt(basePrompt);
      case 'teen':
        return generateSafeTeenPrompt(basePrompt);
      case 'adult':
        return generateSafeAdultPrompt(basePrompt, settings);
      default:
        return basePrompt;
    }
  }

  getSafeIllustrationStyles(): string[] {
    switch (this.vertical) {
      case 'kids':
        return KIDS_SAFE_ILLUSTRATION_STYLES;
      case 'teen':
        return TEEN_SAFE_ILLUSTRATION_STYLES;
      case 'adult':
        return ADULT_SAFE_ILLUSTRATION_STYLES;
      default:
        return [];
    }
  }
}

// Helper function to validate entire book before generation
export function validateCompleteBook(
  vertical: VerticalKey,
  book: {
    title: string;
    tone?: string;
    pages: Array<{
      text: string;
      illustrationPrompt?: string;
    }>;
    settings?: any;
  }
): SafetyValidationResult {
  const validator = new StoryLabSafetyValidator(vertical);
  const allViolations: string[] = [];
  const allWarnings: string[] = [];

  // Validate title
  const titleResult = validator.validateText(book.title);
  if (!titleResult.safe) {
    allViolations.push(...titleResult.violations.map(v => `Title: ${v}`));
  }

  // Validate tone
  if (book.tone) {
    const toneResult = validator.validateTone(book.tone);
    if (!toneResult.safe) {
      allViolations.push(...toneResult.violations.map(v => `Tone: ${v}`));
    }
  }

  // Validate each page
  book.pages.forEach((page, index) => {
    const textResult = validator.validateText(page.text);
    if (!textResult.safe) {
      allViolations.push(...textResult.violations.map(v => `Page ${index + 1} text: ${v}`));
    }
    if (textResult.warnings) {
      allWarnings.push(...textResult.warnings.map(w => `Page ${index + 1}: ${w}`));
    }

    if (page.illustrationPrompt) {
      const promptResult = validator.validateIllustrationPrompt(page.illustrationPrompt);
      if (!promptResult.safe) {
        allViolations.push(...promptResult.violations.map(v => `Page ${index + 1} illustration: ${v}`));
      }
      if (promptResult.warnings) {
        allWarnings.push(...promptResult.warnings.map(w => `Page ${index + 1} illustration: ${w}`));
      }
    }
  });

  // Validate settings
  if (book.settings) {
    const settingsResult = validator.validateBookSettings(book.settings);
    if (!settingsResult.safe) {
      allViolations.push(...settingsResult.violations.map(v => `Settings: ${v}`));
    }
  }

  return {
    safe: allViolations.length === 0,
    violations: allViolations,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
    suggestions: allViolations.length > 0 ? [
      'Review and revise flagged content',
      'Ensure all content meets vertical-specific guidelines',
      'Consider using the safe prompt generator for AI-generated content'
    ] : undefined
  };
}

// Export all validators and types
export {
  validateKidsText,
  validateKidsTone,
  validateKidsIllustrationPrompt,
  validateKidsBookSettings,
  generateSafeKidsPrompt,
  KIDS_SAFE_ILLUSTRATION_STYLES,

  validateTeenText,
  validateTeenTone,
  validateTeenIllustrationPrompt,
  validateTeenBookSettings,
  generateSafeTeenPrompt,
  TEEN_SAFE_ILLUSTRATION_STYLES,
  ALLOWED_TEEN_GENRES,

  validateAdultText,
  validateAdultTone,
  validateAdultIllustrationPrompt,
  validateAdultBookSettings,
  generateSafeAdultPrompt,
  ADULT_SAFE_ILLUSTRATION_STYLES,
  RECOMMENDED_ADULT_CONTENT_TYPES,
  PAYMENT_PROCESSOR_SAFE_GUIDELINES,

  type AdultContentSettings
};
