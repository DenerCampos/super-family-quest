export interface RevenueItem {
  id: string;
  name: string;
  value: number;
  repeat: boolean;
  date: string;
  isSelected: boolean;
  installmentLabel?: string | null;
}

export interface RevenueFormData {
  revenues: RevenueItem[];
} 