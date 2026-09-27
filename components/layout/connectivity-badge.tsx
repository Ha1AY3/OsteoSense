'use client';

import { useConnectivity } from '@/hooks/use-connectivity';
import { cn } from '@/lib/utils';

export function ConnectivityBadge() {
  const { status, mounted } = useConnectivity();

  let colorClass = 'bg-slate-400';
  let text = 'Checking...';

  if (mounted) {
    if (status === 'online') {
      colorClass = 'bg-green-500';
      text = 'Online';
    } else if (status === 'offline') {
      colorClass = 'bg-red-500';
      text = 'Offline';
    } else if (status === 'backend-down') {
      colorClass = 'bg-yellow-500';
      text = 'Server Unreachable';
    }
  }

  return (
    <div suppressHydrationWarning className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 w-fit">
      <span className="relative flex h-2.5 w-2.5">
        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", colorClass)}></span>
        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", colorClass)}></span>
      </span>
      <span>{text}</span>
    </div>
  );
}
