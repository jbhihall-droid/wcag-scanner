# CRO Experiment 001 — Pricing + CTA Variant Test

## Goal
Lift paid checkout starts from pricing-page traffic without increasing acquisition cost.

## Hypothesis
If the landing page frames accessibility issues as a revenue and conversion problem, and the CTA is phrased as an immediate audit outcome rather than a generic scan, more visitors will start checkout.

## Variant Setup
### Control (A)
- Hero headline: "Know exactly what's breaking your site's accessibility"
- Primary CTA: "Scan my site"
- Pricing CTA: "Upgrade to Pro"
- Positioning: developer-first

### Variant B
- Hero headline: "Catch revenue-killing accessibility issues before customers do"
- Primary CTA: "Run free audit"
- Pricing CTA: "Start Pro trial"
- Positioning: conversion-first

## Instrumentation
- Cookie split: `wcag_ab_v1`
- Experiment ID: `pricing-cta-v1`
- Optional heatmaps/session recordings: Microsoft Clarity via `NEXT_PUBLIC_CLARITY_ID`
- Decision rule: minimum 200 visitors per variant and at least 15% lift in checkout starts before choosing a winner

## Metrics to watch for 14 days
- Visitors per variant
- Scan starts per variant
- Checkout starts per variant
- Email capture rate per variant
- Clarity rage clicks / dead clicks around pricing and CTA sections

## Shipping Notes
- Experiment is live in middleware and homepage copy.
- Variant assignment persists for 14 days.
- If Clarity is not yet configured, the split still runs and can be measured with existing analytics plus checkout/email events.

## Day 0 Status
- Experiment launched in code
- Waiting on live traffic after ENG-014 shipping gate clears
