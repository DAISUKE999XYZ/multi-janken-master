
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Trash2, Play } from "lucide-react";
import { Participant } from "@/pages/Index";

interface ParticipantSetupProps {
  onStartGame: (participants: Participant[]) => void;
}

export const ParticipantSetup = ({ onStartGame }: ParticipantSetupProps) => {
  const [participantCount, setParticipantCount] = useState<number>(2);
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);

  const handleCountChange = (count: number) => {
    if (count >= 2 && count <= 10) {
      setParticipantCount(count);
      setParticipantNames(Array(count).fill(""));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...participantNames];
    newNames[index] = name;
    setParticipantNames(newNames);
  };

  const handleProceedToNames = () => {
    setParticipantNames(Array(participantCount).fill(""));
    setShowNameInput(true);
  };

  const handleStartGame = () => {
    const participants: Participant[] = participantNames.map((name, index) => ({
      id: index + 1,
      name: name.trim() || `参加者${index + 1}`,
      isEliminated: false,
    }));
    onStartGame(participants);
  };

  const isReadyToStart = participantNames.length > 0 && 
    participantNames.some(name => name.trim().length > 0);

  if (!showNameInput) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            参加人数を選択
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>参加人数 (2-10人)</Label>
            <Input
              type="number"
              min="2"
              max="10"
              value={participantCount}
              onChange={(e) => handleCountChange(Number(e.target.value))}
              className="text-center text-lg"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4, 5, 6, 8].map((count) => (
              <Button
                key={count}
                variant={participantCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => handleCountChange(count)}
              >
                {count}人
              </Button>
            ))}
          </div>

          <Button 
            onClick={handleProceedToNames} 
            className="w-full"
            size="lg"
          >
            次へ →名前入力
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          参加者の名前を入力 ({participantCount}人)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: participantCount }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Label>参加者 {index + 1}</Label>
              <Input
                placeholder={`参加者${index + 1}`}
                value={participantNames[index] || ""}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="text-center"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowNameInput(false)}
            className="flex-1"
          >
            ← 戻る
          </Button>
          <Button 
            onClick={handleStartGame}
            disabled={!isReadyToStart}
            className="flex-1"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            ゲーム開始！
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
