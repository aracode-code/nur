export const colors = {
  bg: "#07151D",
  surface: "#0D222D",
  surfaceRaised: "#122D39",
  surfaceHover: "#183844",
  text: "#F4F7F4",
  textMuted: "#9EB2B8",
  textSubtle: "#6E8992",
  primary: "#32D4BD",
  primaryInk: "#062522",
  gold: "#E9C879",
  border: "rgba(190,220,221,.13)",
  danger: "#F18E82",
} as const;

export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const radius = {
  control: "12px",
  card: "18px",
  hero: "24px",
  pill: "999px",
} as const;

export const typography = {
  display: { size: "32px", lineHeight: "38px", weight: 700 },
  h1: { size: "28px", lineHeight: "34px", weight: 700 },
  h2: { size: "22px", lineHeight: "28px", weight: 600 },
  h3: { size: "18px", lineHeight: "24px", weight: 600 },
  body: { size: "16px", lineHeight: "24px", weight: 400 },
  bodyS: { size: "14px", lineHeight: "20px", weight: 400 },
  caption: { size: "12px", lineHeight: "16px", weight: 400 },
} as const;

export const layout = {
  sidebar: "248px",
  contentMax: "1500px",
  breakpoints: { mobile: 760, tablet: 1120 },
} as const;

export const motion = {
  fast: "120ms",
  base: "180ms",
  slow: "240ms",
  ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
} as const;

export const tokens = { colors, space, radius, typography, layout, motion };
export type Tokens = typeof tokens;
