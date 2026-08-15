import apiClient from "../apis/apiClient";
import type { ApiResponse } from "../apis/apiResponse";
import type { Supplier } from "../model/Supplier";

const END_POINT = "/suppliers";

export const SupplierService = {
  getSuppliers: async (): Promise<ApiResponse<Supplier[]>> => {
    try {
      const response = await apiClient.get(END_POINT);
      const resData = response.data || response;
      return {
        success: true,
        statuscode: 200,
        message: "Suppliers fetched successfully",
        data: resData.data || (Array.isArray(resData) ? resData : []),
      };
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to fetch suppliers";
    }
  },
};

export const supplierService = SupplierService;
