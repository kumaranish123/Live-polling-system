import React from 'react';

export default function RolePicker({ setRole }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>Choose your role</h2>
      <button onClick={() => setRole('teacher')}>I am Teacher</button>
      <button onClick={() => setRole('student')} style={{ marginLeft: 10 }}>
        I am Student
      </button>
    </div>
  );
}
