import dayjs from "dayjs";

const dateKeys = new Map<string, boolean>(
  Object.entries({
    createdAt: true,
    lastInventoryDate: true,
    updatedAt: true,
    date: true,
    from: true,
    to: true,
    deliveryDate: true,
    approvedAt: true,
    expiryDate: true,
  }),
);

function _isDateKey(key?: string) {
  return key && dateKeys.has(key);
}

export function _parseUnixToDate(
  input: unknown,
  key?: string,
): unknown {
  if (typeof input === "number" && _isDateKey(key)) {
    return dayjs(input).toDate();
  } else if (Array.isArray(input)) {
    return input.map((item) => _parseUnixToDate(item, key));
  } else if (typeof input === "object" && input !== null) {
    return Object.fromEntries(
      Object.entries(
        input as { [s: string]: unknown } | ArrayLike<unknown>,
      ).map(([key, value]) => [key, _parseUnixToDate(value, key)]),
    );
  }
  return input;
}

export function _parseDateToUnix(
  input: unknown,
  key?: string,
): unknown {
  if (dayjs.isDayjs(input)) {
    return input.unix() * 1e3;
  } else if (input instanceof Date) {
    return input.getTime();
  } else if (typeof input === "string" && _isDateKey(key)) {
    const date = new Date(input);
    if (date.toString() !== "Invalid Date") {
      return date.getTime();
    }
    return input;
  } else if (Array.isArray(input)) {
    return input.map((item) => _parseDateToUnix(item, key));
  } else if (typeof input === "object" && input !== null) {
    return Object.fromEntries(
      Object.entries(
        input as { [s: string]: unknown } | ArrayLike<unknown>,
      ).map(([key, value]) => [key, _parseDateToUnix(value)]),
    );
  }
  return input;
}
