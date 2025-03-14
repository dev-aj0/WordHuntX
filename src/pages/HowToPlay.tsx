
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MousePointer, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Footer } from '@/components/ui/footer';

const HowToPlay = () => {
  const steps = [
    {
      title: "Connect Letters",
      description: "Find words by connecting adjacent letters in any direction - horizontally, vertically, or diagonally.",
      icon: <MousePointer className="w-5 h-5" />
    },
    {
      title: "Score Points",
      description: "Words must be at least 3 letters long. Longer words earn more points!",
      icon: <Award className="w-5 h-5" />
    },
    {
      title: "Beat the Clock",
      description: "Find as many words as you can before the timer runs out.",
      icon: <Clock className="w-5 h-5" />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <motion.div 
        className="max-w-md mx-auto w-full flex flex-col gap-8 py-8 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">How to Play</h1>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">{step.title}</h2>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <div className="bg-secondary/50 rounded-lg p-4 border">
            <h3 className="font-bold mb-2">Scoring</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>3 letters</span>
                <span className="font-bold">100 points</span>
              </li>
              <li className="flex justify-between">
                <span>4 letters</span>
                <span className="font-bold">400 points</span>
              </li>
              <li className="flex justify-between">
                <span>5 letters</span>
                <span className="font-bold">800 points</span>
              </li>
              <li className="flex justify-between">
                <span>6 letters</span>
                <span className="font-bold">1400 points</span>
              </li>
              <li className="flex justify-between">
                <span>7 letters</span>
                <span className="font-bold">1800 points</span>
              </li>
              <li className="flex justify-between">
                <span>8+ letters</span>
                <span className="font-bold">2200+ points</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4">
          <Link to="/play">
            <Button className="w-full">Start Playing</Button>
          </Link>
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default HowToPlay;
