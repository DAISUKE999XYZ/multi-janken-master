
import { useState } from "react";
import { ParticipantSetup } from "@/components/ParticipantSetup";
import { JankenGame } from "@/components/JankenGame";
import { GameResult } from "@/components/GameResult";

export type Participant = {
  id: number;
  name: string;
  isEliminated: boolean;
};

export type GamePhase = "setup" | "game" | "result";

const Index = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);

  const handleStartGame = (participantList: Participant[]) => {
    setParticipants(participantList);
    setGamePhase("game");
  };

  const handleGameEnd = (finalWinner: Participant) => {
    setWinner(finalWinner);
    setGamePhase("result");
  };

  const handleRestart = () => {
    setParticipants([]);
    setWinner(null);
    setGamePhase("setup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            🪨📄✂️ じゃんけん勝負アプリ
          </h1>
          <p className="text-muted-foreground">
            みんなでじゃんけん！最後の1人になるまで戦おう！
          </p>
        </header>

        {gamePhase === "setup" && (
          <ParticipantSetup onStartGame={handleStartGame} />
        )}

        {gamePhase === "game" && (
          <JankenGame 
            participants={participants}
            onGameEnd={handleGameEnd}
          />
        )}

        {gamePhase === "result" && winner && (
          <GameResult 
            winner={winner}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
