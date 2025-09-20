
"use client";

import { supabase } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";
import { AuthHeader } from "@/components/layout/AuthHeader";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const view = searchParams.get("view");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          router.replace("/levels");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-4">
      <AuthHeader />
      <div className="w-full max-w-sm pt-16">
        <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome to Web Golf</h1>
            <p className="text-muted-foreground">Sign in or create an account</p>
        </div>
        {message && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <Card>
          <CardContent className="p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              view={view === 'sign_up' ? 'sign_up' : 'sign_in'}
              showLinks={true}
              providers={[]}
              redirectTo={`${new URL(location.href).origin}/auth/callback`}
            />
          </CardContent>
          <CardFooter className="justify-center text-sm">
             <Link href="/reset-password"
                className="font-medium text-primary hover:underline"
                prefetch={false}
              >
                Forgot your password?
              </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
