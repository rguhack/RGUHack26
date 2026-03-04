import React, { useState, useCallback, useEffect, useRef } from "react";
import { useGameState, GameStage } from "@/hooks/useGameState";
import { Taskbar } from "@/components/game/Taskbar";
import { DesktopIcons } from "@/components/game/DesktopIcons";
import { DraggableWindow } from "@/components/game/DraggableWindow";
import { BossBaby } from "@/components/game/BossBaby";
import { PingPongGame } from "@/components/game/PingPongGame";
import { WordleGame } from "@/components/game/WordleGame";
import { TetrisGame } from "@/components/game/TetrisGame";
import { PacmanGame } from "@/components/game/PacmanGame";
import { EndScreen } from "@/components/game/EndScreen";
import { IntroScreen } from "@/components/game/IntroScreen";
import { ProcrastinationDesktop } from "@/components/game/ProcrastinationDesktop";
import { FailMeter } from "@/components/game/FailMeter";
import { HowToPlay } from "@/components/game/HowToPlay";
import { PunishmentScreen } from "@/components/game/PunishmentScreen";
import { TeamsNotif } from "@/components/game/TeamsNotif";
import { OutlookMockup } from "@/components/game/OutlookMockup";
import { Video, LayoutList, Mail } from "lucide-react";

const STAGE_DELAY_MS = 10000;
const SECOND_DELAY_MS = 10000;
const STAGE_METER_POINT_CUTOF = 50;
export { STAGE_METER_POINT_CUTOF };

