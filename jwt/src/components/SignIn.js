import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/api';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const history = useNavigate(); // Используем useHistory вместо useNavigate

  const handleSignIn = async () => {
    try {
      const response = await AuthService.signin({ username, password });
      // Сохраняем токен в LocalStorage
      localStorage.setItem('token', response.data.token);
      setMessage('Signed in!');
      // Переходим на домашнюю страницу
      window.location.href = '/home';
    } catch (error) {
      setMessage('Error signing in');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
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
      <button onClick={handleSignIn}>Sign In</button>
      <p>{message}</p>
    </div>
  );
};

export default SignIn;