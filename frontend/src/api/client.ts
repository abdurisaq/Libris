const BASE_URL = "http://localhost:8000"; 

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers || {});

  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API error: ${res.status} ${message}`);
  }

  return res.json();
}