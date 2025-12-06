'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { THEME } from '@/lib/theme';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Tickets' },
    { href: '/timeline', label: 'Timeline' },
    { href: '/about', label: 'About' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 transition-colors"
        style={{ color: THEME.colors.text.secondary }}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
          />
          <div
            className="fixed top-20 left-0 right-0 z-50 md:hidden"
            style={{
              backgroundColor: THEME.colors.background.primary,
              borderBottom: `1px solid ${THEME.colors.border.hairline}`,
            }}
          >
            <div className="px-6 py-4 space-y-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-base transition-colors py-2"
                    style={{
                      color: isActive
                        ? THEME.colors.accent.primary
                        : THEME.colors.text.secondary,
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
