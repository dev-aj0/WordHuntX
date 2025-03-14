
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Timer, RefreshCw, Trophy, Share2, PlayCircle, Medal } from 'lucide-react';

interface GameControlsProps {
  score: number;
  timeLeft: number;
  onNewGame: () => void;
  onShowInstructions: () => void;
  foundWords: string[];
  gameMode: 'single' | 'multi';
  gameId?: string;
  gameStarted: boolean;
  onStartGame: () => void;
  onShowGameOver?: () => void;
  gameFinished?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  score,
  timeLeft,
  onNewGame,
  foundWords,
  gameMode,
  gameId,
  gameStarted,
  onStartGame,
  onShowGameOver,
  gameFinished = false
}) => {
  // Format time as MM:SS without milliseconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyGameLink = () => {
    const url = `${window.location.origin}/play?gameId=${gameId}&mode=multi`;
    navigator.clipboard.writeText(url);
    alert('Game link copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {gameMode === 'multi' && gameId && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyGameLink}
                    className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Game</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {gameFinished && onShowGameOver && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onShowGameOver}
                    className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
                  >
                    <Medal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Results</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="py-1 px-3 bg-white/80 backdrop-blur-sm flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5" />
            <span className="font-medium">{score}</span>
          </Badge>
          <Badge variant="outline" className="py-1 px-3 bg-white/80 backdrop-blur-sm flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {gameMode === 'single' && gameStarted && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onNewGame}
                    className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Game</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {!gameStarted && (
        <div className="flex justify-center my-4">
          <Button 
            onClick={onStartGame}
            size="lg"
            className="animate-pulse"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Start Game
          </Button>
        </div>
      )}

      {gameStarted && foundWords.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {foundWords.map((word, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-white/60 backdrop-blur-sm shadow-sm"
            >
              {word}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameControls;
