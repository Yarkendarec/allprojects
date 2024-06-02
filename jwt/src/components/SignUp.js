import React, { useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import AuthService from '../services/api';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [secretResponse, setSecretResponse] = useState('');
  const [message, setMessage] = useState('');
  const history = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await AuthService.signup({ username, password, email, secretResponse });
      setMessage('User registered successfully!');
      history('/signin');
    } catch (error) {
      setMessage('Error signing up');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Secret Response"
        value={secretResponse}
        onChange={(e) => setSecretResponse(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>{message}</p>
    </div>
  );
};

export default SignUp;