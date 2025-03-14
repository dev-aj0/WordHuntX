
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trophy, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface GameResult {
  score: number;
  foundWords: string[];
  playerName?: string;
  timestamp?: number;
}

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  score: number;
  foundWords: string[];
  gameMode: 'single' | 'multi';
  opponentResult?: GameResult;
  waitingForOpponent?: boolean;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  onNewGame,
  score,
  foundWords,
  gameMode,
  opponentResult,
  waitingForOpponent = false,
}) => {
  const yourResult: GameResult = {
    score,
    foundWords,
    playerName: 'You',
    timestamp: Date.now()
  };

  // Determine common and unique words between players
  const commonWords = opponentResult ? 
    foundWords.filter(word => opponentResult.foundWords.includes(word)) : [];
  
  const yourUniqueWords = opponentResult ? 
    foundWords.filter(word => !opponentResult.foundWords.includes(word)) : [];
  
  const opponentUniqueWords = opponentResult ? 
    opponentResult.foundWords.filter(word => !foundWords.includes(word)) : [];

  // Get actual scores for comparison
  const yourActualScore = score;
  const opponentActualScore = opponentResult?.score || 0;

  // Determine the winner based on score comparison
  const getResultMessage = () => {
    if (!opponentResult || waitingForOpponent) return "Game Over!";
    
    if (yourActualScore > opponentActualScore) return "You Win!";
    if (yourActualScore < opponentActualScore) return "Opponent Wins!";
    return "It's a Tie!";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-medium">
            {waitingForOpponent ? "Waiting for Opponent" : getResultMessage()}
          </DialogTitle>
          
          {!waitingForOpponent && (
            <>
              <div className="flex justify-center my-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {gameMode === 'single' ? (
                    <Trophy className="w-8 h-8 text-primary" />
                  ) : (
                    <Users className="w-8 h-8 text-primary" />
                  )}
                </div>
              </div>
              
              {gameMode === 'single' ? (
                <DialogDescription className="text-center text-xl font-semibold">
                  Final Score: {score}
                </DialogDescription>
              ) : (
                <div className="flex justify-center items-center gap-8 mt-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <p className="mt-1 font-medium">You</p>
                    <p className="text-xl font-bold">{yourActualScore}</p>
                  </div>
                  
                  {opponentResult ? (
                    <div className="flex flex-col items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>Opp</AvatarFallback>
                      </Avatar>
                      <p className="mt-1 font-medium">Opponent</p>
                      <p className="text-xl font-bold">{opponentActualScore}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center opacity-50">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <p className="mt-1 font-medium">Waiting...</p>
                      <p className="text-xl font-bold">-</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
          {waitingForOpponent && (
            <div className="my-6 flex flex-col items-center">
              <div className="animate-pulse">
                <Users className="w-12 h-12 text-primary mb-4" />
              </div>
              <p className="text-muted-foreground">
                Your score: {score}
              </p>
              <p className="text-muted-foreground mt-2">
                Please wait while your opponent finishes their game.
              </p>
              <p className="text-muted-foreground mt-4 text-sm">
                You can share this link with others to compare scores!
              </p>
            </div>
          )}
        </DialogHeader>
        
        {!waitingForOpponent && foundWords.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="max-h-[200px] overflow-y-auto pr-2">
              {gameMode === 'single' ? (
                <>
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">Words Found: {foundWords.length}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {foundWords.map((word, index) => (
                      <div key={index} className="text-sm bg-secondary rounded-md px-2 py-1 text-center">
                        {word}
                      </div>
                    ))}
                  </div>
                </>
              ) : opponentResult ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {commonWords.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2 text-sm text-muted-foreground">
                          Both Found ({commonWords.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {commonWords.map((word, index) => (
                            <div key={index} className="text-sm bg-secondary rounded-md px-2 py-1 text-center">
                              {word}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {yourUniqueWords.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2 text-sm text-muted-foreground">
                          Only You Found ({yourUniqueWords.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {yourUniqueWords.map((word, index) => (
                            <div key={index} className="text-sm bg-primary/10 rounded-md px-2 py-1 text-center">
                              {word}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {opponentUniqueWords.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2 text-sm text-muted-foreground">
                          Only Opponent Found ({opponentUniqueWords.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {opponentUniqueWords.map((word, index) => (
                            <div key={index} className="text-sm bg-secondary/50 rounded-md px-2 py-1 text-center">
                              {word}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  <p>Waiting for opponent to finish...</p>
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="flex justify-center mt-4">
          {waitingForOpponent ? (
            <Button onClick={onClose} variant="outline" className="px-8">
              Close
            </Button>
          ) : (
            <Button onClick={onNewGame} className="px-8">
              {gameMode === 'single' ? 'Play Again' : 'New Game'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;
