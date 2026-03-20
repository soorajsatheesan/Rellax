import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

const ERROR_MESSAGES: Record<string, string> = {
  "auth-provider": "That login provider is not available.",
  "auth-mode": "That login flow is not available.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const initialError = params.error ? ERROR_MESSAGES[params.error] : undefined;

  return (
    <AuthCard
      eyebrow="Employer onboarding"
      title="Sign up or sign in as employer."
      description="Employer access uses Google or Outlook. Company setup is only shown when the workspace details are missing."
    >
      <SignupForm initialError={initialError} />
    </AuthCard>
  );
}
