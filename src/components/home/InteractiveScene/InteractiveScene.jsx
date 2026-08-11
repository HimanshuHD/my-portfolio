import LegacyInteractiveScene from '../InteractiveScene';
import RubiksCube from './RubiksCube';

export default function InteractiveScene({ onCubeClick }) {
  return <div className="interactive-scene-modular">
    <LegacyInteractiveScene />
    <button className="rubiks-scene-hit-target" type="button" aria-label="Open Rubik's Cube game" onClick={onCubeClick}>
      <RubiksCubePreview />
    </button>
  </div>;
}

function RubiksCubePreview() {
  return <span className="rubiks-scene-hit-cube" aria-hidden="true" />;
}

export { RubiksCube };
