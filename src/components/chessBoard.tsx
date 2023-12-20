import { useEffect, useState } from "react";
import { Chess, PieceSymbol } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Socket, io } from "socket.io-client";

type color = "black" | "white";

interface ChessLogicProps {
  socket: Socket;
  gameId: string;
  playerColor: color;
}

interface Move {
  from: string;
  to: string;
  promotion?: PieceSymbol | undefined;
}

export default function ChessLogic({
  socket,
  gameId,
  playerColor,
}: ChessLogicProps) {
  const [game, setGame] = useState<Chess>(new Chess());

  function makeAMove(move: Move) {
    const gameCopy: Chess = new Chess(game.fen());
    const result = gameCopy.move(move);
    console.log(result);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function handleMove(move: Move, gameId: string) {
    socket.emit("handle move", move, gameId);
  }

  function handleOpponentMove(opponentMove: Move) {
    makeAMove(opponentMove);
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move: Move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    handleMove(move, gameId);
    return true;
  }

  useEffect(() => {
    socket.on("opponent move", (opponentMove: Move) => {
      handleOpponentMove(opponentMove);
    });
  }, []);

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}
