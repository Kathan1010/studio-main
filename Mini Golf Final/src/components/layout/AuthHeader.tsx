
"use client";

import Link from 'next/link';
import { GolfFlagIcon } from '../icons/GolfFlagIcon';

export function AuthHeader() {
  return (
    <header className="absolute top-0 left-0 w-full p-4">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="flex items-center space-x-2 text-foreground">
          <GolfFlagIcon className="h-6 w-6" />
          <span className="font-bold sm:inline-block">Web Golf</span>
        </Link>
      </div>
    </header>
  );
}
