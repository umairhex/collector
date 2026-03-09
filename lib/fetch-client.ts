export const fetchClient = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  if (!res.ok) {
    let errorMessage = "An unexpected error occurred";
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return res;
};
