import Link from "next/link";
import { SignIn } from "@hexclave/next";
import { AuthShell } from "@/components/auth/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to join the debate"
      alternateLabel="New here?"
      alternateHref="/sign-up"
    >
      <SignIn
        fullPage={false}
        automaticRedirect
        firstTab="password"
        extraInfo={
          <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
            Sign in to post arguments, reply in threads, and build your debate
            profile.
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
