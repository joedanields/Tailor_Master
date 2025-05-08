export interface Customer {
  id: string;
  name: string;
  location: string;
  phone?: string;
  email?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Measurements {
  customerId: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  sleeve?: number;
  neck?: number;
  inseam?: number;
  outseam?: number;
  thigh?: number;
  calf?: number;
  ankle?: number;
  bicep?: number;
  wrist?: number;
  height?: number;
  notes?: string;
  updatedAt: number;
}

export type DressType = 
  | 'Dress 1' 
  | 'Dress 2' 
  | 'Dress 3' 
  | 'Dress 4' 
  | 'Dress 5'
  | 'Dress 6' 
  | 'Dress 7' 
  | 'Dress 8' 
  | 'Dress 9' 
  | 'Dress 10';

export type DeliveryMode = 'Customer' | 'Other';

export type DeliveryStatus = 'Taken' | 'Delivered';

export interface DeliveryLog {
  id: string;
  customerId: string;
  dressType: DressType;
  quantity: number;
  deliveryMode: DeliveryMode;
  recipientName?: string;
  status: DeliveryStatus;
  takenDate: number;
  deliveryDate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}