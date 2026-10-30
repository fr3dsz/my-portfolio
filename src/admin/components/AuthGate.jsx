import { useEffect, useMemo, useState } from "react";
import { STUDIO_URL } from "../lib";
import { AuthContext, endSession, loadSession, loginUrl } from "../auth";
import { Skeleton } from "./ui";

const PROVIDERS = [
  ["google", "Continue with Google"],
  ["github", "Continue with GitHub"],
  ["sanity", "Continue with email"],
];

export function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <Skeleton className="h-2 w-40" />
    </div>
  );
}

function SignIn({ failed }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-normal text-ink">Sign in to admin</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone">Use the account that belongs to this Sanity project.</p>
        {failed && (
          <p role="alert" className="mt-4 border border-danger/50 px-3 py-2 text-sm text-ink">
            That sign-in didn&apos;t go through. Please try again.
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          {PROVIDERS.map(([id, label]) => (
            <a key={id} href={loginUrl(id)} className="inline-flex h-10 items-center justify-center border border-line text-sm font-medium text-ink transition-colors duration-150 hover:border-stone/60">
              {label}
            </a>
          ))}
        </div>
        <a href={STUDIO_URL} className="mt-6 inline-block text-sm text-stone underline underline-offset-4 hover:text-ink">
          Open the Studio instead
        </a>
      </div>
    </main>
  );
}

export function AuthGate({ children }) {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let active = true;
    loadSession().then(
      (session) => active && setState(session ? { status: "signed-in", ...session } : { status: "signed-out" }),
      () => active && setState({ status: "signed-out", failed: true })
    );
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      token: state.token,
      user: state.user,
      signOut: async () => {
        await endSession(state.token);
        setState({ status: "signed-out" });
      },
    }),
    [state.token, state.user]
  );

  if (state.status === "loading") return <AdminLoading />;
  if (state.status === "signed-out") return <SignIn failed={state.failed} />;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
