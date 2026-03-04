'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { Trip } from '@/lib/types';

interface SidebarProps {
  recentTrips?: Trip[];
  onNewTrip?: () => void;
}

export default function Sidebar({ recentTrips = [], onNewTrip }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-full bg-[#0F0F0F] border-r border-[#2A2A2A] flex flex-col py-5 px-4 shrink-0">
      {/* Brand */}
      <Link href="/" className="mb-6 block">
        <span className="text-2xl font-bold text-[#E8A838]" style={{ fontFamily: 'Fraunces, serif' }}>
          Drift
        </span>
      </Link>

      {/* New Trip */}
      <button
        onClick={onNewTrip}
        className="w-full flex items-center gap-2 bg-[#E8A838] text-[#0F0F0F] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#d4972e] transition-colors mb-5"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        New Trip
      </button>

      {/* Recent trips */}
      {recentTrips.length > 0 && (
        <div className="mb-4">
          <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2 px-1">Recent</p>
          <div className="flex flex-col gap-0.5">
            {recentTrips.map(trip => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className={cn(
                  'text-sm px-3 py-2 rounded-lg transition-colors truncate',
                  pathname === `/trips/${trip.id}`
                    ? 'bg-[#1A1A1A] text-[#F5F0E8]'
                    : 'text-[#A09A90] hover:text-[#F5F0E8] hover:bg-[#1A1A1A]',
                )}
              >
                {trip.destination}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="mt-auto flex flex-col gap-0.5">
        {[
          { href: '/trips', label: 'All Trips', icon: <TripIcon /> },
          { href: '/profile', label: 'Profile', icon: <ProfileIcon /> },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href
                ? 'bg-[#1A1A1A] text-[#F5F0E8]'
                : 'text-[#A09A90] hover:text-[#F5F0E8] hover:bg-[#1A1A1A]',
            )}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function TripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 12L6 4l4 5 3-3 1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 13c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
