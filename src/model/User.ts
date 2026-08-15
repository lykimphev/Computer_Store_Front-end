import type { Role } from "./Role";
import type { Permission } from "./Permission";

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  token?: string;
  role_id?: number | string;
  permission_id?: number | string;
  expired?: string;
  status?: boolean;
  role?: Role;
  permission?: Permission;
}
