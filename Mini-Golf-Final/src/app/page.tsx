
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers, MousePointer, Target, Gamepad, Camera, Tv, Map, CheckSquare, Database } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { HowToPlay } from '@/components/home/HowToPlay';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeroButtons } from '@/components/home/HeroButtons';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-golf-course');

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />

      <main className="flex-1">
        <section
          className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: heroImage ? `url(${heroImage.imageUrl})` : 'none',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
                Web Golf
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)]">
                Challenge the course in this 3D minigolf adventure, beautifully engineered for pixel-perfect putts.
              </p>
              <HeroButtons />
          </div>
        </section>

        <div className="container py-12 md:py-20 space-y-16">
          <HowToPlay />

          <section id="requirements">
            <h2 className="text-3xl font-bold text-center mb-2">
              Project Features
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              An exercise in web-based 3D.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Layers/></div>
                    <span>Scene & Asset Rendering</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">A Three.js scene was initialized with camera, lighting, and rendering. 3D models for the course were loaded and the golf ball was rendered.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><MousePointer/></div>
                    <span>Basic Physics & Interaction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">Implemented user input to apply velocity to the ball, with simplified friction for realistic movement, without a full physics engine.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Target/></div>
                    <span>Core Gameplay & State</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">Managed game state like hole, par, and strokes, and implemented goal detection to complete levels.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Gamepad/></div>
                    <span>Player Controls</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">Developed intuitive controls for aiming precision and power, with clear visual feedback for an enhanced user experience.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Camera/></div>
                    <span>Interactive Camera System</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">Provided interactive camera controls, including orbit, pan, and zoom, for inspecting the course.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Tv /></div>
                    <span>User Interface (UI)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">A clean UI displays essential game info like hole number and stroke count, and provides interactive controls.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Map /></div>
                    <span>Level Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">A system was implemented for loading multiple levels with terrain variations like slopes and ramps.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><CheckSquare /></div>
                    <span>Level Navigator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">Created a UI for players to select levels and transition between them after completing a hole.</p></CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Database /></div>
                    <span>Persistent Scoring</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1"><p className="text-muted-foreground">Tracked total scores across all levels, saved in a database linked to email-based authentication so players can continue their progress across sessions.</p></CardContent>
              </Card>
            </div>
          </section>
        </div>

        <footer className="border-t bg-gray-50 dark:bg-gray-900/50">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose md:text-left text-muted-foreground">
                Made for CloneFest2025 by team Igniv0x
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
