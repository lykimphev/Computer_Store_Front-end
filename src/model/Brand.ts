export interface Brand {
  id: number | string;
  name: string;
  slug: string;
  logo?: string;
  is_active?: boolean;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}
