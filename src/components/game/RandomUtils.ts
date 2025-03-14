
export const generateRandomSeed = (): number => {
  return Math.floor(Math.random() * 1000000000);
};

// Deterministic random generator based on a seed
export class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  // Generate a random number between 0 and 1
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  // Generate a random integer between min (inclusive) and max (exclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
  
  // Choose a random item from an array
  choose<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }
  
  // Get a weighted random letter
  getRandomLetter(): string {
    const commonLetters = 'ETAOINSRHDLUCMFYWGPBVKXQJZ';
    const weights = [
      12, 9, 8, 7.5, 7, 6.5, 6, 6, 5.5, 5, 4, 3.5, 3, 2.5, 2.5, 2, 2, 1.5, 1.5, 1.5, 1, 1, 0.5, 0.5, 0.5, 0.5
    ];
    
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = this.next() * totalWeight;
    let weightSum = 0;
    
    for (let i = 0; i < commonLetters.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return commonLetters[i];
      }
    }
    
    // Fallback
    return commonLetters[this.nextInt(0, commonLetters.length)];
  }
}
