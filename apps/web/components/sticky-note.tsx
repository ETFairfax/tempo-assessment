/** biome-ignore-all lint/suspicious/noConsole: <explanation */
import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import { useResizable } from '@workspace/ui/hooks/use-resizable';
import { MoveDiagonal2Icon, MoveIcon, PencilIcon } from 'lucide-react';
import type * as React from 'react';
import type { Note } from '../lib/note';

export interface ResizableBoxProps {
  note: Note;
  isDragging: boolean;
  children: React.ReactNode;
  onResize: (width: number, height: number, note: Note) => void;
}

export default function StickyNote({ children, note, isDragging, onResize }: ResizableBoxProps) {
  const { x: left, y: top, w, h } = note;

  const { size, isResizing, onPointerDown } = useResizable((w, h) => onResize(w, h, note), {
    w,
    h
  });

  return (
    <div
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
    >
      {children}
      <Button
        title='Resize Note'
        onPointerDown={onPointerDown}
        variant='ghost'
        size='icon-xs'
        className='absolute cursor-nwse-resize right-0 bottom-0'
      >
        <MoveDiagonal2Icon />
      </Button>
    </div>
  );
}

type StickyNoteControlsProps = {
  isDragging: boolean;
  onEditClick: () => void;
  handlePointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
};

function StickyNoteControls({
  isDragging,
  onEditClick,
  handlePointerDown
}: StickyNoteControlsProps) {
  return (
    <ButtonGroup>
      <Button variant='outline' size='sm' onClick={onEditClick}>
        <PencilIcon />
      </Button>
      <Button
        variant='outline'
        size='sm'
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
      >
        <MoveIcon />
      </Button>
    </ButtonGroup>
  );
}

export { StickyNote, StickyNoteControls };
