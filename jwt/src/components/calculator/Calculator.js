import React, { useState } from 'react';
import './Calculator.css';

const Display = ({ input, result }) => {
  return (
    <div className="display">
      <div className="input">{input}</div>
      <div className="result">{result}</div>
    </div>
  );
};

const Keypad = ({ onClick }) => {
  const buttons = [
    'C', "<" , '(', ')', 
    '7', '8', '9','/', 
    '4', '5', '6','*',
    '1', '2', '3','-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="keypad">
      {buttons.map((button, index) => (
        <button
          className='button-calc' 
          key={index}
          onClick={() => onClick(button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const errorMessages = [
    'Себя дели на 0',
    'Не дели на 0'
  ];

  const getRandomErrorMessage = () => {
    return errorMessages[Math.floor(Math.random() * errorMessages.length)];
  };

  const handleClick = (value) => {
    const operators = ['/', '*', '-', '+'];
    const lastChar = input.slice(-1);
  
    if (value === '=') {
      try {
        if (input.includes('/0')) {
          setResult(getRandomErrorMessage());
        } else {
          let resultValue = eval(input);
          // Округляем результат до 13 символов
          resultValue = Number(resultValue.toFixed(13));
          setResult(resultValue.toString());
        }
      } catch (e) {
        setResult('');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '<') {
      setInput(input.slice(0, -1));
    } else {
      if (input.length >= 24) {
        return;
      }
      if (value === '.') {
        const parts = input.split(/[\+\-\*\/\(\)]/);
        if (parts[parts.length - 1].includes('.') || isNaN(lastChar)) {
          return;
        }
      } else if (operators.includes(value)) {
        if (operators.includes(lastChar)) {
          setInput(input.slice(0, -1) + value);
          return;
        }
      } else if (value === '(') {
        if (!operators.includes(lastChar) && lastChar !== '') {
          return;
        }
      } else if (value === ')') {
        const openParentheses = (input.match(/\(/g) || []).length;
        const closeParentheses = (input.match(/\)/g) || []).length;
        if (openParentheses <= closeParentheses || operators.includes(lastChar) || lastChar === '(' || lastChar === '') {
          return;
        }
      } else if (!isNaN(value)) {
        if (result.length >= 10) {
          return;
        }
        if (lastChar === ')') {
          return;
        }
      } else if (lastChar === '(' && (value === '*' || value === '+' || value === '/')) {
        return;
      }
      setInput(input + value);
    }
  };

  return (
    <div className="calculator">
      <Display input={input} result={result} />
      <Keypad onClick={handleClick} />
    </div>
  );
};

export default Calculator;