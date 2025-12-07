// lib/auth/api.ts
import { TOKEN_STORAGE_KEY } from './config';

export type CurrentUser = {
    user_id: string;
    email: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        console.error('NEXT_PUBLIC_API_BASE_URL is not set');
        return null;
    }

    try {
        const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            // token invalid/expired/etc.
            return null;
        }

        return res.json();
    } catch (err) {
        console.error('Error fetching current user', err);
        return null;
    }
}
