import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { CompanyOnboardingForm } from "@/components/onboarding/company-onboarding-form";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

export default async function OnboardingPage() {
  const auth = await withAuth();

  if (!auth.user) {
    redirect("/login");
  }

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const employer = await convex.query(api.employers.getCurrentEmployer, {});
  const employeeProfile = await convex.query(api.employees.getCurrentEmployeeProfile, {});

  if (employeeProfile?.employee) {
    redirect("/employee/dashboard");
  }

  if (employer?.companyName && employer?.ownerName && employer?.ownerRole) {
    redirect("/dashboard");
  }

  return <CompanyOnboardingForm />;
}
