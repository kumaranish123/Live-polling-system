import { useState } from 'react';
import RolePicker from './RolePicker';
import Teacher from './Teacher';
import Student from './Student';

function App() {
  const [role, setRole] = useState(null);

  if (!role) return <RolePicker setRole={setRole} />;
  if (role === 'teacher') return <Teacher />;
  return <Student />;
}

export default App;
