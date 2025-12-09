import { cn } from '@/lib/utils';

interface LoadingProps {
  variant: 'spinner' | 'skeleton' | 'card';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  lines?: number;
  cardVariant?: 'horizontal' | 'vertical';
}

export default function Loading({
  variant,
  size = 'md',
  className,
  lines = 3,
  cardVariant = 'horizontal',
}: LoadingProps) {
  if (variant === 'spinner') {
    return <Spinner size={size} className={className} />;
  }

  if (variant === 'skeleton') {
    return <Skeleton size={size} className={className} lines={lines} />;
  }

  if (variant === 'card') {
    return <CardSkeleton size={size} className={className} cardVariant={cardVariant} />;
  }

  return null;
}

function Spinner({ size, className }: { size: string; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'border-primary border-t-transparent border-solid rounded-full animate-spin',
          sizeClasses[size as keyof typeof sizeClasses]
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

function Skeleton({ size, className, lines }: { size: string; className?: string; lines: number }) {
  const heightClasses = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
  };

  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4',
  };

  const widthVariants = ['w-full', 'w-[95%]', 'w-[85%]', 'w-[70%]', 'w-3/4'];

  return (
    <div
      className={cn(
        'animate-pulse',
        spacingClasses[size as keyof typeof spacingClasses],
        className
      )}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          role="presentation"
          className={cn(
            'relative overflow-hidden bg-gray-200 rounded',
            'before:absolute before:inset-0 before:-translate-x-full',
            'before:animate-[shimmer_1.5s_infinite_linear]',
            'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
            heightClasses[size as keyof typeof heightClasses],
            widthVariants[index % widthVariants.length]
          )}
          style={{
            animation: 'shimmer 1.5s infinite linear',
          }}
        />
      ))}
    </div>
  );
}

function CardSkeleton({
  size,
  className,
  cardVariant,
}: {
  size: string;
  className?: string;
  cardVariant: 'horizontal' | 'vertical';
}) {
  const sizeClasses = {
    sm: {
      horizontal: { container: 'h-[180px] max-w-[600px]', image: 'w-[140px]' },
      vertical: { container: 'h-[260px] w-[200px]', image: 'h-[140px]' },
    },
    md: {
      horizontal: { container: 'h-[256px] max-w-[865px]', image: 'w-[200px]' },
      vertical: { container: 'h-[367px] w-[288px]', image: 'h-[203px]' },
    },
    lg: {
      horizontal: { container: 'h-[300px] max-w-[1000px]', image: 'w-[240px]' },
      vertical: { container: 'h-[400px] w-[320px]', image: 'h-[240px]' },
    },
  };

  if (cardVariant === 'horizontal') {
    return (
      <div
        className={cn(
          'relative flex items-center w-full rounded-xl border p-2 gap-4 shadow-lg bg-white animate-pulse',
          sizeClasses[size as keyof typeof sizeClasses].horizontal.container,
          className
        )}
      >
        {/* Image Placeholder */}
        <div
          className={cn(
            'relative rounded-tl-lg rounded-bl-lg overflow-hidden bg-gray-200',
            sizeClasses[size as keyof typeof sizeClasses].horizontal.image,
            'h-full'
          )}
        >
          <div className="absolute inset-0 bg-gray-200" />
          <div className="absolute top-2 left-2 bg-gray-300 rounded-full w-[24px] h-[24px]" />
          <div className="absolute bottom-2 right-2 bg-gray-300 text-xs px-1.5 py-0.5 rounded w-8 h-4" />
        </div>

        {/* Info Placeholder */}
        <div className="flex items-center justify-between flex-1 p-2">
          <div className="flex flex-col justify-between w-full py-1 space-y-3">
            <div className="space-y-2">
              <div className="w-1/2 h-5 bg-gray-200 rounded" />
              <div className="w-1/3 h-4 bg-gray-200 rounded" />
              <div className="grid grid-cols-2 gap-x-14 gap-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
              <div className="w-2/3 h-4 bg-gray-200 rounded" />
              <div className="w-1/2 h-4 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex flex-col items-end justify-center space-y-2">
            <div className="w-16 h-5 bg-gray-200 rounded" />
            <div className="w-20 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (cardVariant === 'vertical') {
    return (
      <div
        className={cn(
          'rounded-lg border bg-white shadow-md p-2 transition-all duration-200',
          sizeClasses[size as keyof typeof sizeClasses].vertical.container,
          className
        )}
      >
        {/* Image Placeholder */}
        <div
          className={cn(
            'relative rounded-md overflow-hidden bg-gray-200',
            sizeClasses[size as keyof typeof sizeClasses].vertical.image
          )}
        >
          <div className="absolute inset-0 bg-gray-200" />
          <div className="absolute top-2 left-2 bg-gray-300 rounded-full w-[24px] h-[24px]" />
          <div className="absolute bottom-2 right-2 bg-gray-300 text-xs px-1.5 py-0.5 rounded w-8 h-4" />
        </div>

        {/* Info Placeholder */}
        <div className="mt-4 space-y-3">
          <div className="w-3/4 h-5 bg-gray-200 rounded" />
          <div className="w-1/2 h-4 bg-gray-200 rounded" />
          <div className="w-1/3 h-4 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return null;
}

// Shimmer keyframes
const style = document.createElement('style');
style.innerHTML = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('shimmer-keyframes')) {
  style.id = 'shimmer-keyframes';
  document.head.appendChild(style);
}
