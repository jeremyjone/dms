import { RoleItem } from "./role";

export interface LoginInfo {
  username: string;
  password: string;
}

export interface ExtLoginInfo {
  username: string;
  nickname: string;
}

export interface UserItem {
  id: number;
  username: string;
  nickname: string;
  role: RoleItem;
}

export interface UserLoginItem extends UserItem {
  token: string;
}

export interface UserAddItem {
  username: string;
  nickname: string;
  password: string;
  roleId: number;
}

export interface UserUpdateItem {
  nickname: string;
  roleId: number;
}
