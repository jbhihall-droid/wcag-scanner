// Server-only CRO helper — uses next/headers (App Router server components only).
// For constants (CRO_COOKIE, VARIANTS, etc.) importable anywhere, use cro-constants.ts.

import { cookies } from "next/headers";
import {
  CRO_COOKIE,
  VARIANTS,
  type VariantConfig,
} from "./cro-constants";

export { CRO_COOKIE, CRO_EXPERIMENT_ID, VARIANTS } from "./cro-constants";
export type { VariantKey, VariantConfig } from "./cro-constants";

export async function getActiveVariant(): Promise<VariantConfig> {
  const store = await cookies();
  const bucket = store.get(CRO_COOKIE)?.value;
  if (bucket === "value") return VARIANTS.value;
  return VARIANTS.control;
}
