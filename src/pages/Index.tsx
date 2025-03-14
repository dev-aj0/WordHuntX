
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Trophy, Clock, Users, Grid3X3, BookOpen, Smartphone, Brain, Zap, Award } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Footer } from '@/components/ui/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simple animation timing
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Background patterns - decorative elements
  const BackgroundPatterns = () => (
    <>
      <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
      <div className="absolute bottom-40 right-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl" />
      <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-primary/5 blur-lg" />
      <div className="absolute top-2/3 left-1/4 w-16 h-16 rounded-full bg-secondary/10 blur-lg" />
      
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl opacity-70" />
      <div className="absolute -bottom-20 -right-10 w-60 h-60 rounded-full bg-gradient-to-tl from-amber-500/10 to-green-500/10 blur-2xl opacity-70" />
    </>
  );

  return <div className="min-h-screen flex flex-col relative overflow-hidden">
      <BackgroundPatterns />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <Link to="/how-to-play">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>How to Play</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
        <ThemeToggle />
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 py-12 z-10">
        <div className="w-full max-w-4xl space-y-8">
          <motion.div className="text-center space-y-2" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <h1 className="text-4xl font-bold tracking-tight">Word Hunt</h1>
            <p className="text-muted-foreground">Find words in a sea of letters</p>
          </motion.div>

          <motion.div className="flex flex-col space-y-4" initial={{
          opacity: 0
        }} animate={{
          opacity: loaded ? 1 : 0
        }} transition={{
          duration: 0.5,
          delay: 0.5
        }}>
            <Link to="/play">
              <Button className="w-full h-14 text-lg gap-2 group bg-secondary hover:bg-secondary/90 text-secondary-foreground button-hover">
                <span>Play Now</span>
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div className="pt-8 space-y-6" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.7
        }}>
            {/* Cards side by side using grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Game Description Card */}
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Game Description</CardTitle>
                  <CardDescription>A desktop version of the popular mobile game</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Smartphone className="h-5 w-5 text-purple-500" />
                      </div>
                      <p className="text-sm">
                        Word Hunt is a desktop clone of the popular GamePigeon word game that many enjoy on their mobile devices.
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <Grid3X3 className="h-5 w-5 text-amber-500" />
                      </div>
                      <p className="text-sm">
                        Just like the original, you'll navigate a 4×4 grid of letters to form words by connecting adjacent letters in any direction.
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-sm">
                        Race against the clock to find as many words as possible before time runs out, with the same exciting gameplay you love.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Game Tips Card */}
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Game Tips</CardTitle>
                  <CardDescription>Master the game with these strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors">
                      <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Start with longer words</h3>
                        <p className="text-xs text-muted-foreground">They're worth more points and often reveal shorter words</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors">
                      <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Look for common patterns</h3>
                        <p className="text-xs text-muted-foreground">Prefixes like "re-", "un-" and suffixes like "-ing", "-ed"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors">
                      <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Award className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Scan in multiple directions</h3>
                        <p className="text-xs text-muted-foreground">Words can snake through the grid in any direction</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>;
};

export default Index;
