import Link from "next/link";
import { SignUp } from "@hexclave/next";
import { AuthShell } from "@/components/auth/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Get started"
      subtitle="Create your account"
      alternateLabel="Already have an account?"
      alternateHref="/sign-in"
    >
      <SignUp
        fullPage={false}
        automaticRedirect
        firstTab="password"
        extraInfo={
          <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
            Join a community built for thoughtful debate — not dunking. Free for
            side projects and small groups.
          </p>
        }
      />
      <p className="mt-4 text-center">
        <Link
          href="/"
          className="text-xs text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground"
        >
          Back to home
        </Link>
      </p>
    </AuthShell>
  );
}
