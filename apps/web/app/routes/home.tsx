import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardFooter } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Slider } from '@workspace/ui/components/slider';
import { Textarea } from '@workspace/ui/components/textarea';
import { useMoveable } from '@workspace/ui/hooks/use-moveable';
import { map } from 'es-toolkit/compat';
import { CheckCircle2Icon, TrashIcon } from 'lucide-react';
import type * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { NoteBoard } from '../../components/note-board';
import { StickyNote } from '../../components/sticky-note';
import type { Note } from '../../lib/note';
import { useNotesStore } from '../../lib/notes-store';

export default function Home() {
  const { notes, addNote, settings, updateSettings } = useNotesStore();

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

  // TRASH
  const trashRef = useRef<HTMLDivElement>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const isPointerOverTrash = useCallback((clientX: number, clientY: number) => {
    const trash = trashRef.current;
    if (!trash) return false;

    const trashRect = trash.getBoundingClientRect();
    return (
      clientX >= trashRect.left &&
      clientX <= trashRect.right &&
      clientY >= trashRect.top &&
      clientY <= trashRect.bottom
    );
  }, []);

  const handleBoardPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onMove(e);
      setIsOverTrash(isPointerOverTrash(e.clientX, e.clientY));
    },
    [onMove, isPointerOverTrash]
  );

  const handleBoardPointerUp = useCallback(() => {
    if (isOverTrash && position) {
      const { deleteNote } = useNotesStore.getState();
      deleteNote(position.id);
    }
    setIsOverTrash(false);
    onMoveEnd();
  }, [isOverTrash, position, onMoveEnd]);

  // RESIZE
  const handleNoteResize = useCallback((id: string, w: number, h: number) => {
    const { resizeNote } = useNotesStore.getState();
    resizeNote(id, w, h);
  }, []);

  // Debounce resize event to prevent continuously writing to the store / local storage.
  const debouncedHandleNoteResize = useDebounceCallback(handleNoteResize, 150);

  // ADD
  const handleAddNote = () => {
    const boardRect = boardRef.current?.getBoundingClientRect();

    // Place new note in the center of the board.
    // Ideally swap out with collision detection and place randomly on the board.
    const x = boardRect ? (boardRect.width - settings.defaultHeight) / 2 : 0;
    const y = boardRect ? (boardRect.height - settings.defaultWidth) / 2 : 0;

    addNote({
      id: crypto.randomUUID(),
      text: 'New note',
      x,
      y,
      z: 1,
      w: settings.defaultHeight,
      h: settings.defaultWidth,
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

      <main className='app-main h-dvh bg-muted'>
        <NoteBoard
          ref={boardRef}
          onPointerMove={handleBoardPointerMove}
          onPointerUp={handleBoardPointerUp}
        >
          <div className='absolute top-4 left-4 z-50 flex flex-col gap-2'>
            <Card>
              <CardContent className='flex flex-col gap-8'>
                <Label htmlFor='default-height'>Height</Label>
                <Slider
                  id='default-height'
                  min={100}
                  max={500}
                  value={settings.defaultHeight}
                  onValueChange={value =>
                    updateSettings({
                      defaultHeight: Array.isArray(value) ? value[0] : value
                    })
                  }
                  className='w-full'
                />
                <Label htmlFor='default-width'>Width</Label>
                <Slider
                  id='default-width'
                  min={100}
                  max={500}
                  value={settings.defaultWidth}
                  onValueChange={value =>
                    updateSettings({
                      defaultWidth: Array.isArray(value) ? value[0] : value
                    })
                  }
                  className='w-full'
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddNote}>Add Note</Button>
              </CardFooter>
            </Card>

            <div
              ref={trashRef}
              data-active={isOverTrash}
              className='bg-red-300 p-4 border-dashed border transition-colors data-[active=true]:bg-red-400 data-[active=true]:border-solid flex items-center gap-4 grow'
            >
              <TrashIcon /> The Bin
            </div>
          </div>

          {map(notes, note => {
            const isDragging = position?.id === note.id;

            return (
              <StickyNote
                key={note.id}
                id={note.id}
                isDragging={isDragging}
                x={isDragging ? position.x : note.x}
                y={isDragging ? position.y : note.y}
                w={note.w}
                h={note.h}
                onResize={debouncedHandleNoteResize}
                onPointerDown={onMoveStart}
              >
                <Textarea
                  id={note.id}
                  placeholder='Add note....'
                  className={`${note.color} flex-1 p-2 w-full`}
                  onBlur={e => handleSave(note, e.currentTarget.value)}
                  defaultValue={note.text}
                />
              </StickyNote>
            );
          })}
        </NoteBoard>
      </main>
    </>
  );
}
