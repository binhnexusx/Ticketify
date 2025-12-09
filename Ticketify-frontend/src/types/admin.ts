export interface DashboardStatus {
  check_in_today: number;
  check_out_today: number;
  available_room_count: number;
  occupied_room_count: number;
  booked_room_count: number;
}

export interface DashboardDeal {
  room_type_name: string;
  price: string; 
  total_deals: number;
  total_rooms: string;
  used_rooms: string;
}

export interface DashboardFeedback {
  customer_name: string;
  room_name: string;
  comment: string;
  rating: number;
  submitted_at: string; 
}

export interface DashboardChart{
  room_name: string;
  total_bookings:  number;
}

export interface GuestList{
  guest_number : number;
  name: string;
  email: string;
  phone: number | null;
  booking_count: number | 0;
  status: string;
} 

export interface Pagination{
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export interface Rate {
  room_id: number;
  deal_name: string;
  room_number: string;
  room_type: string;
  room_level: string;
  original_price: string;
  total_rooms: string;
  number_of_booking: string;
  total_revenue: string;
  best_seller_room: boolean;
  booking_id: number;
  date_of_stay: string;
  number_of_days: number; 
  price: number;
}