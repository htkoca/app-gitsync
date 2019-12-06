// ****************************************************************************************************
// Init
// ****************************************************************************************************

// flags
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */

// ****************************************************************************************************
// Export Functions - Arrays
// ****************************************************************************************************

export async function asyncMap(array, callback) {
  const rslt = [...array];
  for (let idx = 0; idx < rslt.length; idx += 1) {
    rslt[idx] = await callback(rslt[idx], idx, rslt);
  }
  return rslt;
}

export async function asyncForEach(array, callback) {
  await asyncMap(array, callback);
}

export async function asyncFilter(array, callback) {
  const rslt = await asyncMap(array, callback);
  return rslt.filter((val, idx) => {
    return !!rslt[idx];
  });
}

export async function asyncReduce(array, callback, initialValue) {
  const collection = [...array];
  let rslt = initialValue || collection[0];
  for (let idx = 0; idx < collection.length; idx += 1) {
    rslt = await callback(rslt, collection[idx], idx, collection);
  }
  return rslt;
}

export async function asyncReduceRight(array, callback, initialValue) {
  const collection = [...array];
  let rslt = initialValue || collection[collection.length - 1];
  for (let idx = 0; idx < collection.length; idx += 1) {
    rslt = await callback(rslt, collection[idx], idx, collection);
  }
  return rslt;
}

export async function asyncMapP(array, callback) {
  const rslt = [...array];
  for (let idx = 0; idx < rslt.length; idx += 1) {
    rslt[idx] = callback(rslt[idx], idx, rslt);
  }
  return Promise.all(rslt);
}

export async function asyncForEachP(array, callback) {
  await asyncMapP(array, callback);
}

// ****************************************************************************************************
// Export Functions - Objects
// ****************************************************************************************************

export async function asyncMapObj(obj, callback) {
  const rslt = { ...obj };
  const keys = Object.keys(rslt);
  for (let idx = 0; idx < keys.length; idx += 1) {
    const key = keys[idx];
    rslt[key] = await callback(rslt[key], key, rslt);
  }
  return rslt;
}

export async function asyncForEachObj(obj, callback) {
  await asyncMapObj(obj, callback);
}

export async function asyncMapObjP(obj, callback) {
  const rslt = { ...obj };
  const keys = Object.keys(rslt);
  for (let idx = 0; idx < keys.length; idx += 1) {
    const key = keys[idx];
    rslt[key] = callback(rslt[key], key, rslt);
  }
  for (let idx = 0; idx < keys.length; idx += 1) {
    const key = keys[idx];
    rslt[key] = await rslt[key];
  }
  return rslt;
}

export async function asyncForEachObjP(obj, callback) {
  await asyncMapObjP(obj, callback);
}

// ****************************************************************************************************
// Export Functions - Misc
// ****************************************************************************************************

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function posixPath(path, stripTrailing) {
  if (typeof path !== 'string') {
    throw new TypeError('expected path to be a string');
  }
  if (path === '\\' || path === '/') return '/';
  const len = path.length;
  if (len <= 1) return path;
  let prefix = '';
  if (len > 4 && path[3] === '\\') {
    const ch = path[2];
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2);
      prefix = '//';
    }
  }
  const segs = path.split(/[/\\]+/);
  if (stripTrailing !== false && segs[segs.length - 1] === '') {
    segs.pop();
  }
  return prefix + segs.join('/');
}

export function arrayToObject(arr, objPath) {
  return [...arr].reduce((accum, item) => {
    const val = objPath.split('.').reduce((res, prop) => res[prop], item);
    if (item && val) {
      accum[val] = item;
    }
    return accum;
  }, {});
}

export function mergeObj(...objects) {
  return objects.reduce(
    (accum, object, idx) => {
      Object.keys(object).forEach((key) => {
        accum[key] = object[key] || accum[key];
      });
      return accum;
    },
    { ...objects[0] }
  );
}
