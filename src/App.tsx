import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { DrinkType, QuizOption } from "./types";
import { quizKo } from "./data/quiz.ko";
import { resultsKo } from "./data/results.ko";
import { scoreAnswers } from "./lib/scoring";
import { Cover } from "./components/Cover";
import { QuizScreen } from "./components/QuizScreen";
import { AnalyzingScreen } from "./components/AnalyzingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { ScentScreen } from "./components/ScentScreen";
import { ScreenTransition } from "./components/ScreenTransition";

const ANALYZING_DURATION_MS = 5000;

type Screen = "cover" | "quiz" | "analyzing" | "result" | "scent";

export default function App() {
  const [screen, setScreen] = useState<Screen>("cover");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(QuizOption | null)[]>(
    () => Array(quizKo.length).fill(null),
  );
  const [resultType, setResultType] = useState<DrinkType | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSelectLanguage = (code: string) => {
    if (code !== "ko") {
      setNotice("이 언어는 샘플에서 준비 중입니다. 한국어로 먼저 확인해주세요.");
      setTimeout(() => setNotice(null), 2400);
      return;
    }
    setScreen("quiz");
  };

  const handleAnswer = (option: QuizOption) => {
    const nextAnswers = [...answers];
    nextAnswers[step] = option;
    setAnswers(nextAnswers);

    if (step + 1 < quizKo.length) {
      setStep(step + 1);
    } else {
      const winner = scoreAnswers(nextAnswers.filter((a): a is QuizOption => a !== null));
      setResultType(winner);
      setScreen("analyzing");
      setTimeout(() => setScreen("result"), ANALYZING_DURATION_MS);
    }
  };

  const handleQuizBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleQuizExit = () => {
    setStep(0);
    setAnswers(Array(quizKo.length).fill(null));
    setScreen("cover");
  };

  const restart = () => {
    setStep(0);
    setAnswers(Array(quizKo.length).fill(null));
    setResultType(null);
    setScreen("cover");
  };

  const screenKey = screen === "result" ? `result-${resultType}` : screen;

  return (
    <>
      <AnimatePresence mode="wait">
        <ScreenTransition key={screenKey}>
          {screen === "cover" && <Cover onSelectLanguage={handleSelectLanguage} />}

          {screen === "quiz" && (
            <QuizScreen
              question={quizKo[step]}
              stepIndex={step}
              total={quizKo.length}
              canGoBack={step > 0}
              initialSelectedId={answers[step]?.id}
              onNext={handleAnswer}
              onBack={handleQuizBack}
              onExit={handleQuizExit}
            />
          )}

          {screen === "analyzing" && <AnalyzingScreen />}

          {screen === "result" && resultType && (
            <ResultScreen result={resultsKo[resultType]} onScent={() => setScreen("scent")} />
          )}

          {screen === "scent" && <ScentScreen onBack={() => setScreen("result")} />}
        </ScreenTransition>
      </AnimatePresence>

      {notice && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ls-text-primary)",
            color: "var(--ls-surface)",
            padding: "0.8rem 1.2rem",
            borderRadius: 12,
            fontSize: "0.85rem",
            fontFamily: "var(--font-body)",
            maxWidth: "22rem",
            textAlign: "center",
            zIndex: 50,
            boxShadow: "var(--ls-shadow-lift)",
          }}
        >
          {notice}
        </div>
      )}

      {(screen === "result" || screen === "scent") && (
        <button
          type="button"
          onClick={restart}
          aria-label="처음으로"
          style={{
            all: "unset",
            position: "fixed",
            top: "1.1rem",
            right: "1.3rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.08em",
            color: "var(--ls-text-tertiary)",
            cursor: "pointer",
            padding: "0.5rem",
            zIndex: 40,
          }}
        >
          RESTART
        </button>
      )}
    </>
  );
}
