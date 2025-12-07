// lib/authClient.ts
export type AuthResponse = {
    accessToken: string;
};

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
    }

    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        // backend returns 400/401 on invalid creds -> throw a nice error
        throw new Error('Invalid credentials');
    }

    return res.json();
}
