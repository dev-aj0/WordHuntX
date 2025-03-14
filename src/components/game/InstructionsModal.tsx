
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white/80 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">How to Play</DialogTitle>
          <DialogDescription className="pt-3">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Find Words</h3>
                <p className="text-sm text-muted-foreground">
                  Connect adjacent letters to form words. Letters can connect in any direction - horizontally, vertically, or diagonally.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Words must be at least 3 letters long. Each word length has its own point value:
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                  <li>3 letters: 100 points</li>
                  <li>4 letters: 400 points</li>
                  <li>5 letters: 800 points</li>
                  <li>6 letters: 1400 points</li>
                  <li>7 letters: 1800 points</li>
                  <li>8+ letters: 2200+ points</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Time Limit</h3>
                <p className="text-sm text-muted-foreground">
                  Find as many words as you can before the timer runs out!
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose} className="px-6">Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsModal;
