import Link from "next/link";

import { signOutEmployerAction } from "@/components/dashboard/account-actions";
import { BrandLogo } from "@/components/global/brand-logo";

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="5.5" height="5.5" rx="1.25" fill="currentColor" />
      <rect x="9" y="0.5" width="5.5" height="5.5" rx="1.25" fill="currentColor" />
      <rect x="0.5" y="9" width="5.5" height="5.5" rx="1.25" fill="currentColor" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="5.5" cy="4.5" r="2.5" fill="currentColor" />
      <path
        d="M1 13c0-2.485 2.015-4.5 4.5-4.5S10 10.515 10 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="11.5" cy="4.5" r="2" fill="currentColor" opacity="0.5" />
      <path
        d="M13 13c0-1.657-.895-3.107-2.221-3.895"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="2" fill="currentColor" />
      <path
        d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.93 2.93l1.06 1.06M11.01 11.01l1.06 1.06M2.93 12.07l1.06-1.06M11.01 3.99l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", Icon: IconGrid },
  { label: "Team", href: "/dashboard", Icon: IconUsers },
  { label: "Settings", href: "/dashboard", Icon: IconSettings },
];

type Props = {
  companyName: string;
  ownerName?: string | null;
  ownerRole?: string | null;
  ownerEmail?: string | null;
  activeItem?: string;
};

export function EmployerSidebar({
  companyName,
  ownerName,
  ownerRole,
  activeItem = "Overview",
}: Props) {
  const initials = (ownerName ?? "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-20 flex w-[220px] flex-col"
      style={{
        background: "var(--db-sidebar)",
        borderRight: "1px solid var(--db-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-14 items-center px-5"
        style={{ borderBottom: "1px solid var(--db-border)" }}
      >
        <BrandLogo />
      </div>

      {/* Workspace badge */}
      <div className="px-3 py-3">
        <div
          className="rounded-[0.875rem] px-3 py-2.5"
          style={{ background: "var(--db-surface)" }}
        >
          <p
            className="font-mono text-[0.62rem] uppercase tracking-[0.2em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            Workspace
          </p>
          <p
            className="mt-0.5 truncate text-sm font-semibold"
            style={{ color: "var(--db-text)" }}
          >
            {companyName}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const isActive = activeItem === label;
          return (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2.5 rounded-[0.75rem] px-3 py-2.5 text-sm font-medium transition"
              style={
                isActive
                  ? {
                      background: "var(--db-nav-active-bg)",
                      color: "var(--db-nav-active-tx)",
                    }
                  : {
                      color: "var(--db-text-soft)",
                    }
              }
            >
              <span
                style={
                  isActive
                    ? { color: "rgba(255,255,255,0.65)" }
                    : { color: "var(--db-text-muted)" }
                }
              >
                <Icon />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div
        className="p-3 space-y-2"
        style={{ borderTop: "1px solid var(--db-border)" }}
      >
        <div
          className="flex items-center gap-3 rounded-[0.875rem] px-3 py-2.5"
          style={{ background: "var(--db-surface)" }}
        >
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[0.6rem] font-bold text-white"
            style={{ background: "var(--rellax-sage)" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-xs font-semibold"
              style={{ color: "var(--db-text)" }}
            >
              {ownerName ?? "Admin"}
            </p>
            <p
              className="truncate text-[0.62rem]"
              style={{ color: "var(--db-text-muted)" }}
            >
              {ownerRole ?? "Administrator"}
            </p>
          </div>
        </div>
        <form action={signOutEmployerAction}>
          <button
            type="submit"
            className="w-full rounded-[0.75rem] py-2 text-xs font-medium transition"
            style={{
              border: "1px solid var(--db-border)",
              color: "var(--db-text-soft)",
              background: "transparent",
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
