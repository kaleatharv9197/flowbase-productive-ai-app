import { SignUp } from "@clerk/nextjs";
import { hasValidClerkPublishableKey } from "@/lib/clerk";

export default function SignUpPage() {
  if (!hasValidClerkPublishableKey()) {
    return (
      <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', color: '#fafafa', fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.75rem' }}>Clerk is not configured</h1>
          <p style={{ color: '#a1a1aa', margin: 0 }}>
            Add real Clerk keys to .env to enable sign up.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b' }}>
      <SignUp forceRedirectUrl="/sync-user" fallbackRedirectUrl="/sync-user" />
    </main>
  );
}
