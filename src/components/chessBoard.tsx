import { useState } from "react";
import { Chess, PieceSymbol } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine() {
  interface Move {
    from: string;
    to: string;
    promotion?: PieceSymbol | undefined;
  }
  const [game, setGame] = useState<Chess>(new Chess());

  function makeAMove(move: Move) {
    const gameCopy: Chess = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move: Move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    return true;
  }

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}
