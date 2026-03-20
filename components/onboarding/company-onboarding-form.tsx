import { cookies } from "next/headers";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { api } from "@/convex/_generated/api";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

async function saveCompanyDetails(formData: FormData) {
  "use server";

  const companyName = formData.get("companyName");
  const ownerName = formData.get("ownerName");
  const ownerRole = formData.get("ownerRole");

  if (
    typeof companyName !== "string" ||
    !companyName.trim() ||
    typeof ownerName !== "string" ||
    !ownerName.trim() ||
    typeof ownerRole !== "string" ||
    !ownerRole.trim()
  ) {
    return;
  }

  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);
  await convex.mutation(api.employers.upsertCurrentEmployer, {
    companyName: companyName.trim(),
    ownerEmail: auth.user.email,
    ownerName: ownerName.trim(),
    ownerRole: ownerRole.trim(),
    authProvider: "unknown",
  });

  const cookieStore = await cookies();
  cookieStore.set("rellax_company_name", companyName.trim(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}

export async function CompanyOnboardingForm() {
  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const employer = await convex.query(api.employers.getCurrentEmployer, {});
  const cookieStore = await cookies();
  const companyName =
    employer?.companyName ?? cookieStore.get("rellax_company_name")?.value ?? "";
  const ownerName =
    employer?.ownerName ??
    [auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ");
  const ownerRole = employer?.ownerRole ?? "";

  return (
    <AuthCard
      eyebrow="Company setup"
      title="Set up your company workspace."
      description="Add your company details before entering the employer dashboard."
    >
      <form action={saveCompanyDetails} className="space-y-5">
        <div>
          <h2 className="font-display text-3xl text-[var(--rellax-ink)]">
            Employer setup
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--rellax-ink-soft)]">
            Add the company name, your name, and your role. If these details
            already exist, the onboarding step is skipped automatically.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-[var(--rellax-ink)]"
          >
            Company name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            defaultValue={companyName}
            className="w-full rounded-2xl border border-black/8 bg-[var(--rellax-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--rellax-sage)]"
            placeholder="Acme Labs"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="ownerName"
            className="block text-sm font-medium text-[var(--rellax-ink)]"
          >
            Your name
          </label>
          <input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            defaultValue={ownerName}
            className="w-full rounded-2xl border border-black/8 bg-[var(--rellax-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--rellax-sage)]"
            placeholder="Jane Doe"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="ownerRole"
            className="block text-sm font-medium text-[var(--rellax-ink)]"
          >
            Your role in the company
          </label>
          <input
            id="ownerRole"
            name="ownerRole"
            type="text"
            required
            defaultValue={ownerRole}
            className="w-full rounded-2xl border border-black/8 bg-[var(--rellax-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--rellax-sage)]"
            placeholder="Founder, HR Lead, Engineering Manager"
          />
        </div>

        <SubmitButton idleLabel="Continue to dashboard" pendingLabel="Saving..." />
      </form>
    </AuthCard>
  );
}
