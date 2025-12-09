export interface CreateBookingPayload {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  totalGuests: number;
}

export interface BookingData {
  booking_id: number;
  user_id: number;
}

export interface BookingResponse {
  data: BookingDetail[];
  total: number;
  page: number;
  limit: number;
}
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface BookingDetail {
  booking_id: number;
  user_id: number | null;
  status: string | null;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  total_price: number;
  total_discounted_price: number;
  booking_details: {
    room_id: number;
    room_name: string;
    room_type: string;
    room_type_price: string;
    room_image: string;
    room_level: string;
    room_level_price: string;
    quantity: number;
    unit_price: number;
    discounted_unit_price: number;
    deal_discount_rate: number;
    deal_name: string
    price_per_unit: string;
  }[];
}
