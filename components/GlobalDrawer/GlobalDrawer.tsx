'use client';

import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { useDrawer } from '@/hooks/useDrawer';

export default function GlobalDrawer() {
  const { isOpen, drawerData, contentRenderer, closeDrawer } = useDrawer();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-gradient-to-br from-slate-50 to-violet-50/30">
        {contentRenderer && drawerData && contentRenderer(drawerData)}
      </SheetContent>
    </Sheet>
  );
}
