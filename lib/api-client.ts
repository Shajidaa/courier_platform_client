import { tokenStorage } from "@/lib/token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
};

export async function apiClient<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { method = "GET", body, headers = {}, credentials = "include" } = options;

    const token = tokenStorage.get();
    const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const errorDetail =
            (Array.isArray(data?.errorSources) && data.errorSources.length > 0)
                ? data.errorSources.map((e: { message?: string }) => e.message).filter(Boolean).join(". ")
                : data?.message ?? "Something went wrong";
        throw new Error(errorDetail);
    }

    return data as T;
}
