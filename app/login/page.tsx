"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthMutation } from "@/hooks/use-auth";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuthMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetup = searchParams.get("setup") === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    auth.mutate(
      { username, password, action: isSetup ? "setup" : "login" },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.push("/");
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="font-heading text-5xl leading-none font-semibold tracking-wide uppercase">
          {isSetup ? "Signup" : "Login"}
        </h1>
        <p className="text-muted-foreground mt-3 text-center text-[10px] tracking-[0.4em] uppercase opacity-60">
          {isSetup ? "Join the Collector" : "Welcome Back"}
        </p>
      </div>

      <div className="border-sidebar-border/50 bg-sidebar/40 rounded-3xl border p-8 shadow-2xl backdrop-blur-2xl">
        {isSetup && (
          <div className="bg-primary/5 border-primary/10 mb-6 rounded-xl border p-4">
            <p className="text-primary mb-1.5 flex items-center gap-2 text-[10px] leading-tight tracking-widest uppercase">
              <span className="h-1 w-1 animate-pulse rounded-full bg-current" />
              Quick Setup:
            </p>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium opacity-80">
              Set up your login credentials to initialize the vault.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <label className="text-muted-foreground/70 ml-1 text-[10px] tracking-[0.25em] uppercase">
              Username
            </label>
            <div className="relative">
              <User className="text-muted-foreground/40 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                autoComplete="one-time-code"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-sidebar-border/50 bg-background/50 focus:ring-primary/10 w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm font-medium transition-all focus:ring-4 focus:outline-none"
                placeholder="Username"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground/70 ml-1 text-[10px] tracking-[0.25em] uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="text-muted-foreground/40 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-sidebar-border/50 bg-background/50 focus:ring-primary/10 w-full rounded-xl border py-2.5 pr-4 pl-10 text-sm font-medium transition-all focus:ring-4 focus:outline-none"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="shadow-primary/20 bg-primary hover:bg-primary/90 mt-4 h-11 w-full rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
            disabled={auth.isPending}
          >
            {auth.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
                {isSetup ? "Signup" : "Login"}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-muted-foreground/60 text-[10px] tracking-[0.15em] uppercase">
          {isSetup ? (
            <>
              Already have a vault?{" "}
              <button
                onClick={() => router.push("/login")}
                className="dark:hover:text-primary text-primary text-[11px] decoration-2 underline-offset-4 transition-all hover:text-black hover:underline dark:text-white"
              >
                Login
              </button>
            </>
          ) : (
            <>
              New to Collector?{" "}
              <button
                onClick={() => router.push("/login?setup=true")}
                className="dark:hover:text-primary text-primary text-[11px] font-bold decoration-2 underline-offset-4 transition-all hover:text-black hover:underline dark:text-white"
              >
                Create Account
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <Suspense
        fallback={
          <div className="border-border/50 bg-background/50 flex h-64 w-full max-w-sm items-center justify-center rounded-2xl border p-8 backdrop-blur-md">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
