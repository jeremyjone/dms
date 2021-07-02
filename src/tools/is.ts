// 是否函数
export const isFunction = (o: any) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Function";
};

// 是否布尔
export const isBoolean = (o: any) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Boolean";
};

// 是否数组
export const isArray = (o: any) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Array";
};

// 是否数字
export const isNumber = (o: any) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Number";
};

// 对象相等
export function isObjectValueEqual(a: any, b: any): boolean {
  const o1 = a instanceof Object;
  const o2 = b instanceof Object;
  // 判断是不是对象
  if (!o1 || !o2) {
    return a === b;
  }

  //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
  //例如：数组返回下表：const arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const o in a) {
    const t1 = a[o] instanceof Object;
    const t2 = b[o] instanceof Object;
    if (t1 && t2) {
      if (!isObjectValueEqual(a[o], b[o])) return false;
    } else if (a[o] !== b[o]) {
      return false;
    }
  }
  return true;
}
