import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(600px circle at 50% 0%, #4f63d2, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Get in Touch</span>
        <h2 className="font-display text-balance mt-4 text-3xl font-bold text-navy-900 sm:text-4xl">
          Ready for IT that just works?
        </h2>
        <p className="mt-4 text-navy-500">
          Tell us about your team and we'll put together a free assessment of your current setup.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-indigo-500 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Work email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <input
            name="company"
            type="text"
            placeholder="Company"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-indigo-500 focus:outline-none"
          />
          <textarea
            name="message"
            rows={4}
            required
            placeholder="What are you looking to solve?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-indigo-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-full bg-indigo-500 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send Message →'}
          </button>

          {status === 'sent' && (
            <p className="text-center text-sm font-medium text-teal-600">
              Thanks! We'll be in touch within one business day.
            </p>
          )}
          {status === 'error' && (
            <p className="text-center text-sm font-medium text-red-500">
              Something went wrong — please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
