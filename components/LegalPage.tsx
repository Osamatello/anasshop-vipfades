import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageAtmosphere from '@/components/PageAtmosphere';

/** Shared shell for Impressum and Datenschutzerklärung. */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-brand-bg text-brand-textPrimary">
      <PageAtmosphere />
      <div className="relative z-10">
        <Header />

        <article className="mx-auto max-w-3xl px-5 pb-20 pt-36 sm:px-8 sm:pt-40">
          <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-xs text-brand-textSecondary">Stand: {updated}</p>

          <div className="legal-content mt-10 space-y-8 text-[15px] font-light leading-7 text-brand-textPrimary/85 [&_a]:text-brand-cream [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-brand-textPrimary [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-brand-textPrimary [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:space-y-1">
            {children}
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
