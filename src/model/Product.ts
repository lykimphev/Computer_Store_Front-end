/**
 * PRODUCT & SPECS DATA MODELS
 */

export interface Specs {
  cpu: string;
  ram?: string;
  storage?: string;
  screen?: string;
  displayExtra?: string;
  vga?: string;
  gpu?: string;
  keyboard?: string;
  os?: string;
  battery?: string;
  weight?: string;
  color?: string;
  canUpgrade?: boolean;
  upgradeOptions?: any[];
  socket?: string;
  capacity?: string;
  wattage?: string;
  formFactor?: string;
  sensor?: string;
  connectivity?: string;
  interface?: string;
}

export type SubCategory =
  | 'all'
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'cooler'
  | 'monitor'
  | 'powersupply'
  | 'case'
  | 'headphone'
  | 'mouse'
  | 'keyboard'
  | 'usb'
  | 'external'
  | 'gaming_chair'
  | 'wifi'
  | 'asus'
  | 'asus_rog'
  | 'msi'
  | 'mac';

export interface Product {
  id: string;
  name: string;
  category: 'laptop' | 'pc_hardware' | 'accessories';
  brand: string;
  subCategory?: string;
  series: string;
  price: number;
  specs: Specs;
  image: string;
  isFeatured?: boolean;
  stock?: number;
}
