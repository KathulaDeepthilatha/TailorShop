import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [successMessage, ] = useState("");

  const handlePinChange = (value, index) => {
    // Only allow numbers
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Move to next input if a digit was entered and there is a next input
      if (value && index < pin.length - 1) {
        const nextInput = document.querySelectorAll('.pin-box')[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // Move to previous input if current input is empty
      const prevInput = document.querySelectorAll('.pin-box')[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };



  const handleLogin = async () => {
    setError(""); // Reset any previous errors
  
    // Validate phone number before login
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
  
    // Validate PIN - check if all digits are filled
    if (pin.some(digit => digit === "")) {
      setError("Please enter all 6 digits of your PIN");
      return;
    }
  
    try {
      const response = await axios.post("https://tailorlog.onrender.com/api/users/login", {
        phone: phoneNumber,
        pin: pin.join(""),
      });
  
      if (response.data.message === 'Login successful') {
        console.log("Login successful! Navigating to home page...");
        onLogin(); // This will trigger the state update in App.js
        navigate('/'); // Now navigate to home page after state change
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
      console.error("Error logging in:", error);
    }
  };
  
  
  

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        maxLength="10"
        onChange={(e) => {
          // Only allow numbers and maximum 10 digits
          const value = e.target.value;
          if (/^\d*$/.test(value) && value.length <= 10) {
            setPhoneNumber(value);
          }
        }}
      />
           
      <div className="pin-input">
        {pin.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handlePinChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={(e) => e.target.select()}
            className="pin-box"
          />
        ))}
  
      </div>
      <button onClick={handleLogin}>Login</button>
      <div>Try with Guest PIN: 123456 </div>
  
    </div>
  );
};

export default LoginPage;
