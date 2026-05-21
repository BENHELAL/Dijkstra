import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { quizQuestions } from "../data/quizQuestions";
import type { QuizQuestion } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { PremiumCard } from "./ui/PremiumCard";
import { SectionHeader } from "./ui/SectionHeader";

const BEST_SCORE_KEY = "dijkstra-best-score";
const BEST_TOTAL_KEY = "dijkstra-best-total";

const difficultyTone: Record<QuizQuestion["difficulty"], "teal" | "blue" | "violet"> = {
  Core: "teal",
  Applied: "blue",
  Challenge: "violet"
};

const emergencyLinks = [
  { from: "S", to: "A", latency: 2 },
  { from: "S", to: "B", latency: 5 },
  { from: "A", to: "B", latency: 1 },
  { from: "A", to: "C", latency: 4 },
  { from: "B", to: "C", latency: 2 },
  { from: "B", to: "T", latency: 6 },
  { from: "C", to: "T", latency: 1 }
];

const emergencySolutionRows = [
  { node: "S", distance: "0", predecessor: "--" },
  { node: "A", distance: "2", predecessor: "S" },
  { node: "B", distance: "3", predecessor: "A" },
  { node: "C", distance: "5", predecessor: "B" },
  { node: "T", distance: "6", predecessor: "C" }
];

const codingExercises = [
  {
    title: "Initialize the Dijkstra table",
    goal: "Create the first cost table: the start node has cost 0, every other node starts as infinity.",
    task: "Complete the function so it returns the correct cost and predecessor tables for the Smart City nodes.",
    starterCode: `nodes = ["S", "A", "B", "C", "D", "T"]
start = "S"

def initialize_tables(nodes, start):
    costs = {}
    previous = {}

    for node in nodes:
        # TODO: set cost to 0 for start, infinity for all others
        # TODO: set every previous node to None
        pass

    return costs, previous

costs, previous = initialize_tables(nodes, start)
print(costs)
print(previous)`,
    expected: `{'S': 0, 'A': inf, 'B': inf, 'C': inf, 'D': inf, 'T': inf}
{'S': None, 'A': None, 'B': None, 'C': None, 'D': None, 'T': None}`,
    hint: `Use float("inf") for infinity.`
  },
  {
    title: "Relax one road segment",
    goal: "Practice the core Dijkstra comparison: update a neighbor only when the new route is cheaper.",
    task: "Complete the relaxation logic for edge A -> C with weight 2.",
    starterCode: `costs = {"S": 0, "A": 2, "B": 3, "C": float("inf"), "D": float("inf"), "T": float("inf")}
previous = {"S": None, "A": "S", "B": "A", "C": None, "D": None, "T": None}

current = "A"
neighbor = "C"
weight = 2

candidate = costs[current] + weight

# TODO: if candidate is smaller than costs[neighbor],
# update costs[neighbor] and previous[neighbor]

print(costs["C"])
print(previous["C"])`,
    expected: `4
A`,
    hint: "Compare candidate with costs[neighbor], then store current as the predecessor."
  }
];

