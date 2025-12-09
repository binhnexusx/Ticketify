export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export enum RoomStatus {
  Available = 'available',
  Booked = 'booked',
  Occupied = 'occupied',
  Maintenance = 'maintenance',
}

export enum BookingStatus {
  Booked = 'booked',
  CheckIn = 'checked_in',
  CheckedOut = 'checked_out',
  Cancelled = 'cancelled',
}

export enum PaymentMethod {
  PayPal = 'PayPal',
  AmericanExpress = 'American Express',
  Visa = 'Visa',
  MasterCard = 'MasterCard',
}

export enum PaymentStatus {
  Success = 'success',
  Failed = 'failed',
}

export enum OverviewType {
  CHECK_IN = "Check-in",
  CHECK_OUT = "Check-out",
  AVAILABLE_ROOM = "Available room",
  OCCUPIED_ROOM = "Occupied room",
  BOOKED_ROOM = "Booked room",
}

export enum OverviewTitle {
  TODAY = "Today's",
  TOTAL = "Total",
}

export enum RoomType {
  SINGLE = 'Single',
  DOUBLE = 'Double',
  TRIPLE = 'Triple'
}

export enum Month {
  Jan = 1,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sep,
  Oct,
  Nov,
  Dec,
}



