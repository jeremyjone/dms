import { libraryApi, LibraryApi } from "./path/libraryApi";
import { dataApi, DataApi } from "./path/dataApi";
import { userApi, UserApi } from "./path/userApi";
import uploadUrls, { url } from "./urls";

export const api = {
  ...libraryApi,
  ...dataApi,
  ...userApi,

  UPLOAD: uploadUrls
};

export interface Api extends LibraryApi, DataApi, UserApi {
  UPLOAD: { [key in url]: string };
}
