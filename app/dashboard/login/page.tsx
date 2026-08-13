import LoginForm from './LoginForm';

export const metadata = {
    title:
        'Mitarbeiter-Login | VIP FADES',
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function DashboardLoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0b0c0e] px-4 py-10">
            <section className="w-full max-w-md rounded-3xl border border-brand-border bg-[#111214] p-6 shadow-2xl sm:p-8">
                <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-brand-cream">
                        VIP FADES
                    </p>

                    <h1 className="mt-3 font-serif text-3xl text-brand-textPrimary">
                        Mitarbeiter-Dashboard
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-brand-textSecondary">
                        Melde dich an, um auf das private Buchungs-Dashboard zuzugreifen.
                    </p>
                </div>

                <LoginForm />
            </section>
        </main>
    );
}