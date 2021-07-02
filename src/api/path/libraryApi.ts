import { get, post, put, del, getData } from "../server";
import { TO, Response } from "@/models/common";
import { LibraryAddItem, LibraryUpdateItem } from "@/models/library";
import { LibraryItem } from "@/models/library";
import { TEST_LIBRARIES } from "../testData/library";

export function GetLibraries(param?: { name?: string; description?: string }) {
  let p = "";
  if (param && param.name) p += `name=${param.name}`;
  if (param && param.description) p += `description=${param.description}`;

  return getData(TEST_LIBRARIES);
}

export function GetLibrary(id: number) {
  return getData(TEST_LIBRARIES.find(x => x.id === id));
}

export function CreateLibrary(library: LibraryAddItem) {
  return getData({
    id: 3,
    name: library.name,
    description: library.description,
    thumbnail: library.thumbnail,
    creatorId: 1,
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    }
  });
}

export function UpdateLibrary(id: number, library: LibraryUpdateItem) {
  return getData({
    id: id,
    name: library.name,
    description: library.description,
    thumbnail: library.thumbnail,
    creatorId: 1,
    creator: {
      id: 1,
      username: "user1",
      nickname: "USER1"
    }
  });
}

export function DeleteLibrary(id: number) {
  return getData("success");
}

export const libraryApi = {
  GetLibraries,
  GetLibrary,
  CreateLibrary,
  UpdateLibrary,
  DeleteLibrary
};

export interface LibraryApi {
  GetLibraries: (param?: {
    name?: string;
    description?: string;
  }) => TO<Response<LibraryItem[]>>;
  GetLibrary: (id: number) => TO<Response<LibraryItem>>;
  CreateLibrary: (library: LibraryAddItem) => TO<Response<LibraryItem>>;
  UpdateLibrary: (
    id: number,
    library: LibraryUpdateItem
  ) => TO<Response<LibraryItem>>;
  DeleteLibrary: (id: number) => TO<Response<object>>;
}
