/**
 * Week calculation utilities for campaign system
 * Uses ISO 8601 week date system (Monday = start of week)
 */

/**
 * Get the start of the ISO week for a given date
 * @param date - Date string in ISO format (YYYY-MM-DD) or Date object
 * @returns ISO date string (YYYY-MM-DD) for the Monday of that week
 */
export function getWeekStartISO(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = d.getUTCDay();

  // Calculate offset to get to Monday (ISO week starts on Monday)
  // If Sunday (0), go back 6 days; if Monday (1), go back 0 days; if Tuesday (2), go back 1 day, etc.
  const offset = (dayOfWeek + 6) % 7;

  // Create new date for the Monday
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - offset);

  return monday.toISOString().split('T')[0];
}

/**
 * Add days to an ISO date string
 * @param isoDate - Date string in ISO format (YYYY-MM-DD)
 * @param days - Number of days to add (can be negative)
 * @returns ISO date string (YYYY-MM-DD)
 */
export function addDaysISO(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Calculate week number since a deployment date
 * @param deployedAt - Deployment date/timestamp
 * @param currentDate - Current date (defaults to now)
 * @returns Week number (1 = first week, 2 = second week, etc.)
 */
export function getWeeksSinceDeployment(deployedAt: string | Date, currentDate: Date = new Date()): number {
  const deployDate = typeof deployedAt === 'string' ? new Date(deployedAt) : deployedAt;
  const deployWeekStart = getWeekStartISO(deployDate);
  const currentWeekStart = getWeekStartISO(currentDate);

  const deployWeekMs = new Date(deployWeekStart).getTime();
  const currentWeekMs = new Date(currentWeekStart).getTime();

  const weeksDiff = Math.floor((currentWeekMs - deployWeekMs) / (7 * 24 * 60 * 60 * 1000));

  return weeksDiff + 1; // Week 1 = first week, not week 0
}

/**
 * Check if a campaign is in the funded period (first 8 weeks)
 * @param deployedAt - Deployment date/timestamp
 * @param currentDate - Current date (defaults to now)
 * @returns true if currently in funded period, false if in payback period
 */
export function isInFundedPeriod(deployedAt: string | Date, currentDate: Date = new Date()): boolean {
  const weekNumber = getWeeksSinceDeployment(deployedAt, currentDate);
  return weekNumber <= 8;
}

/**
 * Calculate total funded amount for a campaign
 * @param dailyBudgetCents - Daily budget in cents
 * @param deployedAt - Deployment date
 * @param currentDate - Current date (defaults to now)
 * @returns Total cents funded by platform so far
 */
export function calculateTotalFunded(
  dailyBudgetCents: number,
  deployedAt: string | Date,
  currentDate: Date = new Date()
): number {
  const deployDate = typeof deployedAt === 'string' ? new Date(deployedAt) : deployedAt;

  // Calculate days since deployment (capped at 56 days = 8 weeks)
  const daysSinceDeployment = Math.floor((currentDate.getTime() - deployDate.getTime()) / (24 * 60 * 60 * 1000));
  const fundedDays = Math.min(daysSinceDeployment, 56); // Max 8 weeks of funding

  return fundedDays * dailyBudgetCents;
}
