// base64 转文件
export function base64toFile(base64: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? "";
  const ext = mime.split("/")?.[1] ?? "";
  const bstr = atob(arr?.[1] ?? "");
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  const name = `${new Date().getTime()}.${ext}`;

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name, { type: mime });
}

/**
 * @description: Calculate the approximate value of the incoming color.
 * @param {string} originColor hexadecimal string
 * @return {string} hexadecimal string
 */
export function similarColor(originColor: string) {
  let s1 = parseInt(originColor[0], 16);
  let s2 = parseInt(originColor[1], 16);
  let s3 = parseInt(originColor[2], 16);
  let s4 = parseInt(originColor[3], 16);
  let s5 = parseInt(originColor[4], 16);
  let s6 = parseInt(originColor[5], 16);

  s1 = s1 + 2 < 16 ? s1 + 2 : s1;
  s2 = s2 + 1 < 16 ? s2 + 1 : s2;
  s3 = s3 + 1 < 16 ? s3 + 1 : s3;
  s4 = s4 + 0 < 16 ? s4 + 0 : s4;
  s5 = s5 + 0 < 16 ? s5 + 0 : s5;
  s6 = s6 + 0 < 16 ? s6 + 0 : s6;

  return `${s1.toString(16)}${s2.toString(16)}${s3.toString(16)}${s4.toString(
    16
  )}${s5.toString(16)}${s6.toString(16)}`;
}

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = any>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>(err => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}

export function find<T>(
  key: string,
  value: any,
  data: T[],
  defaultValue?: T | undefined
): T | undefined {
  return data.find(x => x[key] === value) || defaultValue;
}
