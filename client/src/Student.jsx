import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import PollResults from './PollResults';

export default function Student() {
  /* 1?—?get / save name just for this browser tab */
  const [name, setName] = useState(() => sessionStorage.getItem('studentName') || '');
  const [tempName, setTempName] = useState('');

  /* 2?—?live poll data from server */
  const [poll, setPoll]      = useState(null);
  const [answer, setAnswer]  = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  /* listen for state_update events once */
  useEffect(() => {
    socket.on('state_update', setPoll);
    return () => socket.off('state_update');
  }, []);

  /* simple 1-sec countdown */
  useEffect(() => {
    let id;
    if (poll && poll.active) {
      const tick = () =>
        setTimeLeft(Math.max(0, Math.floor((poll.endsAt - Date.now()) / 1000)));
      tick();
      id = setInterval(tick, 1000);
    }
    return () => clearInterval(id);
  }, [poll]);

  /* ------------------------------------------------ */
  /*  screen 1: ask for name                          */
  if (!name) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h3>Enter your name</h3>
        <input value={tempName} onChange={e => setTempName(e.target.value)} />
        <button
          onClick={() => {
            sessionStorage.setItem('studentName', tempName);
            setName(tempName);
          }}
          disabled={!tempName.trim()}
        >
          Continue
        </button>
      </div>
    );
  }

  /* screen 2: waiting for a poll */
  if (!poll || !poll.active) {
    return <h3>Waiting for teacher to start a poll…</h3>;
  }

  /* screen 3: already answered OR time up => results */
  if (answer !== null || timeLeft === 0) {
    return (
      <>
        <h3>Live results</h3>
        <PollResults poll={poll} />
      </>
    );
  }

  /* screen 4: answer form with countdown */
  return (
    <div>
      <h3>{poll.question}</h3>
      {poll.options.map((o, idx) => (
        <div key={idx}>
          <label>
            <input
              type='radio'
              name='opt'
              value={idx}
              checked={answer === idx}
              onChange={() => setAnswer(idx)}
            />
            {o.text}
          </label>
        </div>
      ))}

      <button
        onClick={() => {
          socket.emit('student:answer', answer);
        }}
        disabled={answer === null}
      >
        Submit
      </button>

      <p>Time left: {timeLeft}s</p>
    </div>
  );
}
