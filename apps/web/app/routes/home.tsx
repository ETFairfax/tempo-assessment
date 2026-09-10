import { Button } from '@workspace/ui/components/button';
import { map } from 'es-toolkit/compat';
import { useDebounceCallback } from 'usehooks-ts';
import { StickyNote } from '../../components/sticky-note';
import type { Note } from '../../lib/note';
import { useNotesStore } from '../../lib/notes-store';

export default function Home() {
  const { notes, addNote, updateNote } = useNotesStore();

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

  const handleStickyNoteResize = (width: number, height: number, note: Note) => {
    updateNote({ ...note, w: width, h: height });
  };

  // Debounce resize event to prevent continuously calling the state change.
  const debouncedHandleStickyNoteResize = useDebounceCallback(handleStickyNoteResize, 500);

  return (
    <>
      <Button onClick={handleAddNote}>Add Note</Button>
      <div className='relative w-full overflow-hidden bg-muted h-full flex flex-1 min-h-96'>
        {map(notes, note => (
          <StickyNote
            key={note.id}
            note={note}
            isDragging={false}
            onResize={debouncedHandleStickyNoteResize}
          >
            <p>{note.id}</p>
            <p>{note.text}</p>
          </StickyNote>
        ))}
      </div>
    </>
  );
}
