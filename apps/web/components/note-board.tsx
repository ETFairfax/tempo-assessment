function NoteBoard(props: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='board'
      className='relative overflow-hidden w-full bg-muted h-full flex flex-1 min-h-96'
      {...props}
    />
  );
}

export { NoteBoard };
