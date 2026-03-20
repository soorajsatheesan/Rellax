function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.7 2.5 12 2.5a9.5 9.5 0 0 0 0 19c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12Z"
      />
      <path
        fill="#34A853"
        d="M2.5 7.9l3.2 2.3C6.5 8 9 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.7 2.5 12 2.5c-3.7 0-6.9 2.1-8.5 5.4Z"
      />
      <path
        fill="#4A90E2"
        d="M12 21.5c2.6 0 4.8-.9 6.4-2.5l-3-2.4c-.8.6-1.9 1-3.4 1-3.9 0-5.2-2.6-5.4-3.9l-3.1 2.4A9.5 9.5 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M2.5 16.1 5.6 13.7C5.3 13 5.1 12.5 5.1 12s.2-1 .5-1.7L2.5 7.9A9.4 9.4 0 0 0 1.5 12c0 1.5.4 2.9 1 4.1Z"
      />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path fill="#0A64C9" d="M13 4h8v16h-8z" />
      <path fill="#1975D1" d="M4 6.5h10v11H4z" />
      <path fill="#31A8FF" d="M13 8.2 21 6v12l-8-2.2z" />
      <path
        fill="#fff"
        d="M9 9.1c-1.9 0-3.3 1.4-3.3 3.4S7.1 16 9 16s3.3-1.4 3.3-3.5S10.9 9.1 9 9.1Zm0 5.2c-.9 0-1.5-.7-1.5-1.8S8.1 10.8 9 10.8s1.5.7 1.5 1.7c0 1.1-.6 1.8-1.5 1.8Z"
      />
    </svg>
  );
}

export function SocialAuthLinks({ mode }: { mode: "sign-up" | "sign-in" }) {
  return (
    <div className="space-y-3">
      <a
        href={`/auth/social?mode=${mode}&provider=GoogleOAuth`}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-black/8 px-4 py-3 text-sm font-medium text-[var(--rellax-ink)] transition hover:bg-[var(--rellax-surface)]"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </a>
      <a
        href={`/auth/social?mode=${mode}&provider=MicrosoftOAuth`}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-black/8 px-4 py-3 text-sm font-medium text-[var(--rellax-ink)] transition hover:bg-[var(--rellax-surface)]"
      >
        <OutlookIcon />
        <span>Continue with Outlook</span>
      </a>
    </div>
  );
}
