import type * as React from 'react';
import { useCallback, useRef, useState } from 'react';

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

interface Position {
  id: string;
  x: number;
  y: number;
}

type OnMoved = (id: string, x: number, y: number) => void;

function useMoveable(onMoved: OnMoved) {
  const containerRef = useRef<HTMLDivElement>(null); // The div which contains the draggable items

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const dragState = useRef<DragState | null>(null);

  const onMoveStart = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const board = containerRef.current;
    if (!board) {
      return;
    }

    const id = e.currentTarget.id;
    if (!id) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    dragState.current = {
      id,
      offsetX: e.clientX - rect.left, // where inside the note the pointer grabbed
      offsetY: e.clientY - rect.top,
      width: rect.width, // note size, used to keep it inside the board
      height: rect.height
    };
    setDraggingId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // The move handler lives on the board, so resolve the dragged note from
      // dragState rather than e.currentTarget (which is always the board).
      const drag = dragState.current;
      const board = containerRef.current;
      if (!drag || !board) {
        return;
      }

      const boardRect = board.getBoundingClientRect();

      let x = e.clientX - boardRect.left - drag.offsetX;
      let y = e.clientY - boardRect.top - drag.offsetY;

      x = Math.max(0, Math.min(x, boardRect.width - drag.width));
      y = Math.max(0, Math.min(y, boardRect.height - drag.height));

      setPosition({ id: drag.id, x, y });
      onMoved(drag.id, x, y);
    },
    [onMoved]
  );

  const onMoveEnd = useCallback(() => {
    dragState.current = null;
    setDraggingId(null);
  }, []);

  return {
    containerRef, //
    draggingId,
    position,
    onMove,
    onMoveEnd,
    onMoveStart
  };
}

export { useMoveable };
