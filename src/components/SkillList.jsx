export default function SkillList({ skills }) {
  return <div className="skill-list">{skills.map((skill, index) => <span key={skill}><b>{String(index + 1).padStart(2, '0')}</b>{skill}</span>)}</div>;
}
