
"use client";

import { useState, Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { levels, type Level } from '@/lib/levels';
import { GameUI } from '@/components/game/GameUI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper, Loader2, Home, RotateCcw, ArrowRight } from 'lucide-react';
import type { Game } from '@/components/game/GolfCanvas';
import { updateBestScore } from '@/lib/supabase/scores';

const GolfCanvas = dynamic(() => import('@/components/game/GolfCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

function PlayArea() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [level, setLevel] = useState<Level | null>(null);
  const [strokes, setStrokes] = useState(0);
  const [power, setPower] = useState(0);
  const [isHoleComplete, setIsHoleComplete] = useState(false);
  const [gameKey, setGameKey] = useState(Date.now());
  const gameRef = useRef<Game | null>(null);


  useEffect(() => {
    const levelId = searchParams.get('level');
    let levelData: Level | undefined | null = null;
    
    if (levelId) {
        levelData = levels.find(l => l.id === parseInt(levelId));
    }

    if (!levelData) {
      router.replace('/levels');
      return;
    }
    
    setLevel(levelData);
    setStrokes(0);
    setIsHoleComplete(false);
    setGameKey(Date.now());
  }, [searchParams, router]);

  // Effect to save score when hole is completed
  useEffect(() => {
    if (isHoleComplete && level) {
      // Don't await, just fire and forget
      updateBestScore(level.id, strokes);
    }
  }, [isHoleComplete, strokes, level]);

  const handleStroke = () => {
    if (isHoleComplete) return;
    setStrokes((prev) => prev + 1);
  };

  const handleHoleComplete = () => {
    if (!isHoleComplete) {
      setIsHoleComplete(true);
    }
  };

  const handleGoToLevels = () => {
    router.push('/levels');
  };
  
  const handleReset = () => {
    setStrokes(0);
    setIsHoleComplete(false);
    setGameKey(Date.now());
  }

  const handleNextLevel = () => {
    if (!level) return;
    const nextLevelId = level.id + 1;
    if (nextLevelId <= levels.length) {
      router.push(`/play?level=${nextLevelId}`);
    } else {
      router.push('/levels');
    }
  };

  if (!level) {
    return (
        <div className="relative w-full h-dvh overflow-hidden bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4 text-muted-foreground">Loading level...</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-background">
      <GameUI 
        level={level.id} 
        par={level.par} 
        strokes={strokes} 
        power={power}
        onReset={handleReset}
        onGoToLevels={handleGoToLevels}
      />
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
          <GolfCanvas
              key={gameKey}
              level={level}
              onStroke={handleStroke}
              onHoleComplete={handleHoleComplete}
              setPower={setPower}
              isGamePaused={isHoleComplete}
              gameRef={gameRef}
          />
      </Suspense>
      {isHoleComplete && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
          <Card className="max-w-sm text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary mb-4">
                <PartyPopper className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Hole {level.id} Complete!</CardTitle>
              <CardDescription>
                You finished in {strokes} strokes (Par {level.par}).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              {level.id < levels.length && (
                <Button onClick={handleNextLevel}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Next Level
                </Button>
              )}
               <Button onClick={handleReset} variant="secondary">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Replay Level
              </Button>
              <Button onClick={handleGoToLevels} variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Back to Levels
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
        <div className="relative w-full h-dvh overflow-hidden bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4 text-muted-foreground">Loading level...</p>
        </div>
    }>
      <PlayArea />
    </Suspense>
  );
}

