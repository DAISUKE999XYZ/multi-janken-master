
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RotateCcw, Sparkles } from "lucide-react";
import { Participant } from "@/pages/Index";

interface GameResultProps {
  winner: Participant;
  onRestart: () => void;
}

export const GameResult = ({ winner, onRestart }: GameResultProps) => {
  return (
    <div className="space-y-8 text-center">
      <Card className="max-w-lg mx-auto border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Trophy className="h-8 w-8 text-yellow-600" />
            優勝おめでとう！
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-6xl">🏆</div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {winner.name}
            </div>
            <div className="flex items-center justify-center gap-2 text-lg text-yellow-600">
              <Sparkles className="h-5 w-5" />
              じゃんけんチャンピオン
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          
          <div className="text-lg text-muted-foreground">
            見事な勝利でした！
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="text-4xl">🎉🎊🎉</div>
        <div className="text-xl text-muted-foreground">
          お疲れさまでした！
        </div>
      </div>

      <Button 
        onClick={onRestart}
        size="lg"
        className="text-lg px-8"
      >
        <RotateCcw className="h-5 w-5 mr-2" />
        もう一度遊ぶ
      </Button>
    </div>
  );
};