const Index = () => {
  const { state, setStage, moveMeter } = useGameState();
  const [skipTutorials, setSkipTutorials] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showBoss, setShowBoss] = useState(false);
  const [bossMsg, setBossMsg] = useState("");
  const [bossAutoAdvance, setBossAutoAdvance] = useState<number | undefined>(
    undefined,
  );
  const [bossAltButton, setBossAltButton] = useState<
    { label: string; onAlt: () => void } | undefined
  >(undefined);
  const [bossDismissLabel, setBossDismissLabel] = useState<string | undefined>(
    undefined,
  );
  const [nextStageAfterBoss, setNextStageAfterBoss] =
    useState<GameStage | null>(null);
  const [showPunishment, setShowPunishment] = useState<GameStage | null>(null);
  const [stageAfterPunishment, setStageAfterPunishment] =
    useState<GameStage | null>(null);
  const [skipDoneStageDelay, setSkipDoneStageDelay] = useState(false);
  const [loopDone, setLoopDone] = useState(false);
  const [isPunishment, setIsPunishment] = useState(true);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bossOnDismissRef = useRef<(() => void) | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  const isAudioRunning = !["fired", "promoted"].includes(state.stage);

  const tryStartAudio = useCallback(() => {
    const audio = bgAudioRef.current;
    if (!audio || !isAudioRunning) return;

    void audio.play().catch(() => {
    });
  }, [isAudioRunning]);

  useEffect(() => {
    const audio = new Audio("/background.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = volume;
    bgAudioRef.current = audio;

    return () => {
      audio.pause();
      bgAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;

    if (isAudioRunning) {
      tryStartAudio();
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [isAudioRunning, tryStartAudio]);

  useEffect(() => {
    if (!isAudioRunning) return;

    const resumeAudio = () => {
      tryStartAudio();
    };

    window.addEventListener("pointerdown", resumeAudio, { passive: true });
    window.addEventListener("keydown", resumeAudio);

    return () => {
      window.removeEventListener("pointerdown", resumeAudio);
      window.removeEventListener("keydown", resumeAudio);
    };
  }, [isAudioRunning, tryStartAudio]);

  // Delayed stage transition (5s gap)
  const delayedStage = useCallback(
    (stage: GameStage, delayMs = 5000) => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
      delayTimer.current = setTimeout(() => setStage(stage), delayMs);
    },
    [setStage],
  );

  useEffect(() => {
    return () => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
    };
  }, []);

  const triggerBoss = useCallback(
    (
      msg: string,
      nextStage: GameStage,
      autoAdvanceDelay?: number,
      altButton?: { label: string; onAlt: () => void },
      dismissLabel?: string,
    ) => {
      setBossMsg(msg);
      setBossAutoAdvance(autoAdvanceDelay);
      setBossAltButton(altButton);
      setBossDismissLabel(dismissLabel);
      setShowBoss(true);
      setNextStageAfterBoss(nextStage);
    },
    [],
  );

  const triggerBossWithDelay = useCallback(
    (
      msg: string,
      nextStage: GameStage,
      delayMs = STAGE_DELAY_MS,
      altButton?: { label: string; onAlt: () => void },
    ) => {
      const timeout = setTimeout(() => {
        triggerBoss(msg, nextStage, undefined, altButton);
      }, delayMs);

      return () => clearTimeout(timeout);
    },
    [triggerBoss],
  );

  const dismissBoss = useCallback(() => {
    setShowBoss(false);
    setBossAutoAdvance(undefined);
    setBossAltButton(undefined);
    setBossDismissLabel(undefined);
    const cb = bossOnDismissRef.current;
    bossOnDismissRef.current = null;
    if (cb) {
      cb();
      return;
    }
    if (nextStageAfterBoss) {
      setStage(nextStageAfterBoss);
      setNextStageAfterBoss(null);
    }
  }, [nextStageAfterBoss, setStage]);

  const triggerPunishment = useCallback(
    (
      nextStage: GameStage,
      punishmentStage: GameStage,
      isPunishment: boolean = true,
    ) => {
      setShowPunishment(punishmentStage);
      setStageAfterPunishment(nextStage);
      setIsPunishment(isPunishment);
    },
    [],
  );

  const handlePunishmentDone = useCallback(() => {
    setShowPunishment(null);
    if (stageAfterPunishment) {
      setSkipDoneStageDelay(true);
      setStage(stageAfterPunishment);
      setStageAfterPunishment(null);
    }
  }, [stageAfterPunishment, setStage]);

  // ── Handlers ──

  const handleIntroStart = useCallback(() => {
    tryStartAudio();
    setStage("procrastination");
    delayedStage("teams", STAGE_DELAY_MS);
  }, [setStage, delayedStage, tryStartAudio]);

  const handleTeamsClose = useCallback(() => {
    setIsPunishment(true);
    triggerBoss(
      "Ignoring my pings? Fine. If you won't reply, then you'll rebound. Put your paddle where your mouse is and let's see if you can keep up.",
      skipTutorials ? "pingpong" : "pong-howto",
    );
  }, [skipTutorials, triggerBoss]);

  const handleTeamsJoin = useCallback(() => {
    moveMeter(10);
    setIsPunishment(false);
    triggerPunishment("pong-done", "pingpong", false);
  }, [moveMeter, triggerPunishment]);

  const handlePongWin = useCallback(() => {
    moveMeter(-15); // toward FIRED (victory)
    triggerBoss(
      "You WON?! Instead of working?! The meter moves toward FIRED. Now get to the standup!",
      "pong-done",
      undefined,
      undefined,
      "wtv.",
    );
  }, [moveMeter, triggerBoss]);

  const handlePongLose = useCallback(() => {
    moveMeter(25); // toward PROMOTED (loss)
    setIsPunishment(true);
    bossOnDismissRef.current = () => triggerPunishment("pong-done", "pingpong");
    triggerBoss(
      "Damn, you're out of practice! Guess you've been working... Let's see you work on that ",
      "pong-done", // fallback, won't be used
      1500,
    );
  }, [moveMeter, triggerBoss, triggerPunishment]);

  const handleMeterOutcome = useCallback(() => {
    if (state.meterValue <= -STAGE_METER_POINT_CUTOF) {
      setStage("fired");
      return true;
    }

    if (state.meterValue >= STAGE_METER_POINT_CUTOF) {
      setStage("promoted");
      return true;
    }

    return false;
  }, [state.meterValue, setStage]);

  useEffect(() => {
    if (state.stage === "pong-done") {
      if (loopDone && handleMeterOutcome()) {
        return;
      }

      if (skipDoneStageDelay) {
        setSkipDoneStageDelay(false);
      }
      delayedStage("zoom", STAGE_DELAY_MS);
    }
  }, [
    state.stage,
    skipDoneStageDelay,
    delayedStage,
    setStage,
    loopDone,
    handleMeterOutcome,
  ]);

  const handleZoomJoin = useCallback(() => {
    moveMeter(20); // did work = toward promoted
    setIsPunishment(false);
    triggerPunishment("wordle-done", "wordle", false);
  }, [moveMeter, triggerPunishment]);

  const handleZoomDecline = useCallback(() => {
    moveMeter(-15); // declined meeting = toward fired
    setIsPunishment(true);
    triggerBoss(
      "Think you can skip the standup? Decode this corporate jargon!",
      skipTutorials ? "wordle" : "wordle-howto",
    );
  }, [moveMeter, skipTutorials, triggerBoss]);

  const handleWordleComplete = useCallback(
    (guesses: number) => {
      if (guesses <= 6) {
        moveMeter(-15);
        triggerBoss(
          `Decoded in ${guesses} tries?! Bet you cheated using AI... Moving towards FIRED!`,
          "wordle-done",
          undefined,
          undefined,
          "wtv.",
        );
      } else {
        moveMeter(20);
        setIsPunishment(true);
        bossOnDismissRef.current = () =>
          triggerPunishment("wordle-done", "wordle");
        triggerBoss(
          "Can't even decode corporate buzzwords?! Seems like you need to attend the meeting after all...",
          "wordle-done", // fallback, won't be used
          1500,
        );
      }
    },
    [moveMeter, triggerBoss, triggerPunishment],
  );

  useEffect(() => {
    if (state.stage === "wordle-done") {
      if (loopDone && handleMeterOutcome()) {
        return;
      }
      if (skipDoneStageDelay) {
        setSkipDoneStageDelay(false);
      }

      return triggerBossWithDelay(
        "Check your emails! 10 unread messages! You're on prod support!",
        skipTutorials ? "pacman" : "pacman-howto",
        SECOND_DELAY_MS,
        {
          label: "Fine.",
          onAlt: () => {
            setShowBoss(false);
            setBossAltButton(undefined);
            setStage("outlook");
          },
        },
      );
    }
  }, [
    skipTutorials,
    state.stage,
    loopDone,
    handleMeterOutcome,
    triggerBossWithDelay,
    setStage,
  ]);

  useEffect(() => {
    if (state.stage === "outlook") {
      const t = setTimeout(() => setStage("jira"), STAGE_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [state.stage, setStage]);

  const handlePacmanWin = useCallback(() => {
    moveMeter(-25);
    triggerBoss(
      "You are AVOIDING work?! Impressive slacking! Keep it up and you might get FIRED!",
      "pacman-done",
      undefined,
      undefined,
      "wtv.",
    );
  }, [moveMeter, triggerBoss]);

  const handlePacmanLose = useCallback(() => {
    moveMeter(30);
    setIsPunishment(true);
    bossOnDismissRef.current = () => triggerPunishment("pacman-done", "pacman");
    triggerBoss(
      "Eaten by your own coworkers?! Pathetic. That's what happens when you don't clear your inbox. Organisation time!",
      "pacman-done", // fallback, won't be used
      1500,
    );
  }, [moveMeter, triggerBoss, triggerPunishment]);

  useEffect(() => {
    if (state.stage === "pacman-done") {
      if (loopDone && handleMeterOutcome()) {
        return;
      }

      if (skipDoneStageDelay) {
        setSkipDoneStageDelay(false);
      }
      delayedStage("jira", STAGE_DELAY_MS);
    }
  }, [
    state.stage,
    skipDoneStageDelay,
    delayedStage,
    setStage,
    loopDone,
    handleMeterOutcome,
  ]);

  useEffect(() => {
    if (state.stage === "jira") {
      return triggerBossWithDelay(
        "The sprint is on fire! It's all your fault for not working! Survive the backlog of tasks!",
        skipTutorials ? "tetris" : "tetris-howto",
        1000,
      );
    }
  }, [state.stage, skipTutorials, triggerBossWithDelay]);

  const handleTetrisTopReached = useCallback(() => {
    moveMeter(25); // failed work = toward fired
    triggerBoss(
      "Ha got you, better luck next time, pay attention during the Jira Refinement! You can have some points for doing work...",
      "tetris-done",
    );
  }, [moveMeter]);

  const handleTetrisSurvived = useCallback(() => {
    moveMeter(-15); // survived = too productive
    triggerBoss(
      "Wait... NO WORK ASSIGNED TO YOU?! You survived the backlog without lifting a finger?! You absolute DEAD WEIGHT! 😤 I’ll get you next time, Slacker..",
      "tetris-done",
      undefined,
      undefined,
      "wtv.",
    );
  }, [moveMeter, triggerBoss]);

  useEffect(() => {
    if (state.stage === "tetris-done") {
      if (handleMeterOutcome()) {
        return;
      }

      setLoopDone(true);
      delayedStage("procrastination", STAGE_DELAY_MS);
      const t = setTimeout(() => delayedStage("teams", 5000), 100);
      return () => clearTimeout(t);
    }
  }, [state.stage, delayedStage, handleMeterOutcome]);

  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  // ── Rendering ──

  if (state.stage === "intro") {
    return (
      <IntroScreen
        onStart={handleIntroStart}
        skipTutorials={skipTutorials}
        setSkipTutorials={setSkipTutorials}
        volume={volume}
        setVolume={setVolume}
      />
    );
  }

  if (state.stage === "fired") {
    return <EndScreen type="fired" onRestart={handleRestart} />;
  }
  if (state.stage === "promoted") {
    return <EndScreen type="promoted" onRestart={handleRestart} />;
  }

  const isGameActive =
    ["pingpong", "wordle", "pacman", "tetris"].includes(state.stage) ||
    state.stage.endsWith("-howto");

  const shouldHideProcrastinationDesktop =
    Boolean(showPunishment) || isGameActive || state.stage === "outlook";
  const shouldDisableProcrastinationDesktop =
    showBoss || state.stage === "teams" || state.stage === "zoom";

  return (
    <div
      className="w-screen h-screen overflow-hidden relative bg-background"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ position: "fixed", right: 16, top: 16, zIndex: 50 }}>
        <FailMeter value={state.meterValue} />
      </div>
      <DesktopIcons />

      {/* Keep mounted so internal state (e.g., cricket match) does not reset between stages */}
      <ProcrastinationDesktop
        hidden={shouldHideProcrastinationDesktop}
        disabled={shouldDisableProcrastinationDesktop}
      />

      {/* Grey overlay when game is active */}
      {isGameActive && <div className="fixed inset-0 bg-foreground/50 z-30" />}

      {/* Teams Notification */}
      {state.stage === "teams" && (
        <>
          <div className="fixed inset-0 z-40" />
          <div className="teams-notification">
            <TeamsNotif onDismiss={handleTeamsClose} onJoin={handleTeamsJoin} />
          </div>
        </>
      )}

      {/* Pong How-To */}
      {state.stage === "pong-howto" && (
        <DraggableWindow
          title="Work Avoidance.exe"
          width={400}
          closable={false}
        >
          <HowToPlay
            title="Pong"
            instructions={[
              "Use W/S or ↑/↓ to move your paddle (left side)",
              "Score 3 points to win and earn demerit!",
              "Losing means you did work... punishment awaits.",
            ]}
            onStart={() => setStage("pingpong")}
          />
        </DraggableWindow>
      )}

      {/* Ping Pong */}
      {state.stage === "pingpong" && (
        <DraggableWindow
          title="Work Avoidance.exe"
          width={400}
          closable={false}
          icon={
            <img
              src="/pingpongpaddle.jpeg"
              alt="paddle icon"
              className="w-4 h-4 rounded-full object-cover"
            />
          }
        >
          <PingPongGame
            onWin={handlePongWin}
            onLose={handlePongLose}
            playerAvatar="/sword.jpeg"
            botAvatar="/marty.jpeg"
            playerName="Marty Supreme"
          />
        </DraggableWindow>
      )}

      {/* Zoom Invite */}
      {state.stage === "zoom" && (
        <DraggableWindow
          title="Zoom Meeting"
          icon={<Video size={14} />}
          width={380}
          closable={false}
        >
          <div className="flex flex-col items-center gap-3 p-3">
            <Video size={40} className="text-primary" />
            <h3 className="text-sm font-bold text-card-foreground text-center">
              📅 Meeting Invite
            </h3>
            <p className="text-xs text-card-foreground text-center font-bold">
              "Synergy Bandwidth Alignment Standup"
            </p>
            <p className="text-[10px] text-muted-foreground text-center">
              Mandatory • 45 min • No agenda • All hands
            </p>
            <div className="flex gap-2">
              <button className="xp-button text-xs" onClick={handleZoomDecline}>
                ✕ Decline
              </button>
              <button className="xp-button text-xs" onClick={handleZoomJoin}>
                ✓ Join
              </button>
            </div>
          </div>
        </DraggableWindow>
      )}

      {/* Outlook Mockup (Fine path from Zoom) */}
      {state.stage === "outlook" && (
        <DraggableWindow
          title="Outlook - Inbox"
          icon={<Mail size={14} />}
          width={730}
          closable={true}
          onClose={() => setStage("jira")}
          bodyStyle={{ padding: 0 }}
        >
          <OutlookMockup onPlayAgain={() => setStage("jira")} />
        </DraggableWindow>
      )}

      {/* Wordle How-To */}
      {state.stage === "wordle-howto" && (
        <DraggableWindow
          title="Corporate Jargon Decoder"
          width={340}
          closable={false}
        >
          <HowToPlay
            title="Wordle"
            instructions={[
              "Guess the 5-letter corporate buzzword in 4 tries",
              "Green = correct letter & position",
              "Yellow = correct letter, wrong position",
              "Getting it in ≤4 tries = slacking (good!)",
            ]}
            onStart={() => setStage("wordle")}
          />
        </DraggableWindow>
      )}

      {/* Wordle */}
      {state.stage === "wordle" && (
        <DraggableWindow
          title="Corporate Jargon Decoder"
          width={340}
          closable={false}
        >
          <WordleGame onComplete={handleWordleComplete} />
        </DraggableWindow>
      )}

      {/* Pacman How-To */}
      {state.stage === "pacman-howto" && (
        <DraggableWindow
          title="Email Client - Inbox (10)"
          icon={<Mail size={14} />}
          width={340}
          closable={false}
        >
          <HowToPlay
            title="Email Pacman"
            instructions={[
              "Eat all 📧 emails while avoiding coworkers",
              "Arrow keys or WASD to move",
              "Ghosts are PM, HR, and CEO - avoid them!",
              "Clear all emails = slacking success!",
            ]}
            onStart={() => setStage("pacman")}
          />
        </DraggableWindow>
      )}

      {/* Pacman */}
      {state.stage === "pacman" && (
        <DraggableWindow
          title="Outlook Inbox"
          icon={<Mail size={14} />}
          width={510}
          closable={false}
          bodyStyle={{ padding: 0 }}
        >
          <PacmanGame onWin={handlePacmanWin} onLose={handlePacmanLose} />
        </DraggableWindow>
      )}

      {/* Tetris How-To */}
      {state.stage === "tetris-howto" && (
        <DraggableWindow
          title="Jira Backlog Refinement"
          icon={<LayoutList size={14} />}
          width={470}
          closable={false}
        >
          <HowToPlay
            title="Backlog Tetris"
            instructions={[
              "Survive for 30 seconds!",
              "Arrow keys or WASD: ←/A →/D move, ↑/W rotate, ↓/S drop",
              "Surviving = you're actively avoiding work = moving toward FIRED",
              "If you let the tasks pile up... You will be forced to do the work and get some points...",
            ]}
            onStart={() => setStage("tetris")}
          />
        </DraggableWindow>
      )}

      {/* Tetris */}
      {state.stage === "tetris" && (
        <DraggableWindow
          title="Jira Backlog Refinement"
          icon={<LayoutList size={14} />}
          width={470}
          closable={false}
        >
          <TetrisGame
            onTopReached={handleTetrisTopReached}
            onCleared={handleTetrisSurvived}
          />
        </DraggableWindow>
      )}

      {/* Boss Baby Overlay + Popup */}
      {showBoss && (
        <>
          <div className="fixed inset-0 bg-foreground/50 z-40" />
          <BossBaby
            message={bossMsg}
            onDismiss={dismissBoss}
            autoAdvanceDelay={bossAutoAdvance}
            altButton={bossAltButton}
            dismissLabel={bossDismissLabel}
          />
        </>
      )}

      {/* Punishment Screen */}
      {showPunishment && (
        <PunishmentScreen
          onComplete={handlePunishmentDone}
          gameStage={showPunishment}
          isPunishment={isPunishment}
        />
      )}

      <Taskbar
        volume={volume}
        setVolume={setVolume}
      />
    </div>
  );
};

export default Index;
