import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './rubiks.css';
import RubiksCube3D from './RubiksCube3D';
import { createSolvedCube } from './CubeState';
import { applyMove } from './CubeMoves';
import { createScramble, expandAnimationMoves, scrambleToString } from './Scramble';
import { isSolved } from './SolvedState';

const MOVE_BUTTONS = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2'];
const ROTATION_DURATION = 480;

// Temporarily disabled while investigating animation timing.
// Keep these values/code documented here so the transaction-style timing can be restored later.
// const STATE_COMMIT_DELAY = 20;

export default function RubiksGame({ onClose }) {
  const [cube, setCube] = useState(createSolvedCube);
  const [moves, setMoves] = useState(0);
  const [scramble, setScramble] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [activeMove, setActiveMove] = useState(null);
  // Temporarily disabled with the state-commit delay investigation.
  // const [pendingMove, setPendingMove] = useState(null);
  const [moveDuration, setMoveDuration] = useState(ROTATION_DURATION);
  const cubeRef = useRef(cube);
  const animationIdRef = useRef(0);
  const queueRef = useRef([]);
  // Temporarily disabled with the state-commit delay investigation.
  // const transitionFrameRef = useRef(null);
  // const commitTimerRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      animationIdRef.current += 1;
      queueRef.current = [];
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  // Keep the timer interval tied only to the start time. Re-running this effect on every
  // cube-state change was resetting the 250ms interval before it could tick, which made
  // the displayed timer appear to jump after moves.
  useEffect(() => {
    if (!startedAt || isSolved(cube)) return undefined;

    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);

    return () => window.clearInterval(timer);
  }, [startedAt, isSolved(cube)]);

  // Temporarily disabled. This was the requestAnimationFrame + state-commit-delay
  // experiment that introduced an intentional settling period between moves.
  // It is kept here for reference and can be restored when we revisit the timing issue.
  // useEffect(() => {
  //   if (!pendingMove || activeMove) return undefined;
  //   const pendingId = pendingMove.id;
  //   transitionFrameRef.current = window.requestAnimationFrame(() => {
  //     transitionFrameRef.current = null;
  //     commitTimerRef.current = window.setTimeout(() => {
  //       commitTimerRef.current = null;
  //       setPendingMove((pending) => {
  //         if (!pending || pending.id !== pendingId) return pending;
  //         const nextId = animationIdRef.current + 1;
  //         animationIdRef.current = nextId;
  //         setActiveMove({ move: pending.move, id: nextId, countMoves: pending.countMoves });
  //         return null;
  //       });
  //     }, STATE_COMMIT_DELAY);
  //   });
  //   return () => {
  //     if (transitionFrameRef.current) window.cancelAnimationFrame(transitionFrameRef.current);
  //     if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
  //   };
  // }, [cube, pendingMove, activeMove]);

  const startSequence = (sequence, baseCube, duration = ROTATION_DURATION, countMoves = false) => {
    if (!sequence.length || activeMove) return false;

    const sequenceId = animationIdRef.current + 1;
    animationIdRef.current = sequenceId;
    cubeRef.current = baseCube;
    queueRef.current = sequence.slice(1).map((move) => ({ move, countMoves }));
    setMoveDuration(duration);
    setActiveMove({ move: sequence[0], id: sequenceId, countMoves });
    return true;
  };

  const finishAnimation = (animationId) => {
    if (!activeMove || animationId !== activeMove.id) return;

    const nextCube = applyMove(cubeRef.current, activeMove.move);
    cubeRef.current = nextCube;
    setCube(nextCube);
    if (activeMove.countMoves) setMoves((count) => count + 1);

    const next = queueRef.current.shift();
    if (next) {
      const nextId = animationIdRef.current + 1;
      animationIdRef.current = nextId;
      setActiveMove({ move: next.move, id: nextId, countMoves: next.countMoves });
    } else {
      setActiveMove(null);
    }
  };

  const scrambleCube = () => {
    if (activeMove) return;

    const sequence = createScramble();
    const animationSequence = expandAnimationMoves(sequence);
    const solvedCube = createSolvedCube();

    animationIdRef.current += 1;
    queueRef.current = [];
    cubeRef.current = solvedCube;
    setActiveMove(null);
    setCube(solvedCube);
    setScramble(sequence);
    setMoves(0);
    setElapsed(0);
    setStartedAt(null);

    startSequence(animationSequence, solvedCube, ROTATION_DURATION, false);
  };

  const resetCube = () => {
    animationIdRef.current += 1;
    queueRef.current = [];
    const solvedCube = createSolvedCube();
    cubeRef.current = solvedCube;
    setActiveMove(null);
    setCube(solvedCube);
    setScramble([]);
    setMoves(0);
    setElapsed(0);
    setStartedAt(null);
  };

  const handleMove = (move) => {
    if (activeMove || (isSolved(cube) && !startedAt)) return;
    const animationSequence = expandAnimationMoves([move]);
    const started = startSequence(animationSequence, cubeRef.current, ROTATION_DURATION, true);
    if (started && !startedAt) setStartedAt(Date.now());
  };

  const solved = isSolved(cube) && scramble.length > 0;
  const isAnimating = Boolean(activeMove);
  const status = solved ? 'Solved ✓' : isAnimating ? 'Animating…' : 'In progress';

  const modal = <div className="rubiks-modal-backdrop" role="presentation">
    <section className="rubiks-game-modal" role="dialog" aria-modal="true" aria-labelledby="rubiks-game-title">
      <button className="rubiks-close" type="button" onClick={onClose} aria-label="Close Rubik's Cube game">×</button>
      <div className="rubiks-game-header"><div><span className="rubiks-kicker">INTERACTIVE MINI GAME</span><h2 id="rubiks-game-title">Solve the Rubik's Cube</h2><p>Scramble it, rotate the faces, and solve it in as few moves as possible.</p></div><div className="rubiks-status">{status}</div></div>
      <div className="rubiks-game-layout"><div className="rubiks-cube-stage"><RubiksCube3D cube={cube} activeMove={activeMove} moveDuration={moveDuration} onAnimationComplete={finishAnimation} />{solved && <div className="rubiks-solved-celebration" aria-live="polite"><span className="celebration-particle particle-1" /><span className="celebration-particle particle-2" /><span className="celebration-particle particle-3" /><span className="celebration-particle particle-4" /><span className="celebration-particle particle-5" /><span className="celebration-particle particle-6" /><div className="rubiks-solved-badge">SOLVED! ✦</div></div>}</div><aside className="rubiks-controls"><div className="rubiks-stats"><div><strong>{moves}</strong><span>Moves</span></div><div><strong>{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</strong><span>Time</span></div></div><div className="rubiks-actions"><button type="button" className="button primary" onClick={scrambleCube} disabled={isAnimating}>Scramble</button><button type="button" className="button ghost" onClick={resetCube}>Reset</button></div><div className="rubiks-moves"><span>Face turns</span><div>{MOVE_BUTTONS.map((move) => <button key={move} type="button" onClick={() => handleMove(move)} disabled={isAnimating}>{move}</button>)}</div></div>{scramble.length > 0 && <div className="rubiks-scramble"><span>Scramble</span><p>{scrambleToString(scramble)}</p></div>}</aside></div>
    </section>
  </div>;

  return createPortal(modal, document.body);
}
