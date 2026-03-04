/* eslint-disable @typescript-eslint/no-explicit-any */
export function deepMerge<T>(target: T, source: unknown): T {
  const src = source as Partial<T>;
  const result: any = { ...(target as any) };
  for (const key of Object.keys(src as object) as (keyof T)[]) {
    const srcVal = src[key];
    const tgtVal = result[key];
    if (srcVal === null || srcVal === undefined) continue;
    if (Array.isArray(srcVal) && Array.isArray(tgtVal)) {
      const merged = [...tgtVal];
      for (const item of srcVal) {
        const exists = merged.some((e: unknown) => JSON.stringify(e) === JSON.stringify(item));
        if (!exists) merged.push(item);
      }
      result[key] = merged;
    } else if (typeof srcVal === 'object' && typeof tgtVal === 'object' && !Array.isArray(srcVal)) {
      result[key] = deepMerge(tgtVal, srcVal);
    } else {
      result[key] = srcVal;
    }
  }
  return result as T;
}
