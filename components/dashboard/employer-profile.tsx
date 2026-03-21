"use client";

import { useActionState, useState } from "react";

import {
  updateEmployerProfileAction,
  type ProfileActionState,
} from "@/components/dashboard/profile-actions";
import { deleteAccountAction } from "@/components/dashboard/account-actions";

type Props = {
  employer: {
    companyName: string;
    companyLogoUrl?: string | null;
    companyWebsite?: string | null;
    industry?: string | null;
    companySize?: string | null;
    headquarters?: string | null;
    aboutCompany?: string | null;
    ownerEmail: string;
    ownerName?: string | null;
    ownerRole?: string | null;
  };
};

const initialState: ProfileActionState = {};

export function EmployerProfile({ employer }: Props) {
  const [state, formAction, pending] = useActionState(
    updateEmployerProfileAction,
    initialState,
  );
  const [logoOverride, setLogoOverride] = useState<string | null>(null);
  const logoValue = logoOverride ?? employer.companyLogoUrl ?? "";

  async function handleLogoUpload(file: File | undefined) {
    if (!file) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Unable to read the selected image."));
      reader.readAsDataURL(file);
    });

    setLogoOverride(dataUrl);
  }

  const inputStyle = {
    width: "100%",
    borderRadius: "0.9rem",
    padding: "0.85rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
    background: "var(--db-input)",
    border: "1px solid var(--db-input-border)",
    color: "var(--db-text)",
  } as const;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <section
        className="rounded-[1.5rem] p-6"
        style={{
          background: "var(--db-card)",
          border: "1px solid var(--db-border)",
          boxShadow: "var(--db-shadow-md)",
        }}
      >
        <p
          className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
          style={{ color: "var(--db-text-muted)" }}
        >
          Company identity
        </p>
        <div className="mt-6 flex flex-col items-center text-center">
          <div
            className="flex size-28 items-center justify-center overflow-hidden rounded-[1.75rem]"
            style={{
              background: "var(--db-surface)",
              border: "2px solid var(--db-border)",
              boxShadow: "var(--db-shadow-md)",
            }}
          >
            {logoValue ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoValue}
                alt={`${employer.companyName} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                className="font-display text-3xl font-semibold"
                style={{ color: "var(--rellax-sage)" }}
              >
                {employer.companyName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <h2
            className="mt-4 text-xl font-semibold"
            style={{ color: "var(--db-text)", letterSpacing: "-0.02em" }}
          >
            {employer.companyName}
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "var(--db-text-soft)" }}>
            {employer.ownerName ?? "Workspace owner"} · {employer.ownerRole ?? "Administrator"}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--db-text-muted)" }}>
            {employer.ownerEmail}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <InfoPill label="Industry" value={employer.industry || "Not set"} />
          <InfoPill label="Company size" value={employer.companySize || "Not set"} />
          <InfoPill label="Headquarters" value={employer.headquarters || "Not set"} />
          <InfoPill label="Website" value={employer.companyWebsite || "Not set"} />
        </div>

        <div
          className="mt-6 rounded-[1rem] p-4"
          style={{
            background: "color-mix(in srgb, var(--rellax-sage) 8%, var(--db-surface))",
            border: "1px solid color-mix(in srgb, var(--rellax-sage) 20%, var(--db-border))",
          }}
        >
          <p
            className="text-xs font-semibold"
            style={{ color: "color-mix(in srgb, var(--rellax-sage) 80%, var(--db-text))" }}
          >
            Profile guidance
          </p>
          <p className="mt-2 text-xs leading-[1.75]" style={{ color: "var(--db-text-soft)" }}>
            Add a square company logo, concise company summary, and basic operating details so
            the dashboard feels polished for admins and employees.
          </p>
        </div>
      </section>

      <section
        className="rounded-[1.5rem] overflow-hidden"
        style={{
          background: "var(--db-card)",
          border: "1px solid var(--db-border)",
          boxShadow: "var(--db-shadow-md)",
        }}
      >
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid var(--db-border)" }}
        >
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
            style={{ color: "var(--db-text-muted)" }}
          >
            Profile settings
          </p>
          <h2 className="mt-1 text-base font-semibold" style={{ color: "var(--db-text)" }}>
            Manage company profile
          </h2>
        </div>

        <form action={formAction} className="space-y-4 p-6">
          <input type="hidden" name="companyLogoUrl" value={logoValue} />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company name">
              <input
                name="companyName"
                defaultValue={employer.companyName}
                required
                style={inputStyle}
              />
            </Field>
            <Field label="Company website">
              <input
                name="companyWebsite"
                type="url"
                defaultValue={employer.companyWebsite ?? ""}
                placeholder="https://company.com"
                style={inputStyle}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Owner name">
              <input
                name="ownerName"
                defaultValue={employer.ownerName ?? ""}
                required
                style={inputStyle}
              />
            </Field>
            <Field label="Owner role">
              <input
                name="ownerRole"
                defaultValue={employer.ownerRole ?? ""}
                required
                style={inputStyle}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Industry">
              <input
                name="industry"
                defaultValue={employer.industry ?? ""}
                placeholder="SaaS, Healthcare, Retail"
                style={inputStyle}
              />
            </Field>
            <Field label="Company size">
              <input
                name="companySize"
                defaultValue={employer.companySize ?? ""}
                placeholder="11-50 employees"
                style={inputStyle}
              />
            </Field>
            <Field label="Headquarters">
              <input
                name="headquarters"
                defaultValue={employer.headquarters ?? ""}
                placeholder="Bengaluru, India"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Company logo">
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  void handleLogoUpload(event.currentTarget.files?.[0]);
                }}
                className="block w-full text-sm"
                style={{ color: "var(--db-text-soft)" }}
              />
              <input
                type="url"
                value={logoValue}
                onChange={(event) => {
                  setLogoOverride(event.target.value);
                }}
                placeholder="Or paste a logo image URL"
                style={inputStyle}
              />
            </div>
          </Field>

          <Field label="About company">
            <textarea
              name="aboutCompany"
              rows={5}
              defaultValue={employer.aboutCompany ?? ""}
              placeholder="Describe your team, culture, and what new employees should know."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>

          {state.error ? (
            <p className="rounded-[0.875rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {state.error}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-[0.875rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
              {state.success}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-w-[210px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--rellax-sage)" }}
            >
              {pending ? "Saving profile…" : "Save company profile"}
            </button>
            <span className="text-xs" style={{ color: "var(--db-text-muted)" }}>
              Profile updates are reflected across the employer workspace.
            </span>
          </div>
        </form>

        <div
          className="border-t p-6"
          style={{ borderColor: "rgba(220,38,38,0.16)" }}
        >
          <div
            className="rounded-[1.25rem] p-5"
            style={{
              background: "var(--db-card)",
              border: "1px solid rgba(220,38,38,0.20)",
            }}
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-red-500">
              Danger zone
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-sm font-semibold" style={{ color: "var(--db-text)" }}>
                  Delete employer account
                </p>
                <p className="mt-1 text-xs leading-6" style={{ color: "var(--db-text-soft)" }}>
                  Permanently deletes your workspace, employee accounts, and associated data.
                </p>
              </div>
              <form action={deleteAccountAction}>
                <button
                  type="submit"
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10 active:opacity-75"
                  style={{ border: "1px solid rgba(220,38,38,0.30)" }}
                >
                  Delete account
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span
        className="text-xs font-semibold"
        style={{ color: "var(--db-text-soft)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  const isEmpty = value === "Not set";
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-[0.95rem] px-4 py-3"
      style={{
        background: "var(--db-surface)",
        border: "1px solid var(--db-border)",
      }}
    >
      <p
        className="font-mono text-[0.58rem] uppercase tracking-[0.17em] shrink-0"
        style={{ color: "var(--db-text-muted)" }}
      >
        {label}
      </p>
      <p
        className="truncate text-sm text-right font-medium"
        style={{ color: isEmpty ? "var(--db-text-muted)" : "var(--db-text)" }}
      >
        {value}
      </p>
    </div>
  );
}
