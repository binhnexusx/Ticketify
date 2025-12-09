export interface HotelFeedback {
  id: number;
  rating: number;
  comment: string;
  user_id: number;
  submitted_at: string;
}

export interface RoomFeedback {
  room_id: number;
  room_name: string;
  booking_detail_id: number;
  room_description: string;
  rating: number;
  comment: string;
}
export interface Favorite {
  total_room: number;
  room_name: string;
  room_type: string;
  room_level: string;
  room_description: string;
  image_url: string
}

export interface FavoriteRoomResponse {
  message: string;
}

export interface Pagination{
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
