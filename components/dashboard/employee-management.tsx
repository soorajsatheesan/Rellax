"use client";

import { useActionState, useState } from "react";

import {
  createEmployeeAction,
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
};

function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
      }}
      className="rounded-full px-3 py-1 text-xs font-medium transition"
      style={{
        border: "1px solid var(--db-border)",
        color: "var(--db-text-soft)",
        background: "var(--db-card)",
      }}
    >
      Copy {label}
    </button>
  );
}

export function EmployeeManagement({
  employees,
}: {
  employees: EmployeeRecord[];
}) {
  const [state, formAction] = useActionState(createEmployeeAction, initialState);
  const [clientError, setClientError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    employeeId: "",
    fullName: "",
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
    if (!formValues.roleTitle.trim()) {
      return "Enter the employee role.";
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
          boxShadow: "var(--db-shadow-sm)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid var(--db-border)" }}
        >
          <div>
            <p
              className="font-mono text-[0.62rem] uppercase tracking-[0.2em] font-semibold"
              style={{ color: "var(--db-text-muted)" }}
            >
              Team credentials
            </p>
            <h2
              className="mt-0.5 text-base font-semibold"
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
                {["Employee ID", "Name", "Role", "Status"].map((col) => (
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
                    className="transition"
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
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.62rem] font-semibold text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-14 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--db-text-soft)" }}
                    >
                      No employees added yet.
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "var(--db-text-muted)" }}
                    >
                      Use the form to create the first employee credential.
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
          boxShadow: "var(--db-shadow-sm)",
        }}
      >
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid var(--db-border)" }}
        >
          <p
            className="font-mono text-[0.62rem] uppercase tracking-[0.2em] font-semibold"
            style={{ color: "var(--db-text-muted)" }}
          >
            Add employee
          </p>
          <h2
            className="mt-0.5 text-base font-semibold"
            style={{ color: "var(--db-text)" }}
          >
            Create credentials
          </h2>
        </div>

        <form
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
          <input
            name="roleTitle"
            type="text"
            required
            placeholder="Role in company"
            value={formValues.roleTitle}
            onChange={(e) => setFormValues((s) => ({ ...s, roleTitle: e.target.value }))}
            onBlur={() => clientError && setClientError(validateForm())}
            style={inputStyle}
          />
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
            Rellax auto-generates a strong temporary password when the credential is created.
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
            className="inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-85"
            style={{ background: "var(--rellax-sage)" }}
          >
            Create employee access
          </button>
        </form>
      </div>
    </section>
  );
}
