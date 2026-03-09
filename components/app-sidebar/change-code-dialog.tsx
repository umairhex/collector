"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, User, Lock, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthMutation } from "@/hooks/use-auth";

export function ChangeCodeDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState<"update" | "reset">("update");
  const [showConfirm, setShowConfirm] = React.useState(false);
  const auth = useAuthMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "update" && (!username || !password)) {
      toast.error("Enter both username and password.");
      return;
    }

    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    auth.mutate(
      {
        username: mode === "reset" ? undefined : username,
        password: mode === "reset" ? undefined : password,
        action: mode === "reset" ? "setup" : "update",
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          onOpenChange(false);
          if (mode === "reset") router.push("/login");
          setShowConfirm(false);
          setUsername("");
          setPassword("");
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setShowConfirm(false);
          setMode("update");
        }
      }}
    >
      <DialogContent className="border-border/50 bg-background/95 rounded-2xl backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-widest uppercase">
            {mode === "reset" ? "Delete All Data" : "Account Settings"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/60 text-[10px] tracking-[0.1em] uppercase">
            {mode === "reset"
              ? "This action will permanently delete all your data."
              : "Update your username and password."}
          </DialogDescription>
        </DialogHeader>

        {!showConfirm && (
          <div className="bg-muted/20 mb-2 flex rounded-xl p-1">
            <button
              onClick={() => setMode("update")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] tracking-wider uppercase transition-all ${mode === "update" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ShieldCheck className="h-3 w-3" />
              Update
            </button>
            <button
              onClick={() => setMode("reset")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[10px] tracking-wider uppercase transition-all ${mode === "reset" ? "bg-destructive text-destructive-foreground shadow-sm" : "text-muted-foreground hover:text-destructive"}`}
            >
              <AlertTriangle className="h-3 w-3" />
              Hard Reset
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {!showConfirm && mode === "update" ? (
            <>
              <div className="space-y-2">
                <label className="text-muted-foreground ml-1 text-[10px] tracking-[0.2em] uppercase">
                  Username
                </label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background border-border/50 focus:ring-primary/10 w-full rounded-xl border py-3 pr-4 pl-10 text-sm font-medium shadow-inner transition-all focus:ring-4 focus:outline-none"
                    placeholder="Username"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground ml-1 text-[10px] tracking-[0.2em] uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border/50 focus:ring-primary/10 w-full rounded-xl border py-3 pr-4 pl-10 text-sm font-medium shadow-inner transition-all focus:ring-4 focus:outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>
            </>
          ) : mode === "reset" || showConfirm ? (
            <div
              className={`flex flex-col items-center gap-3 rounded-2xl border p-5 text-center ${mode === "reset" ? "bg-destructive/10 border-destructive/20" : "bg-primary/5 border-primary/20"}`}
            >
              {mode === "reset" ? (
                <AlertTriangle className="text-destructive h-10 w-10 animate-pulse" />
              ) : (
                <ShieldCheck className="text-primary h-10 w-10" />
              )}
              <div className="space-y-1.5">
                <p
                  className={`font-heading text-xl tracking-widest uppercase ${mode === "reset" ? "text-destructive" : "text-primary"}`}
                >
                  {mode === "reset" ? "Confirm Deletion" : "Confirm Changes"}
                </p>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-medium tracking-wider uppercase">
                  {mode === "reset"
                    ? `This will permanently delete all your data. This action cannot be undone.`
                    : `Your account will be updated. No data will be lost.`}
                </p>
              </div>
            </div>
          ) : null}

          <DialogFooter className="mt-2 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (showConfirm) setShowConfirm(false);
                else onOpenChange(false);
              }}
              className="border-border/50 h-11 rounded-xl px-6 text-[10px] tracking-[0.2em] uppercase"
            >
              {showConfirm ? "Back" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={auth.isPending}
              variant={
                mode === "reset" && showConfirm ? "destructive" : "default"
              }
              className="h-11 rounded-xl px-8 text-[10px] tracking-[0.2em] uppercase transition-all"
            >
              {auth.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {showConfirm
                ? mode === "reset"
                  ? "Confirm Delete"
                  : "Save Changes"
                : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
