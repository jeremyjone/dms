import { post, get, put, del, getData } from "@/api/server";
import { Response, TO } from "@/models/common";
import {
  DataItem,
  DataAddItem,
  DataUpdateItem,
  DataUpdateItems
} from "@/models/data";
import { VersionItem } from "@/models/version";
import { TEST_DATA, TEST_VERSIONS } from "../testData/data";

interface DataParameter {
  name?: string;
  type?: string;
  q?: string;
}

const qs = (q?: DataParameter) => {
  let param = "";
  if (q && q.name) param += "name=" + q.name;
  if (q && q.type) param += "&type=" + q.type;
  if (q && q.q) param += "&q=" + q.q;

  return param;
};

export function GetData(
  libraryId: number,
  parentId: number,
  q?: DataParameter
) {
  return getData(
    TEST_DATA.filter(x => x.libraryId === libraryId && x.parentId === parentId)
  );
}

export function GetDatum(id: number) {
  return getData(TEST_DATA.find(x => x.id === id));
}

export function CreateDatum(data: DataAddItem) {
  return getData({
    id: TEST_DATA.length,
    name: data.name,
    size: 1234,
    type: data.type,
    thumbnail: data.thumbnail,
    description: data.description,
    creatorId: 1,
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    },
    parentId: data.parentId,
    fileId: data.fileId,
    libraryId: data.libraryId,
    updateTime: new Date().toLocaleDateString(),
    createTime: new Date().toLocaleDateString()
  });
}

export function CreateData(data: DataAddItem[]) {
  return getData(TEST_DATA);
}

export function UpdateDatum(id: number, data: DataUpdateItem) {
  return getData(TEST_DATA.find(x => x.id === id));
}

export function UpdateData(items: DataUpdateItems[]) {
  return getData(
    TEST_DATA.filter(x => items.map(item => item.id).includes(x.id))
  );
}

export function DeleteDatum(id: number) {
  return getData("success");
}

export function DeleteData(ids: number[]) {
  return getData("success");
}

export function GetVersions(id: number) {
  return getData(TEST_VERSIONS.filter(x => x.id === id));
}

export const dataApi = {
  GetData,
  GetDatum,
  CreateDatum,
  CreateData,
  UpdateDatum,
  UpdateData,
  DeleteDatum,
  DeleteData,
  GetVersions
};

export interface DataApi {
  /**
   * @param libraryId 资料库 Id
   * @param parentId 父级 id，根层为0，获取全部层级内容为-1
   * @param q 查询参数
   */
  GetData: (
    libraryId: number,
    parentId: number,
    q?: DataParameter
  ) => TO<Response<DataItem[]>>;
  GetDatum: (id: number) => TO<Response<DataItem>>;
  CreateDatum: (data: DataAddItem) => TO<Response<DataItem>>;
  CreateData: (data: DataAddItem[]) => TO<Response<DataItem[]>>;
  UpdateDatum: (id: number, data: DataUpdateItem) => TO<Response<DataItem>>;
  UpdateData: (items: DataUpdateItems[]) => TO<Response<DataItem[]>>;
  DeleteDatum: (id: number) => TO<Response<string>>;
  DeleteData: (ids: number[]) => TO<Response<string>>;
  GetVersions: (id: number) => TO<Response<VersionItem[]>>;
}
