import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { business, links } from '../config/business';
import { SERVICE_OPTIONS, onServiceSelected } from '../lib/serviceEvents';

const ENDPOINT = (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined)?.trim() || '';
const isConnected = /^https:\/\/formspree\.io\/f\/\w+$/.test(ENDPOINT);

interface Values {
  name: string;
  phone: string;
  email: string;
  service: string;
  contactMethod: 'Call' | 'Text' | 'Email';
  description: string;
  appointment: string;
}
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  const digits = v.phone.replace(/\D/g, '');
  if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) e.phone = 'Please enter a valid 10-digit phone number.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address, or leave it blank.';
  if (v.contactMethod === 'Email' && !v.email.trim()) e.email = 'Please add an email address so we can reply by email.';
  if (!v.service) e.service = 'Please choose the service you need.';
  if (v.description.trim().length < 10) e.description = 'Please briefly describe the issue (at least a few words).';
  return e;
}

export function Contact({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  const uid = useId();
  const [values, setValues] = useState<Values>({ name: '', phone: '', email: '', service: '', contactMethod: 'Call', description: '', appointment: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const sending = useRef(false);
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => onServiceSelected((s) => setValues((v) => ({ ...v, service: s }))), []);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending.current) return; // blocks duplicate submissions
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    if (!isConnected) {
      setMessage(`Online requests aren't connected yet, so this form did not send. Please call or text ${business.phoneDisplay}, or email ${business.email}.`);
      setStatus('error');
      return;
    }
    // Spam protection: hidden honeypot field and a minimum time on the form.
    if (honeypot.current?.value || Date.now() - startedAt.current < 2500) {
      setMessage('Please take a moment to review your request, then try again.');
      setStatus('error');
      return;
    }

    sending.current = true;
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `Service request: ${values.service}`,
          'Full name': values.name,
          'Phone number': values.phone,
          email: values.email || undefined,
          'Service needed': values.service,
          'Preferred contact method': values.contactMethod,
          'Issue description': values.description,
          'Preferred appointment time': values.appointment || '-',
          _gotcha: honeypot.current?.value ?? '',
        }),
      });
      if (res.ok) setStatus('sent');
      else {
        const data = await res.json().catch(() => null);
        const detail = data?.errors?.map((x: { message: string }) => x.message).join(' ');
        setMessage(detail ? `Your request could not be sent: ${detail}` : `Your request could not be sent. Please try again, or call ${business.phoneDisplay}.`);
        setStatus('error');
      }
    } catch {
      setMessage(`We couldn't reach the server. Please check your connection, or call ${business.phoneDisplay}.`);
      setStatus('error');
    } finally {
      sending.current = false;
    }
  }

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: keyof Values) => errors[k] && <p id={id(`${k}-err`)} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-300" role="alert"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden />{errors[k]}</p>;
  const a11y = (k: keyof Values) => ({ name: k, 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? id(`${k}-err`) : undefined });

  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden py-24 sm:py-32" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute -left-32 top-20 h-[28rem] w-[28rem] rounded-full bg-electric/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-ice/10 blur-[140px]" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[1fr_1.25fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="h2 mt-4">Let's Get Your Home Comfortable Again</h2>
          <p className="mt-5 max-w-md text-lg text-silver/75">Tell us what is happening with your HVAC or electrical system, and get in touch with {business.name}.</p>
          <ul className="mt-10 space-y-5">
            <li className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/15 text-ice"><Phone className="h-5 w-5" aria-hidden /></span><div><p className="text-xs uppercase tracking-[0.2em] text-silver/55">Phone</p><a href={links.call} className="text-lg font-semibold hover:text-ice">{business.phoneDisplay}</a></div></li>
            <li className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/15 text-ice"><Mail className="h-5 w-5" aria-hidden /></span><div><p className="text-xs uppercase tracking-[0.2em] text-silver/55">Email</p><a href={links.email} className="break-all text-lg font-semibold hover:text-ice">{business.email}</a></div></li>
            <li className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/15 text-ice"><MapPin className="h-5 w-5" aria-hidden /></span><div><p className="text-xs uppercase tracking-[0.2em] text-silver/55">Location</p><p className="text-lg font-semibold">{business.location}</p></div></li>
          </ul>
          <div className="mt-10 grid grid-cols-3 gap-3">
            <a href={links.call} className="btn-primary !px-3"><Phone className="h-4 w-4" aria-hidden /> Call Now</a>
            <a href={links.text} className="btn-glass !px-3"><MessageSquare className="h-4 w-4" aria-hidden /> Text Us</a>
            <a href={links.email} className="btn-glass !px-3"><Mail className="h-4 w-4" aria-hidden /> Email</a>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="card flex flex-col items-center justify-center p-10 text-center shadow-glow" role="status" aria-live="polite">
            <CheckCircle2 className="h-14 w-14 text-ice" aria-hidden />
            <h3 className="mt-5 text-3xl font-bold">Request sent</h3>
            <p className="mt-3 max-w-sm text-silver/80">Thank you, {values.name.split(' ')[0]}. Your request was delivered to {business.name}, and we'll reach out by {values.contactMethod.toLowerCase()}.</p>
            <a href={links.call} className="btn-glass mt-8"><Phone className="h-4 w-4" aria-hidden /> Need us sooner? Call {business.phoneDisplay}</a>
          </div>
        ) : (
          <form ref={formRef} noValidate onSubmit={onSubmit} className="card space-y-5 p-6 shadow-glow sm:p-9" aria-label="Service request">
            {!isConnected && (
              <p className="rounded-xl border border-ice/25 bg-ice/10 px-4 py-3 text-sm text-silver">
                <strong className="text-white">Note:</strong> online requests aren't connected yet. For now, please call, text or email. The form will not send.
              </p>
            )}
            {/* Honeypot: hidden from people, often filled in by bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={id('company')}>Company</label>
              <input ref={honeypot} id={id('company')} name="_gotcha" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor={id('name')} className="label">Full name *</label><input id={id('name')} className="field" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} {...a11y('name')} />{err('name')}</div>
              <div><label htmlFor={id('phone')} className="label">Phone number *</label><input id={id('phone')} type="tel" className="field" autoComplete="tel" placeholder="(713) 555-0123" value={values.phone} onChange={(e) => set('phone', e.target.value)} {...a11y('phone')} />{err('phone')}</div>
              <div><label htmlFor={id('email')} className="label">Email address <span className="text-silver/50">(optional)</span></label><input id={id('email')} type="email" className="field" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} {...a11y('email')} />{err('email')}</div>
              <div>
                <label htmlFor={id('service')} className="label">Service needed *</label>
                <select id={id('service')} className="field" value={values.service} onChange={(e) => set('service', e.target.value)} {...a11y('service')}>
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                {err('service')}
              </div>
            </div>
            <fieldset>
              <legend className="label">Preferred contact method *</legend>
              <div className="flex gap-2">
                {(['Call', 'Text', 'Email'] as const).map((m) => (
                  <label key={m} className={`flex-1 cursor-pointer rounded-xl border px-4 py-2.5 text-center text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-ice ${values.contactMethod === m ? 'border-electric bg-electric/20 text-white' : 'border-white/15 text-silver hover:border-white/30'}`}>
                    <input type="radio" name="contactMethod" value={m} checked={values.contactMethod === m} onChange={() => set('contactMethod', m)} className="sr-only" />
                    {m}
                  </label>
                ))}
              </div>
            </fieldset>
            <div><label htmlFor={id('desc')} className="label">Brief description of the issue *</label><textarea id={id('desc')} rows={4} className="field resize-y" placeholder="e.g. AC is running but blowing warm air since yesterday." value={values.description} onChange={(e) => set('description', e.target.value)} {...a11y('description')} />{err('description')}</div>
            <div><label htmlFor={id('appt')} className="label">Preferred appointment time <span className="text-silver/50">(optional)</span></label><input id={id('appt')} className="field" placeholder="e.g. weekday mornings" value={values.appointment} onChange={(e) => set('appointment', e.target.value)} {...a11y('appointment')} /></div>

            {status === 'error' && (
              <p className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{message}</p>
            )}
            <button type="submit" className="btn-primary w-full !py-4 text-base" disabled={status === 'sending'} aria-busy={status === 'sending'}>
              {status === 'sending' ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Sending…</> : 'Send Service Request'}
            </button>
            <p className="text-xs leading-relaxed text-silver/55">
              By submitting, you agree that {business.name} may contact you about your request using the details you provide. We don't sell your information. See our{' '}
              <button type="button" onClick={onOpenPrivacy} className="underline hover:text-ice">Privacy Policy</button>.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
