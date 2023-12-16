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
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [start, setStart] = useState<boolean>(false);

  const handleJoinRoom = (
    e: React.MouseEvent<HTMLButtonElement>,
    roomId: string,
    username: string,
    socket: Socket
  ): void => {
    const idData = {
      gameId: roomId,
      username: username,
    };
    socket.emit("playerJoinGame", idData);
  };

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

    socket.on("start game", (idData) => {
      setOpponentUsername(idData.username);
      socket.emit("send username", roomId, username);
      setStart(true);
    });

    socket.on("give username", (username) => {
      setStart(true);
      setOpponentUsername(username);
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
      {username && opponentUsername ? (
        <div>
          {username} VS {opponentUsername}
        </div>
      ) : null}
      <div>{start ? <ChessBoard /> : null}</div>
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
          <button
            onClick={(e) =>
              handleJoinRoom(e, roomId!, username!, globalSocket!)
            }
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChessRoom;
