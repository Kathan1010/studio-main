

"use client";

import { supabase } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { AuthHeader } from "@/components/layout/AuthHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This function generates the redirect URL for Supabase Auth.
// It's designed to work in both development and production environments.
function getRedirectUrl() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Your production site URL
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel's automatic URL
    'http://localhost:9002/'; // Your local development URL
  // Ensure it's a full URL with https
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure it ends with a slash
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  // Append the auth callback path
  url = `${url}auth/callback`;
  return url;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const view = searchParams.get("view");
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    // We compute the redirect URL on the client to ensure it's always correct.
    setRedirectUrl(getRedirectUrl());

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // If a user session is detected, redirect to the levels page.
        if (session) {
          router.replace("/levels");
        }
      }
    );

    return () => {
      // Clean up the listener when the component unmounts
      authListener.subscription.unsubscribe();
    };
  }, [router]);
  
  const currentView = view === 'sign_up' ? 'sign_up' : 'sign_in';

  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-4">
      <AuthHeader />
      <div className="w-full max-w-sm pt-16">
        <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome to Web Golf</h1>
            <p className="text-muted-foreground">
              {currentView === 'sign_in' ? 'Sign in to continue' : 'Create an account to start playing'}
            </p>
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
              view={currentView}
              showLinks={false}
              providers={[]}
              redirectTo={redirectUrl ? redirectUrl : undefined}
            />
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            {currentView === 'sign_in' ? (
                <p className="text-muted-foreground">
                  New to the game?{' '}
                  <Link href="/login?view=sign_up" className="font-medium text-primary hover:underline">
                    Sign Up
                  </Link>
                </p>
            ) : (
                <p className="text-muted-foreground">
                  Already a user?{' '}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Log In
                  </Link>
                </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
