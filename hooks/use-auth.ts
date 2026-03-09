import { useMutation } from "@tanstack/react-query";
import { fetchClient as fetch } from "@/lib/fetch-client";

interface AuthParams {
  username?: string;
  password?: string;
  action?: "login" | "setup" | "update" | "logout";
}

export function useAuthMutation() {
  return useMutation({
    mutationFn: async ({ username, password, action }: AuthParams) => {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, action }),
      });
      return res.json();
    },
  });
}
