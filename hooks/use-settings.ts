import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient as fetch } from "@/lib/fetch-client";

interface Settings {
  aiModel?: string;
}

export function useSettings() {
  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Settings) => {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

const RECOMMENDED_MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.0-flash-lite-001",
  "anthropic/claude-3.5-haiku",
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct",
  "mistralai/mistral-large-2411",
];

export function useModels() {
  return useQuery<{ id: string; name: string }[]>({
    queryKey: ["openrouter-models"],
    queryFn: async () => {
      const response = await fetch("https://openrouter.ai/api/v1/models");
      const data = await response.json();

      return data.data
        .filter((m: { id: string }) => RECOMMENDED_MODELS.includes(m.id))
        .map((m: { id: string; name: string }) => ({
          id: m.id,
          name: m.name,
        }))
        .sort((a: { name: string }, b: { name: string }) =>
          a.name.localeCompare(b.name),
        );
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}
