
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Participant } from "@/pages/Index";

interface JankenGameProps {
  participants: Participant[];
  onGameEnd: (winner: Participant) => void;
}

type JankenChoice = "rock" | "paper" | "scissors";

const JANKEN_EMOJI = {
  rock: "🪨",
  paper: "📄", 
  scissors: "✂️"
};

const JANKEN_NAME = {
  rock: "グー",
  paper: "パー",
  scissors: "チョキ"
};

export const JankenGame = ({ participants, onGameEnd }: JankenGameProps) => {
  const [currentParticipants, setCurrentParticipants] = useState<Participant[]>(
    participants.filter(p => !p.isEliminated)
  );
  const [round, setRound] = useState(1);
  const [gameState, setGameState] = useState<"waiting" | "countdown" | "playing" | "result">("waiting");
  const [countdown, setCountdown] = useState(3);
  const [choices, setChoices] = useState<Record<number, JankenChoice>>({});
  const [roundResult, setRoundResult] = useState<string>("");

  useEffect(() => {
    if (currentParticipants.length === 1) {
      onGameEnd(currentParticipants[0]);
    }
  }, [currentParticipants, onGameEnd]);

  const startRound = () => {
    setGameState("countdown");
    setCountdown(3);
    setChoices({});
    setRoundResult("");
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState("playing");
          // CPUの選択を自動で行う
          autoPlayForCPU();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const autoPlayForCPU = () => {
    const newChoices: Record<number, JankenChoice> = {};
    currentParticipants.forEach(participant => {
      const choices: JankenChoice[] = ["rock", "paper", "scissors"];
      newChoices[participant.id] = choices[Math.floor(Math.random() * 3)];
    });
    setChoices(newChoices);
    
    setTimeout(() => {
      determineRoundWinner(newChoices);
    }, 1000);
  };

  const determineRoundWinner = (roundChoices: Record<number, JankenChoice>) => {
    const choiceValues = Object.values(roundChoices);
    const uniqueChoices = [...new Set(choiceValues)];
    
    let winners: Participant[] = [];
    let resultText = "";
    
    if (uniqueChoices.length === 1) {
      // 全員同じ = あいこ
      winners = currentParticipants;
      resultText = "あいこ！もう一度！";
    } else if (uniqueChoices.length === 3) {
      // 3種類全部出た = あいこ
      winners = currentParticipants;
      resultText = "3種類出た！あいこ！";
    } else {
      // 勝負がついた
      const [choice1, choice2] = uniqueChoices;
      let winningChoice: JankenChoice;
      
      if ((choice1 === "rock" && choice2 === "scissors") || 
          (choice1 === "scissors" && choice2 === "rock")) {
        winningChoice = "rock";
      } else if ((choice1 === "paper" && choice2 === "rock") || 
                 (choice1 === "rock" && choice2 === "paper")) {
        winningChoice = "paper";
      } else {
        winningChoice = "scissors";
      }
      
      winners = currentParticipants.filter(p => roundChoices[p.id] === winningChoice);
      resultText = `${JANKEN_NAME[winningChoice]}の勝利！`;
    }
    
    setRoundResult(resultText);
    
    setTimeout(() => {
      if (winners.length < currentParticipants.length) {
        // 敗者を除外
        setCurrentParticipants(winners);
        setRound(prev => prev + 1);
      }
      setGameState("waiting");
    }, 3000);
  };

  if (currentParticipants.length === 1) {
    return null; // GameResultコンポーネントに移行
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            第{round}ラウンド - 残り{currentParticipants.length}人
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentParticipants.map(participant => (
              <Card key={participant.id} className="relative">
                <CardContent className="p-4 text-center">
                  <Badge variant="secondary" className="mb-2">
                    {participant.name}
                  </Badge>
                  <div className="text-4xl mb-2">
                    {gameState === "result" && choices[participant.id] ? 
                      JANKEN_EMOJI[choices[participant.id]] : "❓"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {gameState === "result" && choices[participant.id] ? 
                      JANKEN_NAME[choices[participant.id]] : "準備中..."}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="p-6">
          {gameState === "waiting" && (
            <div className="space-y-4">
              <div className="text-xl">準備はいいですか？</div>
              <Button onClick={startRound} size="lg" className="text-lg px-8">
                じゃんけん開始！
              </Button>
            </div>
          )}
          
          {gameState === "countdown" && (
            <div className="space-y-4">
              <div className="text-2xl">じゃんけん...</div>
              <div className="text-6xl font-bold text-primary">
                {countdown === 0 ? "ポン！" : countdown}
              </div>
            </div>
          )}
          
          {gameState === "playing" && (
            <div className="space-y-4">
              <div className="text-2xl">選択中...</div>
              <div className="flex justify-center space-x-4 text-4xl">
                <span className="animate-bounce">🪨</span>
                <span className="animate-bounce" style={{animationDelay: "0.1s"}}>📄</span>
                <span className="animate-bounce" style={{animationDelay: "0.2s"}}>✂️</span>
              </div>
            </div>
          )}
          
          {gameState === "result" && (
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">{roundResult}</div>
              {roundResult.includes("あいこ") && (
                <div className="text-muted-foreground">次のラウンドに進みます</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
