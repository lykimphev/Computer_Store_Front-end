import apiClient from "../apis/apiClient";
import type { ApiResponse } from "../apis/apiResponse";
import type { Product } from "../model/Product";

const END_POINT = "/products";

const normalizeCategory = (slug: string): Product["category"] => {
  if (slug === "laptops" || slug === "laptop") return "laptop";
  if (slug === "pc_hardware" || slug === "hardware") return "pc_hardware";
  return "accessories";
};

/**
 * Get backend base URL from environment
 */
const getBackendBaseUrl = (): string => {
  const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

/**
 * Ensures full HTTP URL for Laravel Backend static images
 */
export const formatImageUrl = (img: string): string => {
  if (!img) return "/Image/Logo.png";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  const backendBase = getBackendBaseUrl();
  return `${backendBase}${cleanPath}`;
};

/**
 * PRODUCT SERVICE LAYER
 * =====================
 * Handles fetching product list and single product details directly from Laravel API & PostgreSQL database.
 */
export const ProductService = {
  getProducts: async (category?: string, brand?: string, search?: string): Promise<ApiResponse<Product[]>> => {
    try {
      let url = END_POINT;
      const params = new URLSearchParams();
      if (category && category !== "all") params.append("category", category);
      if (brand && brand !== "all") params.append("brand", brand);
      if (search) params.append("search", search);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await apiClient.get(url);
      const resData = response.data || response;
      const rawProducts = Array.isArray(resData.data) ? resData.data : (resData.data?.data || []);

      const data: Product[] = rawProducts.map((p: any) => {
        const rawImg = p.image_url || p.main_image || p.image || "";
        return {
          id: String(p.id),
          name: p.name,
          category: normalizeCategory(typeof p.category === "object" ? (p.category?.slug || "laptop") : (p.category || "laptop")),
          brand: typeof p.brand === "object" ? (p.brand?.slug || p.brand?.name || "all") : (p.brand || "all"),
          subCategory: p.sub_category || "all",
          series: p.series || "",
          price: Number(p.price || 0),
          specs: typeof p.specs === "string" ? JSON.parse(p.specs) : (p.specs || {}),
          image: formatImageUrl(rawImg),
          isFeatured: Boolean(p.is_featured),
          stock: Number(p.stock || 0),
        };
      });

      return {
        success: true,
        statuscode: 200,
        message: "Products fetched successfully",
        data: data,
      };
    } catch (error: any) {
      return {
        success: false,
        statuscode: 500,
        message: error.response?.data?.message || "Failed to fetch products",
        data: [],
      };
    }
  },

  getProductById: async (id: string): Promise<ApiResponse<Product | undefined>> => {
    try {
      const response = await apiClient.get(`${END_POINT}/${id}`);
      const resData = response.data || response;
      const p = resData.data || resData;

      const rawImg = p.image_url || p.main_image || p.image || "";

      const data: Product = {
        id: String(p.id),
        name: p.name,
        category: normalizeCategory(typeof p.category === "object" ? (p.category?.slug || "laptop") : (p.category || "laptop")),
        brand: typeof p.brand === "object" ? (p.brand?.slug || p.brand?.name || "all") : (p.brand || "all"),
        subCategory: p.sub_category || "all",
        series: p.series || "",
        price: Number(p.price || 0),
        specs: typeof p.specs === "string" ? JSON.parse(p.specs) : (p.specs || {}),
        image: formatImageUrl(rawImg),
        isFeatured: Boolean(p.is_featured),
        stock: Number(p.stock || 0),
      };

      return {
        success: true,
        statuscode: 200,
        message: "Product details fetched successfully",
        data: data,
      };
    } catch (error: any) {
      return {
        success: false,
        statuscode: 404,
        message: error.response?.data?.message || "Product not found",
        data: undefined,
      };
    }
  },
};

export const productService = ProductService;