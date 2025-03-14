import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GameBoard from '@/components/game/GameBoard';
import GameControls from '@/components/game/GameControls';
import InstructionsModal from '@/components/game/InstructionsModal';
import GameOverModal from '@/components/game/GameOverModal';
import GameModes from '@/components/game/GameModes';
import { wordList } from '@/data/wordList';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Footer } from '@/components/ui/footer';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  generateGameId, 
  saveGameResult, 
  getGameResult,
  getConsistentGameResult,
  clearOldGames 
} from '@/components/game/GameStorage';

const GAME_DURATION = 120; // 2 minutes in seconds

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type GameMode = 'single' | 'multi';

const GamePage = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty] = useState<DifficultyLevel>('medium');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameId, setGameId] = useState<string>('');
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [opponentResult, setOpponentResult] = useState<any | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const documentVisibleRef = useRef<boolean>(true);
  const gameTimeRef = useRef<number>(GAME_DURATION);
  const lastTickRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharedGameId = params.get('gameId');
    const mode = params.get('mode');
    
    if (sharedGameId && mode === 'multi') {
      setGameId(sharedGameId);
      setGameMode('multi');
      setGameActive(true);
      
      const existingGame = getConsistentGameResult(sharedGameId);
      if (existingGame && existingGame.playerResult) {
        setOpponentResult(existingGame.playerResult);
      }
    } else {
      setGameId(generateGameId());
    }

    clearOldGames();
  }, [location]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      documentVisibleRef.current = document.visibilityState === 'visible';
      
      if (documentVisibleRef.current) {
        lastUpdateTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || !gameMode) return;
    
    if (lastTickRef.current === 0) {
      lastTickRef.current = Date.now();
    }

    const updateTimer = () => {
      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      
      gameTimeRef.current = Math.max(0, gameTimeRef.current - deltaTime);
      
      setTimeLeft(gameTimeRef.current);
      
      if (gameTimeRef.current <= 0) {
        handleGameOver();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateTimer);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [gameStarted, gameMode]);

  const handleStartGame = () => {
    gameTimeRef.current = GAME_DURATION;
    setTimeLeft(GAME_DURATION);
    lastTickRef.current = Date.now();
    setGameStarted(true);
  };

  const handleGameOver = () => {
    if (gameMode === 'multi') {
      saveGameResult(gameId, {
        score,
        foundWords,
        completed: true,
        timestamp: Date.now()
      });
      
      const gameData = getConsistentGameResult(gameId);
      
      if (gameData && gameData.opponentResult) {
        setOpponentResult(gameData.opponentResult);
        setWaitingForOpponent(false);
      } else {
        setWaitingForOpponent(true);
      }
    } else {
      saveGameResult(gameId, {
        score,
        foundWords,
        completed: true,
        timestamp: Date.now()
      });
    }
    
    setShowGameOver(true);
  };

  const openGameOverModal = () => {
    if (timeLeft <= 0 || waitingForOpponent) {
      if (gameMode === 'multi' && gameId) {
        const gameData = getConsistentGameResult(gameId);
        if (gameData && gameData.opponentResult) {
          setOpponentResult(gameData.opponentResult);
          setWaitingForOpponent(false);
        }
      }
      setShowGameOver(true);
    }
  };

  useEffect(() => {
    if (gameMode !== 'multi' || !waitingForOpponent) return;
    
    const checkInterval = setInterval(() => {
      const gameData = getConsistentGameResult(gameId);
      if (gameData && gameData.opponentResult) {
        setOpponentResult(gameData.opponentResult);
        setWaitingForOpponent(false);
        clearInterval(checkInterval);
      }
    }, 3000);
    
    return () => clearInterval(checkInterval);
  }, [gameMode, waitingForOpponent, gameId]);

  const handleWordFound = useCallback((word: string, points: number) => {
    if (!gameStarted) return;
    setScore(prev => prev + points);
    setFoundWords(prev => [...prev, word]);
  }, [gameStarted]);

  const handleNewGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFoundWords([]);
    setShowGameOver(false);
    setWaitingForOpponent(false);
    setOpponentResult(null);
    setGameStarted(false);
    
    if (gameMode === 'single') {
      setGameId(generateGameId());
      setGameActive(true);
    } else {
      setGameMode(null);
      setGameActive(false);
      navigate('/play');
    }
  }, [gameMode, navigate]);

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setGameActive(true);
    
    if (mode === 'single') {
      setGameId(generateGameId());
    }
    
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFoundWords([]);
    setShowGameOver(false);
    setWaitingForOpponent(false);
    setOpponentResult(null);
    setGameStarted(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowInstructions(true)}
                className="h-9 w-9 rounded-full"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>How to Play</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ThemeToggle />
      </div>
      
      <motion.div
        className="flex-1 max-w-md mx-auto w-full flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Word Hunt</h1>
          <div className="w-9"></div>
        </motion.div>
        
        {!gameActive ? (
          <motion.div variants={itemVariants}>
            <GameModes onSelectMode={handleSelectMode} />
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <GameControls
                score={score}
                timeLeft={timeLeft}
                onNewGame={handleNewGame}
                onShowInstructions={() => setShowInstructions(true)}
                foundWords={foundWords}
                gameMode={gameMode || 'single'}
                gameId={gameId}
                gameStarted={gameStarted}
                onStartGame={handleStartGame}
                onShowGameOver={openGameOverModal}
                gameFinished={timeLeft <= 0 || waitingForOpponent}
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex-1">
              <GameBoard
                difficulty={difficulty}
                onWordFound={handleWordFound}
                wordList={wordList}
                gameId={gameId}
                gameStarted={gameStarted}
              />
            </motion.div>
          </>
        )}
      </motion.div>
      
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      
      <GameOverModal
        isOpen={showGameOver}
        onClose={() => setShowGameOver(false)}
        onNewGame={handleNewGame}
        score={score}
        foundWords={foundWords}
        gameMode={gameMode || 'single'}
        opponentResult={opponentResult}
        waitingForOpponent={waitingForOpponent}
      />
      
      <Footer />
    </div>
  );
};

export default GamePage;
