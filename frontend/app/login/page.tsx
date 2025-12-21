'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionCard } from '@/components/SectionCard';
import { PageHeader } from '@/components/PageHeader';
import { THEME } from '@/lib/theme';
import { loginRequest } from '@/lib/authClient';

export default function LoginPage() {
    const [email, setEmail] = useState('');      // was username
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const auth = await loginRequest(email, password);

            // store JWT for later API calls
            localStorage.setItem('changelog_token', auth.accessToken);

            // redirect to admin/dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Login failed. Check your email and password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <SectionCard>
                    <div className="text-center">
                        <PageHeader title=">_ changelog/" />
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 text-sm"
                                placeholder="email"
                                style={{
                                    backgroundColor: THEME.colors.surface.elevated,
                                    color: THEME.colors.text.primary,
                                    border: `1px solid ${THEME.colors.border.primary}`,
                                    borderRadius: THEME.borderRadius.input,
                                    outline: 'none',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = THEME.colors.accent.primary;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = THEME.colors.border.primary;
                                }}
                            />
                        </div>

                        <div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 text-sm"
                                placeholder="password"
                                style={{
                                    backgroundColor: THEME.colors.surface.elevated,
                                    color: THEME.colors.text.primary,
                                    border: `1px solid ${THEME.colors.border.primary}`,
                                    borderRadius: THEME.borderRadius.input,
                                    outline: 'none',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = THEME.colors.accent.primary;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = THEME.colors.border.primary;
                                }}
                            />
                        </div>

                        {error && (
                            <p
                                className="text-sm"
                                style={{ color: THEME.colors.accent.primary }}
                            >
                                {error}
                            </p>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 font-medium text-sm transition-all duration-200 disabled:opacity-60"
                                style={{
                                    backgroundColor: THEME.colors.accent.primary,
                                    color: THEME.colors.text.inverse,
                                    borderRadius: THEME.borderRadius.input,
                                    border: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = THEME.colors.accent.hover;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = THEME.colors.accent.primary;
                                }}
                            >
                                {isSubmitting ? 'Signing In…' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </SectionCard>
            </div>
        </div>
    );
}
