'use client';

import {
    LogOut,
} from 'lucide-react';
import {
    useRouter,
} from 'next/navigation';

import {
    createAuthBrowserClient,
} from '@/lib/supabase/auth-client';

export default function SignOutButton() {
    const router =
        useRouter();

    const handleSignOut =
        async () => {
            const supabase =
                createAuthBrowserClient();

            await supabase.auth.signOut();

            router.replace(
                '/dashboard/login'
            );

            router.refresh();
        };

    return (
        <button
            type="button"
            onClick={
                handleSignOut
            }
            className="inline-flex items-center gap-2 rounded-xl border border-brand-border px-3.5 py-2 text-sm text-brand-textSecondary transition hover:border-brand-cream/40 hover:text-brand-cream"
        >
            <LogOut className="h-4 w-4" />
            Sign out
        </button>
    );
}