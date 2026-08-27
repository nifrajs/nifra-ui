import * as stylex from "@stylexjs/stylex"

export const tokens = {
  bg: "var(--nui-bg)",
  surface: "var(--nui-surface)",
  surfaceRaised: "var(--nui-surface-raised)",
  surfaceInset: "var(--nui-surface-inset)",
  text: "var(--nui-text)",
  textMuted: "var(--nui-text-muted)",
  textFaint: "var(--nui-text-faint)",
  border: "var(--nui-border)",
  borderStrong: "var(--nui-border-strong)",
  accent: "var(--nui-accent)",
  accentStrong: "var(--nui-accent-strong)",
  accentText: "var(--nui-accent-text)",
  danger: "var(--nui-danger)",
  success: "var(--nui-success)",
  warning: "var(--nui-warning)",
  info: "var(--nui-info)",
  focus: "var(--nui-focus)",
  shadow: "var(--nui-shadow)",
  shadowStrong: "var(--nui-shadow-strong)",
  radiusSm: "var(--nui-radius-sm)",
  radiusMd: "var(--nui-radius-md)",
  radiusLg: "var(--nui-radius-lg)",
  fontSans: "var(--nui-font-sans)",
  fontMono: "var(--nui-font-mono)",
} as const

export const styles = stylex.create({
  focusable: {
    outline: "none",
    transition: "border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
  },
  muted: { color: tokens.textMuted },
  mono: { fontFamily: tokens.fontMono },
})

export type ThemeName = "light" | "dark" | "high-contrast"

export function applyTheme(theme: ThemeName): void {
  if (typeof document === "undefined") return
  document.documentElement.dataset.theme = theme
}
