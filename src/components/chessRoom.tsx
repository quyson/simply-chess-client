import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import ChessBoard from "./chessBoard";
import { v4 as uuidv4 } from "uuid";

const ChessRoom = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);

  const handleJoinRoom = (e: React.MouseEvent<HTMLButtonElement>): void => {};

  const handleCreateNewGame = (
    e: React.MouseEvent<HTMLButtonElement>,
    socket: Socket
  ) => {
    e.preventDefault();
    const uuid = uuidv4();
    console.log(uuid);
    socket.emit("createNewGame", uuid);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket: Socket = io("http://localhost:8000", {
      query: { token },
    });
    setGlobalSocket(socket);
    console.log("Connecting to Socket.IO...");
    socket.emit("joinChessRoom");
    socket.on("createNewGame", (gameId, socketId) => {
      console.log("Joined Room");
      setRoomId(gameId);
      setSocketId(socketId);
    });

    return () => {
      socket.disconnect();
      console.log("Socket.IO disconnected.");
    };
  }, []);
  return (
    <div>
      <h1>Chess</h1>
      {roomId ? <div>Room ID{roomId}</div> : null}
      {socketId ? <div>Socket ID{socketId}</div> : null}
      <div>
        <ChessBoard />
      </div>
      <div>
        <button onClick={(e) => handleCreateNewGame(e, globalSocket!)}>
          Create New Game
        </button>
        <form>
          <label htmlFor="joinGame">Join Game</label>
          <input
            id="joinGame"
            name="joinGame"
            placeholder="Room Id"
            onChange={(e) => setJoinRoomId(e.target.value)}
          ></input>
          <button onClick={handleJoinRoom}>Join Game</button>
        </form>
      </div>
    </div>
  );
};

export default ChessRoom;
