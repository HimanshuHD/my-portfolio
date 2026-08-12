import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './rubiks.css';
import RubiksCube3D from './RubiksCube3D';
import { createSolvedCube } from './CubeState';
import { applyMove } from './CubeMoves';
import { createScramble, expandAnimationMoves, scrambleToString } from './Scramble';
import { isSolved } from './SolvedState';

const MOVE_BUTTONS = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2'];
const ROTATION_DURATION = 350;
const STATE_COMMIT_DELAY = 32;

export default function RubiksGame({ onClose }) {
  const [cube, setCube] = useState(createSolvedCube);
  const [moves, setMoves] = useState(0);
  const [scramble, setScramble] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [activeMove, setActiveMove] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [moveDuration, setMoveDuration] = useState(ROTATION_DURATION);
  const cubeRef = useRef(cube);
  const animationIdRef = useRef(0);
  const queueRef = useRef([]);
  const transitionFrameRef = useRef(null);
  const commitTimerRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      animationIdRef.current += 1;
      queueRef.current = [];
      if (transitionFrameRef.current) window.cancelAnimationFrame(transitionFrameRef.current);
      if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  useEffect(() => {
    if (!startedAt || isSolved(cube)) return undefined;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 250);
    return () => window.clearInterval(timer);
  }, [startedAt, cube]);

  useEffect(() => {
    if (!pendingMove || activeMove) return undefined;

    const pendingId = pendingMove.id;
    if (transitionFrameRef.current) window.cancelAnimationFrame(transitionFrameRef.current);
    if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);

    transitionFrameRef.current = window.requestAnimationFrame(() => {
      transitionFrameRef.current = null;
      commitTimerRef.current = window.setTimeout(() => {
        commitTimerRef.current = null;
        setPendingMove((pending) => {
          if (!pending || pending.id !== pendingId) return pending;
          const nextId = animationIdRef.current + 1;
          animationIdRef.current = nextId;
          setActiveMove({ move: pending.move, id: nextId, countMoves: pending.countMoves });
          return null;
        });
      }, STATE_COMMIT_DELAY);
    });

    return () => {
      if (transitionFrameRef.current) {
        window.cancelAnimationFrame(transitionFrameRef.current);
        transitionFrameRef.current = null;
      }
      if (commitTimerRef.current) {
        window.clearTimeout(commitTimerRef.current);
        commitTimerRef.current = null;
      }
    };
  }, [cube, pendingMove, activeMove]);

  const startSequence = (sequence, baseCube, duration = ROTATION_DURATION, countMoves = false) => {
    if (!sequence.length || activeMove || pendingMove) return false;

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
    setActiveMove(null);

    if (next) {
      const nextId = animationIdRef.current + 1;
      animationIdRef.current = nextId;
      setPendingMove({ ...next, id: nextId });
    }
  };

  const scrambleCube = () => {
    if (activeMove || pendingMove) return;

    const sequence = createScramble();
    const animationSequence = expandAnimationMoves(sequence);
    const solvedCube = createSolvedCube();

    animationIdRef.current += 1;
    queueRef.current = [];
    cubeRef.current = solvedCube;
    if (transitionFrameRef.current) window.cancelAnimationFrame(transitionFrameRef.current);
    if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);

    setPendingMove(null);
    setActiveMove(null);
    setCube(solvedCube);
    setScramble(sequence);
    setMoves(0);
    setElapsed(0);
    setStartedAt(Date.now());

    startSequence(animationSequence, solvedCube, ROTATION_DURATION, false);
  };

  const resetCube = () => {
    animationIdRef.current += 1;
    queueRef.current = [];
    if (transitionFrameRef.current) window.cancelAnimationFrame(transitionFrameRef.current);
    if (commitTimerRef.current) window.clearTimeout(commitTimerRef.current);
    const solvedCube = createSolvedCube();
    cubeRef.current = solvedCube;
    setPendingMove(null);
    setActiveMove(null);
    setCube(solvedCube);
    setScramble([]);
    setMoves(0);
    setElapsed(0);
    setStartedAt(null);
  };

  const handleMove = (move) => {
    if (activeMove || pendingMove || (isSolved(cube) && !startedAt)) return;
    const animationSequence = expandAnimationMoves([move]);
    const started = startSequence(animationSequence, cubeRef.current, ROTATION_DURATION, true);
    if (started && !startedAt) setStartedAt(Date.now());
  };

  const solved = isSolved(cube) && scramble.length > 0;
  const isAnimating = Boolean(activeMove || pendingMove);
  const status = solved ? 'Solved ✓' : isAnimating ? 'Animating…' : 'In progress';

  const modal = <div className="rubiks-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="rubiks-game-modal" role="dialog" aria-modal="true" aria-labelledby="rubiks-game-title">
      <button className="rubiks-close" type="button" onClick={onClose} aria-label="Close Rubik's Cube game">×</button>
      <div className="rubiks-game-header"><div><span className="rubiks-kicker">INTERACTIVE MINI GAME</span><h2 id="rubiks-game-title">Solve the Rubik's Cube</h2><p>Scramble it, rotate the faces, and solve it in as few moves as possible.</p></div><div className="rubiks-status">{status}</div></div>
      <div className="rubiks-game-layout"><RubiksCube3D cube={cube} activeMove={activeMove} moveDuration={moveDuration} onAnimationComplete={finishAnimation} /><aside className="rubiks-controls"><div className="rubiks-stats"><div><strong>{moves}</strong><span>Moves</span></div><div><strong>{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</strong><span>Time</span></div></div><div className="rubiks-actions"><button type="button" className="button primary" onClick={scrambleCube} disabled={isAnimating}>Scramble</button><button type="button" className="button ghost" onClick={resetCube}>Reset</button></div><div className="rubiks-moves"><span>Face turns</span><div>{MOVE_BUTTONS.map((move) => <button key={move} type="button" onClick={() => handleMove(move)} disabled={isAnimating}>{move}</button>)}</div></div>{scramble.length > 0 && <div className="rubiks-scramble"><span>Scramble</span><p>{scrambleToString(scramble)}</p></div>}</aside></div>
    </section>
  </div>;

  return createPortal(modal, document.body);
}
