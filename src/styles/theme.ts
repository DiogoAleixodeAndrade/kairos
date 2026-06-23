export const colors = {
  background: "#05050A",
  backgroundSoft: "#0B0D14",
  card: "#11131D",
  cardSoft: "#151824",

  gold: "#D6A84F",
  goldLight: "#FFD76A",

  purple: "#7C5CFF",
  purpleDark: "#4B22B8",

  blue: "#4CC9F0",

  white: "#F5F7FA",
  muted: "#A6A8B3",
  mutedDark: "#6B7280",

  danger: "#EF4444",
  success: "#22C55E",

  border: "rgba(255,255,255,0.08)",
  borderGold: "rgba(214,168,79,0.28)",
  borderPurple: "rgba(124,92,255,0.35)",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 28,
  full: 999,
};

export const typography = {
  title: {
    fontSize: 42,
    fontWeight: "800" as const,
    color: colors.white,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  label: {
    fontSize: 13,
    fontWeight: "800" as const,
    letterSpacing: 2,
  },
};