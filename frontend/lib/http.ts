// frontend/lib/http.ts
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type AuthedGetOptions = {
    params?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, params?: AuthedGetOptions["params"]) {
    const url = new URL(path, API_BASE_URL);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

function getBearerToken() {
    return typeof window !== "undefined"
        ? window.localStorage.getItem("changelog_token")
        : null;
}

async function readError(res: Response) {
    try {
        const text = await res.text();
        return text ? ` - ${text}` : "";
    } catch {
        return "";
    }
}

export async function authedGet<T>(path: string, options?: AuthedGetOptions): Promise<T> {
    const token = getBearerToken();
    const url = buildUrl(path, options?.params);

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const extra = await readError(res);
        throw new Error(`Request failed: ${res.status} ${res.statusText}${extra}`);
    }

    return res.json();
}

export async function authedPut<T>(path: string, body: unknown): Promise<T> {
    const token = getBearerToken();
    const url = buildUrl(path);

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const extra = await readError(res);
        throw new Error(`Request failed: ${res.status} ${res.statusText}${extra}`);
    }

    return res.json();
}

export async function authedPost<T>(path: string, body: unknown): Promise<T> {
    const token = getBearerToken();
    const url = buildUrl(path);

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const extra = await readError(res);
        throw new Error(`Request failed: ${res.status} ${res.statusText}${extra}`);
    }

    return res.json();
}

/**
 * DELETE that returns void (your backend returns 204 No Content)
 */
export async function authedDelete(path: string): Promise<void> {
    const token = getBearerToken();
    const url = buildUrl(path);

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const extra = await readError(res);
        throw new Error(`Request failed: ${res.status} ${res.statusText}${extra}`);
    }
}
