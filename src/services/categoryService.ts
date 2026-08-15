import apiClient from "../apis/apiClient";
import type { ApiResponse } from "../apis/apiResponse";
import type { Category } from "../model/Category";

const END_POINT = "/categories";

export const CategoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await apiClient.get(END_POINT);
      const resData = response.data || response;
      return {
        success: true,
        statuscode: 200,
        message: "Categories fetched successfully",
        data: resData.data || (Array.isArray(resData) ? resData : []),
      };
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to fetch categories";
    }
  },
};

export const categoryService = CategoryService;
