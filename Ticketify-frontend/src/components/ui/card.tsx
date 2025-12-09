import * as React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Heart, MessageSquare, Star } from 'lucide-react';
import { isRoomLiked } from '@/lib/room';
import { formatDateRange } from '@/utils/formatDate';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import RoomFeedbackForm from '@/components/layout/profile/RoomFeedbackForm';
import { formatCurrency } from '@/utils/currency';
import { API_URL } from '@/lib/axios';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'horizontal' | 'vertical' | 'history';
    imageUrl?: string;
    name?: string;
    description?: string;
    price?: string;
    roomType?: string;
    roomLevel?: string;
    floor?: string;
    maxPeople?: number;
    finalPrice?: number;
    deal?: {
      deal_id: number;
      deal_name: string;
      discount_rate: number;
      start_date?: string;
      end_date?: string;
    };
    discountRate?: number;
    alwaysLiked?: boolean;
    roomId: string;
    bookingDetailId: string;
    roomName: string;
    roomDescription: string;
    onRemove?: () => void;
    onAdd?: () => void;
    handleTokenCheck?: () => boolean;
    onFeedbackClick?: () => void;
    amenities?: {
      room_id?: number;
      amenity_id: number;
      name: string;
      icon: string;
    }[];
    checkInDate?: string;
    checkOutDate?: string;
    bookingstatus?: 'booked' | 'checked_in' | 'checked_out' | 'cancelled';
    rating?: number;
    hasFeedback?: boolean;
  }
