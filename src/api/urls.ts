const BASE_URL = "upload/";

export type url =
  | "UPLOAD_DATA_FILE"
  | "UPLOAD_DATA_COVER"
  | "UPLOAD_LIBRARY_COVER";

export default {
  UPLOAD_DATA_FILE: BASE_URL + "data",
  UPLOAD_DATA_COVER: BASE_URL + "data-cover",
  UPLOAD_LIBRARY_COVER: BASE_URL + "library-cover"
};
