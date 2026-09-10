/** biome-ignore-all lint/suspicious/noConsole: <explanation */
import { Button } from '@workspace/ui/components/button';
import { useResizable } from '@workspace/ui/hooks/use-resizable';
import { MoveDiagonal2Icon } from 'lucide-react';
import type * as React from 'react';
import type { Note } from '../lib/note';

type ResizableBoxProps = React.ComponentProps<'div'> & {
  note: Note;
  isDragging: boolean;
  children: React.ReactNode;
  onResize: (id: string, width: number, height: number) => void;
};

export default function StickyNote({
  children,
  note,
  isDragging,
  onPointerDown: handleMove,
  onResize
}: ResizableBoxProps) {
  const { x: left, y: top, w, h } = note;

  const { size, isResizing, onPointerDown } = useResizable((w, h) => onResize(note.id, w, h), {
    w,
    h
  });

  return (
    <div
      id={note.id}
      data-slot='sticky-note'
      data-active={isResizing || isDragging}
      className={`data-[active=true]:shadow-lg shadow-sm absolute p-0 border bg-card overflow-hidden`}
      style={{
        width: size.w,
        height: size.h,
        left,
        top,
        zIndex: isDragging ? 9999 : 1
      }}
      onPointerDown={handleMove}
    >
      {children}
      <Button
        title='Resize Note'
        onPointerDown={e => {
          e.stopPropagation(); // Keep the containers move handler from also starting a drag.
          onPointerDown(e);
        }}
        variant='ghost'
        size='icon-xs'
        className='absolute cursor-nwse-resize right-0 bottom-0'
      >
        <MoveDiagonal2Icon />
      </Button>
    </div>
  );
}

export { StickyNote };
