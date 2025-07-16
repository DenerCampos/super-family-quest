export interface RevenueItem {
  id: string;
  name: string;
  value: number;
  repeat: boolean;
  date: string;
  isSelected: boolean;
}

export interface RevenueFormData {
  revenues: RevenueItem[];
} 