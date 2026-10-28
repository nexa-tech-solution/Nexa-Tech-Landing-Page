import { useEffect, useRef, useState } from "react";
import { env } from "@/config/env";
import { useGoogleLogin } from "@/services/customer-auth";

type GoogleId = {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    auto_select?: boolean;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
  prompt: () => void;
  disableAutoSelect: () => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

const GIS_SRC = "https://accounts.google.com/gsi/client";
let gisPromise: Promise<GoogleId> | null = null;

// Loads Google Identity Services once, on first use.
function loadGis(): Promise<GoogleId> {
  gisPromise ??= new Promise((resolve, reject) => {
    if (window.google) return resolve(window.google.accounts.id);
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => (window.google ? resolve(window.google.accounts.id) : reject(new Error("GIS missing")));
    script.onerror = () => {
      gisPromise = null;
      reject(new Error("Could not load Google sign-in"));
    };
    document.head.appendChild(script);
  });
  return gisPromise;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

// Official Google button when a client id is configured; otherwise a demo
// button that signs in a placeholder customer (mock mode only).
export function GoogleSignInButton() {
  const login = useGoogleLogin();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!env.googleClientId || !buttonRef.current) return;
    let cancelled = false;
    loadGis()
      .then((gis) => {
        if (cancelled || !buttonRef.current) return;
        gis.initialize({
          client_id: env.googleClientId,
          callback: ({ credential }) => login.mutate(credential),
          use_fedcm_for_prompt: true,
        });
        gis.renderButton(buttonRef.current, { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: 320 });
      })
      .catch((e: Error) => setLoadError(e.message));
    return () => {
      cancelled = true;
    };
    // login.mutate is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const error = loadError ?? (login.error ? "Sign-in failed. Please try again." : null);

  return (
    <div className="grid justify-items-center gap-3">
      {env.googleClientId ? (
        <div ref={buttonRef} className="min-h-11" />
      ) : (
        <button
          type="button"
          onClick={() => login.mutate("demo")}
          disabled={login.isPending}
          className="flex w-[320px] max-w-full items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white px-5 py-2.5 text-sm font-semibold text-[#3c4043] transition hover:bg-[#f8f9fa]"
        >
          <GoogleMark /> Continue with Google (demo)
        </button>
      )}
      {login.isPending && <p className="text-sm text-[#6e6d7a]">Signing you in…</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// One Tap: Google's own corner prompt for returning visitors. No-op without a client id.
export function useGoogleOneTap(enabled: boolean) {
  const login = useGoogleLogin();
  useEffect(() => {
    if (!enabled || !env.googleClientId) return;
    const id = setTimeout(() => {
      loadGis()
        .then((gis) => {
          gis.initialize({
            client_id: env.googleClientId,
            callback: ({ credential }) => login.mutate(credential),
            auto_select: true,
            use_fedcm_for_prompt: true,
          });
          gis.prompt();
        })
        .catch(() => {});
    }, 2500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
