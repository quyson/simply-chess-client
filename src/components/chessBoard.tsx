import { useEffect, useState } from "react";
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
  const [game, setGame] = useState<Chess>(new Chess());
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(
    playerColor === "w"
  );
  const [win, setWin] = useState<boolean | null>(null);

  function makeAMove(move: Move) {
    const gameCopy: Chess = new Chess(game.fen());
    const result = gameCopy.move(move);
    console.log(result);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function handleMove(
    sourceSquare: Square,
    targetSquare: Square,
    gameId: string
  ) {
    if (!isPlayerTurn) {
      console.log("Not your turn!");
      return false;
    }
    const move: Move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    const pieceColor = game.get(move.from)?.color;
    if (pieceColor !== playerColor) {
      console.log("You can only move your own pieces!");
      return false;
    }

    const result = makeAMove(move);

    if (result !== null) {
      socket.emit("new move", gameId, move);
      setIsPlayerTurn(false);
      if (game.isCheckmate()) {
        setWin(true);
        return;
      }
      return true;
    }
  }

  function handleOpponentMove(opponentMove: Move) {
    makeAMove(opponentMove);
    if (game.isCheckmate()) {
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
    socket.on("opponent move", (opponentMove: Move) => {
      handleOpponentMove(opponentMove);
    });
  }, []);

  useEffect(() => {
    if (win == null) {
      return;
    } else if (win == false) {
      socket.emit("loss game", username, opponentUsername);
    } else {
      socket.emit("won game", username, opponentUsername);
    }
  }, [win]);

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}
