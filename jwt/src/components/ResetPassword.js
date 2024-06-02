import React, { useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import AuthService from '../services/api';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [secretResponse, setSecretResponse] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const history = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await AuthService.resetPassword({ username, email, secretResponse, password: newPassword });
      setMessage('Password reset successfully!');
      history('/signin');
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      <p>{message}</p>
    </div>
  );
};

export default ResetPassword;