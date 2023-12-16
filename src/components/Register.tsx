import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

const Register = () => {
  type ErrorData = {
    message: string;
  };

  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [error, setError] = useState<ErrorData | null>(null);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!passwordMatch()) {
      return;
    }
    e.preventDefault();
    const response = await axios.post("http://localhost:8000/register", {
      username: username,
      password: password,
    });
    if (response.data) {
      navigate("/");
    }
  };

  const passwordMatch = () => {
    if (password != confirmPassword) {
      handleError({
        message: "Passwords do not match!",
      });
      return false;
    }
    return true;
  };

  const handleError = (message: ErrorData) => {
    setError(message);
  };

  return (
    <div>
      <form>
        <label>Username</label>
        <input
          id="username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <div>
          {error ? <div>{error.message}</div> : null}
          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <label>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <button onClick={handleSubmit}>Register</button>
      </form>
    </div>
  );
};

export default Register;
