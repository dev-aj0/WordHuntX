
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Users, Construction } from 'lucide-react';

interface GameModesProps {
  onSelectMode: (mode: 'single' | 'multi') => void;
}

const GameModes: React.FC<GameModesProps> = ({
  onSelectMode
}) => {
  return <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-2">Select Game Mode</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" size="lg" className="h-24 flex flex-col gap-2" onClick={() => onSelectMode('single')}>
          <User className="h-8 w-8" />
          <span>Single Player</span>
        </Button>
        <div className="flex flex-col items-center">
          <Button variant="outline" size="lg" className="h-24 flex flex-col gap-2 opacity-50 cursor-not-allowed w-full" disabled>
            <Users className="h-8 w-8" />
            <span>Multiplayer</span>
          </Button>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Construction className="h-3 w-3" />
            <span>Under Construction</span>
          </div>
        </div>
      </div>
    </div>;
};

export default GameModes;
