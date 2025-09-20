
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function DesignPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">AI Course Designer</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            This feature is under construction.
          </p>
        </div>

        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Construction className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                    The AI-powered course design tool is currently being developed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Check back later for updates!</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
