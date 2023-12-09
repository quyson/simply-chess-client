import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:8000/login", {
      username: username,
      password: password,
    });
    localStorage.setItem("token", response.data.token);
    if (response.data.success) {
      //dispatch(setCurrentUser(response.data.username));
      navigate("/chessPage");
    }
  };

  return (
    <div>
      <form>
        <label>Username</label>
        <input id="username" name="username"></input>
        <label>Password</label>
        <input id="password" name="password"></input>
        <button>Log In</button>
      </form>
    </div>
  );
};

export default Login;
