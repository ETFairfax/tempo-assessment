import type * as React from 'react';
import { useCallback, useRef, useState } from 'react';

type Size = {
  w: number;
  h: number;
};

type DragState = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type OnResize = (w: number, h: number) => void;

function useResizable(onResize: OnResize, initial: Size, minimumSize = 100) {
  const [size, setSize] = useState<Size>(initial);
  const [isResizing, setIsResizing] = useState(false);
  const startRef = useRef<DragState>({ x: 0, y: 0, w: 0, h: 0 });

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const { x, y, w, h } = startRef.current;
      const next: Size = {
        w: Math.max(minimumSize, w + (e.clientX - x)),
        h: Math.max(minimumSize, h + (e.clientY - y))
      };
      setSize(next);
      onResize(next.w, next.h);
    },
    [onResize, minimumSize]
  );

  const onPointerUp = useCallback(() => {
    setIsResizing(false);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      e.preventDefault();
      startRef.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
      setIsResizing(true);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [size, onPointerMove, onPointerUp]
  );

  return { size, isResizing, onPointerDown };
}

export { useResizable };
