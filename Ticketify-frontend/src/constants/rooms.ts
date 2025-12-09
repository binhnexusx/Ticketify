export enum Amenity {
  FREE_WIFI = 'Free Wi-Fi',
  BREAKFAST_INCLUDED = 'Breakfast Included',
  PETS_WELCOME = 'Pets are Welcome',
  FREE_PARKING = 'Free Parking',
  FREE_LAUNDRY_SERVICE = 'free laundry service',
  FREE_ENTRANCE_EXERCISE_CENTRE = 'Free Entrance Exercise Centre',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export enum RoomType {
  SINGLE = 'Single',
  DOUBLE = 'Double',
  TRIPLE = 'Triple',
}

export const ROOM_TYPES = [
  { id: RoomType.SINGLE, label: 'Single' },
  { id: RoomType.DOUBLE, label: 'Double' },
  { id: RoomType.TRIPLE, label: 'Triple' },
];

export enum RoomLevel {
  VIP = 'Vip',
  LUXURY = 'Luxury',
  STANDARD = 'Standard',
}

export const ROOM_STATUSES = Object.values(RoomStatus);

export const ROOM_LEVEL = [
  { id: RoomLevel.STANDARD, label: 'Standard' },
  { id: RoomLevel.LUXURY, label: 'Luxury' },
  { id: RoomLevel.VIP, label: 'Vip' },
];

export const FACILITIES = [
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'wifi', label: 'Wifi' },
  { id: 'seeView', label: 'See View' },
  { id: 'roomService', label: 'Room Service' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'minibar', label: 'Mini Bar' },
  { id: 'airConditioner', label: 'Air Conditioner' },
];

export const FLOORS = [1, 2];

export const GUEST_RATINGS = [
  { id: '5', label: 'Excellent' },
  { id: '4', label: 'Very good' },
  { id: '3', label: 'Good' },
  { id: '2', label: 'Fair' },
  { id: '1', label: 'Poor' },
];

export const DEALS = [
  { id: 'LongLasting', label: 'Long Lasting' },
  { id: 'FlashSale', label: 'Flash Sale' },
  { id: 'EarlyBird', label: 'Early Bird' },
  { id: 'FamilyDeal', label: 'Family Deal' },
];
