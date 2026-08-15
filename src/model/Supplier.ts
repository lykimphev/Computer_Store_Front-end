export interface Supplier {
  id: number | string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}
