import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms — syncsell',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <nav className="mb-12">
        <Link
          href="/"
          className="text-sm text-neutral-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 rounded-sm"
        >
          ← syncsell
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold mb-6">Terms</h1>
      <p className="text-sm text-neutral-500 mb-8">Placeholder — full terms in progress.</p>

      <div className="text-neutral-700 space-y-4 leading-relaxed">
        <p>Plain-English short version:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the service for legitimate multi-channel selling. Don&apos;t abuse it.</li>
          <li>You own your product and inventory data. You&apos;re responsible for the accuracy of what you sync to each channel.</li>
          <li>Accounts can be suspended for abuse, fraud, or violations of third-party channel policies.</li>
          <li>The service is provided as-is. We&apos;ll do our best to keep syncs running but can&apos;t guarantee uninterrupted availability — oversell windows can still happen during outages.</li>
          <li>We can update these terms; we&apos;ll notify you of material changes.</li>
        </ul>
        <p>
          Questions? Email{' '}
          <a href="mailto:hello@syncsell.example" className="underline hover:text-primary-700">
            hello@syncsell.example
          </a>
          .
        </p>
      </div>
    </main>
  );
}
