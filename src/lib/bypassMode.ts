export const BYPASS_MODE = import.meta.env.VITE_BYPASS_MODE === 'true';

export function isBypassEnabled(): boolean {
  return BYPASS_MODE;
}

export function bypassCheckout(onSuccess: () => void, delay = 500) {
  if (BYPASS_MODE) {
    console.log('🚨 BYPASS MODE: Skipping payment, navigating to success!');
    setTimeout(() => {
      onSuccess();
    }, delay);
    return true;
  }
  return false;
}

export function getBypassWarning() {
  if (BYPASS_MODE) {
    console.warn(
      '%c🎉 BYPASS MODE ACTIVE',
      'background: #10b981; color: #fff; padding: 10px; font-size: 16px; font-weight: bold;',
      '\n✅ All passwords bypassed - instant login!\n✅ All purchases bypassed - instant success!\n✅ Navigate freely and test everything!'
    );
  }
}

export function shouldSkipAuth(): boolean {
  return BYPASS_MODE;
}

export function shouldSkipPayment(): boolean {
  return BYPASS_MODE;
}

if (typeof window !== 'undefined') {
  getBypassWarning();
}
