import React, { useState, useCallback, useEffect } from "react";

const MAX_GUESSES = 6;

const FALLBACK_VALID_WORDS = [
  "SYNCS",
  "AGILE",
  "PIVOT",
  "SCRUM",
  "EPICS",
  "FLEET",
  "RAPID",
  "SLACK",
  "STAND",
  "FOCUS",
  "ALIGN",
  "SCOPE",
  "PATCH",
  "BRICK",
  "CRANE",
  "GLOBE",
  "HOUSE",
  "LIGHT",
  "MONEY",
  "POWER",
  "QUEST",
  "RAISE",
  "SMART",
  "THINK",
  "ULTRA",
  "VALVE",
  "WATER",
  "YIELD",
  "BLAST",
  "CHARM",
  "DRAFT",
  "EIGHT",
  "FLAME",
  "GRAPE",
  "HASTE",
  "INPUT",
  "JUDGE",
  "KNEEL",
  "LEAPS",
  "MANGO",
  "NOBLE",
  "OCEAN",
  "PLUMB",
  "QUITE",
  "ROUND",
  "SHARP",
  "TOWER",
  "UNITE",
  "WATCH",
  "WORLD",
  "BRAIN",
  "CLOUD",
  "DAILY",
  "EXTRA",
  "FRESH",
  "GRAIN",
  "TREND",
  "TRACK",
  "TRADE",
  "TRAIN",
  "TRAIL",
  "TRIAL",
  "TWEAK",
  "SWARM",
  "SPARK",
  "SPACE",
  "SOLVE",
  "SOLID",
  "SHIFT",
  "SHARE",
  "SHAPE",
  "SERVE",
  "JIRAS",
  "CLOUD",
  "CACHE",
  "BYTES",
  "DEBUG",
  "PIXEL",
  "PROXY",
  "ARRAY",
  "QUERY",
  "PROPS",
  "GATES",
  "MODES",
  "NODES",
  "AZURE",
  "REDUX",
  "LINUX",
  "TOKEN",
  "STACK",
  "LINKS",
  "MONGO",
  "KAFKA",
  "GRAPH",
  "SWIFT",
];

const TARGET_WORDS = [
  "AGILE",
  "PIVOT",
  "SCRUM",
  "EPICS",
  "SLACK",
  "STAND",
  "ALIGN",
  "SCOPE",
  "TREND",
  "JIRAS",
  "CLOUD",
  "CACHE",
  "BYTES",
  "DEBUG",
  "PIXEL",
  "PROXY",
  "ARRAY",
  "QUERY",
  "PROPS",
  "GATES",
  "MODES",
  "NODES",
  "AZURE",
  "REDUX",
  "LINUX",
  "TOKEN",
  "STACK",
  "LINKS",
  "MONGO",
  "KAFKA",
  "GRAPH",
  "SWIFT",
];

