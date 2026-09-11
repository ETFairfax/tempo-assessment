import { Button } from '@workspace/ui/components/button';
import { useResizable } from '@workspace/ui/hooks/use-resizable';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { MoveDiagonal2Icon } from 'lucide-react';
import type * as React from 'react';

const stickyNoteVariants = cva(
  'absolute flex w-full flex-col overflow-hidden rounded border shadow-sm data-[active=true]:shadow-lg',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        destructive:
          'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
        warning:
          'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
        info: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
        success:
          'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

type StickyNoteProps = React.ComponentProps<'div'> &
  VariantProps<typeof stickyNoteVariants> & {
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
  className,
  variant,
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
      className={cn(stickyNoteVariants({ variant }), className)}
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
      <div data-slot='sticky-note-footer' className='flex w-full justify-end bg-current/15'>
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

type StickyNoteVariant = NonNullable<VariantProps<typeof stickyNoteVariants>['variant']>;

const StickyNoteVariants: StickyNoteVariant[] = [
  'default',
  'destructive',
  'info',
  'success',
  'warning'
] as const;

export { StickyNote, type StickyNoteVariant, StickyNoteVariants, stickyNoteVariants };
