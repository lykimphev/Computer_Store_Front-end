/**
 * API RESPONSE WRAPPER INTERFACE
 * ==============================
 * Standard API response wrapper contract.
 */
export interface ApiResponse<T> {
  success: boolean;
  statuscode: number;
  message: string;
  data: T;
}
