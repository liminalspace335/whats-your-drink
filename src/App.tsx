import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { DrinkType, QuizOption, QuizQuestion, ResultContent } from "./types";
import { buildUi, type Ui } from "./data/ui.ko";
import { scoreAnswers } from "./lib/scoring";
import {
  fetchQuizQuestions,
  fetchResultTypes,
  fetchBranding,
  insertSubmission,
  insertReferralVisit,
} from "./lib/db";
import { Cover } from "./components/Cover";
import { QuizScreen } from "./components/QuizScreen";
import { AnalyzingScreen } from "./components/AnalyzingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { ScentScreen } from "./components/ScentScreen";
import { ScreenTransition } from "./components/ScreenTransition";

const ANALYZING_DURATION_MS = 5000;

type Screen = "loading" | "cover" | "quiz" | "analyzing" | "result" | "scent";

function buildResultsMap(resultTypes: Awaited<ReturnType<typeof fetchResultTypes>>) {
  const map = {} as Record<DrinkType, ResultContent>;
  for (const r of resultTypes) {
    map[r.type] = {
      type: r.type,
      displayName: r.code.replace("_", " "),
      personalityTitle: r.personalityTitle,
      aboutYou: r.aboutYou,
      notes: r.notes,
      scentDescription: r.scentDescription,
      whyItFits: r.whyItFits,
      recommendedFor: r.recommendedFor,
    };
  }
  return map;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [resultsData, setResultsData] = useState<Record<DrinkType, ResultContent> | null>(null);
  const [ui, setUi] = useState<Ui | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(QuizOption | null)[]>([]);
  const [resultType, setResultType] = useState<DrinkType | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const referralLogged = useRef(false);

  useEffect(() => {
    Promise.all([fetchQuizQuestions(), fetchResultTypes(), fetchBranding()])
      .then(([qs, resultTypes, branding]) => {
        setQuestions(qs);
        setAnswers(Array(qs.length).fill(null));
        setResultsData(buildResultsMap(resultTypes));
        setUi(buildUi(branding));
        setScreen("cover");
      })
      .catch((err) => {
        console.error(err);
        setLoadError("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      });

    if (!referralLogged.current) {
      referralLogged.current = true;
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref) {
        insertReferralVisit(ref).catch(() => {
          // best-effort — a failed referral log should not affect the visitor
        });
      }
    }
  }, []);

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

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      const finalAnswers = nextAnswers.filter((a): a is QuizOption => a !== null);
      const winner = scoreAnswers(finalAnswers);
      setResultType(winner);
      setScreen("analyzing");

      const payload = questions.map((q, i) => ({
        question_id: q.id,
        option_id: finalAnswers[i]?.id ?? "",
      }));
      insertSubmission(payload, winner)
        .then(setSubmissionId)
        .catch(() => setSubmissionId(null));

      setTimeout(() => setScreen("result"), ANALYZING_DURATION_MS);
    }
  };

  const handleQuizBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleQuizExit = () => {
    setStep(0);
    setAnswers(Array(questions.length).fill(null));
    setScreen("cover");
  };

  const restart = () => {
    setStep(0);
    setAnswers(Array(questions.length).fill(null));
    setResultType(null);
    setSubmissionId(null);
    setScreen("cover");
  };

  if (loadError) {
    return (
      <div style={{ padding: "3rem 1.5rem", textAlign: "center", fontFamily: "sans-serif" }}>
        {loadError}
      </div>
    );
  }

  if (screen === "loading" || !ui || !resultsData) {
    return null;
  }

  const screenKey = screen === "result" ? `result-${resultType}` : screen;

  return (
    <>
      <AnimatePresence mode="wait">
        <ScreenTransition key={screenKey}>
          {screen === "cover" && <Cover ui={ui} onSelectLanguage={handleSelectLanguage} />}

          {screen === "quiz" && (
            <QuizScreen
              ui={ui}
              question={questions[step]}
              stepIndex={step}
              total={questions.length}
              canGoBack={step > 0}
              initialSelectedId={answers[step]?.id}
              onNext={handleAnswer}
              onBack={handleQuizBack}
              onExit={handleQuizExit}
            />
          )}

          {screen === "analyzing" && <AnalyzingScreen />}

          {screen === "result" && resultType && (
            <ResultScreen
              ui={ui}
              result={resultsData[resultType]}
              submissionId={submissionId}
              onScent={() => setScreen("scent")}
            />
          )}

          {screen === "scent" && <ScentScreen ui={ui} onBack={() => setScreen("result")} />}
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
