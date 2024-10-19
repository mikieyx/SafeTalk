import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mergeJSON<T extends { [key: string]: any }>(
  baseObject: T,
  overrideObject: Partial<T>
) {
  // Create a copy of baseObject to avoid mutation
  const newBaseObject = { ...baseObject };

  if (
    typeof newBaseObject !== "object" ||
    newBaseObject === null ||
    typeof overrideObject !== "object" ||
    overrideObject === null
  ) {
    return newBaseObject;
  }

  for (const key in overrideObject) {
    if (Object.prototype.hasOwnProperty.call(overrideObject, key)) {
      const baseValue = newBaseObject[key];
      const overrideValue = overrideObject[key];
      if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
        // Merge arrays
        // @ts-ignore
        newBaseObject[key] = [...baseValue, ...overrideValue];
      } else if (
        typeof baseValue === "object" &&
        typeof overrideValue === "object" &&
        baseValue !== null && // Ensure baseValue is not null before recursion
        overrideValue !== null // Ensure overrideValue is not null before recursion
      ) {
        // Recursively merge nested objects
        newBaseObject[key] = mergeJSON(baseValue, overrideValue);
      } else {
        // Replace leaf values directly
        // @ts-ignore
        newBaseObject[key] = overrideValue;
      }
    }
  }

  return newBaseObject;
}
