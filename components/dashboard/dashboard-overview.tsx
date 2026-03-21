type OverviewEmployee = {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  roleTitle: string;
  status: "active";
  progressPercentage: number;
};

type OverviewRole = {
  _id: string;
  roleTitle: string;
  requiredSkills: string[];
  updatedAt: number;
};

type Props = {
  companyName: string;
  companyWebsite?: string | null;
  industry?: string | null;
  companySize?: string | null;
  headquarters?: string | null;
  aboutCompany?: string | null;
  employees: OverviewEmployee[];
  roles: OverviewRole[];
};

function formatUpdatedAt(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function DashboardOverview({
  companyName,
  companyWebsite,
  industry,
  companySize,
  headquarters,
  aboutCompany,
  employees,
  roles,
}: Props) {
  const averageProgress = employees.length
    ? Math.round(
        employees.reduce((sum, employee) => sum + employee.progressPercentage, 0) /
          employees.length,
      )
    : 0;

  const topEmployees = [...employees]
    .sort((a, b) => b.progressPercentage - a.progressPercentage)
    .slice(0, 4);

  const recentRoles = [...roles]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div
          className="rounded-[1.75rem] p-8"
          style={{
            background:
              "linear-gradient(140deg, color-mix(in srgb, var(--rellax-sage) 88%, white 12%) 0%, color-mix(in srgb, var(--rellax-slate) 80%, black 20%) 100%)",
            boxShadow: "var(--db-shadow-lg)",
          }}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-white/60">
            Overview
          </p>
          <h2 className="mt-3 font-display text-3xl text-white" style={{ letterSpacing: "-0.02em" }}>
            {companyName} workspace at a glance
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-[1.8] text-white/70">
            {aboutCompany ||
              "Track onboarding readiness, review active roles, and keep your company profile polished in one operational dashboard."}
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <MetricChip label="Active employees" value={String(employees.length)} />
            <MetricChip label="Average progress" value={`${averageProgress}%`} />
            <MetricChip label="Defined roles" value={String(roles.length)} />
          </div>
        </div>

        <div
          className="rounded-[1.75rem] p-6"
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
            Company snapshot
          </p>
          <div className="mt-5 space-y-4">
            <SnapshotRow label="Industry" value={industry || "—"} empty={!industry} />
            <SnapshotRow label="Company size" value={companySize || "—"} empty={!companySize} />
            <SnapshotRow label="Headquarters" value={headquarters || "—"} empty={!headquarters} />
            <SnapshotRow label="Website" value={companyWebsite || "—"} empty={!companyWebsite} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div
          className="rounded-[1.5rem] overflow-hidden"
          style={{
            background: "var(--db-card)",
            border: "1px solid var(--db-border)",
            boxShadow: "var(--db-shadow-md)",
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom: "1px solid var(--db-border)" }}
          >
            <div>
              <p
                className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
                style={{ color: "var(--db-text-muted)" }}
              >
                Team performance
              </p>
              <h3
                className="mt-1 text-base font-semibold"
                style={{ color: "var(--db-text)" }}
              >
                Highest onboarding progress
              </h3>
            </div>
          </div>

          {topEmployees.length ? (
            <div className="divide-y" style={{ borderColor: "var(--db-border)" }}>
              {topEmployees.map((employee) => (
                <div
                  key={employee._id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--db-text)" }}>
                      {employee.fullName}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--db-text-muted)" }}>
                      {employee.roleTitle} · {employee.email}
                    </p>
                  </div>
                  <div className="flex min-w-[144px] items-center gap-3">
                    <div
                      className="h-2 flex-1 overflow-hidden rounded-full"
                      style={{ background: "var(--db-surface)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${employee.progressPercentage}%`,
                          background: "var(--rellax-sage)",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <span
                      className="font-mono text-xs tabular-nums font-medium w-9 text-right"
                      style={{ color: "var(--db-text-soft)" }}
                    >
                      {employee.progressPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No employee activity yet"
              description="Create your first employee credential to start tracking onboarding progress."
            />
          )}
        </div>

        <div
          className="rounded-[1.5rem] overflow-hidden"
          style={{
            background: "var(--db-card)",
            border: "1px solid var(--db-border)",
            boxShadow: "var(--db-shadow-md)",
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom: "1px solid var(--db-border)" }}
          >
            <div>
              <p
                className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
                style={{ color: "var(--db-text-muted)" }}
              >
                Role coverage
              </p>
              <h3
                className="mt-1 text-base font-semibold"
                style={{ color: "var(--db-text)" }}
              >
                Recently updated roles
              </h3>
            </div>
          </div>

          {recentRoles.length ? (
            <div className="space-y-3 px-6 py-5">
              {recentRoles.map((role) => (
                <div
                  key={role._id}
                  className="rounded-[1rem] p-4"
                  style={{
                    background: "var(--db-surface)",
                    border: "1px solid var(--db-border)",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold capitalize" style={{ color: "var(--db-text)" }}>
                      {role.roleTitle}
                    </p>
                    <span
                      className="font-mono text-[0.62rem] uppercase tracking-[0.15em]"
                      style={{ color: "var(--db-text-muted)" }}
                    >
                      {formatUpdatedAt(role.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {role.requiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full px-2.5 py-1 font-mono text-[0.62rem]"
                        style={{
                          color: "var(--db-text-soft)",
                          background: "var(--db-card)",
                          border: "1px solid var(--db-border)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No roles configured"
              description="Define role requirements to map employees to the right onboarding path."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-white/20 bg-white/10 px-4 py-3.5 backdrop-blur-sm">
      <p className="font-mono text-[0.57rem] uppercase tracking-[0.18em] text-white/55">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-white" style={{ letterSpacing: "-0.02em" }}>{value}</p>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-[0.75rem] px-3 py-2.5"
      style={{ background: "var(--db-surface)" }}
    >
      <p className="text-xs font-medium shrink-0" style={{ color: "var(--db-text-muted)" }}>
        {label}
      </p>
      <p
        className="truncate text-right text-sm font-medium"
        style={{ color: empty ? "var(--db-text-muted)" : "var(--db-text)" }}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="text-sm font-semibold" style={{ color: "var(--db-text)" }}>
        {title}
      </p>
      <p className="mt-1 text-xs leading-6" style={{ color: "var(--db-text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
