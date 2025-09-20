
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { ArrowRight } from 'lucide-react';

export function HeroButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
       <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" disabled>
          Play Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    )
  }

  const playNowHref = user ? '/levels' : '/login?view=sign_up';

  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
      <Button asChild size="lg">
        <Link href={playNowHref}>
          Play Now <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      {!user && (
        <Button
          asChild
          size="lg"
          variant="outline"
          className="text-white border-white bg-transparent hover:bg-white hover:text-primary"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
