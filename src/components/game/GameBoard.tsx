
import React, { useState, useEffect, useRef } from 'react';
import LetterCell from './LetterCell';
import WordPath from './WordPath';
import { toast } from 'sonner';
import { SeededRandom } from './RandomUtils';
import { calculateWordPoints } from './GameStorage';

// Define game constants
const MIN_WORD_LENGTH = 3;
const BOARD_SIZES = { easy: 4, medium: 5, hard: 6 };
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface Point {
  x: number;
  y: number;
}

interface GameBoardProps {
  difficulty?: DifficultyLevel;
  onWordFound: (word: string, points: number) => void;
  wordList: string[];
  gameId?: string;
  gameStarted: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  difficulty = 'medium', 
  onWordFound,
  wordList,
  gameId = Date.now().toString(),
  gameStarted 
}) => {
  const boardSize = BOARD_SIZES[difficulty];
  const [board, setBoard] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchMoveRef = useRef<{ clientX: number, clientY: number } | null>(null);

  // Initialize board with random letters
  useEffect(() => {
    // Use the gameId as seed for deterministic board generation
    const seed = parseInt(gameId) || Date.now();
    const rng = new SeededRandom(seed);
    
    const newBoard = Array(boardSize * boardSize)
      .fill('')
      .map(() => rng.getRandomLetter().toLowerCase());
    
    setBoard(newBoard);
    setFoundWords([]);
    
    // Set CSS variable for board sizing
    document.documentElement.style.setProperty('--board-size', boardSize.toString());
  }, [difficulty, gameId]);

  // Convert 1D index to 2D coordinates
  const indexToCoord = (index: number) => {
    return {
      row: Math.floor(index / boardSize),
      col: index % boardSize
    };
  };

  // Check if two cells are adjacent
  const areAdjacent = (index1: number, index2: number) => {
    const coord1 = indexToCoord(index1);
    const coord2 = indexToCoord(index2);
    
    return Math.abs(coord1.row - coord2.row) <= 1 && 
           Math.abs(coord1.col - coord2.col) <= 1;
  };

  // Find the element at a specific point
  const getElementAtPoint = (x: number, y: number): HTMLElement | null => {
    // Create a small area around the point to improve touch precision
    const elements = document.elementsFromPoint(x, y);
    for (const element of elements) {
      if (element instanceof HTMLElement && element.hasAttribute('data-index')) {
        return element;
      }
    }
    return null;
  };

  // Get cell center position for path drawing
  const getCellCenter = (index: number): Point => {
    if (!boardRef.current) return { x: 0, y: 0 };
    
    const board = boardRef.current;
    const cells = board.getElementsByClassName('letter-cell');
    const cell = cells[index] as HTMLElement;
    
    if (!cell) return { x: 0, y: 0 };
    
    const cellRect = cell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    
    return {
      x: (cellRect.left + cellRect.width / 2) - boardRect.left,
      y: (cellRect.top + cellRect.height / 2) - boardRect.top
    };
  };

  // Handle cell selection start
  const handleCellMouseDown = (index: number) => {
    if (!gameStarted) return;
    setIsSelecting(true);
    setSelectedCells([index]);
    setPathPoints([getCellCenter(index)]);
  };

  // Handle cell hover during selection
  const handleCellMouseEnter = (index: number) => {
    if (!isSelecting || !gameStarted) return;
    
    // Check if this cell is already selected
    if (selectedCells.includes(index)) {
      // If we're going back to the previous cell (undoing)
      if (selectedCells.length > 1 && selectedCells[selectedCells.length - 2] === index) {
        const newSelected = selectedCells.slice(0, -1);
        setSelectedCells(newSelected);
        setPathPoints(newSelected.map(getCellCenter));
      }
      return;
    }
    
    // Check if the new cell is adjacent to the last selected cell
    const lastCell = selectedCells[selectedCells.length - 1];
    if (areAdjacent(lastCell, index)) {
      setSelectedCells([...selectedCells, index]);
      setPathPoints([...pathPoints, getCellCenter(index)]);
    }
  };

  // Handle touch move for better diagonal detection
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting || !gameStarted) return;
    
    const touch = e.touches[0];
    touchMoveRef.current = { clientX: touch.clientX, clientY: touch.clientY };
    
    // Prevent scrolling during word selection
    e.preventDefault();
    
    // Get the element at the current touch position
    const element = getElementAtPoint(touch.clientX, touch.clientY);
    if (!element) return;
    
    const cellIndex = element.getAttribute('data-index');
    if (cellIndex !== null) {
      const index = parseInt(cellIndex);
      handleCellMouseEnter(index);
    }
  };

  // Handle selection end
  const handleCellMouseUp = () => {
    if (!isSelecting || !gameStarted) return;
    
    setIsSelecting(false);
    touchMoveRef.current = null;
    
    // Get the word from selected cells
    const word = selectedCells.map(index => board[index]).join('');
    
    // Check if the word is valid (length and in word list)
    const isValidWord = word.length >= MIN_WORD_LENGTH && 
                        wordList.includes(word) && 
                        !foundWords.includes(word);
    
    if (isValidWord) {
      // Calculate points using the updated points system
      const points = calculateWordPoints(word);
      onWordFound(word, points);
      setFoundWords([...foundWords, word]);
      toast.success(`Found "${word}" +${points}`, {
        position: "top-center",
        duration: 1500,
      });
    } else if (word.length >= MIN_WORD_LENGTH) {
      if (foundWords.includes(word)) {
        toast.info("Word already found", { 
          position: "top-center",
          duration: 1500,
        });
      } else {
        toast.error("Not in word list", { 
          position: "top-center",
          duration: 1500,
        });
      }
    }
    
    // Reset selection state
    setTimeout(() => {
      setSelectedCells([]);
      setPathPoints([]);
    }, 100);
  };

  return (
    <div className="relative max-w-md mx-auto w-full">
      <div 
        ref={boardRef}
        className="word-board relative py-2 px-2 bg-secondary/50 backdrop-blur-lg rounded-xl shadow-md"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleCellMouseUp}
      >
        {board.map((letter, index) => (
          <LetterCell
            key={index}
            letter={letter}
            index={index}
            selected={selectedCells.includes(index)}
            flipped={gameStarted}
            onCellMouseDown={handleCellMouseDown}
            onCellMouseEnter={handleCellMouseEnter}
            onCellMouseUp={handleCellMouseUp}
          />
        ))}
        <WordPath points={pathPoints} active={isSelecting && gameStarted} />
      </div>
    </div>
  );
};

export default GameBoard;
