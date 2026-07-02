function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override: Partial<T> | null | undefined): T {
  if (!override) {
    return structuredClone(base);
  }

  const result = structuredClone(base) as Record<string, unknown>;
  const source = override as Record<string, unknown>;

  for (const key of Object.keys(source)) {
    const overrideValue = source[key];
    if (overrideValue === undefined) continue;

    const baseValue = result[key];

    if (Array.isArray(overrideValue)) {
      result[key] = structuredClone(overrideValue);
      continue;
    }

    if (isPlainObject(overrideValue) && isPlainObject(baseValue)) {
      result[key] = deepMerge(baseValue, overrideValue as Record<string, unknown>);
      continue;
    }

    result[key] = overrideValue;
  }

  return result as T;
}
