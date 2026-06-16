import posthog from 'posthog-js';

// Replace with your PostHog project key to enable analytics.
// https://posthog.com — free tier is plenty for tracking level plays/deaths.
const POSTHOG_KEY = 'YOUR_KEY_HERE';
const POSTHOG_HOST = 'https://us.i.posthog.com';

let initialized = false;

function init() {
  if (initialized || !POSTHOG_KEY || POSTHOG_KEY === 'YOUR_KEY_HERE') return;
  posthog.init(POSTHOG_KEY, { api_host: POSTHOG_HOST });
  initialized = true;
}

init();

// No-ops gracefully whenever PostHog hasn't been initialized (no key set
// yet, or the key was removed), so dev builds never throw on missing config.
export function track(event, props) {
  if (!initialized) return;
  posthog.capture(event, props);
}
