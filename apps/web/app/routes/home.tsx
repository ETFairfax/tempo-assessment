import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import { Textarea } from '@workspace/ui/components/textarea';
import { useMoveable } from '@workspace/ui/hooks/use-moveable';
import { map } from 'es-toolkit/compat';
import { CheckCircle2Icon } from 'lucide-react';
import { useCallback } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { NoteBoard } from '../../components/note-board';
import { StickyNote } from '../../components/sticky-note';
import type { Note } from '../../lib/note';
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
    position,
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

  // EDIT
  const handleSave = useCallback((note: Note, value: string) => {
    const { updateNote } = useNotesStore.getState();
    updateNote({ ...note, text: value });
  }, []);

  return (
    <>
      <Alert variant='destructive' className='min-res-guard max-w-sm mt-8 mx-auto'>
        <CheckCircle2Icon />
        <AlertTitle>Unsupported</AlertTitle>
        <AlertDescription>
          This application is intended to be used on desktop. Minimum screen resolution: 1024x768.
        </AlertDescription>
      </Alert>

      <main className='app-main h-dvh'>
        <ButtonGroup className='absolute top-4 left-4'>
          <Button onClick={handleAddNote}>Add Note</Button>
        </ButtonGroup>
        <NoteBoard ref={boardRef}>
          {map(notes, note => {
            const isDragging = position?.id === note.id;

            return (
              <StickyNote
                key={note.id}
                id={note.id}
                isDragging={isDragging}
                onResize={debouncedHandleNoteResize}
                onPointerDown={onMoveStart}
                onPointerMove={onMove}
                onPointerUp={onMoveEnd}
                x={isDragging ? position.x : note.x}
                y={isDragging ? position.y : note.y}
                w={note.w}
                h={note.h}
              >
                <Textarea
                  name={note.id}
                  className={`${note.color} border-none grow h-full flex-1 p-2`}
                  onBlur={e => handleSave(note, e.currentTarget.value)}
                >
                  {note.text}
                </Textarea>
              </StickyNote>
            );
          })}
        </NoteBoard>
      </main>
    </>
  );
}
