import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Persist our notes to local storage
import type { Note } from './note';

type NotesStoreState = {
  notes: Record<string, Note>; // Store as Record to speed up mutations (no searching through arrays)
};

type NotesStoreActions = {
  addNote: (note: Note) => void;
  moveNote: (id: Note['id'], x: number, y: number) => void;
  resizeNote: (id: Note['id'], w: number, h: number) => void;
  updateNote: (note: Note) => void;
  deleteNote: (note: Note['id']) => void;
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

      moveNote: (id, x, y) =>
        set(state => {
          const target = state.notes?.[id];
          if (!target) return state;
          return {
            notes: { ...state.notes, [id]: { ...target, x, y } }
          };
        }),

      resizeNote: (id, w, h) =>
        set(state => {
          const target = state.notes?.[id];
          if (!target) return state;
          return {
            notes: { ...state.notes, [id]: { ...target, w, h } }
          };
        }),

      updateNote: note =>
        set(state => ({
          notes: { ...state.notes, [note.id]: note }
        })),

      deleteNote: noteId =>
        set(state => {
          const { [noteId]: _removed, ...rest } = state.notes;
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
