import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import { Card, CardContent, CardFooter } from '@workspace/ui/components/card';
import { useResizable } from '@workspace/ui/hooks/use-resizable';
import { MoveDiagonal2Icon } from 'lucide-react';
import type * as React from 'react';

type ResizableBoxProps = React.ComponentProps<'div'> & {
  // note: Note;
  x: number;
  y: number;
  w: number;
  h: number;
  isDragging: boolean;
  children: React.ReactNode;
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
}: ResizableBoxProps) {
  const {
    size,
    isResizing,
    onPointerDown: onResizePointerDown
  } = useResizable((w, h) => onResize(id, w, h), {
    w,
    h
  });

  return (
    <Card
      id={id}
      data-slot='sticky-note'
      data-active={isResizing || isDragging}
      className={`data-[active=true]:shadow-lg shadow-sm absolute p-0 border bg-card overflow-hidden flex flex-col`}
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
      <CardContent className='flex-1 px-0'>{children}</CardContent>
      <CardFooter>
        <ButtonGroup className='absolute right-0 bottom-0 bg-accent/60 w-full flex justify-end'>
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
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export { StickyNote };
