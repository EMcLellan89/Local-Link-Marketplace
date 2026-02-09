import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WebinarRequest {
  courseTopic: string;
  targetAudience: 'merchant' | 'partner';
  duration?: number; // in minutes
  courseDescription?: string;
  keyLearningOutcomes?: string[];
  pricing?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { courseTopic, targetAudience, duration = 60, courseDescription, keyLearningOutcomes, pricing }: WebinarRequest = await req.json();

    if (!courseTopic || !targetAudience) {
      return new Response(
        JSON.stringify({ error: "courseTopic and targetAudience are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate webinar content using AI
    const webinarContent = generateWebinarScript({
      courseTopic,
      targetAudience,
      duration,
      courseDescription,
      keyLearningOutcomes,
      pricing
    });

    return new Response(
      JSON.stringify({
        success: true,
        webinar: webinarContent
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error generating webinar:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateWebinarScript(params: WebinarRequest) {
  const { courseTopic, targetAudience, duration, courseDescription, keyLearningOutcomes, pricing } = params;

  // Calculate time allocations based on duration
  const introTime = Math.round(duration * 0.12); // 12% for intro
  const problemTime = Math.round(duration * 0.17); // 17% for problem identification
  const solutionTime = Math.round(duration * 0.33); // 33% for solution/framework
  const implementationTime = Math.round(duration * 0.25); // 25% for implementation
  const ctaTime = Math.round(duration * 0.13); // 13% for CTA and next steps

  const audienceType = targetAudience === 'merchant' ? 'local business owners' : 'Local-Link partners';
  const audienceGoal = targetAudience === 'merchant'
    ? 'grow their business and increase revenue'
    : 'add high-ticket services and increase their income';

  // Generate complete webinar structure
  return {
    title: `${targetAudience === 'partner' ? 'Partner' : 'Merchant'} Webinar: ${courseTopic}`,
    subtitle: generateSubtitle(courseTopic, targetAudience),
    duration,
    targetAudience,
    description: courseDescription || generateDescription(courseTopic, targetAudience),

    lessons: [
      {
        title: `Introduction & The Transformation Promise (${introTime} min)`,
        duration: introTime,
        content: generateIntroduction(courseTopic, targetAudience, audienceType, keyLearningOutcomes)
      },
      {
        title: `The Problem & Why It Matters (${problemTime} min)`,
        duration: problemTime,
        content: generateProblemSection(courseTopic, targetAudience, audienceType)
      },
      {
        title: `The ${courseTopic} Framework (${solutionTime} min)`,
        duration: solutionTime,
        content: generateSolutionFramework(courseTopic, targetAudience, keyLearningOutcomes)
      },
      {
        title: `Implementation Strategy (${implementationTime} min)`,
        duration: implementationTime,
        content: generateImplementation(courseTopic, targetAudience)
      },
      {
        title: `Your Path Forward & Next Steps (${ctaTime} min)`,
        duration: ctaTime,
        content: generateCTA(courseTopic, targetAudience, pricing)
      }
    ],

    metadata: {
      format: 'recorded',
      includesQandA: true,
      includesWorkbook: true,
      createdAt: new Date().toISOString()
    }
  };
}

function generateSubtitle(topic: string, audience: string): string {
  const subtitles = {
    merchant: [
      `Transform Your Business Results Starting Today`,
      `Practical Strategies That Actually Work`,
      `Build a Thriving Business Without Guesswork`,
      `Proven Systems for Real Growth`
    ],
    partner: [
      `Add High-Ticket Services & Multiply Your Income`,
      `Position Yourself as the Local Expert`,
      `Build a Profitable Practice in 30 Days`,
      `Turn Expertise Into Recurring Revenue`
    ]
  };

  return subtitles[audience][Math.floor(Math.random() * subtitles[audience].length)];
}

function generateDescription(topic: string, audience: string): string {
  if (audience === 'merchant') {
    return `A comprehensive training for local business owners covering ${topic}. Learn practical, proven strategies you can implement immediately to grow your business and increase profitability.`;
  } else {
    return `An intensive training for Local-Link partners on how to sell and deliver ${topic} services. Master positioning, pricing, and implementation to build a high-ticket practice.`;
  }
}

function generateIntroduction(topic: string, audience: string, audienceType: string, outcomes?: string[]): string {
  const defaultOutcomes = [
    `Understand the complete ${topic} framework`,
    `Know exactly how to implement these strategies`,
    `Have a clear action plan for the next 30 days`,
    `See real-world examples and case studies`
  ];

  const learningOutcomes = outcomes || defaultOutcomes;

  return `# Welcome: ${topic}

## Opening Hook (2 minutes)
"How many of you have struggled with ${topic.toLowerCase()}?

Maybe you've tried different approaches that didn't work.
Maybe you're not sure where to start.
Maybe you know you need to improve but don't have a clear system.

What if I told you there's a proven framework that can transform your results—and you can start implementing it TODAY?

That's exactly what we're covering in this webinar."

## Who This Webinar Is For (2 minutes)
This training is specifically designed for ${audienceType} who want to:
✅ Master ${topic.toLowerCase()}
✅ Get clear, actionable strategies
✅ See real results within 30-90 days
✅ Build sustainable, long-term success

## The Transformation Promise (${Math.ceil(learningOutcomes.length * 0.75)} minutes)
"By the end of this webinar, you will:

${learningOutcomes.map((outcome, i) => `${i + 1}. ${outcome}`).join('\n')}

This isn't theory. This is practical, proven strategy you can implement immediately."

## Ground Rules (1 minute)
- Stay to the end for the complete system
- Take notes on the frameworks we share
- Ask questions in the chat
- Be ready to take action

Let's dive in!`;
}

function generateProblemSection(topic: string, audience: string, audienceType: string): string {
  return `# Why ${topic} Is Critical (And Why Most Fail)

## The Current Reality (${audience === 'merchant' ? '4' : '5'} minutes)
"Let's talk about what's really happening with ${topic.toLowerCase()}.

Most ${audienceType} struggle because they:
- Don't have a clear system or framework
- Try random tactics without strategy
- Copy what others do without understanding why
- Give up before seeing results
- Don't measure what matters

Sound familiar?

The problem isn't effort. The problem is approach."

## The Cost of Inaction (3 minutes)
"What does it cost you to NOT master ${topic.toLowerCase()}?

${audience === 'merchant' ? `
- Lost customers who go to competitors
- Revenue left on the table
- Wasted time and resources
- Stress and frustration
- Business stagnation or decline
` : `
- Missed high-ticket opportunities
- Competing on price instead of value
- Income ceiling you can't break through
- Clients who don't see you as the expert
- Limited growth and scalability
`}

The truth is: You can't afford to NOT get this right."

## The Breakthrough Moment (${audience === 'merchant' ? '3' : '2'} minutes)
"Here's the good news:

${topic} isn't complicated. It just requires the right framework.

When you have a proven system, everything changes:
- You know exactly what to do (and what NOT to do)
- You see results faster
- You build confidence and momentum
- Success becomes repeatable
- Growth becomes predictable

That's what we're giving you today."`;
}

function generateSolutionFramework(topic: string, audience: string, outcomes?: string[]): string {
  return `# The ${topic} Framework

## Overview: The Core System (3 minutes)
"The ${topic} framework has ${outcomes?.length || 5} key components.

Master these, and you master ${topic.toLowerCase()}.

${outcomes ? outcomes.map((outcome, i) => `${i + 1}. ${outcome}`).join('\n') : `
1. Foundation & Assessment
2. Strategy & Planning
3. Implementation & Execution
4. Optimization & Scaling
5. Measurement & Refinement`}

Let's break down each component."

## Component Deep Dive (15-20 minutes)
"I'm going to walk you through each component step-by-step.

### Component 1: [First Core Element]
This is where everything starts. Without this foundation, nothing else works.

Here's exactly what you need to do:
- Step 1: [Specific action]
- Step 2: [Specific action]
- Step 3: [Specific action]

**Real Example:**
'A [business type] implemented this and saw [specific result] in [timeframe].'

### Component 2: [Second Core Element]
Once your foundation is solid, this is where you build momentum.

Key strategies:
- Strategy A: [Specific tactic]
- Strategy B: [Specific tactic]
- Strategy C: [Specific tactic]

**Pro Tip:** [Insider advice that saves time or money]

### Component 3-${outcomes?.length || 5}: [Remaining Components]
[Continue with detailed breakdowns of each component, including specific actions, examples, and pro tips]

## The Integration System (5 minutes)
"Here's where it all comes together.

The magic isn't in the individual components—it's in how they work together.

When you integrate these properly:
- Each component amplifies the others
- Results compound over time
- Success becomes systematic
- You build a sustainable competitive advantage

This is what separates those who get occasional wins from those who build lasting success."`;
}

function generateImplementation(topic: string, audience: string): string {
  return `# How to Implement This Starting Today

## The 30-Day Launch Plan (5 minutes)
"You now have the framework. Here's exactly how to implement it.

**Week 1**: Foundation Setup
- Day 1-2: [Specific tasks]
- Day 3-4: [Specific tasks]
- Day 5-7: [Specific tasks]

**Week 2**: Initial Implementation
- Day 8-10: [Specific tasks]
- Day 11-14: [Specific tasks]

**Week 3**: Optimization
- Day 15-17: [Specific tasks]
- Day 18-21: [Specific tasks]

**Week 4**: Scale & Refine
- Day 22-25: [Specific tasks]
- Day 26-30: [Specific tasks]

**Result**: By Day 30, you have a complete ${topic.toLowerCase()} system up and running."

## Common Mistakes to Avoid (4 minutes)
"As you implement, watch out for these pitfalls:

❌ **Mistake 1**: [Common error]
✅ **Instead**: [Correct approach]

❌ **Mistake 2**: [Common error]
✅ **Instead**: [Correct approach]

❌ **Mistake 3**: [Common error]
✅ **Instead**: [Correct approach]

Avoid these, and you'll save months of wasted effort."

## Quick Wins & Early Indicators (5 minutes)
"You don't have to wait 30 days to see results.

Here are the quick wins you should see in the first week:
- [Specific result 1]
- [Specific result 2]
- [Specific result 3]

These early indicators tell you you're on the right track."

## Case Studies (${audience === 'merchant' ? '8' : '6'} minutes)
"Let me share real examples of ${audience === 'merchant' ? 'businesses' : 'partners'} who implemented this:

**Case Study 1**: [Industry/Type]
- Starting Point: [Situation]
- What They Implemented: [Specific actions]
- Results: [Specific outcomes]
- Timeline: [How long it took]
- Key Lesson: [Main takeaway]

**Case Study 2**: [Industry/Type]
[Same structure as Case Study 1]

${audience === 'merchant' ? '**Case Study 3**: [Third example with same structure]' : ''}

These are real results from real ${audience === 'merchant' ? 'businesses' : 'partners'}. This system works."`;
}

function generateCTA(topic: string, audience: string, pricing?: number): string {
  const priceDisplay = pricing ? `$${pricing}` : '[See current pricing]';

  return `# Your Path Forward

## What's Included in the Full Program (3 minutes)
"Everything we've covered today is just the overview.

In the complete ${topic} program, you get:

### ✅ Comprehensive Training
- [X] hours of step-by-step video training
- Complete implementation guides
- Templates, swipe files, and resources
- Real-world case studies

### ✅ Support & Community
- Private forum access
- Monthly group coaching calls
- Direct support from instructors
- Network of peers implementing the same system

### ✅ Ongoing Updates
- New strategies as they're developed
- Market trend updates
- Additional resources and tools
- Lifetime access to all updates

${audience === 'partner' ? `### ✅ Certification & Credibility
- Official certification upon completion
- Badge for your profile
- Access to exclusive opportunities
- Positioning as a verified expert` : ''}

## Investment & ROI (2 minutes)
"Let's talk about the investment.

**Program Investment**: ${priceDisplay}

**Your ROI**:
${audience === 'merchant' ? `
- Even a 10% improvement in [key metric] pays for this multiple times over
- One new customer from these strategies = paid off
- Increased lifetime value of existing customers = pure profit
- Time saved from having a proven system = priceless
` : `
- One new client at $[X],000 = [X]x ROI
- Monthly recurring revenue from implementation = ongoing ROI
- Positioning as the expert = premium pricing
- Time saved from proven frameworks = more clients served
`}

Most ${audience === 'merchant' ? 'businesses' : 'partners'} see ROI within the first 30 days."

## Special Webinar Bonus (1 minute)
"For everyone on this live webinar, we're including special bonuses:

🎁 **Bonus #1**: [Relevant resource] ($[X] value)
🎁 **Bonus #2**: [Relevant template/tool] ($[X] value)
🎁 **Bonus #3**: [Strategy session or guide] ($[X] value)

**Total Bonus Value**: $[X]

These bonuses are ONLY available to webinar attendees and expire when this session ends."

## How to Enroll (1 minute)
"Ready to get started?

1. Click the enrollment link in the chat (or below this video)
2. Complete your registration (takes 2 minutes)
3. Get instant access to all training materials
4. Start implementing today

Questions? Drop them in chat or email support@locallink.com."

## Final Words (2 minutes)
"Here's the truth:

You can keep doing what you've been doing and hope for different results.

Or you can invest in a proven system, follow a clear framework, and start seeing real progress.

The ${topic} strategies we've covered today work. They're proven. They're practical.

And they're waiting for you.

${audience === 'merchant' ? `Your business deserves this level of clarity and direction.` : `Your practice deserves to operate at this level.`}

**The enrollment link is live right now.**

Let's do this together.

See you inside the program! 🚀"

---

## Thank You
"Thank you for investing your time in this webinar.

Even if you don't enroll today, you've learned frameworks you can start applying immediately.

But if you're serious about mastering ${topic.toLowerCase()}...
If you want the complete system, support, and resources...
If you're ready to see real results in the next 30-90 days...

**Click that enrollment button now.**

We're here to help you succeed."`;
}
