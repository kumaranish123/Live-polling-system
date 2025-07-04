import React, { useState } from 'react';
import { socket } from './socket';
import PollResults from './PollResults';

export default function Teacher() {
  const [question, setQuestion] = useState('');
  const [optTexts, setOptTexts] = useState(['', '', '', '']);
  const [pollState, setPollState] = useState(null);

  // listen once for server updates
  React.useEffect(() => {
    socket.on('state_update', setPollState);
    return () => socket.off('state_update');
  }, []);

  const startPoll = () => {
    socket.emit('teacher:create_poll', {
      question,
      options: optTexts,
    });
    setQuestion('');
    setOptTexts(['', '', '', '']);
  };

  // if a poll is running, just show results
  if (pollState && pollState.active) {
    return (
      <>
        <h2>Live results</h2>
        <PollResults poll={pollState} />
        <p>Poll closes at: {new Date(pollState.endsAt).toLocaleTimeString()}</p>
      </>
    );
  }

  return (
    <div>
      <h2>Create a new poll</h2>
      <div>
        <label>Question:&nbsp;</label>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{ width: '60%' }}
        />
      </div>
      {optTexts.map((txt, idx) => (
        <div key={idx}>
          <label>Option {idx + 1}:&nbsp;</label>
          <input
            value={txt}
            onChange={e =>
              setOptTexts(o => {
                const copy = [...o];
                copy[idx] = e.target.value;
                return copy;
              })
            }
          />
        </div>
      ))}
      <button onClick={startPoll} disabled={!question.trim()}>
        Start poll
      </button>
    </div>
  );
}
