'use client';

import {CheckCircle2, Loader2, Send} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState, type FormEvent} from 'react';

type FormStatus = 'idle' | 'submitting' | 'success';

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  'w-full rounded-xl border border-[#e7dbc4] bg-[#fffcf5] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/45 outline-none transition-colors focus:border-heading focus:ring-2 focus:ring-heading/25';

const errorFieldClass = 'border-red-300 focus:border-red-400 focus:ring-red-200';

export default function ContactForm() {
  const t = useTranslations('ContactSection');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (data: FormData): FormErrors => {
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const nextErrors: FormErrors = {};

    if (!name) {
      nextErrors.name = t('formErrorRequired');
    }
    if (!email) {
      nextErrors.email = t('formErrorRequired');
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = t('formErrorEmail');
    }
    if (!message) {
      nextErrors.message = t('formErrorRequired');
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus('submitting');

    window.setTimeout(() => {
      setStatus('success');
      form.reset();
    }, 700);
  };

  if (status === 'success') {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-[#e7dbc4] bg-white/72 p-5 text-center shadow-[0_16px_40px_rgba(113,94,58,0.07)] backdrop-blur-sm sm:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-heading/10 text-heading">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="mt-5 text-xl font-semibold tracking-tight text-ink">
          {t('formSuccessTitle')}
        </p>
        <p className="mt-2 max-w-xs text-sm leading-6 text-copy">
          {t('formSuccessDescription')}
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex h-full flex-col rounded-2xl border border-[#e7dbc4] bg-white/72 p-5 shadow-[0_16px_40px_rgba(113,94,58,0.07)] backdrop-blur-sm sm:p-6"
    >
      <p className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
        {t('formTitle')}
      </p>

      <div className="mt-4 flex-1 grid gap-4 sm:grid-cols-2 content-start">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-ink-soft">
            {t('formNameLabel')}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t('formNamePlaceholder')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={`mt-1.5 ${fieldClass} ${errors.name ? errorFieldClass : ''}`}
          />
          {errors.name ? (
            <p id="contact-name-error" className="mt-1.5 text-xs text-red-500">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className="text-sm font-medium text-ink-soft">
            {t('formPhoneLabel')}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t('formPhonePlaceholder')}
            className={`mt-1.5 ${fieldClass}`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-ink-soft">
            {t('formEmailLabel')}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t('formEmailPlaceholder')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`mt-1.5 ${fieldClass} ${errors.email ? errorFieldClass : ''}`}
          />
          {errors.email ? (
            <p id="contact-email-error" className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="text-sm font-medium text-ink-soft">
            {t('formMessageLabel')}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={3}
            placeholder={t('formMessagePlaceholder')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`mt-1.5 resize-none ${fieldClass} ${errors.message ? errorFieldClass : ''}`}
          />
          {errors.message ? (
            <p id="contact-message-error" className="mt-1.5 text-xs text-red-500">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-5 ml-auto flex w-full items-center justify-center gap-2 rounded-xl bg-heading px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(51,100,67,0.2)] transition-colors hover:bg-ink-strong disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-7"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('formSubmittingLabel')}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t('formSubmitLabel')}
          </>
        )}
      </button>
    </form>
  );
}
