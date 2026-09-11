import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import { Card, CardContent, CardFooter, CardHeader } from '@workspace/ui/components/card';
import { useResizable } from '@workspace/ui/hooks/use-resizable';
import { MoveDiagonal2Icon } from 'lucide-react';
import type * as React from 'react';

type StickyNoteProps = React.ComponentProps<'div'> & {
  x: number;
  y: number;
  w: number;
  h: number;
  isDragging: boolean;
  onResize: (id: string, width: number, height: number) => void;
};

function StickyNote({
  id = '',
  children,
  x: left,
  y: top,
  w,
  h,
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onResize
}: StickyNoteProps) {
  const {
    size,
    isResizing,
    onPointerDown: onResizePointerDown
  } = useResizable((w, h) => onResize(id, w, h), {
    w,
    h
  });

  return (
    <div
      id={id}
      data-slot='sticky-note'
      data-active={isResizing || isDragging}
      className='absolute data-[active=true]:shadow-lg shadow-sm flex flex-col w-full rounded border overflow-hidden bg-card'
      style={{
        width: size.w,
        height: size.h,
        left,
        top,
        zIndex: isDragging ? 9999 : 1
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
      <div className='bg-accent/60 w-full flex justify-end'>
        <Button
          title='Resize Note'
          onPointerDown={e => {
            e.stopPropagation(); // Keep the containers move handler from also starting a drag.
            onResizePointerDown(e);
          }}
          variant='ghost'
          size='icon-xs'
          className='cursor-nwse-resize'
        >
          <MoveDiagonal2Icon />
        </Button>
      </div>
    </div>
  );
}

export { StickyNote };
