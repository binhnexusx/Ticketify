import { PaymentMethod } from "@/constants/enums";

export type FormValues = {
  // Guest Info
  name: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  mainGuest: string;
  assistance: string;
  region: string;

  // Payment Info
  paymentMethod: PaymentMethod;

  // Bank Card Info
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};
