import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Link as LinkIcon, RefreshCw, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Top nav */}
      <header className="border-b border-neutral-200">
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 rounded"
          >
            syncsell
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 rounded px-2 py-1"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 bg-primary-700 text-white text-sm font-medium rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2"
            >
              Start free
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.05]">
              Never oversell again.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-600 leading-relaxed">
              You update stock on Shopify and forget Etsy. A customer buys what you don&apos;t have. syncsell keeps one stock number in sync across every channel, automatically.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white text-base font-medium rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2"
              >
                Start free
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-800 text-base font-medium rounded-lg hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* Channel logo strip */}
        <section aria-labelledby="channels-heading" className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <div className="border-y border-neutral-200 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:gap-10 gap-6">
              <h2 id="channels-heading" className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                Works with
              </h2>
              <ul className="flex flex-wrap items-center gap-x-10 gap-y-6">
                <li className="flex items-center gap-2 text-neutral-700">
                  {/* Shopify mark */}
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="text-[#95BF47]">
                    <path
                      fill="currentColor"
                      d="M16.5 5.3c-.2-.1-1.7-.2-1.7-.2s-1.2-1.2-1.3-1.3c-.1-.1-.3-.1-.4-.1 0 0-.2.1-.6.2-.4-1.1-1-2.1-2-2.1h-.1C10.1.9 9.6.7 9.2.7 6.4.7 5.1 4.2 4.7 6c-1.1.3-1.9.6-2 .6-.6.2-.6.2-.7.8C1.9 7.8.5 19 .5 19l10.7 2L17 19.6s-.3-13.9-.3-14c0-.2-.1-.3-.2-.3zM12.3 3.7c-.3.1-.7.2-1.1.4v-.3c0-.7-.1-1.4-.3-1.9.7.1 1.1.9 1.4 1.8zm-1.8-1.6c.2.5.3 1.2.3 2v.2c-.7.2-1.5.5-2.3.7.4-1.7 1.3-2.6 2-2.9zm-.7-.7c.1 0 .3 0 .4.1-.9.4-1.8 1.5-2.2 3.5-.6.2-1.2.4-1.8.5.5-1.6 1.7-4.1 3.6-4.1z"
                    />
                    <path
                      fill="#5E8E3E"
                      d="M16.5 5.3c-.2-.1-1.7-.2-1.7-.2s-1.2-1.2-1.3-1.3c-.1-.1-.1-.1-.2-.1l-1 17.3L17 19.6s-.3-13.9-.3-14c-.1-.2-.1-.3-.2-.3z"
                    />
                    <path
                      fill="#FFF"
                      d="m10.5 8.7-.6 2.1s-.6-.3-1.3-.3c-1.1 0-1.1.7-1.1.9 0 1 2.7 1.4 2.7 3.8 0 1.9-1.2 3.1-2.8 3.1-2 0-3-1.2-3-1.2l.5-1.7s1 .9 1.9.9c.6 0 .8-.5.8-.8 0-1.3-2.2-1.4-2.2-3.6 0-1.8 1.3-3.6 4-3.6 1.2 0 1.1.4 1.1.4z"
                    />
                  </svg>
                  <span className="text-base font-semibold">Shopify</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-700">
                  {/* Etsy mark */}
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="text-[#F1641E]">
                    <path
                      fill="currentColor"
                      d="M9.16 4.45v6.41s2.23.03 3.54-.07c1.02-.16 1.22-.27 1.39-1.28l.25-.99h.74l-.12 2.76.06 2.82h-.74l-.19-.87c-.23-1-.56-1.09-1.39-1.18-1.05-.11-3.54-.08-3.54-.08v5.35c0 1.03.53 1.48 1.7 1.48h3.5c1.09 0 2.18-.09 2.86-1.65l.9-2h.62c-.03.42-.51 4.08-.59 4.85 0 0-3.3-.06-4.7-.06H6.15l-2.22.06v-.72l.73-.15c1.06-.22 1.36-.51 1.36-1.36 0 0 .06-2.88.06-7.64 0-4.77-.06-7.62-.06-7.62 0-.95-.3-1.15-1.36-1.37l-.73-.14V3.5l2.18.06h8.78c1.38 0 3.73-.24 3.73-.24s-.08 1.44-.16 4.83h-.67l-.25-.88c-.24-1.1-.6-1.67-1.27-1.94-.69-.28-1.76-.39-3.19-.39H9.16Z"
                    />
                  </svg>
                  <span className="text-base font-semibold">Etsy</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-700">
                  {/* Amazon mark */}
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="text-[#FF9900]">
                    <path
                      fill="currentColor"
                      d="M13.58 10.56c-.26-.35-.63-.66-1.1-.92-.47-.26-1.2-.5-2.18-.73l-.95-.2c-.36-.08-.62-.18-.78-.3-.16-.12-.24-.27-.24-.46 0-.2.12-.37.35-.5.24-.13.54-.2.93-.2.6 0 1.19.23 1.75.7.14.12.3.18.45.18.13 0 .22-.02.3-.08.07-.05.1-.12.1-.2V6.8c0-.14-.04-.23-.13-.3-.65-.45-1.52-.68-2.58-.68-.96 0-1.75.22-2.36.67-.6.44-.91 1.02-.91 1.72 0 .58.18 1.06.54 1.45.37.4.94.71 1.73.95l1.05.25c.47.13.8.25 1 .37.2.12.3.3.3.52 0 .2-.11.37-.36.52-.24.14-.61.2-1.1.2-.8 0-1.5-.3-2.12-.9-.13-.14-.27-.2-.42-.2-.12 0-.22.03-.3.09-.07.06-.1.14-.1.23v1.1c0 .13.04.22.13.29.8.5 1.72.74 2.77.74 1.08 0 1.94-.23 2.59-.7.65-.46.97-1.08.97-1.85 0-.62-.13-1.12-.39-1.47Z"
                    />
                    <path
                      fill="currentColor"
                      d="M21.96 16.06c-.1-.13-.34-.23-.7-.29-.37-.06-.84-.06-1.43 0-.28.04-.54.09-.78.16-.23.06-.38.12-.44.16-.05.04-.07.08-.07.14 0 .04.02.08.05.1.04.02.09.03.15.03l.29-.03c.89-.11 1.6-.11 2.12 0 .52.11.62.47.3 1.07-.18.36-.4.72-.65 1.07-.1.14-.11.22-.04.26.07.04.16.02.28-.07.81-.62 1.34-1.41 1.6-2.36.07-.27.04-.42-.06-.54Z"
                    />
                    <path
                      fill="currentColor"
                      d="M19.54 18.3C16.87 20.1 13.88 21 10.57 21c-3.39 0-6.5-.87-9.31-2.6-.23-.15-.4-.08-.22.17.77 1.04 1.74 1.93 2.91 2.67 2.14 1.35 4.55 2.04 7.22 2.04 3.31 0 6.32-.9 9.05-2.72 1.03-.69 1.94-1.56 2.7-2.6.18-.22.02-.37-.2-.22"
                    />
                  </svg>
                  <span className="text-base font-semibold">Amazon</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-700">
                  {/* eBay mark */}
                  <svg width="48" height="24" viewBox="0 0 72 24" aria-hidden="true">
                    <text x="0" y="20" fontFamily="Helvetica, Arial, sans-serif" fontSize="20" fontWeight="700">
                      <tspan fill="#E53238">e</tspan>
                      <tspan fill="#0064D2">b</tspan>
                      <tspan fill="#F5AF02">a</tspan>
                      <tspan fill="#86B817">y</tspan>
                    </text>
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-heading" className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <h2 id="how-heading" className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            How it works
          </h2>
          <p className="mt-3 text-neutral-600 max-w-2xl">
            Three steps to stop oversells. No spreadsheets, no manual reconciling.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            <li className="rounded-lg border border-neutral-200 p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-700">
                <LinkIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">1. Connect your stores</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Link Shopify, Etsy, Amazon, or eBay in a few clicks. OAuth only, no scraping.
              </p>
            </li>
            <li className="rounded-lg border border-neutral-200 p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-700">
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">2. Link products across channels</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Match SKUs across stores so syncsell knows a ring on Etsy is the same ring on Shopify.
              </p>
            </li>
            <li className="rounded-lg border border-neutral-200 p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-700">
                <CheckCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">3. Sell on one, stock updates on all</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                One sale on any channel and every other listing drops by one in seconds.
              </p>
            </li>
          </ol>
        </section>

        {/* Testimonial */}
        <section aria-label="Customer quote" className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <figure className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 md:p-10 max-w-3xl mx-auto">
            <blockquote className="text-lg md:text-xl italic text-neutral-800 leading-relaxed">
              &ldquo;Oversold a Valentine&apos;s order on Etsy while it was sold out on Shopify. Never again.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-neutral-600 not-italic">
              &mdash; Morgan, jewelry maker
            </figcaption>
          </figure>
        </section>

        {/* Pricing teaser */}
        <section aria-labelledby="pricing-heading" className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <div className="text-center">
            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
              Simple pricing
            </h2>
            <p className="mt-3 text-neutral-600">Pick the plan that matches how many channels you run.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="rounded-lg border border-neutral-200 p-8 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-900">Starter</h3>
                <span className="text-xs font-medium bg-primary-50 text-primary-800 px-2.5 py-1 rounded-full">
                  Free trial: 14 days
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">For 1&ndash;2 channels.</p>
              <p className="mt-6">
                <span className="text-4xl font-semibold text-neutral-900">$19&ndash;29</span>
                <span className="text-neutral-600"> /mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-700 shrink-0" aria-hidden="true" />
                  <span>Up to 2 connected stores</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-700 shrink-0" aria-hidden="true" />
                  <span>Real-time stock sync</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-700 shrink-0" aria-hidden="true" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center justify-center px-4 py-2.5 border border-neutral-300 text-neutral-800 font-medium rounded-lg hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2"
              >
                Start free
              </Link>
            </div>
            <div className="rounded-lg border-2 border-primary-700 p-8 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-900">Growth</h3>
                <span className="text-xs font-medium bg-primary-50 text-primary-800 px-2.5 py-1 rounded-full">
                  Free trial: 14 days
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">For 3+ channels.</p>
              <p className="mt-6">
                <span className="text-4xl font-semibold text-neutral-900">$39&ndash;49</span>
                <span className="text-neutral-600"> /mo</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-700 shrink-0" aria-hidden="true" />
                  <span>Unlimited connected stores</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-700 shrink-0" aria-hidden="true" />
                  <span>Priority sync + bulk linking</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-700 shrink-0" aria-hidden="true" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center justify-center px-4 py-2.5 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2"
              >
                Start free
              </Link>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section aria-label="Sign up" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-lg bg-neutral-900 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Start your 14-day free trial
              </h2>
              <p className="mt-2 text-neutral-300">No credit card needed. Connect your first store in minutes.</p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white font-medium rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 focus:ring-offset-neutral-900 whitespace-nowrap"
            >
              Start free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-neutral-600">
          <p className="font-semibold text-neutral-900">syncsell</p>
          <nav className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 rounded"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 rounded"
            >
              Terms
            </Link>
            <span>&copy; {year} syncsell</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
