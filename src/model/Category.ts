export interface Category {
  id: number | string;
  name: string;
  slug: string;
  icon?: string;
  is_active?: boolean;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}
