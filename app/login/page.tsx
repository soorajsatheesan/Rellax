import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const defaultView = params.view === "employee" ? "employee" : "employer";

  return (
    <AuthCard
      eyebrow="Workspace access"
      title="Sign in to Rellax."
      description="Employer and employee access live in one surface, with the right authentication path for each role."
    >
      <LoginForm defaultView={defaultView} />
    </AuthCard>
  );
}
