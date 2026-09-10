import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Persist our notes to local storage
import type { Note } from './note';

type NotesStoreState = {
  notes: Record<string, Note>; // Store as Record to speed up mutations (no searching through arrays)
};

type NotesStoreActions = {
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
  clear: () => void;
};

type NotesStore = NotesStoreState & NotesStoreActions;

const initialNotes: NotesStoreState['notes'] = {};

export const useNotesStore = create<NotesStore>()(
  persist(
    set => ({
      notes: initialNotes,

      addNote: note =>
        set(state => ({
          notes: { ...state.notes, [note.id]: note }
        })),

      updateNote: note =>
        set(state => ({
          notes: { ...state.notes, [note.id]: note }
        })),

      deleteNote: note =>
        set(state => {
          const { [note.id]: _removed, ...rest } = state.notes;
          return { notes: rest };
        }),

      clear: () => set(() => ({ notes: {} }))
    }),
    {
      name: 'notes-storage', // local storage key
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // biome-ignore lint/suspicious/noConsole: OK to log here.
          console.error('Failed to rehydrate notes-storage:', error);
        } else {
          // biome-ignore lint/suspicious/noConsole: OK to log here.
          console.log('Rehydrated:', state);
        }
      }
    }
  )
);
