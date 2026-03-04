'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export default function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Plan', icon: <ChatIcon /> },
    { href: '/trips', label: 'Trips', icon: <TripIcon /> },
    { href: '/profile', label: 'Profile', icon: <ProfileIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F] border-t border-[#2A2A2A] flex sm:hidden">
      {links.map(({ href, label, icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
              active ? 'text-[#E8A838]' : 'text-[#A09A90]',
            )}
          >
            {icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 2V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function TripIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 15L7 5l5 6.5 3.5-3.5L17 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 17c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