function EmergencySensorExercise() {
  return (
    <PremiumCard className="min-w-0 p-4 sm:p-5">
      <SectionHeader
        eyebrow="Practice exercise"
        title="Emergency sensor routing"
        description="A smoke alert starts at sensor S and must reach the control room T with the lowest total latency."
      />

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/45 to-amber-50/70 p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="rose">Emergency</Badge>
            <Badge tone="amber">Latency in ms</Badge>
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950">Communication links</h3>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white/90">
            <table className="w-full min-w-[240px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-3 py-3 sm:px-4">Link</th>
                  <th className="px-3 py-3 sm:px-4">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {emergencyLinks.map((link) => (
                  <tr key={`${link.from}-${link.to}`}>
                    <td className="px-3 py-3 text-slate-950 sm:px-4">
                      {link.from} -&gt; {link.to}
                    </td>
                    <td className="px-3 py-3 sm:px-4">{link.latency} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white/85 p-3 sm:p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Student task
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm font-bold leading-6 text-slate-700">
              <li>Use Dijkstra's algorithm to find the fastest route from S to T.</li>
              <li>Complete the final values of d(v) and pi(v).</li>
              <li>Explain why the direct-looking route is not necessarily the best one.</li>
            </ol>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/45 to-cyan-50/70 p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="emerald">Self-check</Badge>
            <Badge tone="blue">Dijkstra table</Badge>
          </div>
          <h3 className="mt-3 break-words text-lg font-black leading-snug text-slate-950">
            Fastest route: S -&gt; A -&gt; B -&gt; C -&gt; T
          </h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
            Total latency is 6 ms: 2 + 1 + 2 + 1.
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white/90">
            <table className="w-full min-w-[260px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-3 py-3 sm:px-4">v</th>
                  <th className="px-3 py-3 sm:px-4">d(v)</th>
                  <th className="px-3 py-3 sm:px-4">pi(v)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {emergencySolutionRows.map((row) => (
                  <tr key={row.node}>
                    <td className="px-3 py-3 text-slate-950 sm:px-4">{row.node}</td>
                    <td className="px-3 py-3 sm:px-4">{row.distance}</td>
                    <td className="px-3 py-3 sm:px-4">{row.predecessor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-3 sm:p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700">
              Why the direct-looking route loses
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
              Dijkstra minimizes total latency, not the number of links or how direct a path looks.
              For example, S -&gt; B -&gt; T takes 11 ms, while the slightly longer-looking route
              through A, B, and C takes only 6 ms.
            </p>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}

function CodingPracticeSection() {
  return (
    <PremiumCard className="min-w-0 p-4 sm:p-5">
      <SectionHeader
        eyebrow="Coding practice"
        title="Two small exercises"
        description="Use these short Python tasks to connect the visual simulation to the actual algorithm logic."
      />

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-2">
        {codingExercises.map((exercise, index) => (
          <div
            key={exercise.title}
            className="min-w-0 rounded-2xl border border-teal-100 bg-gradient-to-br from-white via-teal-50/50 to-cyan-50/70 p-3 shadow-sm sm:p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="teal">Exercise {index + 1}</Badge>
              <Badge tone="blue">Python</Badge>
            </div>
            <h3 className="mt-3 text-lg font-black text-slate-950">{exercise.title}</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{exercise.goal}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{exercise.task}</p>

            <pre className="mt-4 max-h-[330px] max-w-full overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs font-semibold leading-5 text-slate-100 sm:p-4">
              <code>{exercise.starterCode}</code>
            </pre>

            <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="min-w-0 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                  Expected result
                </p>
                <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs font-black leading-5 text-slate-800">
                  {exercise.expected}
                </pre>
              </div>
              <div className="min-w-0 rounded-xl border border-cyan-100 bg-cyan-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700">
                  Hint
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{exercise.hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}

export function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array.from({ length: quizQuestions.length }, () => null)
  );
  const [isComplete, setIsComplete] = useState(false);

  const question = quizQuestions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const score = useMemo(
    () =>
      answers.reduce<number>(
        (total, answer, index) => total + (answer === quizQuestions[index].correctIndex ? 1 : 0),
        0
      ),
    [answers]
  );
  const progress = isComplete
    ? 100
    : Math.round(((currentIndex + (selectedAnswer !== null ? 1 : 0)) / quizQuestions.length) * 100);
  const difficultyCounts = useMemo(
    () =>
      quizQuestions.reduce<Record<QuizQuestion["difficulty"], number>>(
        (counts, item) => ({ ...counts, [item.difficulty]: counts[item.difficulty] + 1 }),
        { Core: 0, Applied: 0, Challenge: 0 }
      ),
    []
  );

  useEffect(() => {
    if (!isComplete) return;

    const existingScore = Number(window.localStorage.getItem(BEST_SCORE_KEY) ?? "0");
    const existingTotal = Number(window.localStorage.getItem(BEST_TOTAL_KEY) ?? "0");
    const safeExistingScore = Number.isFinite(existingScore) ? existingScore : 0;
    const safeExistingTotal = Number.isFinite(existingTotal) ? existingTotal : 0;
    const existingPercent =
      safeExistingTotal > 0 ? safeExistingScore / safeExistingTotal : 0;
    const currentPercent = score / quizQuestions.length;

    if (
      currentPercent > existingPercent ||
      (currentPercent === existingPercent && score > safeExistingScore)
    ) {
      window.localStorage.setItem(BEST_SCORE_KEY, String(score));
      window.localStorage.setItem(BEST_TOTAL_KEY, String(quizQuestions.length));
    }
  }, [isComplete, score]);

  const chooseAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setAnswers((current) =>
      current.map((answer, index) => (index === currentIndex ? optionIndex : answer))
    );
  };

  const goNext = () => {
    if (currentIndex === quizQuestions.length - 1) {
      setIsComplete(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    setAnswers(Array.from({ length: quizQuestions.length }, () => null));
    setIsComplete(false);
  };

  if (isComplete) {
    const percent = Math.round((score / quizQuestions.length) * 100);

    return (
      <section className="grid min-w-0 gap-5">
        <PremiumCard className="min-w-0 p-4 sm:p-6">
          <SectionHeader
            eyebrow="Quiz complete"
            title={`Score: ${score} / ${quizQuestions.length}`}
            description={
              percent >= 80
                ? "Strong work. You can explain both the table mechanics and the real-world purpose."
                : "Good practice run. Review the explanations, then try again to strengthen the key ideas."
            }
            action={<Button variant="primary" onClick={restart}>Restart quiz</Button>}
          />
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 via-cyan-500 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-6 grid gap-3">
            <h3 className="text-lg font-black text-slate-950">Answer review</h3>
            {quizQuestions.map((item, index) => {
              const answer = answers[index];
              const isCorrect = answer === item.correctIndex;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 ${
                    isCorrect ? "border-emerald-200 bg-emerald-50/70" : "border-rose-200 bg-rose-50/70"
                  } min-w-0`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={difficultyTone[item.difficulty]}>{item.difficulty}</Badge>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Question {index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-black leading-6 text-slate-950">
                    {item.question}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                    {isCorrect
                      ? "Correct."
                      : `Correct answer: ${item.options[item.correctIndex]}`}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                    {item.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </PremiumCard>
        <EmergencySensorExercise />
        <CodingPracticeSection />
      </section>
    );
  }

  return (
    <section className="grid min-w-0 gap-5">
      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <PremiumCard className="min-w-0 p-4 sm:p-5">
          <SectionHeader
            eyebrow="Interactive quiz"
            title="Quiz & Practice"
            description="A richer set of core, applied, and challenge questions with instant explanations after every answer."
          />
          <div className="mt-5 rounded-xl border border-slate-200 bg-white/85 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-slate-950">
                Question {currentIndex + 1} of {quizQuestions.length}
              </p>
              <Badge tone="amber">Current score: {score}</Badge>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 via-cyan-500 to-amber-400"
                initial={false}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-xl border border-teal-100 bg-teal-50/80 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                Answered
              </p>
              <p className="mt-1 text-2xl font-black text-teal-900">
                {answeredCount}/{quizQuestions.length}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["Core", "Applied", "Challenge"] as const).map((difficulty) => (
                <div key={difficulty} className="min-w-0 rounded-xl border border-slate-100 bg-white/90 p-3">
                  <p className="break-words text-[10px] font-black uppercase tracking-[0.08em] text-slate-500 sm:tracking-[0.14em]">
                    {difficulty}
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-950">
                    {difficultyCounts[difficulty]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PremiumCard>

        <motion.div
          key={question.id}
          className="min-w-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PremiumCard className="min-w-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{question.topic}</Badge>
              <Badge tone={difficultyTone[question.difficulty]}>{question.difficulty}</Badge>
            </div>
            <h3 className="mt-3 break-words text-lg font-black leading-tight text-slate-950 sm:text-xl">
              {question.question}
            </h3>

            <div className="mt-5 grid gap-3">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isCorrect = question.correctIndex === optionIndex;
                const showResult = selectedAnswer !== null;
                const resultClass =
                  showResult && isCorrect
                    ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                    : showResult && isSelected
                      ? "border-rose-300 bg-rose-50 text-rose-950"
                      : "border-slate-200 bg-white/90 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/60";

                return (
                  <button
                    key={option}
                    className={`min-w-0 rounded-xl border p-3 text-left text-sm font-bold leading-6 transition sm:p-4 ${resultClass}`}
                    onClick={() => chooseAnswer(optionIndex)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 min-w-0 rounded-xl border p-3 sm:p-4 ${
                  selectedAnswer === question.correctIndex
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-200 bg-rose-50"
                }`}
              >
                <p className="text-sm font-black text-slate-950">
                  {selectedAnswer === question.correctIndex ? "Correct" : "Not quite"}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                  {question.explanation}
                </p>
                <Button variant="primary" className="mt-4" onClick={goNext}>
                  {currentIndex === quizQuestions.length - 1 ? "Show final score" : "Next question"}
                </Button>
              </motion.div>
            )}
          </PremiumCard>
        </motion.div>
      </section>

      <EmergencySensorExercise />
      <CodingPracticeSection />
    </section>
  );
}
