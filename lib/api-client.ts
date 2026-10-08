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

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message ?? "Something went wrong");
    }

    return data as T;
}
