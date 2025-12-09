import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star } from 'lucide-react';
import { API_URL } from '@/constants/api';
import { RoomData } from '@/types/room';

interface HotelInformationCardProps {
  room: RoomData | null;
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const HotelInformationCard: React.FC<HotelInformationCardProps> = ({
  room,
  showAll,
  setShowAll,
}) => {
  const imagesToShow = showAll ? room?.images : room?.images?.slice(0, 4);
  const feedbacks = room?.feedbacks || [];
  const feedbackCount = feedbacks.length;
  const averageRating = feedbackCount
    ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbackCount
    : 0;
  const percentage = (averageRating / 5) * 100;
  return (
    <div>
      <div className="flex flex-col lg:flex-row">
        <div className="grid gap-2 w-full lg:w-[200px] relative">
          {imagesToShow?.map((img, i) => (
            <img
              key={i}
              src={`${API_URL}${img}`}
              alt={`room-image-${i}`}
              className="rounded-md w-[140px] h-[120px] object-cover"
            />
          ))}
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-2 p-4">
            <div>
              <h2 className="text-md font-semibold pb-1 line-clamp-2">{room?.name}</h2>
              <p className="text-xs text-root-gray-500 p-0">{room?.description}</p>
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <p className="text-sm">{feedbackCount || 0} Reviews</p>
                  <ChevronRight />
                </div>
                <span className="flex items-center gap-1 p-1 border rounded text-xs">
                  <Star className="w-3 h-3 text-yellow-500" fill="#facc15" stroke="#facc15" />
                  {averageRating.toFixed(0)}
                </span>
              </div>
              <div className="w-full bg-root-gray-300 rounded-full h-2 mt-1">
                <div
                  className="bg-root-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-1 text-sm text-root-gray-500 p-4">
            <ul className="flex flex-col gap-y-5">
              {room?.amenities && room.amenities.length > 0 ? (
                room.amenities.map((amenity) => (
                  <li key={amenity.name} className="flex items-center gap-2">
                    <img
                      src={`${API_URL}${amenity.icon}`}
                      alt={amenity.name}
                      className="w-5 h-5 object-contain"
                    />
                    <span>{amenity.name}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground italic">No amenities available.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HotelInformationCard;
