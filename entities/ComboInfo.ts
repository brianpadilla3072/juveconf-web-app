export interface Merchandise {
  enabled: boolean;
  allMerchandise: {
    type: string;
    label: string;
    sizes: string[];
  }[];
  selectedSizes?: { [type: string]: string };
}

export interface SnapshotInfo {
  appliedPrice: number;
  basePrice: number;
  preSaleInfo?: {
    id: string;
    name: string;
    discount: number;
  } | null;
}

export interface AttendeeInfo {
  email?: string;
  phone?: string;
  birthdate?: string;
  city?: string;
  church?: string;
  merchandiseSizes?: { [type: string]: string };
}

export interface ComboInfo {
  hasCombo: boolean;
  message?: string; // Solo presente cuando hasCombo = false
  
  // Información del combo (solo presente cuando hasCombo = true)
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  isFree?: boolean;
  personsIncluded?: number;
  benefits?: string[];
  merchandise?: Merchandise | null;
  attendeeInfo?: AttendeeInfo | null;
  snapshotInfo?: SnapshotInfo | null;
}

export interface ComboInfoResponse {
  success: boolean;
  data: ComboInfo;
  error?: string;
}