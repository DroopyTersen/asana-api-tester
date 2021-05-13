import React, { useState, useEffect } from "react";

const getStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage;
  } else {
    return { getItem: (key) => "", setItem: (key, value) => {} };
  }
};

export default function usePersistedState<T>(defaultValue: T, key: string) {
  let [value, setValue] = useState<T>(() => {
    try {
      let cachedValue = getStorage().getItem(key);
      if (!cachedValue) return defaultValue;
      try {
        return JSON.parse(cachedValue);
      } catch (err) {
        // Unable to parse the JSON, must be a string?
        return cachedValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  useEffect(() => {
    let valueStr = typeof value === "string" ? value : JSON.stringify(value);
    getStorage().setItem(key, valueStr);
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
