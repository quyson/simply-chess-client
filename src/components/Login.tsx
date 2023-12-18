import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/slices/userSlice";
import React from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  interface Result {
    username: string;
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
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
          dispatch(setCurrentUser(result.data.username));
          navigate("/chessRoom");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(setCurrentUser(null));
    localStorage.setItem("token", "");
  }, []);

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
      <a href="/register">Register</a>
    </div>
  );
};

export default Login;
