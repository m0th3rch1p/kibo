'use client';

import { forwardRef } from 'react';
import { ScrollArea } from '@repo/shadcn-ui/components/ui/scroll-area';
import { useSidebarScroll } from '../hooks/use-sidebar-scroll';

interface ScrollAreaWithPersistenceProps extends React.ComponentProps<typeof ScrollArea> {
  children: React.ReactNode;
}

const ScrollAreaWithPersistence = forwardRef<
  HTMLDivElement,
  ScrollAreaWithPersistenceProps
>(({ children, ...props }, ref) => {
  const { scrollElementRef } = useSidebarScroll();

  return (
    <ScrollArea {...props} ref={ref}>
      <div
        ref={scrollElementRef}
        className="h-full"
        style={{ height: '100%', overflow: 'auto' }}
      >
        {children}
      </div>
    </ScrollArea>
  );
});

ScrollAreaWithPersistence.displayName = 'ScrollAreaWithPersistence';

export { ScrollAreaWithPersistence };