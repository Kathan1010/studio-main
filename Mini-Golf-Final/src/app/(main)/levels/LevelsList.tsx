
"use client";

import { useRouter } from 'next/navigation';
import type { ScoreInfo } from '@/lib/supabase/scores';
import type { Level } from '@/lib/levels';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

type LevelsListProps = {
  levels: Level[];
  scores: ScoreInfo[];
};

export function LevelsList({ levels, scores }: LevelsListProps) {
  const router = useRouter();

  const scoresMap = useMemo(() => new Map(scores.map(s => [s.level_id, s])), [scores]);

  const handlePlayClick = (levelId: number) => {
    router.push(`/play?level=${levelId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {levels.map((level) => {
        const scoreInfo = scoresMap.get(level.id);
        const bestScore = scoreInfo?.strokes;

        return (
          <Card 
            key={level.id} 
            className="flex flex-col"
          >
            <CardHeader>
               <div className="flex justify-between items-start">
                 <div>
                    <CardDescription>Hole {level.id}</CardDescription>
                    <CardTitle>{level.name}</CardTitle>
                 </div>
                 <Badge variant={'outline'}>Par {level.par}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {bestScore !== undefined && (
                <div className="flex items-center justify-end">
                    <Badge variant={'default'}>
                      Best: {bestScore}
                    </Badge>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePlayClick(level.id)}
                className="w-full"
              >
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}
