import axios from "axios";
import { LocalStorage, Loading } from "quasar";
import { utils } from "@/utils";
import { toast, ToastType } from "@/components";
import { Response, Status, TO } from "@/models/common";
import { vars } from "@/utils/vars";
import { DOWN_URL, PRO_URL } from "@/config/url";
import store from "@/store";

const isProd = process.env.NODE_ENV === "production";

const setBaseUrl = (proUrl = PRO_URL, devUrl = "") => {
  axios.defaults.baseURL = isProd ? proUrl : devUrl;
};

axios.defaults.timeout = 50000;
setBaseUrl();

// http request interceptor
axios.interceptors.request.use(
  async config => {
    if (!config.headers?.["Content-Type"]) {
      config.headers["Content-Type"] =
        "application/json;application/x-www-form-urlencoded;charset=UTF-8";
    } else if (config.headers?.["Content-Type"] === "multipart/form-data") {
      delete config.headers["Content-Type"];
    }

    config.data = JSON.stringify({
      ...config.data
    });

    // 添加用户信息到请求头
    config.headers["Username"] = LocalStorage.getItem(vars.keys.username);
    config.headers["UserId"] = LocalStorage.getItem(vars.keys.userId);

    config.headers.Authorization = "Bearer " + store.state.user.token;

    if (isProd) {
      config.url = config.url?.replace(/\/api\//, "/");
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// The response interceptor is exception handling
axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    let errType: ToastType = "error";

    if (err && err.response) {
      const result = err.response.data as Response<string>;

      if (!isProd) {
        console.log(result);
      }

      let errMessage = "未知错误";
      if (result.status === Status.Param) {
        // 参数错误，显示服务器返回的错误信息。
        // 排除不需要显示错误信息的 url
        errMessage = "参数错误，";
        if (/login/.test(err.response.config.url)) {
          errMessage = "";
        }
        if (result.data) {
          errMessage += result.data + "。";
        } else {
          errMessage += "请重试。";
        }

        errType = "warning";
      } else if (result.status === Status.Pepeat) {
        errMessage = "重复操作，当前数据无变化。";
        errType = "info";
      } else if (result.status === Status.Error) {
        errMessage = "服务器出错，请稍后再试。";
      } else if (result.status === Status.Empty) {
        errMessage = "当前请求结果为空。";
        errType = "warning";
      } else if (result.status === Status.Illegal) {
        errMessage = "非法操作。";
      }

      // 调试信息
      if (process.env.NODE_ENV !== "production") {
        errMessage += result.data;
      }

      switch (err.response.status) {
        case 400:
          err.response.message = errMessage;
          break;
        case 401:
          err.response.message = "未授权，请重新登录";
          store.dispatch("Logout");
          break;
        case 403:
          err.response.message = "拒绝访问";
          break;
        case 404:
          err.response.message = "请求错误,未找到该资源";
          break;
        case 405:
          err.response.message = "请求方法未允许";
          break;
        case 408:
          err.response.message = "请求超时";
          break;
        case 500:
          err.response.message = "服务器端出错";
          break;
        case 501:
          err.response.message = "网络未实现";
          break;
        case 502:
          err.response.message = "网络错误";
          break;
        case 503:
          err.response.message = "服务不可用";
          break;
        case 504:
          err.response.message = "网络超时";
          break;
        case 505:
          err.response.message = "http版本不支持该请求";
          break;
        default:
          err.response.message = `other连接错误${err.response.status}`;
      }
    } else {
      err.response.message = "无法连接到服务器!";
    }

    // 排除不需要显示错误信息的 url
    if (
      !/login|logout|avatar|refresh_token|document|new-number|get_roles/.test(
        err.response.config.url
      )
    ) {
      toast(err.response.message, errType);
    }

    // 在交互错误时，强制关闭 loading 框
    Loading.hide();
    return Promise.reject(err.response);
  }
);

/**
 * Encapsulate GET methods
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get<T>(url: string, params = {}): TO<T> {
  return utils.to(
    new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then(result => {
          resolve(result.data);
        })
        .catch(err => {
          reject(err);
        });
    })
  );
}

/**
 * Encapsulate POST methods
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post<T>(url: string, data?: {}): TO<T> {
  return utils.to(
    new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then(result => {
          resolve(result.data);
        })
        .catch(err => {
          reject(err);
        });
    })
  );
}

/**
 * Encapsulate PUT methods
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put<T>(url: string, data?: {}): TO<T> {
  return utils.to(
    new Promise((resolve, reject) => {
      axios
        .put(url, data)
        .then(result => {
          resolve(result.data);
        })
        .catch(err => {
          reject(err);
        });
    })
  );
}

/**
 * Encapsulate DELETE methods
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del<T>(url: string, data?: {}): TO<T> {
  return utils.to(
    new Promise((resolve, reject) => {
      axios
        .delete(url, data)
        .then(result => {
          resolve(result.data);
        })
        .catch(err => {
          reject(err);
        });
    })
  );
}

/**
 * Encapsulate Download methods, download files.
 * @param url
 * @param config: header config, a object
 * @param filename
 * @param filetype: file mime type
 * @returns {Promise}
 */
export function download(
  url: string,
  filename: string,
  filetype: string,
  config = {}
) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${DOWN_URL}${url}`,
      responseType: "blob",
      method: "GET",
      ...config
    })
      .then(result => {
        const fileURL = window.URL.createObjectURL(
          new Blob([result.data], { type: filetype })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", filename);
        document.body.appendChild(fileLink);

        fileLink.click();
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getData<T>(data: T) {
  return utils.to(Promise.resolve({ status: Status.OK, data, errorCode: "" }));
}

export function getErr(reason: string) {
  return utils.to(Promise.reject(`Error: ${reason}`));
}
