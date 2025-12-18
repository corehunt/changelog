// frontend/lib/http.ts
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type AuthedOptions = {
    params?: Record<string, string | number | boolean | undefined | null>;
};

function getToken(): string | null {
    return typeof window !== "undefined"
        ? window.localStorage.getItem("changelog_token")
        : null;
}

function buildUrl(path: string, options?: AuthedOptions): URL {
    const url = new URL(path, API_BASE_URL);

    if (options?.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url;
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        const err: any = new Error(
            `Request failed: ${res.status} ${res.statusText} - ${text}`
        );
        err.status = res.status;
        err.statusText = res.statusText;
        err.body = text;
        throw err;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        // @ts-expect-error - allow non-json endpoints if needed
        return undefined;
    }

    return res.json();
}

export async function authedGet<T>(
    path: string,
    options?: AuthedOptions
): Promise<T> {
    const token = getToken();
    const url = buildUrl(path, options);

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // TODO come back to when ready to implement caching
        cache: "no-store",
    });

    return handleResponse<T>(res);
}

export async function authedPut<T>(
    path: string,
    body: unknown,
    options?: AuthedOptions
): Promise<T> {
    const token = getToken();
    const url = buildUrl(path, options);

    const res = await fetch(url.toString(), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    return handleResponse<T>(res);
}
