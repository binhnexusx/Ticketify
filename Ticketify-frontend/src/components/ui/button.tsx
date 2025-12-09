import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-5',
  {
    variants: {
      variant: {
        default:
          'bg-root-primary-500 text-white hover:bg-root-primary-600 disabled:bg-gray-400 disabled:text-gray-200',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline:
          'border border-root-primary-500 text-root-primary-500 bg-background hover:border-root-primary-600 hover:text-root-primary-600 disabled:text-root-gray-400 disabled:border-root-gray-400 disabled:hover:border-root-gray-400 disabled:hover:text-root-gray-400',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        'icon-blue-light-fill': 'bg-blue-100 text-blue-900 hover:bg-blue-200',
        'icon-blue-light-outline':
          'border border-blue-300 text-blue-900 bg-white hover:bg-blue-100',
        'icon-blue-dark-fill': 'bg-blue-800 text-white hover:bg-blue-700',
        'icon-blue-dark-outline': 'border border-blue-500 text-blue-800 bg-white hover:bg-blue-100',
        profile: 'w-full px-4 py-4 text-sm hover:bg-root-primary-500 hover:text-white',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-[32px] px-[12px] py-[6px] rounded-[4px] text-sm',
        lg: 'h-10 px-5 rounded-md text-base',
        icon: 'h-9 w-9',
        square: 'w-[300px] h-[64px] px-[16px] py-[8px] rounded-[4px] text-base',
      },
      selected: {
        true: 'bg-blue-100 text-blue-800 border-blue-700',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      selected: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      selected,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const contentClassName = cn(
      'flex gap-2 w-full',
      variant === 'profile' ? 'items-start' : 'items-center'
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, selected }), className)}
        ref={ref}
        {...props}
      >
        <span className="flex items-center justify-center w-full gap-2">
          <span className={contentClassName}>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children && <span className="mx-auto">{children}</span>}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </span>
        </span>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
