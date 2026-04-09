// Shared CRO constants — safe to import from edge middleware, client components, and server components.
// Do NOT import next/headers or any server-only API here.

export const CRO_COOKIE = "wcag_ab_v1";
export const CRO_EXPERIMENT_ID = "pricing-cta-v1";

export type VariantKey = "control" | "value";

export type VariantConfig = {
  key: VariantKey;
  badge: string;
  heroTitle: string;
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  pricingHeading: string;
  pricingSubheading: string;
  proDescription: string;
  proCta: string;
};

export const VARIANTS: Record<VariantKey, VariantConfig> = {
  control: {
    key: "control",
    badge: "Variant A · developer-first",
    heroTitle: "Know exactly what's breaking your site's accessibility",
    heroBody:
      "Scan any public URL, surface the most important axe-core violations, and get a clean issue list your team can act on fast.",
    primaryCta: "Scan my site",
    secondaryCta: "See pricing",
    pricingHeading: "Simple pricing",
    pricingSubheading: "Start free. Upgrade when you need more.",
    proDescription: "For teams shipping accessible products",
    proCta: "Upgrade to Pro",
  },
  value: {
    key: "value",
    badge: "Variant B · conversion-first",
    heroTitle: "Catch revenue-killing accessibility issues before customers do",
    heroBody:
      "Run a fast first-pass accessibility audit, prioritize the blockers most likely to hurt conversion, and give your team a clean list to fix this sprint.",
    primaryCta: "Run free audit",
    secondaryCta: "Compare plans",
    pricingHeading: "Plans built for fast accessibility wins",
    pricingSubheading: "Audit free, then upgrade once the fixes start shipping.",
    proDescription: "For teams that want faster triage, repeat scans, and cleaner reporting",
    proCta: "Start Pro trial",
  },
};
