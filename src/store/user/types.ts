import { PermissionItem } from "@/models/role";

export interface VUserState {
  username: string;
  nickname: string;
  token: string;
  role: PermissionItem[];
}
