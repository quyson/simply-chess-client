import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import React from "react";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  interface Result {
    message: string;
    token: string;
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await axios
      .post("http://localhost:8000/login", {
        username: username,
        password: password,
      })
      .then((result: AxiosResponse<Result>) => {
        localStorage.setItem("token", result.data.token);
        if (result.data.token) {
          navigate("/chessRoom");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
        <label>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={handleSubmit}>Log In</button>
      </form>
    </div>
  );
};

export default Login;
