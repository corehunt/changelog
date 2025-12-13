// frontend/lib/http.ts
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type AuthedGetOptions = {
    params?: Record<string, string | number | boolean | undefined | null>;
};

export async function authedGet<T>(
    path: string,
    options?: AuthedGetOptions
): Promise<T> {
    const token =
        typeof window !== "undefined"
            ? window.localStorage.getItem("changelog_token")
            : null;

    const url = new URL(path, API_BASE_URL);

    if (options?.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json();
}
