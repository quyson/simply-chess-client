import { useEffect, useRef, useState } from "react";
import { Chess, PieceSymbol, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Socket, io } from "socket.io-client";

type color = "b" | "w";

interface ChessLogicProps {
  socket: Socket;
  gameId: string;
  playerColor: color;
  username: string;
  opponentUsername: string;
}

interface Move {
  from: Square;
  to: Square;
  promotion?: PieceSymbol | undefined;
}

export default function ChessLogic({
  socket,
  gameId,
  playerColor,
  username,
  opponentUsername,
}: ChessLogicProps) {
  const gameRef = useRef<Chess>(new Chess());
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(
    playerColor === "w"
  );
  const [win, setWin] = useState<boolean | null>(null);

  function makeAMove(move: Move) {
    const gameCopy: Chess = new Chess(gameRef.current.fen());
    const result = gameCopy.move(move);
    gameRef.current = new Chess(result.after);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  //the problem is that the turn

  function handleMove(
    sourceSquare: Square,
    targetSquare: Square,
    gameId: string
  ) {
    if (!isPlayerTurn) {
      console.log("Not your turn!");
      return false;
    }
    const move: Move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    };

    const pieceColor = gameRef.current.get(move.from)?.color;
    if (pieceColor !== playerColor) {
      console.log("You can only move your own pieces!");
      return false;
    }

    const result = makeAMove(move);
    if (!result) {
      console.log("invalid");
      return false;
    }
    if (result !== null) {
      socket.emit("handle move", result.after, gameId);
      setIsPlayerTurn(false);
      if (gameRef.current.isCheckmate()) {
        setWin(true);
        return;
      }
      return true;
    }
  }

  // the error is that the game state is not properly changing turns, i believe because of asynchronous conflicts
  // so we must send only after game state is properly updated. we might have to use useref for up to date values but state to render

  function handleOpponentMove(opponentMove: string) {
    gameRef.current = new Chess(opponentMove);
    if (gameRef.current.isCheckmate()) {
      setWin(false);
      return;
    }
    setIsPlayerTurn(true);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    const currentMove = handleMove(sourceSquare, targetSquare, gameId)!;
    return currentMove;
  }

  useEffect(() => {
    socket.on("opponent move", (opponentMove) => {
      handleOpponentMove(opponentMove);
    });
  }, []);

  useEffect(() => {
    socket.on("status", (message: string) => {
      console.log(message);
    });
  }, []);

  useEffect(() => {
    if (win == null) {
      return;
    } else if (win == false) {
      alert("You LOSt");
      socket.emit("loss game", username, opponentUsername);
    } else {
      alert("you won!");
      socket.emit("won game", username, opponentUsername);
    }
  }, [win]);

  return <Chessboard position={gameRef.current.fen()} onPieceDrop={onDrop} />;
}
