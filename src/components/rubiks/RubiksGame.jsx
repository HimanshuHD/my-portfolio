import { useEffect, useState } from 'react';
import './rubiks.css';
import RubiksCube3D from './RubiksCube3D';
import { createSolvedCube } from './CubeState';
import { applyMove, applyMoves } from './CubeMoves';
import { createScramble, scrambleToString } from './Scramble';
import { isSolved } from './SolvedState';

const MOVE_BUTTONS = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2'];

export default function RubiksGame({ onClose }) {
  const [cube, setCube] = useState(createSolvedCube);
  const [moves, setMoves] = useState(0);
  const [scramble, setScramble] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt || isSolved(cube)) return undefined;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 250);
    return () => window.clearInterval(timer);
  }, [startedAt, cube]);

  const scrambleCube = () => { const sequence = createScramble(20); setCube(applyMoves(createSolvedCube(), sequence)); setScramble(sequence); setMoves(0); setElapsed(0); setStartedAt(Date.now()); };
  const resetCube = () => { setCube(createSolvedCube()); setScramble([]); setMoves(0); setElapsed(0); setStartedAt(null); };
  const handleMove = (move) => { if (isSolved(cube) && !startedAt) return; setCube((current) => applyMove(current, move)); setMoves((count) => count + 1); if (!startedAt) setStartedAt(Date.now()); };
  const solved = isSolved(cube) && scramble.length > 0;

  return <div className="rubiks-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="rubiks-game-modal" role="dialog" aria-modal="true" aria-labelledby="rubiks-game-title">
      <button className="rubiks-close" type="button" onClick={onClose} aria-label="Close Rubik's Cube game">×</button>
      <div className="rubiks-game-header"><div><span className="rubiks-kicker">INTERACTIVE MINI GAME</span><h2 id="rubiks-game-title">Solve the Rubik's Cube</h2><p>Scramble it, rotate the faces, and solve it in as few moves as possible.</p></div><div className="rubiks-status">{solved ? 'Solved ✓' : 'In progress'}</div></div>
      <div className="rubiks-game-layout"><RubiksCube3D cube={cube} /><aside className="rubiks-controls"><div className="rubiks-stats"><div><strong>{moves}</strong><span>Moves</span></div><div><strong>{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</strong><span>Time</span></div></div><div className="rubiks-actions"><button type="button" className="button primary" onClick={scrambleCube}>Scramble</button><button type="button" className="button ghost" onClick={resetCube}>Reset</button></div><div className="rubiks-moves"><span>Face turns</span><div>{MOVE_BUTTONS.map((move) => <button key={move} type="button" onClick={() => handleMove(move)}>{move}</button>)}</div></div>{scramble.length > 0 && <div className="rubiks-scramble"><span>Scramble</span><p>{scrambleToString(scramble)}</p></div>}</aside></div>
    </section>
  </div>;
}
