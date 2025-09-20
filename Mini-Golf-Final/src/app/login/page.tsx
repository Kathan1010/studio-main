
import { Suspense } from 'react';
import { LoginForm } from './LoginForm';
import { Loader2 } from 'lucide-react';
import { AuthHeader } from "@/components/layout/AuthHeader";

function LoginPageFallback() {
    return (
        <div className="relative min-h-dvh w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-4">
            <AuthHeader />
            <div className="w-full max-w-sm pt-16 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginPageFallback />}>
            <LoginForm />
        </Suspense>
    );
}
