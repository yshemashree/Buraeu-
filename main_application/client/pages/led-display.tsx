/**
 * The LED wall display.
 *
 * Per the doc's LED spec: a 3x5 tile wall at 168x168px/tile gives a fixed
 * 504 (wide) x 840 (tall) pixel canvas, portrait orientation. This route
 * renders exactly that canvas and scales it to fit whatever screen actually
 * drives the wall, so the media player pointed at this URL never has to do
 * its own layout math.
 *
 * This is a passive, unattended display — no navigation, no session gate,
 * and critically: no registration data. It only shows what's already public
 * on the leaderboard (first name + company), rotating between a branded
 * attract screen and the live standings.
 */
import { useEffect, useState } from 'react';
import { useGetLeaderboard, getGetLeaderboardQueryKey } from '@shared/api-client-react';

const LED_WIDTH = 504;
const LED_HEIGHT = 840;
const ROTATE_MS = 9000;

type Slide = 'attract' | 'leaderboard';

export default function LedDisplay() {
  const [slide, setSlide] = useState<Slide>('attract');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((s) => (s === 'attract' ? 'leaderboard' : 'attract'));
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const leaderboardParams = { scope: 'today' as const, limit: 8 };
  const { data: leaderboard } = useGetLeaderboard(leaderboardParams, {
    query: {
      refetchInterval: 15000,
      queryKey: getGetLeaderboardQueryKey(leaderboardParams),
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div
        style={{
          width: LED_WIDTH,
          height: LED_HEIGHT,
          // Pure-CSS scale-to-fit: whichever axis is the tighter constraint wins.
          transform: `scale(min(calc(100vw / ${LED_WIDTH}), calc(100vh / ${LED_HEIGHT})))`,
          transformOrigin: 'center',
        }}
        className="relative shrink-0 overflow-hidden bg-[#00010f]"
      >
        <div aria-hidden className="bureau-matrix pointer-events-none absolute inset-0 opacity-60" />

        {slide === 'attract' ? <AttractSlide /> : <LeaderboardSlide rows={leaderboard?.rows ?? []} />}
      </div>
    </div>
  );
}

function AttractSlide() {
  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-8 px-8 text-center">
      <span className="font-mono text-[18px] font-medium uppercase tracking-[0.2em] text-violet-400">
        Global Fintech Fest 2026
      </span>
      <h1 className="font-sans text-[64px] font-normal leading-[1.05] text-white">
        Bureau
        <br />
        Fraud Arena
      </h1>
      <p className="max-w-[22ch] font-mono text-[16px] uppercase tracking-[0.1em] text-[var(--text-on-dark-muted)]">
        Register at the booth to play
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {['Spot the Fraud', 'Spoof the System', 'Fraud Detective'].map((label) => (
          <span
            key={label}
            className="border border-violet-700 px-6 py-3 font-mono text-[15px] uppercase tracking-[0.08em] text-white"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function LeaderboardSlide({ rows }: { rows: { rank: number; displayName: string; company: string; total: number }[] }) {
  return (
    <div className="relative z-10 flex h-full w-full flex-col px-6 py-8">
      <div className="shrink-0 text-center">
        <span className="font-mono text-[14px] font-medium uppercase tracking-[0.2em] text-violet-400">
          Live Standings — Today
        </span>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-2">
        {rows.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-mono text-[15px] uppercase tracking-[0.05em] text-[var(--text-on-dark-faint)]">
              Be the first on the board
            </span>
          </div>
        )}
        {rows.map((row) => (
          <div
            key={row.rank}
            className="flex items-center gap-3 border-b border-ink-800 py-2.5"
          >
            <span className="w-9 shrink-0 text-center font-mono text-[20px] font-medium tabular-nums text-violet-500">
              {row.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-[18px] font-medium text-white">{row.displayName}</p>
              <p className="truncate font-mono text-[12px] uppercase tracking-[0.05em] text-[var(--text-on-dark-muted)]">
                {row.company}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[22px] font-medium tabular-nums text-white">
              {row.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
