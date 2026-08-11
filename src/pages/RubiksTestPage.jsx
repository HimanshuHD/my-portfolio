import { useMemo, useState } from 'react';
import { applyMove, applyMoves, inverseMoves } from '../components/rubiks/CubeMoves';
import { createSolvedCube, getFacelets, serializeCube } from '../components/rubiks/CubeState';
import { createScramble } from '../components/rubiks/Scramble';
import { isSolved } from '../components/rubiks/SolvedState';
import './RubiksTestPage.css';

const CASES = [
  { id: 'initial', name: 'Solved cube starts solved', run: () => isSolved(createSolvedCube()) },
  { id: 'inverse', name: "R + R' returns solved", run: () => isSolved(applyMoves(createSolvedCube(), ['R', "R'"])) },
  { id: 'four-r', name: 'R × 4 returns solved', run: () => isSolved(applyMoves(createSolvedCube(), ['R', 'R', 'R', 'R'])) },
  { id: 'four-u', name: 'U × 4 returns solved', run: () => isSolved(applyMoves(createSolvedCube(), ['U', 'U', 'U', 'U'])) },
  { id: 'four-f', name: 'F × 4 returns solved', run: () => isSolved(applyMoves(createSolvedCube(), ['F', 'F', 'F', 'F'])) },
  { id: 'double', name: 'R2 equals R + R', run: () => serializeCube(applyMove(createSolvedCube(), 'R2')) === serializeCube(applyMoves(createSolvedCube(), ['R', 'R'])) },
  { id: 'sequence', name: 'Sequence + inverse returns solved', run: () => { const sequence = ['R', 'U', "R'", 'F2', 'D', "L'", 'B2']; return isSolved(applyMoves(createSolvedCube(), [...sequence, ...inverseMoves(sequence)])); } },
  { id: 'scramble', name: 'Generated scramble is valid', run: () => { const sequence = createScramble(20); return sequence.length === 20 && sequence.every((move) => /^[URFDLB](2|'|)?$/.test(move)); } },
];

const COLORS = { U: '#f4f0d7', R: '#e12d2d', F: '#198b49', D: '#f0d329', L: '#ef7822', B: '#1769aa' };

export default function RubiksTestPage() {
  const [results, setResults] = useState(null);
  const [cube, setCube] = useState(createSolvedCube);
  const [sequence, setSequence] = useState([]);
  const facelets = useMemo(() => getFacelets(cube), [cube]);

  const runTests = () => setResults(CASES.map((test) => { try { return { ...test, passed: Boolean(test.run()), error: null }; } catch (error) { return { ...test, passed: false, error: error.message }; } }));
  const scramble = () => { const moves = createScramble(20); setCube(applyMoves(createSolvedCube(), moves)); setSequence(moves); };
  const reset = () => { setCube(createSolvedCube()); setSequence([]); };
  const applySequence = () => { const moves = ['R', 'U', "R'", 'F2', 'D']; setCube((current) => applyMoves(current, moves)); setSequence(moves); };
  const passed = results?.filter((result) => result.passed).length ?? 0;

  return <main className="rubiks-test-page"><div className="rubiks-test-shell">
    <header><span className="rubiks-test-kicker">DEVELOPER TEST PANEL</span><h1>Rubik's Cube Engine</h1><p>Run the same cube-engine checks used by the feature without opening a terminal.</p></header>
    <section className="rubiks-test-toolbar"><button className="button primary" onClick={runTests}>Run all tests</button><button className="button ghost" onClick={scramble}>Scramble state</button><button className="button ghost" onClick={applySequence}>Apply sample moves</button><button className="button ghost" onClick={reset}>Reset</button>{results && <strong>{passed}/{results.length} passed</strong>}</section>
    <div className="rubiks-test-grid">
      <section className="rubiks-test-card"><h2>Engine checks</h2>{results ? <div className="rubiks-test-list">{results.map((result) => <div className={`rubiks-test-row ${result.passed ? 'pass' : 'fail'}`} key={result.id}><span>{result.passed ? '✓' : '✕'}</span><div><strong>{result.name}</strong>{result.error && <small>{result.error}</small>}</div></div>)}</div> : <p className="rubiks-empty">Click <strong>Run all tests</strong> to execute the checks in your browser.</p>}</section>
      <section className="rubiks-test-card"><h2>Current cube state</h2><div className="rubiks-face-grid">{Object.entries(facelets).map(([face, stickers]) => <div className="rubiks-face" key={face}><strong>{face}</strong><div className="rubiks-facelets">{stickers.map((color, index) => <span key={`${face}-${index}`} style={{ background: COLORS[color] }} />)}</div></div>)}</div><p className="rubiks-sequence"><strong>Last action:</strong> {sequence.length ? sequence.join(' ') : 'Reset / solved state'}</p><code>{serializeCube(cube)}</code><p className="rubiks-validity">{isSolved(cube) ? '✓ Cube is solved' : '• Cube is scrambled / in progress'}</p></section>
    </div>
  </div></main>;
}
