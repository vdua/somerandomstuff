const contains = (arr, prop) => {
  return arr.indexOf(prop) > -1;
};

export const without = (obj, keys) => {
  if (obj === undefined || obj === null) return obj;
  return Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => !contains(keys, key))
  );
};

export const formatDate = (time) => {
  if (time < 0) {
    return "";
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(time).toLocaleDateString("en-US", options);
};
