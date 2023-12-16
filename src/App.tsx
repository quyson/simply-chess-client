import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ChessRoom from "./components/chessRoom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/chessRoom" element={<ChessRoom />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
