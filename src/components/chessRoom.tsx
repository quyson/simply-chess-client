import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import ChessBoard from "./chessBoard";
import ChessLogic from "./chessBoard";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/configureStore";

const ChessRoom = () => {
  const navigate = useNavigate();

  type color = "b" | "w";

  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null);
  const [start, setStart] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<color | null>(null);

  const username: string | null = useSelector(
    (state: RootState) => state.user && state.user.currentUser
  );

  const handleJoinRoom = (
    e: React.MouseEvent<HTMLButtonElement>,
    joinRoomId: string,
    username: string,
    socket: Socket
  ): void => {
    e.preventDefault();
    const idData = {
      gameId: joinRoomId,
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

    socket.on("createNewGame", (gameId: string, socketId: string) => {
      console.log("Joined Room");
      setRoomId(gameId);
      setSocketId(socketId);
    });

    socket.on("start game", (idData) => {
      setOpponentUsername(idData.username);
      setPlayerColor("w");
      setStart(true);
      socket.emit("send username", idData.gameId, username);
    });

    socket.on("give username", (username, gameId) => {
      setOpponentUsername(username);
      setRoomId(gameId);
      setPlayerColor("b");
      setStart(true);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      navigate("/");
    });

    return () => {
      socket.disconnect();
      console.log("Socket.IO disconnected.");
    };
  }, []);

  const handleDisconnect = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <div>
      <h1>Chess</h1>
      {roomId ? <div>Room ID: {roomId}</div> : null}
      {username && opponentUsername ? (
        <div>
          {username} VS {opponentUsername}
        </div>
      ) : null}
      {start ? (
        <ChessLogic
          socket={globalSocket!}
          gameId={roomId!}
          playerColor={playerColor!}
        />
      ) : null}
      <div>
        {start ? (
          <div>
            <button onClick={(e) => handleDisconnect(e)}>Leave Match</button>
          </div>
        ) : null}
        {!start ? (
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
                  handleJoinRoom(e, joinRoomId!, username!, globalSocket!)
                }
              >
                Join Game
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChessRoom;
