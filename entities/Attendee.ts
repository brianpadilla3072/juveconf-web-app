export interface Attendee {
  name: string;
  cuil: string;
  metadata?: string; // JSON string con: { email?, phone?, birthdate?, city?, church? }
}