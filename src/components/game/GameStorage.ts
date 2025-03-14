import { generateRandomSeed } from './RandomUtils';

interface GameResult {
  score: number;
  foundWords: string[];
  playerName?: string;
  completed: boolean;
  timestamp: number;
}

export interface StoredGame {
  gameId: string;
  playerResult?: GameResult;
  opponentResult?: GameResult;
  createdAt: number;
}

const STORAGE_KEY = 'word_hunt_games';

// New scoring system
export const calculateWordPoints = (word: string): number => {
  const length = word.length;
  switch (length) {
    case 3: return 100;
    case 4: return 400;
    case 5: return 800;
    case 6: return 1400;
    case 7: return 1800;
    case 8: return 2200;
    default: return length > 8 ? 2200 + ((length - 8) * 400) : 0; // For words longer than 8 letters
  }
};

export const saveGameResult = (gameId: string, result: GameResult): void => {
  const games = getGames();
  const existingGameIndex = games.findIndex(g => g.gameId === gameId);
  
  // Ensure the result has a timestamp
  const resultWithTimestamp = {
    ...result,
    timestamp: result.timestamp || Date.now()
  };
  
  if (existingGameIndex >= 0) {
    const game = games[existingGameIndex];
    
    // If this is the first result for this game
    if (!game.playerResult || !game.playerResult.completed) {
      game.playerResult = resultWithTimestamp;
    } 
    // If there's already a result, this is the opponent's result
    else if (!game.opponentResult || !game.opponentResult.completed) {
      game.opponentResult = resultWithTimestamp;
    }
    // If both results exist, update the more recent one based on timestamp
    else if (resultWithTimestamp.timestamp) {
      // Use timestamps to determine which result to update
      if (game.playerResult.timestamp > game.opponentResult.timestamp) {
        if (resultWithTimestamp.timestamp >= game.playerResult.timestamp) {
          game.playerResult = resultWithTimestamp;
        } else {
          // This is older than both results, so it must be the opponent
          game.opponentResult = resultWithTimestamp;
        }
      } else {
        if (resultWithTimestamp.timestamp >= game.opponentResult.timestamp) {
          game.opponentResult = resultWithTimestamp;
        } else {
          // This is older than both results, so it must be the player
          game.playerResult = resultWithTimestamp;
        }
      }
    }
    
    games[existingGameIndex] = game;
  } else {
    // Create a new game entry
    games.push({
      gameId,
      playerResult: resultWithTimestamp,
      createdAt: Date.now()
    });
  }
  
  // Save to localStorage and fire a custom event to notify other tabs/components
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  window.dispatchEvent(new CustomEvent('gameDataChanged'));
};

export const getGameResult = (gameId: string): StoredGame | undefined => {
  const games = getGames();
  return games.find(g => g.gameId === gameId);
};

export const getGames = (): StoredGame[] => {
  const gamesJson = localStorage.getItem(STORAGE_KEY);
  if (!gamesJson) return [];
  
  try {
    return JSON.parse(gamesJson);
  } catch (e) {
    console.error('Error parsing stored games', e);
    return [];
  }
};

export const getConsistentGameResult = (gameId: string): StoredGame | undefined => {
  const game = getGameResult(gameId);
  if (!game) return undefined;
  
  // If we have both results, make a normalized copy that both players will see the same way
  if (game.playerResult && game.opponentResult) {
    // Create a deep copy to avoid modifying the original
    const normalizedGame = JSON.parse(JSON.stringify(game));
    
    // Ensure player always sees themselves as "playerResult"
    // but the data content is consistent between both players
    const originalPlayerResult = normalizedGame.playerResult;
    const originalOpponentResult = normalizedGame.opponentResult;
    
    // Return the original game but with consistent ordering of results
    return {
      ...normalizedGame,
      // Both results are present, so we can keep the original structure
      // and let the GameOverModal component handle the display logic
    };
  }
  
  // If there's only one result, just return the game as is
  return game;
};

export const generateGameId = (): string => {
  // Generate a random game ID
  return generateRandomSeed().toString();
};

export const clearOldGames = (): void => {
  const games = getGames();
  const now = Date.now();
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  const filteredGames = games.filter(game => {
    return now - game.createdAt < ONE_WEEK;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredGames));
};

// Additional function to help with debugging
export const debugRecentGames = (): void => {
  const games = getGames();
  console.log("Current stored games:", games);
  console.log("Games with completed results:", games.filter(game => game.playerResult?.completed));
}
