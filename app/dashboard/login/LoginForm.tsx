'use client';

import {
    FormEvent,
    useState,
} from 'react';
import {
    LockKeyhole,
    Mail,
} from 'lucide-react';
import {
    useRouter,
} from 'next/navigation';

import {
    createAuthBrowserClient,
} from '@/lib/supabase/auth-client';

export default function LoginForm() {
    const router =
        useRouter();

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            const supabase =
                createAuthBrowserClient();

            const {
                error:
                signInError,
            } =
                await supabase.auth.signInWithPassword(
                    {
                        email:
                            email.trim(),
                        password,
                    }
                );

            if (signInError) {
                setError(
                    'Invalid email or password.'
                );
                return;
            }

            router.replace(
                '/dashboard'
            );

            router.refresh();
        } catch (
        loginError
        ) {
            console.error(
                'Dashboard login error:',
                loginError
            );

            setError(
                'Unable to sign in right now. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={
                handleSubmit
            }
            className="mt-8 space-y-5"
        >
            <div>
                <label
                    htmlFor="dashboard-email"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-brand-textSecondary"
                >
                    Email
                </label>

                <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/70" />

                    <input
                        id="dashboard-email"
                        type="email"
                        autoComplete="email"
                        value={
                            email
                        }
                        onChange={(
                            event
                        ) =>
                            setEmail(
                                event
                                    .target
                                    .value
                            )
                        }
                        required
                        className="w-full rounded-2xl border border-brand-border bg-[#151619] py-3.5 pl-11 pr-4 text-sm text-brand-textPrimary outline-none transition focus:border-brand-cream/50"
                        placeholder="vipfadeskoplenz@gmail.com"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="dashboard-password"
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-brand-textSecondary"
                >
                    Password
                </label>

                <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-cream/70" />

                    <input
                        id="dashboard-password"
                        type="password"
                        autoComplete="current-password"
                        value={
                            password
                        }
                        onChange={(
                            event
                        ) =>
                            setPassword(
                                event
                                    .target
                                    .value
                            )
                        }
                        required
                        className="w-full rounded-2xl border border-brand-border bg-[#151619] py-3.5 pl-11 pr-4 text-sm text-brand-textPrimary outline-none transition focus:border-brand-cream/50"
                        placeholder="Enter password"
                    />
                </div>
            </div>

            {error && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={
                    loading
                }
                className="w-full rounded-2xl bg-brand-cream px-4 py-3.5 text-sm font-semibold text-brand-bg transition hover:bg-brand-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading
                    ? 'Signing in...'
                    : 'Sign in'}
            </button>
        </form>
    );
}