interface WordleGameProps {
  onComplete: (guesses: number) => void;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

export const WordleGame: React.FC<WordleGameProps> = ({ onComplete }) => {
  const [target] = useState(
    () => TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)],
  );
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [validWords, setValidWords] = useState<Set<string>>(
    new Set(FALLBACK_VALID_WORDS),
  );
  const [letterStates, setLetterStates] = useState<
    Record<string, "correct" | "present" | "absent">
  >({});

  // Load words from dictionary if available
  useEffect(() => {
    let active = true;
    const loadWords = async () => {
      try {
        const response = await fetch("/words.txt");
        if (!response.ok) return;
        const text = await response.text();
        const words = text
          .split(/\r?\n/)
          .map((w) => w.trim().toUpperCase())
          .filter((w) => /^[A-Z]{5}$/.test(w));
        if (!active || words.length === 0) return;
        setValidWords(new Set([...FALLBACK_VALID_WORDS, ...words]));
      } catch {
        return;
      }
    };
    loadWords();
    return () => {
      active = false;
    };
  }, []);

  // Update letter states (for keyboard coloring)
  const updateLetterStates = useCallback((word: string, targetWord: string) => {
    setLetterStates((prev) => {
      const next = { ...prev };
      for (let i = 0; i < word.length; i++) {
        const l = word[i];
        if (l === targetWord[i]) {
          next[l] = "correct";
        } else if (targetWord.includes(l)) {
          if (next[l] !== "correct") next[l] = "present";
        } else {
          if (!next[l]) next[l] = "absent";
        }
      }
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    if (done || current.length !== 5) return;
    const upper = current.toUpperCase();
    if (!validWords.has(upper)) {
      setError("Not a valid word!");
      setTimeout(() => setError(""), 1500);
      return;
    }
    const newGuesses = [...guesses, upper];
    setGuesses(newGuesses);
    setCurrent("");
    updateLetterStates(upper, target);

    if (upper === target) {
      setDone(true);
      onComplete(newGuesses.length);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setDone(true);
      onComplete(7);
    }
  }, [
    current,
    guesses,
    done,
    target,
    validWords,
    updateLetterStates,
    onComplete,
  ]);

  const handleKey = useCallback(
    (key: string) => {
      if (done) return;
      if (key === "ENTER") {
        submit();
        return;
      }
      if (key === "⌫") {
        setCurrent((prev) => prev.slice(0, -1));
        return;
      }
      if (/^[A-Z]$/.test(key) && current.length < 5) {
        setCurrent((prev) => prev + key);
      }
    },
    [current, done, submit],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === "Enter") {
        submit();
        return;
      }
      if (e.key === "Backspace") {
        setCurrent((prev) => prev.slice(0, -1));
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) {
        setCurrent((prev) => prev + e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, done, submit]);

  // Determine coloring of letters in boxes
  const getColor = (letter: string, index: number, row: string) => {
    if (!row) return "bg-card border border-border";
    const targetLetters = target.split("");
    const rowLetters = row.split("");
    const counts: Record<string, number> = {};
    targetLetters.forEach((l) => (counts[l] = (counts[l] || 0) + 1));

    const result: Array<"correct" | "present" | "absent"> =
      Array(5).fill("absent");
    // First pass: correct letters
    for (let i = 0; i < 5; i++) {
      if (rowLetters[i] === targetLetters[i]) {
        result[i] = "correct";
        counts[rowLetters[i]]--;
      }
    }
    // Second pass: present letters
    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;
      if (counts[rowLetters[i]] > 0) {
        result[i] = "present";
        counts[rowLetters[i]]--;
      }
    }
    if (result[index] === "correct")
      return "bg-success text-success-foreground";
    if (result[index] === "present")
      return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  const getKeyColor = (letter: string) => {
    const state = letterStates[letter];
    if (state === "correct") return "bg-success text-success-foreground";
    if (state === "present") return "bg-warning text-warning-foreground";
    if (state === "absent") return "bg-foreground/30 text-muted-foreground";
    return "bg-muted text-card-foreground";
  };

  const rows = [...guesses];
  while (rows.length < MAX_GUESSES) rows.push("");

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-card-foreground font-bold">
        Decode the corporate buzzword!
      </p>
      {error && (
        <p className="text-xs text-destructive font-bold animate-pulse">
          {error}
        </p>
      )}

      {/* Word rows */}
      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {[0, 1, 2, 3, 4].map((ci) => {
              const isCurrentRow = ri === guesses.length && !done;
              const letter = isCurrentRow ? current[ci] || "" : row[ci] || "";
              const colorClass = isCurrentRow
                ? "bg-card border border-border"
                : getColor(letter, ci, row);
              return (
                <div
                  key={ci}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-bold border ${colorClass}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* On-screen keyboard */}
      {!done && (
        <div className="flex flex-col items-center gap-0.5 mt-1">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-0.5">
              {row.map((key) => (
                <button
                  key={key}
                  className={`${key.length > 1 ? "px-2" : "w-7"} h-8 text-[10px] font-bold rounded-sm cursor-pointer border border-border ${getKeyColor(key)}`}
                  onClick={() => handleKey(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Show target if failed */}
      {done && guesses[guesses.length - 1] !== target && (
        <p className="text-xs text-destructive font-bold">
          The word was: {target}
        </p>
      )}
    </div>
  );
};
