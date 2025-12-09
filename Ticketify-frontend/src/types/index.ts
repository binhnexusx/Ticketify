import {
  Gender,
  UserRole,
  RoomStatus,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from '@/constants/enums';
import { RoomLevel } from '@/constants/rooms';

export interface User {
  user_id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  email: string;
  password: string;
  phone: string;
  address: string;
  avatar_url: string;
  role: UserRole;
  is_active: boolean;
}

export interface RegisterPayload {
  name: string;
  date_of_birth: string;
  gender: Gender;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Room {
  room_id: number;
  name: string;
  room_type_id: number;
  status: RoomStatus;
  price: string;
  description: string;
  images: string[];
  room_type_name?: string;
  room_level_name?: string;
}

export interface RoomImage {
  room_image_id: number;
  room_id: number;
  image_url: string;
  uploaded_at: string;
}

export interface RoomType {
  room_type_id: number;
  name: string;
  description: string;
  max_people: number;
  default_price: number;
}

export interface RoomAmenity {
  room_amenity_id: number;
  room_id: number;
  amenity_id: number;
}

export interface Amenity {
  amenity_id: number;
  name: string;
  icon: string;
  created_at: string | null;
  usage_count?: string;
}

export interface RoomWithDetails extends Room {
  images: string[];
  room_type_name?: string;
  room_level_name?: string;
  floor_name?: string;
  max_people?: number;
  room_type_price?: string;
  room_level_price?: string;
  floor_id?: number;
  room_level_id?: number;
  amenities?: Amenity[];
  final_price?: string;
  deal?: {
    deal_id: number;
    deal_name: string;
    discount_rate: number;
    start_date: string;
    end_date: string;
  } | null;
  rating?: number;
}

export interface HotelFeedback {
  hotel_feedback_id: number;
  user_id: number;
  rating: number;
  comment: string;
  submitted_at: string;
  avatar_url: string;
  full_name: string;
}

export interface HomepageData {
  rooms: RoomWithDetails[];
  topAmenities: Amenity[];
  topFeedbacks: HotelFeedback[];
}

export interface HomepageResponse {
  message: string;
  data: HomepageData;
}

export interface RoomListResponse {
  data: {
    rooms: RoomWithDetails[];
    hasDeals: boolean;
    pagination: {
      currentPage: number;
      perPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

export interface HotelState {
  rooms: Room[];
  searchResults: Room[];
  loading: boolean;
  error: string | null;
}

export interface Booking {
  booking_id: number;
  user_id: number;
  room_id: number;
  status: BookingStatus;
  check_in_date?: Date;
  check_out_date?: Date;
}

export interface BookingDetail {
  booking_detail_id: number;
  booking_id: number;
  room_id: number;
  quantity: number;
  price_per_unit: number;
  note: string;
  check_in_date: string;
  check_out_date: string;
}

export interface BookHotelPayload {
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  service_name?: string;
  quantity?: number;
  price_per_unit?: number;
  note?: string;
  total_guests: number;
}

export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paid_at: string;
  card_name: string;
  card_number: number;
  exp_date: Date;
}

export interface CreatePaymentDTO {
  booking_id: number;
  amount: number;
  method: PaymentMethod;
  card_name: string;
  card_number: string;
  exp_date: string;
}

export interface FavoriteRoom {
  favorite_room_id: number;
  user_id: number;
  room_id: number;
  created_at: string;
}

export interface CalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dateRange: [Date | null, Date | null]) => void;
  minDate?: Date;
}

export interface FilterForm {
  check_in: string;
  check_out: string;
  room_type: string;
  rooms: number;
  people: number;
}

export interface UrlSearchParams {
  check_in?: string;
  check_out?: string;
  people?: number;
  room_level?: string;
  page?: number;
  limit?: number;
}

export interface FilterSearchParams {
  priceRange?: [number, number];
  facilities?: string[];
  guestRating?: string;
  floor?: string;
}

export interface FilterState {
  range: number[];
  selectedFacilities: string[];
  guestRating: number | undefined;
  roomType: number | undefined;
  floor: string;
}

export interface ChangedFilters {
  range: boolean;
  selectedFacilities: boolean;
  guestRating: boolean;
  roomType: boolean;
  floor: boolean;
}

export interface RoomSearchFormValues {
  check_in: Date;
  check_out: Date;
  people: number;
  room_level: RoomLevel;
}
