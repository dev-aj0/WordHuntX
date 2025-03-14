
import React from 'react';

interface Point {
  x: number;
  y: number;
}

interface WordPathProps {
  points: Point[];
  active: boolean;
}

const WordPath: React.FC<WordPathProps> = ({ points, active }) => {
  if (!active || points.length < 2) return null;
  
  // Create the path string for SVG
  const pathString = points.reduce((path, point, index) => {
    return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
  }, '');
  
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
      <path 
        d={pathString} 
        stroke="rgba(var(--primary), 0.6)" 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WordPath;
