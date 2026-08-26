/**
 * Placeholder content for the AI Demo Area (doc section 13).
 *
 * The client's real AI demo, videos and "AI/demo responses" have not been
 * supplied yet — per the doc, the offline version can be either a locally
 * recreated demo or "a simulated version using pre-configured
 * responses/content". This is that simulated version: a scripted sequence
 * that plays out locally with no network calls, so the screen is functional
 * for rehearsal today and only the content needs swapping once the client
 * delivers their real videos/demo assets.
 *
 * To swap in real content:
 *  - Put each screen's idle-loop video at /public/assets/ai-demo/screen-N-loop.mp4
 *  - Replace the `steps` below with the client's real demo script, or point
 *    DEMO_SCREENS[n].mode at a different renderer entirely.
 */

export type ScreenOrientation = 'vertical' | 'horizontal';

export interface DemoStep {
  /** How long this step stays on screen before auto-advancing. */
  durationMs: number;
  headline: string;
  body: string;
}

export interface DemoScreenConfig {
  id: string;
  label: string;
  orientation: ScreenOrientation;
  ctaLabel: string;
  /** Local idle-loop video. Falls back to a static branded screen if this 404s. */
  loopVideoSrc: string;
  steps: DemoStep[];
}

const SPOT_STEPS: DemoStep[] = [
  { durationMs: 4000, headline: 'Meet Bureau AI', body: "I'm Bureau's fraud-detection assistant. Watch me analyse a live signal in real time." },
  { durationMs: 5000, headline: 'Scanning device signals', body: 'Checking device fingerprint, network reputation and behavioural biometrics…' },
  { durationMs: 5000, headline: 'Cross-referencing the network', body: 'Comparing this session against millions of prior fraud patterns across the Bureau network.' },
  { durationMs: 5000, headline: 'Verdict', body: 'High-confidence match: synthetic identity ring detected. Flagged in 340ms.' },
  { durationMs: 4000, headline: 'That’s the Bureau edge', body: 'Real-time, explainable fraud detection — before the transaction ever completes.' },
];

const DETECTIVE_STEPS: DemoStep[] = [
  { durationMs: 4000, headline: 'Fraud Detective, AI edition', body: 'Watch Bureau AI trace a mule network across thousands of accounts.' },
  { durationMs: 5000, headline: 'Mapping the graph', body: 'Building a transaction graph from anonymised account activity…' },
  { durationMs: 5000, headline: 'Finding the bridge', body: 'One account links two clusters that should never have touched. That’s the tell.' },
  { durationMs: 5000, headline: 'Ring confirmed', body: '14 accounts, 1 coordinated ring, identified without a single manual review.' },
  { durationMs: 4000, headline: 'From weeks to milliseconds', body: 'This is what Bureau’s graph intelligence looks like in production.' },
];

export const DEMO_SCREENS: DemoScreenConfig[] = [
  {
    id: '1',
    label: 'AI Demo — Screen 1',
    orientation: 'vertical',
    ctaLabel: 'Tap to see Bureau AI in action',
    loopVideoSrc: '/assets/ai-demo/screen-1-loop.mp4',
    steps: SPOT_STEPS,
  },
  {
    id: '2',
    label: 'AI Demo — Screen 2',
    orientation: 'vertical',
    ctaLabel: 'Tap to see Bureau AI in action',
    loopVideoSrc: '/assets/ai-demo/screen-2-loop.mp4',
    steps: SPOT_STEPS,
  },
  {
    id: '3',
    label: 'AI Demo — Screen 3',
    orientation: 'vertical',
    ctaLabel: 'Tap to see Bureau AI in action',
    loopVideoSrc: '/assets/ai-demo/screen-3-loop.mp4',
    steps: DETECTIVE_STEPS,
  },
  {
    id: '4',
    label: 'AI Demo — Screen 4 (Horizontal)',
    orientation: 'horizontal',
    ctaLabel: 'Tap to see Bureau AI in action',
    loopVideoSrc: '/assets/ai-demo/screen-4-loop.mp4',
    steps: DETECTIVE_STEPS,
  },
];

export function getDemoScreen(id: string | undefined): DemoScreenConfig | undefined {
  return DEMO_SCREENS.find((s) => s.id === id);
}
