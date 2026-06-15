interface Props {
  todoCount: number;
  doneCount: number;
}

export default function Header({ todoCount, doneCount }: Props) {
  return (
    <header className="header">
      <div className="brand">
        <div>
          <h1>TaskGrid</h1>
          <p className="tagline">Stay focused. Ship faster.</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat">
          <span className="stat-num" style={{ color: 'var(--amber)' }}>{todoCount}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num" style={{ color: 'var(--green)' }}>{doneCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>
    </header>
  );
}
