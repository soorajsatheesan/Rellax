"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  bulkCreateEmployeesAction,
  createEmployeeAction,
  deleteEmployeeAction,
  type BulkUploadResult,
  type EmployeeActionState,
} from "@/components/dashboard/employee-actions";

const initialState: EmployeeActionState = {};

type EmployeeRecord = {
  _id: string;
  employeeId: string;
  email: string;
  fullName: string;
  roleTitle: string;
  status: "active";
  progressPercentage: number;
};

type RoleOption = {
  roleTitle: string;
  roleId?: string;
};

function formatRoleLabel(roleTitle: string) {
  return roleTitle
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="db-nav-btn rounded-full px-3 py-1 text-xs font-medium"
      style={{
        border: `1px solid ${copied ? "rgba(34,197,94,0.35)" : "var(--db-border)"}`,
        color: copied ? "#16a34a" : "var(--db-text-soft)",
        background: copied ? "rgba(34,197,94,0.08)" : "var(--db-card)",
        transition: "color 0.2s, background 0.2s, border-color 0.2s",
      }}
    >
      {copied ? "Copied!" : `Copy ${label}`}
    </button>
  );
}

export function EmployeeManagement({
  employees,
  availableRoles,
}: {
  employees: EmployeeRecord[];
  availableRoles: RoleOption[];
}) {
  const [state, formAction, createPending] = useActionState(createEmployeeAction, initialState);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Remove this employee's access? This cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteEmployeeAction(id);
      setDeletingId(null);
      router.refresh();
    });
  }
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [bulkResult, setBulkResult] = useState<BulkUploadResult | null>(null);
  const [isBulkPending, startBulkTransition] = useTransition();

  function handleBulkUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBulkResult(null);
    startBulkTransition(async () => {
      const result = await bulkCreateEmployeesAction(data);
      setBulkResult(result);
      if (result.successCount > 0) {
        form.reset();
        router.refresh();
      }
    });
  }

  const [clientError, setClientError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    employeeId: "",
    fullName: "",
    roleId: "",
    roleTitle: "",
    email: "",
  });

  function validateForm() {
    if (!/^[a-zA-Z0-9_-]{4,32}$/.test(formValues.employeeId.trim())) {
      return "Use an employee ID with 4 to 32 letters, numbers, hyphens, or underscores.";
    }
    if (!formValues.fullName.trim()) {
      return "Enter the employee name.";
    }
    if (!formValues.roleTitle.trim() || !formValues.roleId.trim()) {
      return "Select the employee role.";
    }
    if (
      !availableRoles.some(
        (role) =>
          role.roleTitle === formValues.roleTitle.trim() &&
          (role.roleId ?? "") === formValues.roleId.trim(),
      )
    ) {
      return "Choose one of the roles defined in role management.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      return "Enter a valid employee email address.";
    }
    return null;
  }

  const inputStyle = {
    width: "100%",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
    background: "var(--db-input)",
    border: "1px solid var(--db-input-border)",
    color: "var(--db-text)",
    transition: "border-color 0.15s",
  } as const;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
      {/* Employee table */}
      <div
        className="rounded-[1.5rem] overflow-hidden"
        style={{
          background: "var(--db-card)",
          border: "1px solid var(--db-border)",
          boxShadow: "var(--db-shadow-md)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid var(--db-border)" }}
        >
          <div>
            <p
              className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
              style={{ color: "var(--db-text-muted)" }}
            >
              Team credentials
            </p>
            <h2
              className="mt-1 text-base font-semibold"
              style={{ color: "var(--db-text)" }}
            >
              Employee access
            </h2>
          </div>
          <span
            className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
            style={{
              background: "var(--db-surface)",
              border: "1px solid var(--db-border)",
              color: "var(--db-text-muted)",
            }}
          >
            {employees.length} active
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr style={{ background: "var(--db-surface)" }}>
                {["Employee ID", "Name", "Role", "Progress", "Status", ""].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left font-mono text-[0.58rem] uppercase tracking-[0.18em] font-semibold"
                    style={{ color: "var(--db-text-muted)" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.length ? (
                employees.map((employee, i) => (
                  <tr
                    key={employee._id}
                    className="transition-colors hover:bg-[var(--db-surface)]"
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid var(--db-border)",
                    }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: "var(--rellax-sage)" }}
                      >
                        {employee.employeeId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--db-text)" }}
                      >
                        {employee.fullName}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--db-text-muted)" }}
                      >
                        {employee.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-sm"
                        style={{ color: "var(--db-text-soft)" }}
                      >
                        {employee.roleTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-20 rounded-full overflow-hidden"
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
                          className="font-mono text-xs tabular-nums font-medium"
                          style={{ color: "var(--db-text-soft)" }}
                        >
                          {employee.progressPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.62rem] font-semibold text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(employee._id)}
                        disabled={deletingId === employee._id || isPending}
                        className="rounded-full px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10 disabled:opacity-40"
                        style={{ border: "1px solid rgba(220,38,38,0.25)" }}
                      >
                        {deletingId === employee._id ? "Removing…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--db-text-soft)" }}
                    >
                      No employees yet.
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--db-text-muted)" }}
                    >
                      Create your first employee credential using the form.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add employee form */}
      <div
        className="rounded-[1.5rem] overflow-hidden"
        style={{
          background: "var(--db-card)",
          border: "1px solid var(--db-border)",
          boxShadow: "var(--db-shadow-md)",
        }}
      >
        {/* Card header */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid var(--db-border)" }}
        >
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
            style={{ color: "var(--db-text-muted)" }}
          >
            Add employee
          </p>
          <h2
            className="mt-1 text-base font-semibold"
            style={{ color: "var(--db-text)" }}
          >
            Create credentials
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 px-6 pt-4">
          {(["single", "bulk"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="rounded-full px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] font-semibold transition"
              style={{
                background: activeTab === tab ? "var(--rellax-sage)" : "var(--db-surface)",
                color: activeTab === tab ? "#fff" : "var(--db-text-muted)",
                border: activeTab === tab ? "1px solid transparent" : "1px solid var(--db-border)",
              }}
            >
              {tab === "single" ? "Single" : "Bulk CSV"}
            </button>
          ))}
        </div>

        {activeTab === "single" && <form
          action={formAction}
          className="space-y-3 p-6"
          onSubmit={(event) => {
            const nextError = validateForm();
            if (nextError) {
              event.preventDefault();
              setClientError(nextError);
              return;
            }
            setClientError(null);
          }}
        >
          <input
            name="employeeId"
            type="text"
            required
            placeholder="Employee ID"
            value={formValues.employeeId}
            onChange={(e) => setFormValues((s) => ({ ...s, employeeId: e.target.value }))}
            onBlur={() => clientError && setClientError(validateForm())}
            style={inputStyle}
          />
          <input
            name="fullName"
            type="text"
            required
            placeholder="Employee name"
            value={formValues.fullName}
            onChange={(e) => setFormValues((s) => ({ ...s, fullName: e.target.value }))}
            onBlur={() => clientError && setClientError(validateForm())}
            style={inputStyle}
          />
          <input type="hidden" name="roleId" value={formValues.roleId} />
          <select
            name="roleTitle"
            required
            value={formValues.roleTitle}
            onChange={(e) => {
              const nextRole = availableRoles.find(
                (role) => role.roleTitle === e.target.value,
              );
              setFormValues((s) => ({
                ...s,
                roleTitle: e.target.value,
                roleId: nextRole?.roleId ?? "",
              }));
            }}
            onBlur={() => clientError && setClientError(validateForm())}
            style={inputStyle}
            disabled={availableRoles.length === 0}
          >
            <option value="">
              {availableRoles.length === 0 ? "Add roles first in role management" : "Select employee role"}
            </option>
            {availableRoles.map((role) => (
              <option key={role.roleId ?? role.roleTitle} value={role.roleTitle}>
                {formatRoleLabel(role.roleTitle)}
              </option>
            ))}
          </select>
          <input
            name="email"
            type="email"
            required
            placeholder="employee@company.com"
            value={formValues.email}
            onChange={(e) => setFormValues((s) => ({ ...s, email: e.target.value }))}
            onBlur={() => clientError && setClientError(validateForm())}
            style={inputStyle}
          />

          {/* Info note */}
          <div
            className="rounded-[0.75rem] px-4 py-3 text-xs leading-6"
            style={{
              background: "var(--db-surface)",
              border: "1px solid var(--db-border)",
              color: "var(--db-text-soft)",
            }}
          >
            {availableRoles.length === 0
              ? "Add at least one role in role management before creating employee credentials."
              : "Rellax auto-generates a strong temporary password when the credential is created."}
          </div>

          {/* Errors */}
          {clientError ? (
            <p className="rounded-[0.75rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-500">
              {clientError}
            </p>
          ) : null}

          {!clientError && state.error ? (
            <p className="rounded-[0.75rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-500">
              {state.error}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-[0.75rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600">
              {state.success}
            </p>
          ) : null}

          {/* Credentials reveal */}
          {state.credentials ? (
            <div className="space-y-3 rounded-[0.875rem] border border-emerald-400/25 bg-emerald-500/8 p-4">
              <div>
                <p className="text-xs font-semibold text-emerald-600">
                  Copy these employee credentials
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--db-text-muted)" }}>
                  Share the employee ID and temporary password securely.
                </p>
              </div>
              <div
                className="rounded-[0.75rem] p-3"
                style={{
                  background: "var(--db-card)",
                  border: "1px solid var(--db-border)",
                }}
              >
                <p className="text-[0.6rem] uppercase tracking-[0.16em] text-emerald-600 font-mono">
                  Employee ID
                </p>
                <p className="mt-1.5 font-mono text-xs" style={{ color: "var(--db-text)" }}>
                  {state.credentials.employeeId}
                </p>
              </div>
              <div
                className="rounded-[0.75rem] p-3"
                style={{
                  background: "var(--db-card)",
                  border: "1px solid var(--db-border)",
                }}
              >
                <p className="text-[0.6rem] uppercase tracking-[0.16em] text-emerald-600 font-mono">
                  Temporary password
                </p>
                <p className="mt-1.5 font-mono text-xs" style={{ color: "var(--db-text)" }}>
                  {state.credentials.password}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <CopyButton value={state.credentials.employeeId} label="employee ID" />
                <CopyButton value={state.credentials.password} label="password" />
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={createPending || availableRoles.length === 0}
            className="inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-85 disabled:opacity-60"
            style={{ background: "var(--rellax-sage)" }}
          >
            {createPending ? "Creating…" : "Create employee access"}
          </button>
        </form>}

        {activeTab === "bulk" && (
          <form onSubmit={handleBulkUpload} className="space-y-4 p-6">
            {/* Format hint */}
            <div
              className="rounded-[0.75rem] px-4 py-3 text-xs leading-6 space-y-1"
              style={{
                background: "var(--db-surface)",
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
              }}
            >
              <p className="font-semibold" style={{ color: "var(--db-text)" }}>
                Expected columns (no header required):
              </p>
              <p className="font-mono" style={{ color: "var(--db-text-muted)" }}>
                employeeId, fullName, roleTitle, email
              </p>
            </div>

            {/* File input */}
            <div>
              <label
                className="block text-xs mb-1.5 font-medium"
                style={{ color: "var(--db-text-muted)" }}
              >
                Upload file{" "}
                <span style={{ color: "var(--db-text-soft)" }}>(.csv or .xlsx)</span>
              </label>
              <input
                type="file"
                name="file"
                accept=".csv,.xlsx"
                required
                className="block w-full text-xs cursor-pointer"
                style={{ color: "var(--db-text-soft)" }}
              />
            </div>

            {/* Result feedback */}
            {bulkResult && (
              <div className="space-y-2">
                {bulkResult.successCount > 0 && (
                  <p className="rounded-[0.75rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600">
                    {bulkResult.successCount} employee{bulkResult.successCount !== 1 ? "s" : ""} created
                    {bulkResult.failedCount > 0 ? `, ${bulkResult.failedCount} failed` : " successfully"}.
                  </p>
                )}
                {bulkResult.successCount === 0 && bulkResult.failedCount > 0 && (
                  <p className="rounded-[0.75rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-500">
                    All {bulkResult.failedCount} row{bulkResult.failedCount !== 1 ? "s" : ""} failed.
                  </p>
                )}
                {bulkResult.errors.length > 0 && (
                  <div
                    className="rounded-[0.75rem] px-4 py-3 space-y-1"
                    style={{
                      background: "var(--db-surface)",
                      border: "1px solid var(--db-border)",
                    }}
                  >
                    {bulkResult.errors.map((e, i) => (
                      <p key={i} className="font-mono text-[0.68rem]" style={{ color: "var(--db-text-muted)" }}>
                        Row {e.row}{e.employeeId ? ` (${e.employeeId})` : ""}: {e.error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isBulkPending}
              className="inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-85 disabled:opacity-60"
              style={{ background: "var(--rellax-sage)" }}
            >
              {isBulkPending ? "Uploading…" : "Upload employees"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
