import { cn } from "@/lib/utils";
import { EyebrowTag } from "./bureau/eyebrow-tag";
import { ScanEye, Target, Fingerprint, CheckCircle2 } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SignalField, ScanFrame } from "./bureau";

export function SpotTheFraudSpectator({ state }: { state: any }) {
  const { currentLevel, currentQuestion, shuffledOptions, imageOptions, selectedIndices, timeLeft, score } = state;

  if (!currentQuestion) return null;

  const isImageQuestion = currentQuestion.kind === "image";
  const imageQuestionInstruction = currentQuestion.selectN === 1 ? 'Only One Correct' : 'Two Correct';

  return (
    <div className="flex h-full w-full flex-col p-6 bg-black">
      <div className="shrink-0 flex flex-col gap-2 border-b border-ink-800 pb-3">
        <div className="flex items-center justify-between">
          <EyebrowTag>
            {currentLevel?.kind === 'image'
              ? `Find the AI generated image · ${currentLevel?.correctCount === 1 ? 'Only One Correct' : 'Two Correct'}`
              : currentLevel?.label}
          </EyebrowTag>
          <span className="font-mono text-eyebrow-micro tabular-nums text-white uppercase tracking-[0.03em]">
            Score <span className="text-violet-500">{score}</span>
          </span>
        </div>
      </div>

      <div className="shrink-0 h-1 w-full bg-ink-800 mt-3 mb-6">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-linear",
            timeLeft <= 5 ? "bg-coral-600" : "bg-cyan-500"
          )}
          style={{ width: `${currentLevel ? (timeLeft / currentLevel.timerSec) * 100 : 0}%` }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <h2 className="shrink-0 pt-2 pb-4 font-sans text-display-sm font-medium leading-snug text-white">
          {isImageQuestion ? 'Find the AI generated image.' : currentQuestion.stem}
        </h2>
        
        {isImageQuestion ? (
          <p className="mb-4 shrink-0 font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-violet-500">
            {imageQuestionInstruction}
          </p>
        ) : currentQuestion.selectN > 1 && (
          <p className="mb-4 shrink-0 font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-violet-500">
            Select {currentQuestion.selectN}
          </p>
        )}

        <div className={cn(
          "flex-1 min-h-0 grid gap-4",
          isImageQuestion ? "grid-cols-2 grid-rows-2" : "grid-rows-4"
        )}>
          {shuffledOptions?.map((opt: any, i: number) => {
            const isSelected = selectedIndices?.includes(opt.originalIndex);
            const quizImage = isImageQuestion ? imageOptions[opt.originalIndex - 1] : null;

            return (
              <div
                key={i}
                className={cn(
                  "relative overflow-hidden border transition-colors duration-[var(--dur-base)] flex",
                  isImageQuestion ? "w-full h-full" : "items-center gap-4 px-6 py-4",
                  isSelected
                    ? "border-violet-700 bg-[rgba(71,21,255,0.08)]"
                    : "border-ink-800 bg-ink-900"
                )}
              >
                {isImageQuestion && quizImage && (
                  <>
                    <img
                      src={quizImage.src}
                      className={cn(
                        "absolute inset-0 size-full bg-ink-950 object-contain px-4 pt-4 pb-12 transition-opacity",
                        isSelected && "opacity-60"
                      )}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[rgba(0,2,36,0.82)] px-4 py-2">
                      <span className="font-mono text-eyebrow-micro font-medium tabular-nums text-white">
                        {quizImage.label}
                      </span>
                      <ScanEye className={cn("size-6", isSelected ? "text-violet-500" : "text-white/70")} />
                    </div>
                  </>
                )}
                {!isImageQuestion && (
                  <>
                    <span className={cn(
                      "shrink-0 font-mono text-body-md font-medium tabular-nums",
                      isSelected ? "text-violet-500" : "text-[var(--text-on-dark-muted)]"
                    )}>
                      {String(opt.originalIndex).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1 font-sans text-body-lg leading-snug text-white">
                      {opt.text}
                    </span>
                  </>
                )}
                <div className={cn("shrink-0", isImageQuestion && "absolute right-3 top-3")}>
                  {isSelected
                    ? <div className="size-4 bg-violet-500" />
                    : <div className={cn("size-4 border", isImageQuestion ? "border-white/80 bg-[rgba(0,2,36,0.5)]" : "border-ink-700")} />
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
