
import React from 'react';
import { cn } from '@/lib/utils';

interface LetterCellProps {
  letter: string;
  index: number;
  selected: boolean;
  flipped: boolean;
  onCellMouseDown: (index: number) => void;
  onCellMouseEnter: (index: number) => void;
  onCellMouseUp: () => void;
}

const LetterCell: React.FC<LetterCellProps> = ({
  letter,
  index,
  selected,
  flipped,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp
}) => {
  return (
    <div
      className={cn(
        "letter-cell aspect-square flex items-center justify-center rounded-lg border font-medium text-lg sm:text-xl md:text-2xl select-none cursor-pointer bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-300",
        selected && "bg-primary/80 text-primary-foreground border-primary",
        !flipped && "bg-primary text-primary-foreground [transform:rotateY(180deg)]"
      )}
      data-index={index}
      onMouseDown={() => flipped && onCellMouseDown(index)}
      onMouseEnter={() => flipped && onCellMouseEnter(index)}
      onMouseUp={() => flipped && onCellMouseUp()}
      onTouchStart={() => flipped && onCellMouseDown(index)}
      // We're now handling touchmove in the parent component for better accuracy
    >
      {flipped ? letter.toUpperCase() : ""}
    </div>
  );
};

export default LetterCell;
