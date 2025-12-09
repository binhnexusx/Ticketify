import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, onValueChange, ...props }, ref) => {
  const thumbs = value ?? defaultValue ?? [0];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex touch-none select-none items-center', className)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative w-full h-1 overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-root-primary-500" />
      </SliderPrimitive.Track>

      {Array.isArray(thumbs) &&
        thumbs.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              'relative block w-5 h-5 rounded-full border transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
              i === 0
                ? 'border-root-primary-500 bg-background'
                : 'bg-root-primary-500 border-primary/50 before:content-[""] before:absolute before:inset-[-10px] before:rounded-full before:bg-[#94C5E1] before:opacity-50 before:-z-10'
            )}
          />
        ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