>(
  (
    {
      className,
      variant = 'default',
      imageUrl,
      name,
      description,
      price,
      roomType,
      roomLevel,
      floor,
      maxPeople,
      finalPrice,
      deal,
      alwaysLiked,
      roomId,
      roomDescription,
      roomName,
      bookingDetailId,
      onRemove,
      onAdd,
      handleTokenCheck = () => true,
      amenities = [],
      hasFeedback,
      onFeedbackClick,
      bookingstatus,
      checkInDate,
      checkOutDate,
      rating,
      ...props
    },
    ref
  ) => {
    const [isLiked, setIsLiked] = React.useState<boolean>(false);

    React.useEffect(() => {
      const fetchLikedStatus = async () => {
        if (alwaysLiked) {
          setIsLiked(true);
        } else if (roomId) {
          const liked = await isRoomLiked(roomId);
          setIsLiked(liked);
        }
      };

      fetchLikedStatus();
    }, [alwaysLiked, roomId]);

    const handleHeartClick = async (e: React.MouseEvent) => {
      e.stopPropagation();

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        if (handleTokenCheck) return handleTokenCheck();
      }

      if (alwaysLiked) return;

      const newState = !isLiked;
      setIsLiked(newState);

      if (newState) {
        if (onAdd) onAdd();
      } else {
        if (onRemove) onRemove();
      }
    };

    const getStatusConfig = (bookingstatus: string) => {
      switch (bookingstatus) {
        case 'booked':
          return {
            text: 'Booked',
            className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          };
        case 'checked_in':
          return {
            text: 'Checked_in',
            className: 'bg-blue-100 text-blue-700 border-blue-200',
          };
        case 'checked_out':
          return {
            text: 'Checked_out',
            className: 'bg-red-200 text-red-800 border-red-200',
          };
        case 'cancelled':
          return {
            text: 'Cancelled',
            className: 'bg-red-100 text-red-700 border-red-200',
          };
        default:
          return {
            text: 'Unknown',
            className: 'bg-gray-100 text-gray-700 border-gray-200',
          };
      }
    };

    const statusConfig = getStatusConfig(bookingstatus ?? 'unknown');

    if (variant === 'horizontal' && imageUrl && name && description && price) {
      return (
        <div
          ref={ref}
          className={cn(
            'relative flex items-center w-full max-w-[865px] h-[270px] rounded-xl border p-2 gap-4 shadow-lg bg-white transition-all duration-200 hover:shadow-xl hover:border-gray-300 hover:scale-[1.01]',
            className
          )}
          {...props}
        >
          {deal && deal.discount_rate > 0 && (
            <img
              src={`/public/assets/images/offer-tag.png`}
              alt="Offer Tag"
              className="absolute -top-2.5 -right-6 w-[147.32px] h-[150px] z-30"
            />
          )}

          {/* Left: Image */}
          <div className="relative w-[200px] h-full rounded-tl-lg rounded-bl-lg overflow-hidden">
            <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/25" />
            <div
              className="absolute top-2 left-2 bg-white/80 rounded-full w-[24px] h-[24px] flex items-center justify-center cursor-pointer z-10"
              onClick={handleHeartClick}
            >
              <Heart
                className={cn(
                  'w-[20px] h-[20px]',
                  isLiked ? 'text-red-500 fill-red-500' : 'text-gray-800'
                )}
              />
            </div>
            <div
              className={cn(
                'absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm',
                rating == null
                  ? 'bg-gray-400 text-white'
                  : rating >= 4
                    ? 'bg-green-500 text-white'
                    : rating >= 3
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
              )}
            >
              <Star size={12} className="fill-current" />
              {rating == null ? '—' : rating}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1 p-2">
            <div className="grid grid-rows-[auto_1fr_auto] h-full py-1">
              <div>
                <h2 className="text-xl font-bold">{name}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 gap-x-14">
                {amenities.map((a, i) => (
                  <div
                    key={a.amenity_id || i}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <img
                      src={`${API_URL}${a.icon}`}
                      alt={a.name}
                      className="object-contain w-5 h-5"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-icon.png';
                      }}
                    />
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start justify-between mt-2">
                {roomLevel && (
                  <p className="text-xl font-bold text-root-state-Success_Dark max-w-[100px] truncate">
                    {roomLevel}
                  </p>
                )}
                <div className="flex gap-20">
                  <div className="min-w-[60px]">
                    {deal && deal.discount_rate > 0 ? (
                      <p className="text-sm text-red-500">
                        {(deal.discount_rate * 100).toFixed(0)}% Off
                      </p>
                    ) : (
                      <p className="text-sm text-transparent">Placeholder</p>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    {deal && deal.discount_rate > 0 && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatCurrency(Number(price))}
                      </p>
                    )}
                    <p className="text-sm font-bold text-root-state-Success_Dark">
                      {formatCurrency(Number(finalPrice ?? price))}
                    </p>
                    <p className="text-xs text-root-gray-500">Per night</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-80">
                <div>
                  {roomType && <p className="text-xs text-gray-500">{roomType} room</p>}
                  {floor && <p className="text-xs text-gray-500">{floor}</p>}
                </div>
                {deal && deal.deal_name && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-2 py-2 mt-1 rounded-sm bg-root-primary-500">
                      <img
                        src={`/public/assets/images/bill.png`}
                        alt="Deal Icon"
                        className="object-contain w-5 h-5"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-icon.png';
                        }}
                      />
                      <div className="flex flex-col">
                        <p className="text-base font-bold text-root-gray-white">{deal.deal_name}</p>
                      </div>
                    </div>
                    {deal.start_date && deal.end_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <img
                          src={`/public/assets/images/time.png`}
                          alt="Calendar Icon"
                          className="object-contain w-4 h-4"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-icon.png';
                          }}
                        />
                        <span className="text-root-primary-600">
                          {formatDateRange(deal.start_date, deal.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'vertical' && imageUrl && name && description) {
      return (
        <div
          ref={ref}
          className={cn(
            'w-[288px] h-[367px] rounded-lg border border-gray-200 bg-white shadow-md p-2 pb-6 transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:scale-[1.01]',
            className
          )}
          {...props}
        >
          <div className="relative w-full h-[203px] rounded-md overflow-hidden">
            <img src={imageUrl} alt={name} className="w-[272px] h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div
              className="absolute top-2 left-2 bg-white/80 rounded-full w-[24px] h-[24px] flex items-center justify-center cursor-pointer z-10"
              onClick={handleHeartClick}
            >
              <Heart
                className={cn(
                  'w-[18px] h-[18px]',
                  isLiked ? 'text-red-500 fill-red-500' : 'text-gray-800'
                )}
              />
            </div>
            <div
              className={cn(
                'absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm',
                rating == null
                  ? 'bg-gray-400 text-white'
                  : rating >= 4
                    ? 'bg-green-500 text-white'
                    : rating >= 3
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
              )}
            >
              <Star size={12} className="fill-current" />
              {rating == null ? '—' : rating}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <h2 className="text-lg font-bold leading-tight">{name}</h2>
            <p className="text-xs text-gray-500 uppercase">{roomType}</p>
            <p className="mt-1 text-sm font-semibold">{roomLevel}</p>
            <p className="text-sm text-gray-600">
              {description.length > 30 ? `${description.slice(0, 30)}...` : description}
            </p>
          </div>
        </div>
      );
    }

    if (variant === 'history') {
      return (
        <div
          ref={ref}
          className={cn(
            'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group w-full max-w-[865px]',
            className
          )}
          {...props}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden md:w-80 md:h-auto">
              <img
                src={imageUrl}
                alt={name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute p-2 transition-all duration-200 rounded-full top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110"
              >
                <Heart
                  size={20}
                  className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors duration-200`}
                />
              </button>
              <div
                className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border font-medium text-sm ${statusConfig.className} backdrop-blur-sm`}
              >
                {statusConfig.text}
              </div>
              {deal && deal.discount_rate > 0 && (
                <button
                  className={`absolute bottom-0 rounded w-full px-3 py-1.5 font-medium text-sm bg-root-primary-500`}
                >
                  <div className="mt-1 text-sm font-medium text-white">
                    <span className="font-semibold">Applied deal: {deal.deal_name}</span> (
                    {(deal.discount_rate * 100).toFixed(0)}% off)
                  </div>
                </button>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 md:p-8">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1 text-2xl font-bold text-gray-900">{name}</h3>
                      <div className="flex items-center gap-2 mb-3 text-gray-600">
                        <span className="font-medium">{roomLevel}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-sm text-gray-600">Total Paid</p>
                      <p className="text-3xl font-bold text-root-primary-500">
                        {formatCurrency(Number(finalPrice ?? price))}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Calendar size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-900">{checkInDate || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-50">
                        <Calendar size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Check-out</p>
                        <p className="font-semibold text-gray-900">{checkOutDate || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Rating:</span>
                      <div className="flex gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={
                                hasFeedback && i < (rating ?? 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      {bookingstatus === 'checked_out' && !hasFeedback ? (
                        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-root-primary-500 hover:bg-root-primary-600">
                          <MessageSquare size={18} />
                          <span className="font-medium">Add Feedback</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onFeedbackClick?.();
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                        >
                          <MessageSquare size={18} />
                          <span className="font-medium">Your Feedback</span>
                        </button>
                      )}
                    </DialogTrigger>

                    <DialogContent className="max-w-xl p-0 bg-transparent border-none shadow-none">
                      <div className="overflow-hidden bg-white shadow-lg rounded-xl w-[500px] h-[550px]">
                        <RoomFeedbackForm
                          roomId={roomId}
                          bookingDetailId={bookingDetailId}
                          roomName={roomName}
                          roomDescription={roomDescription}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
