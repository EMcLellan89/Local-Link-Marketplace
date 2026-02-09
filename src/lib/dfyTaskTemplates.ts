export type TaskTemplate = { title: string; offsetHours?: number };

const H = (n: number) => n;

export const DFY_TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
  "ai-missed-call-booking": [
    { title: "Verify intake + required access", offsetHours: H(2) },
    { title: "Connect SMS number + missed-call trigger", offsetHours: H(8) },
    { title: "Configure AI replies (services/FAQs/tone)", offsetHours: H(12) },
    { title: "Connect booking link/calendar + test booking", offsetHours: H(20) },
    { title: "Launch + send merchant confirmation", offsetHours: H(30) },
  ],

  "ai-website-chat-closer": [
    { title: "Verify intake + website access", offsetHours: H(2) },
    { title: "Install chat widget on website", offsetHours: H(10) },
    { title: "Train AI on services/FAQs + tone", offsetHours: H(16) },
    { title: "Connect booking/lead capture + test", offsetHours: H(24) },
    { title: "Launch + send merchant confirmation", offsetHours: H(36) },
  ],

  "ai-social-dm-autoresponder": [
    { title: "Verify intake + connect FB/IG permissions", offsetHours: H(4) },
    { title: "Configure DM flows (FAQs/qualifiers/booking)", offsetHours: H(12) },
    { title: "Test flows + edge cases", offsetHours: H(20) },
    { title: "Launch + send merchant confirmation", offsetHours: H(30) },
  ],

  "ai-speed-to-lead-dialer": [
    { title: "Verify intake + lead source triggers", offsetHours: H(4) },
    { title: "Configure AI call script + qualifiers", offsetHours: H(12) },
    { title: "Set routing/transfer rules", offsetHours: H(20) },
    { title: "QA test with sample leads", offsetHours: H(28) },
    { title: "Launch + send merchant confirmation", offsetHours: H(36) },
  ],

  "ai-marketing-funnels": [
    { title: "Verify intake + gather assets (logo/photos/testimonials)", offsetHours: H(6) },
    { title: "Build landing page + thank-you page", offsetHours: H(24) },
    { title: "Configure lead form + tracking", offsetHours: H(30) },
    { title: "Set AI SMS/email follow-up sequences", offsetHours: H(40) },
    { title: "Connect booking + end-to-end QA", offsetHours: H(52) },
    { title: "Launch + send merchant confirmation", offsetHours: H(60) },
  ],

  "ai-quote-generator": [
    { title: "Verify intake + pricing rules", offsetHours: H(6) },
    { title: "Build quote flow + estimate logic", offsetHours: H(20) },
    { title: "Configure quote delivery + follow-up", offsetHours: H(28) },
    { title: "Connect booking + QA test", offsetHours: H(36) },
    { title: "Launch + send merchant confirmation", offsetHours: H(48) },
  ],

  "ai-reactivation-engine": [
    { title: "Verify intake + list upload requirements", offsetHours: H(6) },
    { title: "Import list + segment audience", offsetHours: H(18) },
    { title: "Configure offer + messaging sequences", offsetHours: H(28) },
    { title: "QA test + compliance checks", offsetHours: H(36) },
    { title: "Launch + reporting setup", offsetHours: H(44) },
  ],

  "ai-review-booster": [
    { title: "Verify intake + review link + triggers", offsetHours: H(6) },
    { title: "Configure review request flow", offsetHours: H(18) },
    { title: "Configure private feedback routing", offsetHours: H(26) },
    { title: "Test + launch + confirmation", offsetHours: H(36) },
  ],

  "ai-gbp-manager": [
    { title: "Verify intake + GBP access", offsetHours: H(8) },
    { title: "Configure posting topics + cadence", offsetHours: H(20) },
    { title: "Configure response rules", offsetHours: H(28) },
    { title: "Launch + confirmation", offsetHours: H(36) },
  ],

  "ai-local-seo-pages": [
    { title: "Verify intake + cities/services list", offsetHours: H(8) },
    { title: "Generate first batch of pages", offsetHours: H(28) },
    { title: "Publish + internal linking checks", offsetHours: H(40) },
    { title: "QA + confirmation", offsetHours: H(52) },
  ],

  "ai-social-content-repurposer": [
    { title: "Verify intake + content sources", offsetHours: H(6) },
    { title: "Configure content themes + cadence", offsetHours: H(18) },
    { title: "Set approval/auto-post mode", offsetHours: H(26) },
    { title: "Launch + confirmation", offsetHours: H(36) },
  ],

  "ai-ad-copy-generator": [
    { title: "Verify intake + offers/angles", offsetHours: H(4) },
    { title: "Configure weekly copy pack templates", offsetHours: H(16) },
    { title: "Deliver first pack + confirmation", offsetHours: H(24) },
  ],

  "ai-upsell-engine": [
    { title: "Verify intake + upsell offers", offsetHours: H(6) },
    { title: "Configure post-job triggers + messaging", offsetHours: H(20) },
    { title: "Connect booking/checkout routing", offsetHours: H(28) },
    { title: "QA + launch + confirmation", offsetHours: H(36) },
  ],

  "ai-subscription-saver": [
    { title: "Verify intake + cancellation triggers", offsetHours: H(6) },
    { title: "Configure save offers + rules", offsetHours: H(20) },
    { title: "QA test + reporting", offsetHours: H(28) },
    { title: "Launch + confirmation", offsetHours: H(36) },
  ],
};
