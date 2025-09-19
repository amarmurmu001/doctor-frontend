import React, { useState, useEffect, useRef } from 'react';

const Captcha = ({ onValidationChange }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [expectedAnswer, setExpectedAnswer] = useState(null);

  // Use ref to store callback to prevent re-renders
  const onValidationChangeRef = useRef(onValidationChange);

  // Generate a simple math problem
  const generateCaptcha = () => {
    const operations = ['+', '-', '*'];
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer;
    let problem;

    switch (operation) {
      case '+':
        answer = num1 + num2;
        problem = `${num1} + ${num2}`;
        break;
      case '-': {
        // Ensure positive result
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        answer = larger - smaller;
        problem = `${larger} - ${smaller}`;
        break;
      }
      case '*':
        answer = num1 * num2;
        problem = `${num1} × ${num2}`;
        break;
      default:
        answer = num1 + num2;
        problem = `${num1} + ${num2}`;
    }

    setCaptchaText(problem);
    setExpectedAnswer(answer);
    setUserAnswer('');
    setIsValid(false);
  };

  // Update ref when callback changes
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange;
  }, [onValidationChange]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    const valid = userAnswer.trim() && parseInt(userAnswer) === expectedAnswer;
    setIsValid(valid);
    if (onValidationChangeRef.current) {
      onValidationChangeRef.current(valid);
    }
  }, [userAnswer, expectedAnswer]);

  const handleAnswerChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setUserAnswer(value);
  };

  const handleRefresh = () => {
    generateCaptcha();
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-900">
          Verification Code
        </label>
        <button
          type="button"
          onClick={handleRefresh}
          className="text-[#7551B2] hover:text-[#6441a0] text-sm underline"
          title="Refresh CAPTCHA"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-3">
        <div className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 font-mono text-lg font-bold text-gray-800 min-w-[120px] text-center">
          {captchaText} = ?
        </div>
        <div className="text-sm text-gray-600">
          Solve this math problem to verify you're human
        </div>
      </div>

      <div>
        <input
          type="text"
          value={userAnswer}
          onChange={handleAnswerChange}
          placeholder="Enter the answer"
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            userAnswer.trim()
              ? (isValid
                  ? 'border-green-500 focus:ring-green-500 bg-green-50'
                  : 'border-red-500 focus:ring-red-500 bg-red-50')
              : 'border-gray-300 focus:ring-[#7551B2] focus:border-[#7551B2]'
          }`}
          maxLength="3"
        />
        {userAnswer.trim() && (
          <div className={`mt-1 text-xs ${
            isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {isValid ? '✓ Correct!' : '✗ Incorrect answer'}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        This helps us prevent automated spam submissions.
      </div>
    </div>
  );
};

export default Captcha;
