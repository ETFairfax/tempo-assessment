import { cn } from 'cn';
import { TrashIcon } from 'lucide-react';
import type * as React from 'react';

type TrashZoneProps = React.ComponentProps<'div'>;

function TrashZone({ className, ...rest }: TrashZoneProps) {
  return (
    <div
      {...rest}
      className={cn(
        'bg-red-300 p-4 border-dashed border transition-colors data-[active=true]:bg-red-400 data-[active=true]:border-solid flex items-center gap-4'
      )}
    >
      <TrashIcon /> The Bin
    </div>
  );
}

export { TrashZone };
