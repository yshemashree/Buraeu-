/**
 * AI Demo Area — one of the 4 offline demo screens (doc section 13).
 *
 * State machine: idle video loop -> attendee taps the CTA -> the scripted AI
 * demo plays -> on completion, or after INACTIVITY_MS with no interaction,
 * it returns to the idle loop automatically. Nothing here calls the network;
 * everything is local content, so it keeps running with no internet.
 *
 * screenId comes from the route (/ai-demo/1 .. /ai-demo/4) so the same
 * kiosk build can drive any of the four physical screens by URL alone —
 * useful because 3 are vertical and 1 is horizontal.
 */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { getDemoScreen, type DemoStep } from '@/data/ai-demo-content';

const INACTIVITY_MS = 45_000;

type ScreenState = 'loop' | 'demo';

export default function AiDemo() {
  const { screenId } = useParams<{ screenId: string }>();
  const config = getDemoScreen(screenId);

  const [state, setState] = useState<ScreenState>('loop');
  const [stepIndex, setStepIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const inactivityTimer = useRef<number | null>(null);

  const returnToLoop = () => {
    setState('loop');
    setStepIndex(0);
  };

  const armInactivityTimer = () => {
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    inactivityTimer.current = window.setTimeout(returnToLoop, INACTIVITY_MS);
  };

  const startDemo = () => {
    setStepIndex(0);
    setState('demo');
  };

  // Auto-advance through the scripted steps while the demo is running.
  useEffect(() => {
    if (state !== 'demo' || !config) return;
    armInactivityTimer();

    const step = config.steps[stepIndex];
    if (!step) {
      returnToLoop();
      return;
    }
    const timer = window.setTimeout(() => {
      if (stepIndex + 1 >= config.steps.length) {
        returnToLoop();
      } else {
        setStepIndex((i) => i + 1);
      }
    }, step.durationMs);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, stepIndex, config]);

  useEffect(() => () => {
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
  }, []);

  if (!config) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <p className="font-mono text-sm uppercase tracking-[0.05em]">Unknown demo screen. Use /ai-demo/1 through /ai-demo/4.</p>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-black"
      data-orientation={config.orientation}
      onClick={() => (state === 'demo' ? armInactivityTimer() : startDemo())}
    >
      {!videoFailed ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={config.loopVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bureau-matrix bg-[#00010f]" />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

      {state === 'loop' && (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-6 p-10 text-center">
          <h1 className="font-sans text-[clamp(28px,4vw,48px)] font-normal text-white">Bureau AI Demo</h1>
          <button
            type="button"
            onClick={startDemo}
            className="tap border border-violet-500 bg-violet-700/90 px-8 py-4 font-mono text-[clamp(14px,1.6vw,20px)] uppercase tracking-[0.08em] text-white"
          >
            {config.ctaLabel}
          </button>
        </div>
      )}

      {state === 'demo' && <DemoOverlay step={config.steps[stepIndex]} />}
    </div>
  );
}

function DemoOverlay({ step }: { step: DemoStep | undefined }) {
  if (!step) return null;
  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-5 px-12 text-center">
      <span className="font-mono text-[clamp(12px,1.2vw,16px)] uppercase tracking-[0.2em] text-violet-400">
        Bureau AI
      </span>
      <h2 className="font-sans text-[clamp(24px,3.4vw,42px)] font-normal text-white">{step.headline}</h2>
      <p className="max-w-[46ch] text-[clamp(14px,1.6vw,22px)] text-[var(--text-on-dark-muted)]">{step.body}</p>
    </div>
  );
}
