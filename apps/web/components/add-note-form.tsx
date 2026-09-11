import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardFooter } from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Slider } from '@workspace/ui/components/slider';
import { useNotesStore } from '../lib/notes-store';

type AddNoteFormProps = {
  height: number;
  width: number;
  onAddNote: () => void;
};

function AddNoteForm({ height, width, onAddNote }: AddNoteFormProps) {
  const { updateSettings } = useNotesStore();

  return (
    <Card>
      <CardContent className='flex flex-col gap-4 '>
        <Label htmlFor='default-height'>Height</Label>
        <Slider
          id='default-height'
          min={100}
          max={500}
          value={height}
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
          value={width}
          onValueChange={value =>
            updateSettings({
              defaultWidth: Array.isArray(value) ? value[0] : value
            })
          }
          className='w-full'
        />
      </CardContent>
      <CardFooter>
        <Button onClick={onAddNote}>Add Note</Button>
      </CardFooter>
    </Card>
  );
}

export { AddNoteForm };
