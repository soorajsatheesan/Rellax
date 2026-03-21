"use client";

import { signOutEmployerAction } from "@/components/dashboard/account-actions";
import { BrandLogo } from "@/components/global/brand-logo";

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

function IconOverview() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="1.25" y="1.25" width="5.25" height="5.25" rx="1.2" fill="currentColor" />
      <rect x="8.5" y="1.25" width="5.25" height="3.2" rx="1.2" fill="currentColor" opacity="0.65" />
      <rect x="8.5" y="6.35" width="5.25" height="7.4" rx="1.2" fill="currentColor" />
      <rect x="1.25" y="8.45" width="5.25" height="5.3" rx="1.2" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

function IconRole() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M3 4.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3 7.5h6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3 10.5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="4.5" r="2.5" fill="currentColor" />
      <path
        d="M2.2 13c.6-2.15 2.7-3.5 5.3-3.5S12.2 10.85 12.8 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}


const NAV_ITEMS = [
  { label: "Overview", section: "overview", Icon: IconOverview },
  { label: "Employees", section: "employees", Icon: IconUsers },
  { label: "Roles", section: "roles", Icon: IconRole },
  { label: "Profile", section: "profile", Icon: IconProfile },
] as const;

export type DashboardSection = (typeof NAV_ITEMS)[number]["section"];

type Props = {
  companyName: string;
  ownerName?: string | null;
  ownerRole?: string | null;
  ownerEmail?: string | null;
  activeSection?: DashboardSection;
  onSectionChange?: (section: DashboardSection) => void;
};

export function EmployerSidebar({
  companyName,
  ownerName,
  ownerRole,
  activeSection = "overview",
  onSectionChange,
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
        <BrandLogo tone="auto" />
      </div>

      {/* Workspace badge */}
      <div className="px-3 py-3">
        <div
          className="rounded-[0.875rem] px-3 py-2.5"
          style={{
            background: "var(--db-surface)",
            border: "1px solid var(--db-border)",
          }}
        >
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            Workspace
          </p>
          <p
            className="mt-1 truncate text-sm font-semibold"
            style={{ color: "var(--db-text)" }}
          >
            {companyName}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, section, Icon }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSectionChange?.(section)}
              className={`db-nav-btn flex w-full items-center gap-2.5 rounded-[0.75rem] px-3 py-2.5 text-sm font-medium text-left${isActive ? " db-nav-active" : ""}`}
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
                    ? { color: "rgba(255,255,255,0.70)" }
                    : { color: "var(--db-text-muted)" }
                }
              >
                <Icon />
              </span>
              {label}
            </button>
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
          style={{
            background: "var(--db-surface)",
            border: "1px solid var(--db-border)",
          }}
        >
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[0.62rem] font-bold text-white"
            style={{
              background: "var(--rellax-sage)",
              boxShadow: "0 0 0 2px color-mix(in srgb, var(--rellax-sage) 30%, transparent)",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-xs font-semibold"
              style={{ color: "var(--db-text)" }}
            >
              {ownerName ?? "Admin"}
            </p>
            <p
              className="truncate text-[0.6rem] mt-0.5"
              style={{ color: "var(--db-text-muted)" }}
            >
              {ownerRole ?? "Administrator"}
            </p>
          </div>
        </div>
        <form action={signOutEmployerAction}>
          <button
            type="submit"
            className="db-nav-btn w-full rounded-[0.75rem] py-2 text-xs font-medium"
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
