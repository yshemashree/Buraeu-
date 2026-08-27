import { cn } from "@/lib/utils";
import { EyebrowTag } from "./bureau/eyebrow-tag";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SignalField, ScanFrame } from "./bureau";

export function FraudDetectiveSpectator({ state }: { state: any }) {
  const { currentCase, caseScore, bonusScore, caseTimeLeft, graphNodes, graphEdges, selectedNode, solved, revealed } = state;
  const isFinished = solved || revealed;

  if (!currentCase || !graphNodes || !graphEdges) return null;

  // Replicate graph scaling logic from the main component
  const graphData = (() => {
    if (!graphNodes.length) return { viewBox: '-200 -200 400 400', width: 400, height: 400 };
    const PAD_X = 90;
    const PAD_TOP = 50;
    const PAD_BOTTOM = 75;
    const MIN_SPAN = 280;
    const xs = graphNodes.map((n: any) => n.x);
    const ys = graphNodes.map((n: any) => n.y);
    let minX = Math.min(...xs) - PAD_X;
    let maxX = Math.max(...xs) + PAD_X;
    let minY = Math.min(...ys) - PAD_TOP;
    let maxY = Math.max(...ys) + PAD_BOTTOM;
    if (maxX - minX < MIN_SPAN) {
      const mid = (minX + maxX) / 2;
      minX = mid - MIN_SPAN / 2;
      maxX = mid + MIN_SPAN / 2;
    }
    if (maxY - minY < MIN_SPAN) {
      const mid = (minY + maxY) / 2;
      minY = mid - MIN_SPAN / 2;
      maxY = mid + MIN_SPAN / 2;
    }
    return { viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`, width: maxX - minX, height: maxY - minY };
  })();

  return (
    <div className="flex h-full w-full flex-col bg-black">
      <div className="shrink-0 flex flex-col gap-2 border-b border-ink-800 p-6 pb-3">
        <div className="flex items-center justify-between">
          <EyebrowTag>{currentCase.sector}</EyebrowTag>
          <span className="font-mono text-eyebrow-micro tabular-nums text-white uppercase tracking-[0.03em]">
            Score <span className="text-violet-500">{caseScore + bonusScore}</span>
          </span>
        </div>
      </div>

      <div className="shrink-0 h-1 w-full bg-ink-800">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-linear",
            caseTimeLeft <= 10 ? "bg-coral-600" : "bg-cyan-500"
          )}
          style={{ width: `${(caseTimeLeft / 45) * 100}%` }}
        />
      </div>

      <div className="relative min-h-0 flex-1 bg-russian overflow-hidden z-0" style={{ touchAction: 'none' }}>
        <SignalField texture="dots" tone="russian" fade={false} />
        <TransformWrapper 
          initialScale={0.9}
          minScale={0.3}
          maxScale={4}
          centerOnInit
          limitToBounds
          minPositionX={-160}
          maxPositionX={160}
          minPositionY={-180}
          maxPositionY={180}
          panning={{ disabled: true }}
          wheel={{ disabled: true }}
          pinch={{ disabled: true }}
          doubleClick={{ disabled: true }}
        >
          {() => (
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="flex h-full w-full items-center justify-center"
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <svg className="block h-full w-full" viewBox={graphData.viewBox} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrow-normal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="rgba(139,92,246,0.7)" />
                  </marker>
                  <marker id="arrow-answer" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="var(--coral-600)" />
                  </marker>
                </defs>

                {graphEdges.map((e: any, i: number) => {
                  const isAnswerEdge = isFinished && (currentCase.answer.includes(e.source.id) || currentCase.answer.includes(e.target.id));
                  const dx = e.target.x - e.source.x;
                  const dy = e.target.y - e.source.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const pad = 30;
                  const safe = dist > pad * 2;
                  const x1a = safe ? e.source.x + (dx / dist) * pad : e.source.x;
                  const y1a = safe ? e.source.y + (dy / dist) * pad : e.source.y;
                  const x2a = safe ? e.target.x - (dx / dist) * pad : e.target.x;
                  const y2a = safe ? e.target.y - (dy / dist) * pad : e.target.y;
                  return (
                    <g key={i}>
                      <line
                        x1={x1a} y1={y1a}
                        x2={x2a} y2={y2a}
                        stroke={isAnswerEdge ? 'var(--coral-600)' : 'rgba(139,92,246,0.45)'}
                        strokeWidth={isAnswerEdge ? 2 : 1.5}
                        opacity={isFinished && !isAnswerEdge ? 0.15 : 1}
                        strokeDasharray={isAnswerEdge ? "none" : "4 4"}
                        markerEnd={isAnswerEdge ? 'url(#arrow-answer)' : 'url(#arrow-normal)'}
                      />
                    </g>
                  );
                })}

                {graphNodes.map((n: any) => {
                  const isSelected = selectedNode === n.id;
                  const isAnswerNode = isFinished && currentCase.answer.includes(n.id);
                  return (
                    <g 
                      key={n.id} 
                      transform={`translate(${n.x},${n.y})`}

                      className={cn(
                        "transition-opacity duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                        isFinished && !isAnswerNode ? "opacity-30" : "opacity-100"
                      )}
                    >
                      <foreignObject x={-60} y={-60} width={120} height={120} className="overflow-visible">
                        <div className="flex h-full w-full flex-col items-center justify-center">
                          {isSelected || isAnswerNode ? (
                            <ScanFrame id={n.id.substring(0, 4)} tone={isAnswerNode ? 'coral' : 'violet'}>
                              <div className={cn(
                                "flex size-12 items-center justify-center border",
                                isAnswerNode ? "border-coral-600 bg-coral-600 text-russian" : "border-violet-500 bg-violet-700 text-white"
                              )}>
                                <span className="font-mono text-body-md uppercase">{n.id.substring(0, 2)}</span>
                              </div>
                            </ScanFrame>
                          ) : (
                            <div className="flex size-12 items-center justify-center border border-ink-700 bg-ink-800 text-white">
                              <span className="font-mono text-body-md uppercase">{n.id.substring(0, 2)}</span>
                            </div>
                          )}
                          <span className={cn(
                            "mt-1.5 text-center font-mono text-eyebrow-micro uppercase tracking-[0.03em] leading-none",
                            isAnswerNode ? "text-coral-600" : "text-[var(--text-on-dark-muted)]"
                          )}>
                             {isFinished ? (currentCase.nodeLabels?.[n.id] || n.id) : n.id}
                          </span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>

      <div className="p-6 shrink-0 border-t border-ink-800">
        <h2 className="font-sans text-display-xs text-white leading-snug">{currentCase.instruction}</h2>
      </div>
    </div>
  );
}
