'use client';

import { useSyncActiveModule } from '@/hooks/useSyncActiveModule';

export const SyncModuleProvider = ({ children }: { children: React.ReactNode }) => {
  useSyncActiveModule();
  return children;
};
