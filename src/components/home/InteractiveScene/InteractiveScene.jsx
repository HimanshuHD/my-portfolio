import LegacyInteractiveScene from '../InteractiveScene';

export default function InteractiveScene({ onCubeClick }) {
  return <div className="interactive-scene-modular">
    <LegacyInteractiveScene onCubeClick={onCubeClick} />
  </div>;
}
