# Tempo - Sticky Notes Assessment

## Installation 

Clone this repository then `pnpm install` from the root directory.

## Running the app

Run `pnpm dev` from the terminal

## Requirements

1. Create a new note of the specified size at the specified position.⏳

    * `add-note-form.tsx` provides the user with sliders to specify size
    * specifying position - not implemented.  Currently the new note is placed at random. I would need to get the bounds of the container div which could shift when the window is resized.  Perhaps the use of a ResizeObserver could be used for this. 

2. Change note size by dragging. ✅

    * `use-resizable.ts` - Should be able to reuse for other resize features (Not tightly coupled to this implementation).

3. Move a note by dragging. ✅

    * `use-movable.ts` - Should be able to reuse for other move features (Not tightly coupled to this implementation).

4. Remove a note by dragging it over a predefined "trash" zone. ✅

    * Not perfect.  Only detects when the pointer is over the "trash".
    * Trash zone can become hidden if the note is large and you drag from its right hand side.

You are encouraged to think about the best UI for these features that is
possible to implement in the specified timeframe.

### System requirements:

1. The web application is intended to be used on desktop. Minimum screen resolution: 1024x768. ✅

    * Accomplished using Tailwind - no js measuring of screen size.
    * See global.css `min-res-guard` and `app-main` application.

2. The following browsers should be supported: latest versions of Google Chrome
(Windows and Mac), Mozilla Firefox (all platforms), Microsoft Edge. ⏳

    * Unable to test on all browsers.

### Technologies:

1. Language: Typescript ✅

2. You should use React without stock components. The general idea is to avoid using ready-made solutions, so that we can fully assess how you design and engineer solutions in the scope of a small task like this. 

    * I have use shad-cn for basic components (Buttons / Cards etc).  I started coding from scratch but found I was just making shad-cn components ❌
    * I have made custom components (StickyNote / TrashZone) and hooks where necessary ✅

3. If your project requires building, provide the necessary instructions ✅

    * See installation instructions above. 

### Optional bonus features:

1. Entering/editing note text

    * `onBlur` function of the `<Textarea/>` updates the notes text property. 
    * Scroll bar becomes visible when needed.

2. Moving notes to front (in case of overlapping notes)  ✅

    * Not perfect. Dragging a node brings it to the front by setting zindex and resets to 1 when stopped.         

3. Saving notes to local storage (restoring them on page load)  ✅

    * Use `zustand` for state management and its `persist` function for saving/hydrating to/from local storage. 

4. Different note colors ✅

    * Added variants to the StickyNotes component and selected at random.

5. Saving notes to REST API. Note: you're not required to implement the API, you can mock it, but the mocks should be asynchronous.❌

    * Not implemented.  
    * I would have used Tanstack Query, with possibly making an optimistic update of the cache while API is being called.
    * Maybe a simple "toast" message or similar to confirm if the API call was successful or not. 

## Improvements

The following improvements could be made to the UI:

- Initial loading spinner/skeleton while the application is hydrating data from local storage. 

- Introduce an "Are you sure?" dialog to confirm the user wants to delete a note.

-  Add a `...` button to the bottom bar of the StickNote with options to

    - Change color
    - Delete note

- Add a dedicated drag handle to the sticky note. At the moment the user drags the note from anywhere in the div. This prevents the user from being able to select the text from the text area; should they wish to copy the text for example.

- A delete all button - would have been handy during development.   If implemented it would be behind a settings in "Danger Zone" ⚠️ 

## AI

Claude Code was used to assist with the development.  
I approached it a feature at a time, rather than taking "one shot" at the application.

## Summary

A fun project.

I have done drag and drop using `react-dnd` before to specified drop zones; this is the first time for random positioning.

This was also my first time using `zustand` - very easy to pick up.  I made the choice of using `Record<Note['id'], Note>` to improve lookups — O(1) rather than O(n) with an array.

Thanks for the opportunity.  I look forward to your feedback. 