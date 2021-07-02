/**
 * 纯等待函数
 * @param cond 条件函数，函数中必须返回一个 Boolean 值，当条件为真，跳出等待
 * @param timeout 超时时间，单位 ms，默认 10s
 */
export const boringWait = (cond: () => boolean, timeout = 10000) => {
  return new Promise<void>((resolve, reject) => {
    let time = 0;
    const t = setInterval(() => {
      time++;
      if (cond()) {
        clearInterval(t);
        resolve();
      }
      if (time > timeout / 100) {
        // 大于10秒，超时
        clearInterval(t);
        reject();
      }
    }, 100);
  });
};

/**
 * 生成uuid
 * @param {Number} len 指定uuid的长度
 * @param {Number} radix 进制，默认16进制
 */
export function uuid(len?: number, radix = 16): string {
  const chars: string[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  const uuid: string[] = [];
  let i: number;
  radix = radix || chars.length;

  if (len) {
    // tslint:disable-next-line: no-bitwise
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r: number;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        // tslint:disable-next-line: no-bitwise
        r = 0 | (Math.random() * 16);
        // tslint:disable-next-line: no-bitwise
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

export function clone<T>(data: T): T {
  if (typeof data !== "object") {
    return data;
  } else {
    const d: any = Array.isArray(data) ? [] : {};
    for (const i in data) {
      d[i] = typeof data[i] === "object" ? clone(data[i]) : data[i];
    }
    return d;
  }
}
