export function computeBackoffSeconds(attempts: number): number {
  const base = 30; // Base backoff in seconds
  const jitter = 10; // Random jitter in seconds

  // Exponential backoff: base * 2^attempts, capped at 30 minutes
  const raw = base * Math.pow(2, Math.max(0, attempts));
  const capped = Math.min(raw, 60 * 30);

  // Add random jitter
  const j = Math.floor(Math.random() * jitter);
  return capped + j;
}
