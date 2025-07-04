export default function PollResults({ poll }) {
  if (!poll) return null;
  const total = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1;

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>{poll.question}</h3>
      {poll.options.map((o, i) => {
        const pct = Math.round((o.votes * 100) / total);
        return (
          <div key={i} style={{ marginBottom: 6 }}>
            <div>
              {o.text} – {pct}%
            </div>
            <div
              style={{
                height: 8,
                background: '#ddd',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: pct + '%',
                  background: '#4caf50',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
