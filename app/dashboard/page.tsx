import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

function getSection(value?: string) {
  if (value === "employees" || value === "roles" || value === "profile") {
    return value;
  }

  return "overview";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const auth = await withAuth();

  if (!auth.user) {
    redirect("/login");
  }

  const { section: sectionParam } = await searchParams;
  const section = getSection(sectionParam);

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const employeeProfile = await convex.query(api.employees.getCurrentEmployeeProfile, {});

  if (employeeProfile?.employee) {
    redirect("/employee/dashboard");
  }

  const workspace = await convex.query(api.employers.getCurrentEmployerWorkspace, {});

  if (!workspace?.employer) {
    redirect("/onboarding");
  }

  const { employer, employees } = workspace;

  const roleRequirements = await convex.query(
    api.roleRequirements.getRoleRequirementsForEmployer,
    {},
  );

  const progressRecords = await convex.query(
    api.employeeProgress.getEmployeeProgressByEmployer,
    {},
  );

  const progressMap = new Map(
    progressRecords.map((p) => [p.employeeId, p.progressPercentage]),
  );

  const employeesWithProgress = employees.map((employee) => ({
    _id: employee._id,
    employeeId: employee.employeeId,
    email: employee.email,
    fullName: employee.fullName,
    roleTitle: employee.roleTitle,
    status: employee.status,
    progressPercentage: progressMap.get(employee._id) ?? 0,
  }));

  const activeCount = employees.filter((e) => e.status === "active").length;
  const uniqueRoles = new Set(
    employees.map((e) => e.roleTitle).filter(Boolean),
  ).size;
  const averageProgress = employeesWithProgress.length
    ? Math.round(
        employeesWithProgress.reduce(
          (sum, employee) => sum + employee.progressPercentage,
          0,
        ) / employeesWithProgress.length,
      )
    : 0;

  return (
    <DashboardShell
      initialSection={section}
      employer={{
        companyName: employer.companyName,
        companyLogoUrl: employer.companyLogoUrl,
        companyWebsite: employer.companyWebsite,
        industry: employer.industry,
        companySize: employer.companySize,
        headquarters: employer.headquarters,
        aboutCompany: employer.aboutCompany,
        ownerEmail: employer.ownerEmail ?? auth.user.email,
        ownerName: employer.ownerName,
        ownerRole: employer.ownerRole,
      }}
      employees={employeesWithProgress}
      roles={roleRequirements}
      activeCount={activeCount}
      uniqueRoles={uniqueRoles}
      averageProgress={averageProgress}
    />
  );
}
