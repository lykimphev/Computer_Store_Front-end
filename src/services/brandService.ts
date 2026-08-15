import apiClient from "../apis/apiClient";
import type { ApiResponse } from "../apis/apiResponse";
import type { Brand } from "../model/Brand";

const END_POINT = "/brands";

export const BrandService = {
  getBrands: async (): Promise<ApiResponse<Brand[]>> => {
    try {
      const response = await apiClient.get(END_POINT);
      const resData = response.data || response;
      return {
        success: true,
        statuscode: 200,
        message: "Brands fetched successfully",
        data: resData.data || (Array.isArray(resData) ? resData : []),
      };
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to fetch brands";
    }
  },
};

export const brandService = BrandService;
