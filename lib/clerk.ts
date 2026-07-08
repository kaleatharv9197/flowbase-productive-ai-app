const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function hasValidClerkPublishableKey() {
  return (
    typeof publishableKey === "string" &&
    (publishableKey.startsWith("pk_test_") || publishableKey.startsWith("pk_live_")) &&
    !publishableKey.includes("placeholder")
  );
}
