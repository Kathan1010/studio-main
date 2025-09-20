
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mouse, Smartphone, Target, Camera } from "lucide-react";

export function HowToPlay() {

  return (
    <section id="how-to-play" className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">How to Play</h2>
      <p className="text-center text-muted-foreground mb-8">
        Master the controls to conquer the course.
      </p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target />
              Objective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong>Goal:</strong> Get the golf ball into the hole in as few strokes as possible.
              </li>
              <li>
                <strong>Par:</strong> Each hole has a 'Par' score, which is the target number of strokes to aim for.
              </li>
              <li>
                <strong>Power Bar:</strong> The power bar at the bottom fills from green to red, indicating shot strength.
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mouse />
              Desktop Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong>Aim & Shoot:</strong> Click and drag away from the ball. The direction and distance determine aim and power. Release to shoot.
              </li>
              <li>
                <strong>Camera View:</strong> The camera automatically follows the ball to keep the action in frame.
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-3">
                <Smartphone />
                Mobile Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>
                  <strong>Aim & Shoot:</strong> Tap and drag on the screen away from the ball. Release to shoot.
                </li>
                 <li>
                  <strong>Camera View:</strong> The camera automatically follows the ball to keep the action in frame.
                </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
