export interface RoleItem {
  id: number;
  name: string;
  description: string;
  permissions?: PermissionItem[];
}

export interface PermissionItem {
  id: number;
  name: string;
  description: string;
  default: boolean;
  value?: boolean;
}
