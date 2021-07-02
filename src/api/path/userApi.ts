import { post, get, put, del, getData, getErr } from "@/api/server";
import {
  LoginInfo,
  UserItem,
  UserLoginItem,
  UserAddItem,
  UserUpdateItem,
  ExtLoginInfo
} from "@/models/user";
import { Response, TO } from "@/models/common";
import { PermissionItem, RoleItem } from "@/models/role";
import { encrypt } from "@/utils/business";
import { TEST_PERMISSIONS, TEST_ROLES, TEST_USER } from "../testData/user";

export function Login(data: LoginInfo): TO<Response<UserLoginItem>> {
  if (
    data.username === TEST_USER.username &&
    data.password === encrypt("qaz123")
  ) {
    return getData({
      ...TEST_USER,
      token: "my_token"
    });
  } else {
    return getErr("login error");
  }
}

export function ExtLogin(data: ExtLoginInfo): TO<Response<UserLoginItem>> {
  return getData({
    id: 1,
    username: data.username,
    nickname: data.nickname,
    role: TEST_ROLES[0],
    token: "my_token"
  });
}

export function GetUser(): TO<Response<UserItem>> {
  return getData(TEST_USER);
}

export function GetUsers(): TO<Response<Array<UserItem>>> {
  return getData([TEST_USER]);
}

export function CreateUser(user: UserAddItem): TO<Response<UserItem>> {
  return getData({
    id: 2,
    username: user.username,
    nickname: user.nickname,
    role: TEST_ROLES.find(x => x.id === user.roleId) ?? TEST_ROLES[2]
  });
}

export function UpdateUser(
  id: number,
  user: UserUpdateItem
): TO<Response<UserItem>> {
  return getData(TEST_USER);
}

export function DeleteUser(ids: number[]): TO<Response<string>> {
  return getData("success");
}

export function GetRoles(): TO<Response<Array<RoleItem>>> {
  return getData(TEST_ROLES);
}

export function GetPermissions(): TO<Response<Array<PermissionItem>>> {
  return getData(TEST_PERMISSIONS);
}

export const userApi = {
  Login,
  ExtLogin,
  GetUser,
  GetUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
  GetRoles,
  GetPermissions
};

export interface UserApi {
  Login: (data: LoginInfo) => TO<Response<UserLoginItem>>;
  ExtLogin: (data: ExtLoginInfo) => TO<Response<UserLoginItem>>;
  GetUser: () => TO<Response<UserItem>>;
  GetUsers: () => TO<Response<Array<UserItem>>>;
  CreateUser: (user: UserAddItem) => TO<Response<UserItem>>;
  UpdateUser: (id: number, user: UserUpdateItem) => TO<Response<UserItem>>;
  DeleteUser: (ids: number[]) => TO<Response<string>>;
  GetRoles: () => TO<Response<Array<RoleItem>>>;
  GetPermissions: () => TO<Response<Array<PermissionItem>>>;
}
