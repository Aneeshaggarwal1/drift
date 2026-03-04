import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import type { Trip } from '@/lib/types';

interface AppLayoutProps {
  children: React.ReactNode;
  recentTrips?: Trip[];
  onNewTrip?: () => void;
  hideSidebar?: boolean;
}

export default function AppLayout({ children, recentTrips, onNewTrip, hideSidebar = false }: AppLayoutProps) {
  return (
    <div className="flex h-dvh bg-[#0F0F0F] overflow-hidden">
      {/* Sidebar — desktop only */}
      {!hideSidebar && (
        <div className="hidden sm:flex">
          <Sidebar recentTrips={recentTrips} onNewTrip={onNewTrip} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 sm:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
