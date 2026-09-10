import { Button } from '@workspace/ui/components/button';
import { useMoveable } from '@workspace/ui/hooks/use-moveable';
import { map } from 'es-toolkit/compat';
import { useCallback } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { NoteBoard } from '../../components/note-board';
import { StickyNote } from '../../components/sticky-note';
import { useNotesStore } from '../../lib/notes-store';

export default function Home() {
  const { notes, addNote } = useNotesStore();

  // MOVE
  const handleNoteMove = useCallback((id: string, x: number, y: number) => {
    const { moveNote } = useNotesStore.getState();
    moveNote(id, x, y);
  }, []);

  // Debounce move event to prevent continuously writing to the store / local storage.
  const debouncedHandleNoteMove = useDebounceCallback(handleNoteMove, 150);

  const {
    containerRef: boardRef,
    draggingId,
    position: draggingPosition,
    onMove,
    onMoveStart,
    onMoveEnd
  } = useMoveable(debouncedHandleNoteMove);

  // RESIZE
  const handleNoteResize = useCallback((id: string, w: number, h: number) => {
    const { resizeNote } = useNotesStore.getState();
    resizeNote(id, w, h);
  }, []);

  // Debounce resize event to prevent continuously writing to the store / local storage.
  const debouncedHandleNoteResize = useDebounceCallback(handleNoteResize, 150);

  // ADD
  const handleAddNote = () => {
    addNote({
      id: crypto.randomUUID(),
      text: 'New note',
      x: 200,
      y: 50,
      z: 1,
      w: 250,
      h: 200,
      color: ''
    });
  };

  return (
    <>
      <Button onClick={handleAddNote}>Add Note</Button>
      <NoteBoard ref={boardRef} onPointerMove={onMove} onPointerUp={onMoveEnd}>
        {map(notes, note => {
          const isDragging = draggingId === note.id;
          const renderNote =
            draggingPosition?.id === note.id
              ? { ...note, x: draggingPosition.x, y: draggingPosition.y }
              : note;
          return (
            <StickyNote
              key={note.id}
              note={renderNote}
              isDragging={isDragging}
              onResize={debouncedHandleNoteResize}
              onPointerDown={onMoveStart}
            >
              <p>{note.id}</p>
              <p>{note.text}</p>
            </StickyNote>
          );
        })}
      </NoteBoard>
    </>
  );
}
