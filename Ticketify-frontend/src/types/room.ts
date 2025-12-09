export interface Deal {
  deal_id: number;
  deal_name: string;
  discount_rate?: number;
  start_date?: string;
  end_date?: string;
}

export interface Room {
  room_id: number;
  name: string;
  room_type_id: number;
  room_type_name?: string;
  room_level_id: number;
  room_level_name?: string;
  floor_id?: number;
  amenities?: any[];
  images?: string[];
  image_urls?: string[];
  room_type_price?: number;
  total_price: number;
  status: 'available' | 'occupied' | 'maintenance';
  description?: string;
  deal?: Deal | null;
}
export interface RoomHome {
  room_id: number;
  name: string;
  description: string;
  status: 'available' | 'booked' | 'occupied' | 'maintenance';
  room_type_name: string;
  room_level_name: string;
  image_url?: string[];
}

export interface Amenity {
  name: string;
  icon: string;
}

export interface Feedbacks {
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface RoomData {
  room_id: number;
  room_number: number;
  name?: string;
  description: string;

  price: number;
  deal_name: String;
  discount_rate?: number;
  room_level?: string;
  room_level_price?: string;

  room_type?: string;
  room_type_price?: string;
  max_people: Number;

  floor_name: String;

  images: string[];
  amenities: Amenity[];

  feedbacks?: Feedbacks[];
}

// export interface RoomData {
//   room_id: number;
//   name?: string;
//   description: string;
//   price: string;
//   room_level_price?: string;
//   room_level?: string;
//   room_type_price?: string;
//   discount_rate?: number;
//   images: string[];
//   amenities: Amenity[];
// }

export interface RoomForm {
  number: string;
  bed: string;
  floor: string;
  facilities?: string;
  description?: string;
  status: RoomStatus;
}

export interface RoomLevel {
  room_level_id: number;
  name: string;
  price: number;
}

export interface FilterAmenity {
  amenity_id: number;
  name: string;
  icon: string;
}

export interface Floor {
  floor_id: number;
  name: string;
}

export interface RoomType {
  room_type_id: number;
  name: string;
  price: number;
  max_people: number;
}

export interface PriceRange {
  min_price: number;
  max_price: number;
}

export interface FilterOptions {
  maxPeople: number[];
  roomLevels: RoomLevel[];
  amenities: FilterAmenity[];
  floors: Floor[];
  roomTypes: RoomType[];
  priceRange: PriceRange;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface RoomFilters {
  min_price?: number;
  max_price?: number;
  room_type?: number;
  people?: number;
  check_in_date?: string;
  check_out_date?: string;
  amenities?: string;
  has_deal?: string;
  status?: RoomStatus;
  room_level?: number;
  floor?: number;
}

export interface FilteredRoom extends Room {
  price: number;
  roomType: string;
  roomLevel: string;
  floor: string;
  max_people: number;
  images: string[];
  deal?: {
    deal_id: number;
    deal_name: string;
    discount_rate: number;
    final_price: number;
  } | null;
}

export interface RoomAvailable {
  id: number;
  name: string;
  roomType: string;
  roomLevel: string;
  floor: number;
  amenities: { name: string }[];
  price: number;
  status: string;
}
