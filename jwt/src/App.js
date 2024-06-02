import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import Protected from './components/Protected';
import Tictactoe from './components/tictactoe/Tictactoe';
import Weatherapi from './components/weatherapi/Weatherapi';
import Todo from './components/todolist/Todo';
import Calculator from './components/calculator/Calculator';

const token = localStorage.getItem('token');
const PrivateRoute = ({ element, ...rest }) => {
  

  // Проверка наличия токена при загрузке страницы
  useEffect(() => {
    if (!token) {
      // Если токена нет, перенаправляем на страницу входа
      window.location.href = '/signin';
    }
  }, [token]);

  // Если токен отсутствует или недействителен, перенаправляем на страницу входа
  if (!token) {
    return <Navigate to="/signin" />;
  }

  return <Route {...rest} element={element} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn></SignIn>} />
        <Route path="/signup" element={<SignUp></SignUp>} />
        <Route path="/reset-password" element={<ResetPassword></ResetPassword>} />
        <Route path="/home" element={<Protected token={token}><Home /></Protected>} />
        <Route path="/" element={<SignIn></SignIn>} />
        <Route path="/tictactoe" element={<Protected token={token}><Tictactoe /></Protected>} />
        <Route path="/weatherapi" element={<Protected token={token}><Weatherapi /></Protected>} />
        <Route path="/todolist" element={<Protected token={token}><Todo /></Protected>} />
        <Route path="/calculator" element={<Protected token={token}><Calculator /></Protected>} />
      </Routes>
    </Router>
  );
};

export default App;