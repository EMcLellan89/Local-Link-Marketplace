export const warningEmail = {
  subject: "Action Required: Your Local-Link Partner Account is in Warning Status",
  html: ({ companyName, reasons }: { companyName: string; reasons: string[] }) => `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>Local-Link Marketplace — Partner Compliance</h2>
      <p>Hi ${companyName || "Partner"},</p>
      <p>Your Partner account has been placed in <b>Warning</b> status. This may temporarily restrict publishing new deals and requesting territory expansion.</p>
      <p><b>What triggered this:</b></p>
      <ul>
        ${reasons.map((r) => `<li>${r}</li>`).join("")}
      </ul>
      <p><b>What to do next:</b></p>
      <ol>
        <li>Log in and visit your <b>Compliance Center</b></li>
        <li>Complete the checklist and restore required activity/quality</li>
        <li>Once your account meets requirements again, you'll be automatically reinstated</li>
      </ol>
      <p><a href="/partner/compliance">Open Compliance Center</a></p>
      <p>— Local-Link Marketplace Team</p>
    </div>
  `,
};

export const probationPlanEmail = {
  subject: "Your 7-Day Partner Probation Plan (Get Back to Active Fast)",
  html: ({ companyName }: { companyName: string }) => `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>Local-Link Marketplace — 7-Day Recovery Plan</h2>
      <p>Hi ${companyName || "Partner"},</p>
      <p>Here's the fastest path to get your status back to <b>Active</b>:</p>
      <ol>
        <li><b>Day 1–2:</b> Ensure certification training is 100% complete</li>
        <li><b>Day 2–4:</b> Launch/refresh at least 2 deals to Live</li>
        <li><b>Day 3–7:</b> Drive paid redemptions & keep chargebacks low</li>
      </ol>
      <p>Track your progress in the Compliance Center.</p>
      <p><a href="/partner/compliance">Open Compliance Center</a></p>
      <p>— Local-Link Marketplace Team</p>
    </div>
  `,
};

export const reinstatedEmail = {
  subject: "You're Back to Active ✅ — Local-Link Partner Status Reinstated",
  html: ({ companyName, score }: { companyName: string; score: number }) => `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>Local-Link Marketplace — Status Reinstated</h2>
      <p>Hi ${companyName || "Partner"},</p>
      <p>Good news — your Partner status has been reinstated to <b>Active</b>.</p>
      <p>Your eligibility score is now <b>${score}/100</b>.</p>
      <p>You can publish deals and request territory expansion again.</p>
      <p><a href="/partner/dashboard">Go to Partner Dashboard</a></p>
      <p>— Local-Link Marketplace Team</p>
    </div>
  `,
};
