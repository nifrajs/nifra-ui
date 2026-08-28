import type { StyleXStyles } from "@stylexjs/stylex"
import * as stylex from "@stylexjs/stylex"
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type CSSProperties,
  type FormHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TableHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { applyTheme, type ThemeName } from "../tokens/tokens.stylex"

// Keep the component stylesheet statically analyzable for StyleX. The public
// token object lives in tokens.stylex.ts; this local mirror lets the Babel
// transform inline the semantic CSS variables instead of generating unresolved
// cross-module aliases in the docs runtime.
const tokens = {
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
  overlay: "var(--nui-overlay)",
  codeBg: "var(--nui-code-bg)",
  codeText: "var(--nui-code-text)",
  shadow: "var(--nui-shadow)",
  shadowStrong: "var(--nui-shadow-strong)",
  radiusSm: "var(--nui-radius-sm)",
  radiusMd: "var(--nui-radius-md)",
  radiusLg: "var(--nui-radius-lg)",
  fontSans: "var(--nui-font-sans)",
  fontMono: "var(--nui-font-mono)",
} as const

export type XStyleProps = { xstyle?: StyleXStyles; className?: string }
type DivProps = HTMLAttributes<HTMLDivElement> & XStyleProps

const sx = (
  ...items: Array<StyleXStyles | null | undefined | false>
): string | undefined => {
  const result = stylex.props(...(items as never[]))
  return result.className
}

const withClass = (
  className: string | undefined,
  extra?: string,
): string | undefined =>
  [className, extra].filter(Boolean).join(" ") || undefined

const shared = stylex.create({
  focusable: {
    outline: "none",
    transition: "border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
  },
  mono: { fontFamily: tokens.fontMono },
})

const ui = stylex.create({
  root: { fontFamily: tokens.fontSans },
  container: {
    width: "100%",
    maxWidth: 1180,
    marginInline: "auto",
    paddingInline: 24,
  },
  stack: { display: "flex", flexDirection: "column" },
  inline: { display: "flex", alignItems: "center" },
  grid: { display: "grid" },
  separator: { height: 1, width: "100%", backgroundColor: tokens.border },
  button: {
    alignItems: "center",
    justifyContent: "center",
    display: "inline-flex",
    gap: 8,
    minHeight: 38,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusMd,
    paddingInline: 14,
    backgroundColor: tokens.surface,
    color: tokens.text,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1,
    userSelect: "none",
    whiteSpace: "nowrap",
    outline: "none",
    transition: "border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
    ":hover": { backgroundColor: tokens.surfaceInset },
    ":active": { transform: "translateY(1px)" },
    ":disabled": { opacity: 0.48, transform: "none" },
  },
  buttonPrimary: {
    backgroundColor: tokens.accent,
    borderColor: tokens.accent,
    color: tokens.accentText,
    ":hover": {
      backgroundColor: tokens.accentStrong,
      borderColor: tokens.accentStrong,
    },
  },
  buttonDanger: {
    backgroundColor: tokens.danger,
    borderColor: tokens.danger,
    color: "#fff",
    ":hover": { filter: "brightness(0.92)" },
  },
  buttonGhost: {
    borderColor: "transparent",
    backgroundColor: "transparent",
    ":hover": { backgroundColor: tokens.surfaceInset },
  },
  buttonInvalid: {
    borderColor: tokens.danger,
    color: tokens.danger,
  },
  buttonSmall: { minHeight: 32, paddingInline: 10, fontSize: 13 },
  buttonLarge: { minHeight: 46, paddingInline: 18, fontSize: 15 },
  iconButton: { width: 38, paddingInline: 0 },
  datePickerTrigger: {
    width: "100%",
    justifyContent: "space-between",
    textAlign: "left",
  },
  link: {
    color: tokens.accentStrong,
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  card: {
    minWidth: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surface,
    boxShadow: tokens.shadow,
  },
  cardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  cardBody: { minWidth: 0, padding: 20 },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
    backgroundColor: tokens.surfaceRaised,
  },
  badge: {
    display: "inline-flex",
    alignSelf: "flex-start",
    alignItems: "center",
    minHeight: 24,
    borderRadius: 999,
    paddingInline: 9,
    backgroundColor: tokens.surfaceInset,
    color: tokens.textMuted,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  badgeSmall: {
    minHeight: 20,
    paddingInline: 6,
    fontSize: 9,
    whiteSpace: "nowrap",
  },
  badgeAccent: {
    backgroundColor: "var(--nui-accent-soft)",
    color: tokens.accentStrong,
  },
  badgeDanger: {
    backgroundColor: "var(--nui-danger-soft)",
    color: tokens.danger,
  },
  field: {
    display: "grid",
    gap: 7,
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
  },
  label: { color: tokens.text, fontSize: 13, fontWeight: 800 },
  description: { color: tokens.textMuted, fontSize: 13, lineHeight: 1.45 },
  error: { color: tokens.danger, fontSize: 13, lineHeight: 1.45 },
  input: {
    width: "100%",
    minHeight: 40,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusMd,
    paddingInline: 12,
    backgroundColor: tokens.surface,
    color: tokens.text,
    outline: "none",
    transition: "border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
    "::placeholder": { color: tokens.textFaint },
    ":disabled": { opacity: 0.55 },
  },
  inputInvalid: {
    borderColor: tokens.danger,
    ":focus-visible": { borderColor: tokens.danger },
  },
  otpSlot: {
    flex: "1 1 0",
    minWidth: 0,
    overflow: "hidden",
    textAlign: "center",
    paddingInline: 0,
  },
  textarea: {
    width: "100%",
    minHeight: 100,
    resize: "vertical",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusMd,
    padding: 12,
    backgroundColor: tokens.surface,
    color: tokens.text,
    lineHeight: 1.5,
    outline: "none",
    transition: "border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
    "::placeholder": { color: tokens.textFaint },
  },
  controlRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  controlBox: {
    position: "relative",
    display: "inline-grid",
    placeItems: "center",
    width: 18,
    height: 18,
    flex: "0 0 auto",
  },
  checkboxInput: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    margin: 0,
    opacity: 0,
    zIndex: 1,
    cursor: "pointer",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
  },
  checkboxIndicator: {
    display: "inline-grid",
    placeItems: "center",
    width: 18,
    height: 18,
    flex: "0 0 auto",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusSm,
    backgroundColor: tokens.surface,
    color: tokens.accentText,
    fontSize: 13,
    fontWeight: 900,
    transition: "background-color 140ms ease, border-color 140ms ease",
  },
  checkboxIndicatorChecked: {
    borderColor: tokens.accent,
    backgroundColor: tokens.accent,
  },
  checkboxIndicatorIndeterminate: {
    borderColor: tokens.accent,
    backgroundColor: tokens.accent,
  },
  checkboxInvalid: { borderColor: tokens.danger },
  checkboxLabel: { lineHeight: 1.35 },
  radio: {
    width: 16,
    height: 16,
    flex: "0 0 auto",
    margin: 0,
    accentColor: tokens.accent,
  },
  radioRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    minWidth: 0,
    padding: "9px 10px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: tokens.radiusMd,
    backgroundColor: "transparent",
    color: tokens.text,
    cursor: "pointer",
    transition:
      "background-color 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
    ":hover": {
      backgroundColor: tokens.surfaceInset,
    },
  },
  radioRowSelected: {
    borderColor: "transparent",
    backgroundColor: tokens.surfaceRaised,
    boxShadow: "inset 3px 0 0 var(--nui-accent)",
  },
  radioRowDisabled: { cursor: "not-allowed", opacity: 0.55 },
  radioIndicator: {
    display: "grid",
    placeItems: "center",
    width: 18,
    height: 18,
    flex: "0 0 auto",
    marginTop: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: 999,
    backgroundColor: tokens.surface,
    transition: "border-color 140ms ease",
  },
  radioIndicatorSelected: { borderColor: tokens.accent },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: tokens.accent,
  },
  radioLabel: {
    display: "grid",
    gap: 3,
    minWidth: 0,
    lineHeight: 1.35,
  },
  range: {
    appearance: "none",
    width: "100%",
    minHeight: 24,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: 0,
    backgroundColor: "transparent",
    accentColor: tokens.accent,
    cursor: "pointer",
    outline: "none",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
    },
    ":disabled": { cursor: "not-allowed", opacity: 0.5 },
  },
  switch: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    width: 40,
    height: 22,
    flex: "0 0 auto",
    padding: 2,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: 999,
    backgroundColor: tokens.surfaceInset,
    outline: "none",
    transition: "background-color 140ms ease, border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
    ":disabled": { opacity: 0.5 },
  },
  switchOn: {
    borderColor: tokens.accent,
    backgroundColor: tokens.accent,
  },
  switchThumb: {
    display: "block",
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: tokens.surface,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.22)",
    transition: "transform 140ms ease",
  },
  switchThumbOn: { transform: "translateX(17px)" },
  select: {
    appearance: "none",
    width: "100%",
    minHeight: 40,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusMd,
    paddingInline: 12,
    backgroundColor: tokens.surface,
    color: tokens.text,
    outline: "none",
    transition: "border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
  },
  calendar: {
    display: "grid",
    gap: 14,
    width: "100%",
    minWidth: 0,
    maxWidth: 320,
    padding: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surface,
  },
  calendarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  calendarTitle: { fontSize: 14, fontWeight: 800 },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: 3,
  },
  calendarWeekday: {
    color: tokens.textFaint,
    fontSize: 10,
    fontWeight: 800,
    textAlign: "center",
    textTransform: "uppercase",
  },
  calendarDay: {
    display: "grid",
    placeItems: "center",
    width: "100%",
    minWidth: 0,
    minHeight: 30,
    aspectRatio: "1",
    padding: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: tokens.radiusSm,
    color: tokens.text,
    backgroundColor: "transparent",
    appearance: "none",
    fontSize: 12,
    outline: "none",
    ":hover": { backgroundColor: tokens.surfaceInset },
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
  },
  calendarDaySelected: {
    color: tokens.accentText,
    backgroundColor: tokens.accent,
  },
  calendarDayDisabled: {
    cursor: "not-allowed",
    color: tokens.textFaint,
    opacity: 0.5,
    ":hover": { backgroundColor: "transparent" },
  },
  calendarDayOutside: { color: tokens.textFaint },
  tabsList: {
    display: "flex",
    gap: 4,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
    overflowX: "auto",
  },
  tab: {
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    padding: "10px",
    backgroundColor: "transparent",
    color: tokens.textMuted,
    fontWeight: 800,
    fontSize: 13,
    whiteSpace: "nowrap",
    outline: "none",
    transition: "border-color 140ms ease",
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      borderColor: tokens.focus,
    },
    ":hover": { color: tokens.text },
  },
  tabActive: { borderBottomColor: tokens.accent, color: tokens.accentStrong },
  accordion: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusMd,
    overflow: "hidden",
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
    ":last-child": { borderBottomWidth: 0 },
  },
  accordionTrigger: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    padding: 16,
    backgroundColor: tokens.surface,
    color: tokens.text,
    textAlign: "left",
    fontWeight: 800,
    lineHeight: 1.25,
    cursor: "pointer",
  },
  accordionTitle: { minWidth: 0, flex: 1 },
  accordionIcon: {
    display: "grid",
    placeItems: "center",
    width: 18,
    height: 18,
    flex: "0 0 auto",
    color: tokens.textMuted,
    fontSize: 17,
    lineHeight: 1,
  },
  accordionContent: {
    padding: "0 16px 16px",
    color: tokens.textMuted,
    lineHeight: 1.6,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 40,
    display: "grid",
    placeItems: "center",
    padding: 20,
    backgroundColor: tokens.overlay,
  },
  drawerOverlay: {
    placeItems: "stretch end",
  },
  dialog: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "80vh",
    overflow: "auto",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surface,
    color: tokens.text,
    boxShadow: tokens.shadowStrong,
  },
  drawer: {
    width: "min(440px, 100%)",
    height: "100%",
    overflow: "auto",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: tokens.borderStrong,
    backgroundColor: tokens.surface,
    color: tokens.text,
    boxShadow: tokens.shadowStrong,
  },
  dialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  dialogBody: { padding: 20 },
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
    backgroundColor: tokens.surfaceRaised,
  },
  popover: {
    position: "absolute",
    zIndex: 30,
    top: "100%",
    left: 0,
    marginTop: 8,
    minWidth: 220,
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusMd,
    backgroundColor: tokens.surface,
    boxShadow: tokens.shadowStrong,
  },
  datePickerPopover: {
    width: "min(320px, 100%)",
    minWidth: 0,
    maxWidth: "100%",
  },
  tooltipAnchor: {
    position: "relative",
    display: "inline-flex",
  },
  tooltip: {
    position: "absolute",
    zIndex: 60,
    right: 0,
    bottom: "calc(100% + 8px)",
    width: "max-content",
    maxWidth: 240,
    padding: "7px 9px",
    borderRadius: tokens.radiusSm,
    backgroundColor: tokens.text,
    color: tokens.bg,
    fontSize: 11,
    lineHeight: 1.35,
    boxShadow: tokens.shadowStrong,
  },
  relative: { position: "relative" },
  alert: {
    display: "grid",
    gap: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusMd,
    padding: 14,
    backgroundColor: tokens.surfaceRaised,
  },
  alertDanger: {
    borderColor: "var(--nui-danger-border)",
    backgroundColor: "var(--nui-danger-soft)",
  },
  alertSuccess: {
    borderColor:
      "color-mix(in srgb, var(--nui-success) 42%, var(--nui-border))",
    backgroundColor:
      "color-mix(in srgb, var(--nui-success) 9%, var(--nui-surface))",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: tokens.surfaceInset,
  },
  progressBar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: tokens.accent,
    transition: "width 220ms ease",
  },
  skeleton: {
    minHeight: 16,
    borderRadius: tokens.radiusSm,
    backgroundColor: tokens.surfaceInset,
    animationName: "nui-pulse",
    animationDuration: "1.4s",
    animationIterationCount: "infinite",
  },
  tableWrap: {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    overflowX: "auto",
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusMd,
  },
  table: {
    width: "100%",
    minWidth: "100%",
    borderCollapse: "collapse",
    tableLayout: "auto",
    fontSize: 14,
  },
  tableCompact: { fontSize: 13 },
  tableCaption: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  th: {
    height: 42,
    padding: "10px 14px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
    backgroundColor: tokens.surfaceRaised,
    color: tokens.textMuted,
    textAlign: "left",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    verticalAlign: "middle",
  },
  thCompact: { height: 36, padding: "8px 10px", fontSize: 10 },
  thSticky: { position: "sticky", top: 0, zIndex: 1 },
  thSelection: { width: 44, paddingInline: 10, textAlign: "center" },
  thButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
    maxWidth: "100%",
    minHeight: 24,
    margin: -4,
    padding: 4,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: tokens.radiusSm,
    backgroundColor: "transparent",
    color: "inherit",
    font: "inherit",
    letterSpacing: "inherit",
    textAlign: "inherit",
    textTransform: "inherit",
    whiteSpace: "inherit",
    outline: "none",
    cursor: "pointer",
    ":hover": { color: tokens.text },
    ":focus-visible": {
      boxShadow: "0 0 0 3px var(--nui-focus-ring)",
      color: tokens.text,
    },
  },
  thSortIcon: {
    color: tokens.textFaint,
    fontFamily: tokens.fontMono,
    fontSize: 10,
    letterSpacing: 0,
  },
  selectionCell: {
    width: 44,
    paddingInline: 10,
    textAlign: "center",
    verticalAlign: "middle",
  },
  selectionControl: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
  },
  tableRowSelected: {
    backgroundColor: "var(--nui-accent-soft)",
  },
  tableRowStriped: {
    backgroundColor: tokens.surfaceRaised,
  },
  td: {
    minWidth: 0,
    padding: "12px 14px",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
    color: tokens.text,
    verticalAlign: "middle",
    overflow: "hidden",
    overflowWrap: "anywhere",
    lineHeight: 1.4,
  },
  tdCompact: { padding: "9px 10px" },
  tableEmptyCell: {
    padding: "28px 18px",
    color: tokens.textMuted,
    textAlign: "center",
    whiteSpace: "normal",
  },
  stat: {
    display: "grid",
    gap: 6,
    padding: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusMd,
    backgroundColor: tokens.surface,
  },
  statValue: { fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em" },
  statLabel: {
    color: tokens.textMuted,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  timeline: { display: "grid", gap: 18 },
  timelineItem: { display: "grid", gridTemplateColumns: "12px 1fr", gap: 12 },
  timelineDot: {
    width: 10,
    height: 10,
    marginTop: 5,
    borderRadius: 999,
    backgroundColor: tokens.accent,
    boxShadow: "0 0 0 4px var(--nui-accent-soft)",
  },
  tool: {
    display: "grid",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusMd,
    backgroundColor: tokens.surfaceRaised,
  },
  code: {
    fontFamily: tokens.fontMono,
    fontSize: 12,
    color: tokens.accentStrong,
  },
  message: {
    maxWidth: "78%",
    padding: "12px 14px",
    borderRadius: tokens.radiusLg,
    lineHeight: 1.55,
  },
  messageHuman: {
    marginLeft: "auto",
    backgroundColor: tokens.accent,
    color: tokens.accentText,
    borderBottomRightRadius: tokens.radiusSm,
  },
  messageAgent: {
    backgroundColor: tokens.surfaceRaised,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderBottomLeftRadius: tokens.radiusSm,
  },
  prompt: {
    display: "grid",
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surface,
  },
  statusDot: {
    width: 8,
    height: 8,
    display: "inline-block",
    borderRadius: 999,
    backgroundColor: tokens.success,
  },
  activity: { display: "grid", gap: 10 },
  activityItem: {
    display: "grid",
    gridTemplateColumns: "8px 1fr auto",
    alignItems: "start",
    gap: 10,
    fontSize: 13,
  },
})

export function ThemeProvider({
  theme = "light",
  children,
  className,
  xstyle,
}: { theme?: ThemeName; children: ReactNode } & XStyleProps) {
  useEffect(() => applyTheme(theme), [theme])
  return (
    <div className={withClass(sx(ui.root, xstyle), className)}>{children}</div>
  )
}

export function ThemeScript({
  defaultTheme = "light",
}: {
  defaultTheme?: ThemeName
}) {
  const safeTheme = JSON.stringify(defaultTheme)
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.dataset.theme=${safeTheme}`,
      }}
    />
  )
}

export function Icon({
  label,
  size = 16,
  children,
}: {
  label?: string
  size?: number
  children: ReactNode
}) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  )
}

export const Container = forwardRef<HTMLDivElement, DivProps>(
  function Container({ xstyle, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={withClass(sx(ui.container, xstyle), className)}
        {...props}
      />
    )
  },
)

export function Stack({
  gap = 16,
  xstyle,
  className,
  ...props
}: DivProps & { gap?: number }) {
  return (
    <div
      className={withClass(sx(ui.stack, xstyle), className)}
      style={{ gap: `${gap}px` }}
      {...props}
    />
  )
}

export function Inline({
  gap = 10,
  wrap = true,
  xstyle,
  className,
  ...props
}: DivProps & { gap?: number; wrap?: boolean }) {
  return (
    <div
      className={withClass(sx(ui.inline, xstyle), className)}
      style={{ gap: `${gap}px`, flexWrap: wrap ? "wrap" : "nowrap" }}
      {...props}
    />
  )
}

export function Grid({
  gap = 16,
  columns = "repeat(auto-fit, minmax(180px, 1fr))",
  xstyle,
  className,
  ...props
}: DivProps & { gap?: number; columns?: string }) {
  return (
    <div
      className={withClass(sx(ui.grid, xstyle), className)}
      style={{ gap: `${gap}px`, gridTemplateColumns: columns }}
      {...props}
    />
  )
}

export function Separator({ xstyle, className, ...props }: DivProps) {
  return (
    <div
      role="separator"
      className={withClass(sx(ui.separator, xstyle), className)}
      {...props}
    />
  )
}

export function ScrollArea({
  children,
  xstyle,
  className,
  ...props
}: DivProps) {
  return (
    <div
      className={withClass(
        sx({ maxHeight: "100%", overflow: "auto" } as never, xstyle),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </span>
  )
}

export function FocusRing({
  children,
  xstyle,
}: {
  children: ReactNode
  xstyle?: StyleXStyles
}) {
  return <div className={sx(shared.focusable, xstyle)}>{children}</div>
}

export function Portal({ children }: { children: ReactNode }) {
  return <>{children}</>
}
export function Slot({ children }: { children: ReactNode }) {
  return <>{children}</>
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  XStyleProps & {
    tone?: "primary" | "danger" | "ghost" | "neutral"
    size?: "sm" | "md" | "lg"
  }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { tone = "neutral", size = "md", xstyle, className, ...props },
    ref,
  ) {
    const toneStyle =
      tone === "primary"
        ? ui.buttonPrimary
        : tone === "danger"
          ? ui.buttonDanger
          : tone === "ghost"
            ? ui.buttonGhost
            : null
    const sizeStyle =
      size === "sm" ? ui.buttonSmall : size === "lg" ? ui.buttonLarge : null
    return (
      <button
        ref={ref}
        className={withClass(
          sx(ui.button, toneStyle, sizeStyle, xstyle),
          className,
        )}
        {...props}
      />
    )
  },
)

export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "children"> & { label: string; children?: ReactNode }
>(function IconButton({ label, xstyle, children, ...props }, ref) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      {...props}
      xstyle={[ui.iconButton, xstyle] as never}
    >
      {children}
    </Button>
  )
})

export function ButtonGroup({
  children,
  gap = 6,
  wrap = true,
  xstyle,
  className,
  ...props
}: DivProps & { gap?: number; wrap?: boolean }) {
  return (
    <Inline
      gap={gap}
      wrap={wrap}
      xstyle={xstyle}
      className={className}
      {...props}
    >
      {children}
    </Inline>
  )
}
export function Link({
  href,
  children,
  xstyle,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & XStyleProps) {
  return (
    <a
      href={href}
      className={withClass(sx(ui.link, xstyle), className)}
      {...props}
    >
      {children}
    </a>
  )
}
export function LinkButton({
  children,
  href,
  xstyle,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  XStyleProps & { children?: ReactNode }) {
  return (
    <a
      href={href}
      className={withClass(sx(ui.button, ui.buttonPrimary, xstyle), className)}
      {...props}
    >
      {children}
    </a>
  )
}
export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  children,
  ...props
}: ButtonProps & {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}) {
  const [internal, setInternal] = useState(defaultPressed)
  const value = pressed ?? internal
  return (
    <Button
      aria-pressed={value}
      tone={value ? "primary" : "neutral"}
      onClick={(event) => {
        const next = !value
        setInternal(next)
        onPressedChange?.(next)
        props.onClick?.(event)
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
export function ToggleGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  ...props
}: {
  options: Array<{ value: string; label: string }>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
} & XStyleProps) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value)
  const current = value ?? internal
  return (
    <Inline xstyle={props.xstyle} className={props.className}>
      {options.map((option) => (
        <Toggle
          key={option.value}
          pressed={current === option.value}
          onPressedChange={() => {
            setInternal(option.value)
            onValueChange?.(option.value)
          }}
        >
          {option.label}
        </Toggle>
      ))}
    </Inline>
  )
}
export function Badge({
  children,
  tone = "neutral",
  size = "default",
  xstyle,
  className,
}: {
  children: ReactNode
  tone?: "neutral" | "accent" | "danger"
  size?: "default" | "sm"
} & XStyleProps) {
  return (
    <span
      className={withClass(
        withClass(
          sx(
            ui.badge,
            tone === "accent"
              ? ui.badgeAccent
              : tone === "danger"
                ? ui.badgeDanger
                : null,
            size === "sm" ? ui.badgeSmall : null,
            xstyle,
          ),
          "nui-badge",
        ),
        className,
      )}
    >
      {children}
    </span>
  )
}
export function Tag(props: ComponentProps<typeof Badge>) {
  return <Badge {...props} />
}
export function Avatar({
  name,
  src,
  size = 36,
  xstyle,
  className,
}: { name: string; src?: string; size?: number } & XStyleProps) {
  const [imageFailed, setImageFailed] = useState(false)
  useEffect(() => setImageFailed(false), [src])
  return (
    <span
      className={withClass(
        sx(
          {
            display: "inline-grid",
            placeItems: "center",
            width: size,
            height: size,
            overflow: "hidden",
            borderRadius: 999,
            backgroundColor: tokens.accent,
            color: tokens.accentText,
            fontWeight: 800,
          } as never,
          xstyle,
        ),
        className,
      )}
      role="img"
      aria-label={name}
    >
      {src && !imageFailed ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          onError={() => setImageFailed(true)}
        />
      ) : (
        name.slice(0, 2).toUpperCase()
      )}
    </span>
  )
}
export function AvatarGroup({
  names,
  xstyle,
}: {
  names: string[]
  xstyle?: StyleXStyles
}) {
  return (
    <Inline gap={-6} xstyle={xstyle}>
      {names.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </Inline>
  )
}
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className={sx({
        padding: "2px 6px",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: tokens.borderStrong,
        borderBottomWidth: 2,
        borderRadius: tokens.radiusSm,
        backgroundColor: tokens.surfaceInset,
        color: tokens.textMuted,
        fontFamily: tokens.fontMono,
        fontSize: 11,
      } as never)}
    >
      {children}
    </kbd>
  )
}
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className={sx(shared.mono, { color: tokens.accentStrong } as never)}>
      {children}
    </code>
  )
}
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className={sx({
        margin: 0,
        overflowX: "auto",
        padding: 16,
        borderRadius: tokens.radiusMd,
        backgroundColor: tokens.codeBg,
        color: tokens.codeText,
        fontFamily: tokens.fontMono,
        fontSize: 12,
        lineHeight: 1.7,
      } as never)}
    >
      <code>{code}</code>
    </pre>
  )
}

export function Card({ children, xstyle, className, ...props }: DivProps) {
  return (
    <div className={withClass(sx(ui.card, xstyle), className)} {...props}>
      {children}
    </div>
  )
}
export function CardHeader({
  children,
  xstyle,
  className,
  ...props
}: DivProps) {
  return (
    <div className={withClass(sx(ui.cardHeader, xstyle), className)} {...props}>
      {children}
    </div>
  )
}
export function CardBody({ children, xstyle, className, ...props }: DivProps) {
  return (
    <div className={withClass(sx(ui.cardBody, xstyle), className)} {...props}>
      {children}
    </div>
  )
}
export function CardFooter({
  children,
  xstyle,
  className,
  ...props
}: DivProps) {
  return (
    <div className={withClass(sx(ui.cardFooter, xstyle), className)} {...props}>
      {children}
    </div>
  )
}

export function Field({
  label,
  description,
  error,
  children,
  htmlFor,
  xstyle,
  className,
}: {
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  children: ReactNode
  htmlFor?: string
} & XStyleProps) {
  return (
    <div
      className={withClass(sx(ui.field, xstyle), className)}
      data-invalid={error ? "" : undefined}
    >
      {label && (
        <label className={sx(ui.label)} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {description && <div className={sx(ui.description)}>{description}</div>}
      {error && (
        <div role="alert" className={sx(ui.error)}>
          {error}
        </div>
      )}
    </div>
  )
}
export function Label(
  props: LabelHTMLAttributes<HTMLLabelElement> & XStyleProps,
) {
  const { xstyle, className, ...rest } = props
  return (
    <label className={withClass(sx(ui.label, xstyle), className)} {...rest} />
  )
}
export function Description({
  children,
  xstyle,
  className,
}: { children: ReactNode } & XStyleProps) {
  return (
    <div className={withClass(sx(ui.description, xstyle), className)}>
      {children}
    </div>
  )
}
export function FieldError({
  children,
  xstyle,
  className,
}: { children: ReactNode } & XStyleProps) {
  return (
    <div role="alert" className={withClass(sx(ui.error, xstyle), className)}>
      {children}
    </div>
  )
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & XStyleProps
>(function Input({ xstyle, className, ...props }, ref) {
  const invalid =
    props["aria-invalid"] === true || props["aria-invalid"] === "true"
  return (
    <input
      ref={ref}
      className={withClass(
        sx(ui.input, invalid ? ui.inputInvalid : null, xstyle),
        withClass("nui-input", className),
      )}
      {...props}
    />
  )
})
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & XStyleProps
>(function Textarea({ xstyle, className, ...props }, ref) {
  const invalid =
    props["aria-invalid"] === true || props["aria-invalid"] === "true"
  return (
    <textarea
      ref={ref}
      className={withClass(
        sx(ui.textarea, invalid ? ui.inputInvalid : null, xstyle),
        withClass("nui-textarea", className),
      )}
      {...props}
    />
  )
})
export function InputGroup({
  start,
  end,
  children,
  xstyle,
  className,
}: { start?: ReactNode; end?: ReactNode; children: ReactNode } & XStyleProps) {
  return (
    <div
      className={withClass(
        sx(
          {
            display: "flex",
            alignItems: "center",
            gap: 8,
            minHeight: 40,
            paddingInline: 10,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: tokens.borderStrong,
            borderRadius: tokens.radiusMd,
            backgroundColor: tokens.surface,
          } as never,
          xstyle,
        ),
        className,
      )}
    >
      {start && <span>{start}</span>}
      {children}
      {end && <span>{end}</span>}
    </div>
  )
}
export function SearchField(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return <Input type="search" placeholder="Search" {...props} />
}
export function PasswordField(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return <Input type="password" {...props} />
}
export function NumberField(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return <Input type="number" {...props} />
}
export type CheckboxState = boolean | "indeterminate"
type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "defaultChecked" | "onChange"
> & {
  label?: ReactNode
  checked?: CheckboxState
  defaultChecked?: CheckboxState
  onCheckedChange?: (value: CheckboxState) => void
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"]
} & XStyleProps

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled,
      xstyle,
      className,
      ...props
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [internal, setInternal] = useState<CheckboxState>(
      defaultChecked ?? false,
    )
    const value = checked ?? internal
    const isChecked = value === true

    useEffect(() => {
      if (inputRef.current)
        inputRef.current.indeterminate = value === "indeterminate"
    }, [value])

    return (
      <label
        className={withClass(
          withClass(sx(ui.controlRow), "nui-control-row"),
          className,
        )}
        onClick={(event) => {
          if (value !== "indeterminate") return
          // A mixed checkbox has no native checked value to toggle from.
          // Resolve it at the label boundary so mouse, touch, and keyboard
          // activation all produce the same checked transition.
          event.preventDefault()
          setInternal(true)
          onCheckedChange?.(true)
        }}
        data-state={
          value === "indeterminate"
            ? "indeterminate"
            : isChecked
              ? "checked"
              : "unchecked"
        }
        data-disabled={disabled ? "" : undefined}
        data-invalid={props["aria-invalid"] ? "" : undefined}
      >
        <span className={sx(ui.controlBox)}>
          <input
            {...props}
            ref={(node) => {
              inputRef.current = node
              if (typeof ref === "function") ref(node)
              else if (ref) ref.current = node
            }}
            type="checkbox"
            checked={isChecked}
            aria-checked={value === "indeterminate" ? "mixed" : isChecked}
            data-state={
              value === "indeterminate"
                ? "indeterminate"
                : isChecked
                  ? "checked"
                  : "unchecked"
            }
            disabled={disabled}
            className={sx(ui.checkboxInput, xstyle)}
            onChange={(event) => {
              // Native inputs report `checked=false` while indeterminate. A
              // user activation should resolve that mixed state to checked so
              // bulk-selection controls can select the complete visible set.
              const next =
                value === "indeterminate" ? true : event.target.checked
              setInternal(next)
              onCheckedChange?.(next)
              onChange?.(event)
            }}
          />
          <span
            aria-hidden="true"
            className={withClass(
              sx(
                ui.checkboxIndicator,
                isChecked ? ui.checkboxIndicatorChecked : null,
                value === "indeterminate"
                  ? ui.checkboxIndicatorIndeterminate
                  : null,
                props["aria-invalid"] ? ui.checkboxInvalid : null,
              ),
              "nui-checkbox-indicator",
            )}
          >
            {value === "indeterminate" ? "−" : isChecked ? "✓" : null}
          </span>
        </span>
        {label && <span className={sx(ui.checkboxLabel)}>{label}</span>}
      </label>
    )
  },
)
export function CheckboxGroup({
  options,
  value,
  defaultValue = [],
  onValueChange,
  name,
  legend,
}: {
  options: Array<{
    value: string
    label: ReactNode
    description?: ReactNode
    disabled?: boolean
  }>
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  name?: string
  legend?: ReactNode
}) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const update = (next: string[]) => {
    setInternal(next)
    onValueChange?.(next)
  }
  return (
    <fieldset className={sx(ui.field)}>
      {legend && <legend className={sx(ui.label)}>{legend}</legend>}
      <Stack gap={10}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            label={
              <span className={sx(ui.field)}>
                <span>{option.label}</span>
                {option.description && (
                  <span className={sx(ui.description)}>
                    {option.description}
                  </span>
                )}
              </span>
            }
            disabled={option.disabled}
            checked={current.includes(option.value)}
            onCheckedChange={(checked) =>
              update(
                checked === true
                  ? [...current, option.value]
                  : current.filter((entry) => entry !== option.value),
              )
            }
          />
        ))}
      </Stack>
    </fieldset>
  )
}
export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  legend,
  description,
}: {
  options: Array<{
    value: string
    label: ReactNode
    description?: ReactNode
    disabled?: boolean
  }>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  legend?: ReactNode
  description?: ReactNode
}) {
  const groupId = useId()
  const [internal, setInternal] = useState(defaultValue ?? "")
  const current = value ?? internal
  return (
    <fieldset className={withClass(sx(ui.field), "nui-radio-group")}>
      {legend && <legend className={sx(ui.label)}>{legend}</legend>}
      {description && <div className={sx(ui.description)}>{description}</div>}
      {options.map((option) => (
        <label
          key={option.value}
          className={withClass(
            sx(
              ui.radioRow,
              current === option.value ? ui.radioRowSelected : null,
              option.disabled ? ui.radioRowDisabled : null,
            ),
            "nui-radio-row",
          )}
          data-state={current === option.value ? "checked" : "unchecked"}
          data-disabled={option.disabled ? "" : undefined}
        >
          <span className={sx(ui.controlBox)}>
            <input
              type="radio"
              name={name ?? groupId}
              value={option.value}
              checked={current === option.value}
              disabled={option.disabled}
              className={sx(ui.checkboxInput)}
              onChange={() => {
                setInternal(option.value)
                onValueChange?.(option.value)
              }}
            />
            <span
              aria-hidden="true"
              className={sx(
                ui.radioIndicator,
                current === option.value ? ui.radioIndicatorSelected : null,
              )}
            >
              {current === option.value && <span className={sx(ui.radioDot)} />}
            </span>
          </span>
          <span className={sx(ui.radioLabel)}>
            <span>{option.label}</span>
            {option.description && (
              <span className={sx(ui.description)}>{option.description}</span>
            )}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
export function Switch({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  xstyle,
  className,
  disabled,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (value: boolean) => void
} & XStyleProps) {
  const [internal, setInternal] = useState(defaultChecked ?? false)
  const value = checked ?? internal
  return (
    <label
      className={withClass(
        withClass(sx(ui.controlRow), "nui-control-row"),
        className,
      )}
    >
      <button
        {...props}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        className={sx(ui.switch, value ? ui.switchOn : null, xstyle)}
        onClick={(event) => {
          const next = !value
          setInternal(next)
          onCheckedChange?.(next)
          props.onClick?.(event)
        }}
      >
        <span
          aria-hidden="true"
          className={sx(ui.switchThumb, value ? ui.switchThumbOn : null)}
        />
      </button>
      {label}
    </label>
  )
}
export function Select({
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options?: Array<{ value: string; label: string }>
} & XStyleProps) {
  const { xstyle, className, children, ...rest } = props
  return (
    <select
      className={withClass(
        sx(ui.select, xstyle),
        withClass("nui-select", className),
      )}
      {...rest}
    >
      {children ??
        options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
  )
}
export function Combobox({
  options = [],
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Choose…",
  id,
  className,
  xstyle,
  disabled,
  onChange,
  onFocus,
  onKeyDown,
  ...props
}: {
  options: Array<{ value: string; label: string }>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "onFocus" | "onKeyDown"
> &
  Pick<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onFocus" | "onKeyDown"
  > &
  XStyleProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listboxId = `${inputId}-listbox`
  const containerRef = useRef<HTMLDivElement>(null)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const selectedValue = value ?? internalValue
  const selected = options.find((option) => option.value === selectedValue)
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  )
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])
  const selectValue = (next: string) => {
    setInternalValue(next)
    setQuery("")
    setOpen(false)
    onValueChange?.(next)
  }
  return (
    <div ref={containerRef} className={sx(ui.field, ui.relative)}>
      <Input
        {...props}
        id={inputId}
        className={className}
        xstyle={xstyle}
        value={open ? query : query || selected?.label || ""}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-autocomplete="list"
        disabled={disabled}
        onFocus={(event) => {
          setOpen(true)
          onFocus?.(event)
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
            setQuery("")
          }
          if (event.key === "Enter" && filtered[0]) {
            event.preventDefault()
            selectValue(filtered[0].value)
          }
          onKeyDown?.(event)
        }}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
          onChange?.(event)
        }}
      />
      {open && (
        <div id={listboxId} className={sx(ui.popover)} role="listbox">
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={selectedValue === option.value}
                key={option.value}
                className={sx(ui.button, ui.buttonGhost, ui.buttonSmall)}
                style={{ width: "100%", justifyContent: "flex-start" }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectValue(option.value)}
              >
                {option.label}
              </button>
            ))
          ) : (
            <span
              className={sx(ui.description)}
              role="option"
              aria-disabled="true"
            >
              No matches found.
            </span>
          )}
        </div>
      )}
    </div>
  )
}
export function MultiSelect({
  options,
  value = [],
  onValueChange,
}: {
  options: Array<{ value: string; label: string }>
  value?: string[]
  onValueChange?: (value: string[]) => void
}) {
  return (
    <Select
      multiple
      value={value}
      onChange={(event) =>
        onValueChange?.(
          Array.from(event.target.selectedOptions, (option) => option.value),
        )
      }
      options={options}
    />
  )
}
export function Slider({
  xstyle,
  className,
  style,
  min = 0,
  max = 100,
  value,
  defaultValue,
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & XStyleProps) {
  const minValue = Number(min)
  const maxValue = Number(max)
  const fallback = minValue + (maxValue - minValue) / 2
  const parseValue = (
    candidate: number | string | readonly string[] | undefined,
    backup: number,
  ) => {
    const parsed =
      typeof candidate === "number"
        ? candidate
        : typeof candidate === "string"
          ? Number(candidate)
          : Number.NaN
    return Number.isFinite(parsed) ? parsed : backup
  }
  const [internal, setInternal] = useState(parseValue(defaultValue, fallback))
  const current = parseValue(value, internal)
  const progress =
    maxValue > minValue
      ? Math.min(
          100,
          Math.max(0, ((current - minValue) / (maxValue - minValue)) * 100),
        )
      : 0
  return (
    <Input
      type="range"
      {...props}
      min={min}
      max={max}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onChange={(event) => {
        setInternal(Number(event.target.value))
        onChange?.(event)
      }}
      className={withClass("nui-range", className)}
      xstyle={[ui.range, xstyle] as never}
      style={
        {
          accentColor: "var(--nui-accent)",
          "--nui-range-progress": `${progress}%`,
          ...style,
        } as CSSProperties
      }
    />
  )
}
export function DatePicker({
  value,
  defaultValue = "",
  onChange,
  placeholder = "Pick a date",
  defaultOpen = false,
  name,
  id,
  disabled,
  required,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  xstyle,
  className,
}: {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  defaultOpen?: boolean
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  "aria-label"?: string
  "aria-invalid"?: boolean | "true" | "false"
} & XStyleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [internal, setInternal] = useState(defaultValue)
  const [open, setOpen] = useState(defaultOpen)
  const current = value ?? internal
  const formatted = current
    ? new Date(`${current}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : placeholder
  const update = (next: string) => {
    setInternal(next)
    onChange?.(next)
    setOpen(false)
  }
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", close)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", close)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])
  return (
    <div ref={containerRef} className={sx(ui.field, ui.relative)}>
      <Button
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
        aria-invalid={ariaInvalid}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={className}
        xstyle={
          [
            ui.datePickerTrigger,
            ariaInvalid ? ui.buttonInvalid : null,
            xstyle,
          ] as never
        }
        onClick={() => setOpen(!open)}
      >
        <span>{formatted}</span>
        <span aria-hidden="true">⌄</span>
      </Button>
      <input type="hidden" name={name} value={current} required={required} />
      {open && (
        <div
          className={withClass(
            sx(ui.popover, ui.datePickerPopover),
            "nui-date-picker-popover",
          )}
          role="dialog"
          aria-label="Choose date"
        >
          <Calendar value={current} onChange={update} month={current} />
        </div>
      )}
    </div>
  )
}
export function Calendar({
  value,
  defaultValue,
  onChange,
  month: monthValue,
  disabled,
}: {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  month?: string
  disabled?: (date: string) => boolean
}) {
  const parseDate = (input?: string) => {
    if (!input) return null
    const [year, month, day] = input.split("-").map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day)
  }
  const formatDate = (date: Date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-")
  const seed = parseDate(value ?? defaultValue) ?? new Date()
  const [selected, setSelected] = useState(value ?? defaultValue ?? "")
  const [month, setMonth] = useState(
    () =>
      parseDate(monthValue) ?? new Date(seed.getFullYear(), seed.getMonth(), 1),
  )
  const current = value ?? selected
  const selectedDate = parseDate(current)
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => {
    if (index < firstDay) return null
    return new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1)
  })
  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
  const selectDate = (date: Date) => {
    const next = formatDate(date)
    setSelected(next)
    onChange?.(next)
  }

  return (
    <div
      className={withClass(sx(ui.calendar), "nui-calendar")}
      role="group"
      aria-label="Calendar"
    >
      <div className={withClass(sx(ui.calendarHeader), "nui-calendar-header")}>
        <button
          type="button"
          className={sx(ui.button, ui.buttonGhost, ui.buttonSmall)}
          aria-label="Previous month"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          ←
        </button>
        <strong
          className={withClass(sx(ui.calendarTitle), "nui-calendar-title")}
          aria-live="polite"
        >
          {monthLabel}
        </strong>
        <button
          type="button"
          className={sx(ui.button, ui.buttonGhost, ui.buttonSmall)}
          aria-label="Next month"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          →
        </button>
      </div>
      <div
        className={withClass(sx(ui.calendarGrid), "nui-calendar-grid")}
        role="grid"
        aria-label={monthLabel}
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span
            className={withClass(
              sx(ui.calendarWeekday),
              "nui-calendar-weekday",
            )}
            role="columnheader"
            key={day}
          >
            {day}
          </span>
        ))}
        {cells.map((date, index) => (
          <span
            className="nui-calendar-cell"
            role="gridcell"
            key={date ? formatDate(date) : `empty-${index}`}
            aria-selected={
              date && selectedDate
                ? formatDate(date) === formatDate(selectedDate)
                : undefined
            }
          >
            {date &&
              (() => {
                const dateValue = formatDate(date)
                const isDisabled = disabled?.(dateValue) ?? false
                return (
                  <button
                    type="button"
                    className={withClass(
                      sx(
                        ui.calendarDay,
                        selectedDate && formatDate(selectedDate) === dateValue
                          ? ui.calendarDaySelected
                          : null,
                        isDisabled ? ui.calendarDayDisabled : null,
                      ),
                      "nui-calendar-day",
                    )}
                    aria-label={date.toLocaleDateString("en-US", {
                      dateStyle: "full",
                    })}
                    aria-pressed={
                      selectedDate
                        ? formatDate(selectedDate) === dateValue
                        : false
                    }
                    disabled={isDisabled}
                    onClick={() => selectDate(date)}
                  >
                    {date.getDate()}
                  </button>
                )
              })()}
          </span>
        ))}
      </div>
    </div>
  )
}
export function TimeField(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return <Input type="time" {...props} />
}
export function OTPInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  disabled = false,
}: {
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
}) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const update = (next: string) => {
    setInternal(next)
    onChange?.(next)
  }
  return (
    <Inline
      gap={8}
      wrap={false}
      xstyle={{ width: "100%", minWidth: 0 } as never}
      className="nui-otp-input"
    >
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node
          }}
          inputMode="numeric"
          maxLength={1}
          value={current[index] ?? ""}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          xstyle={ui.otpSlot}
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, "").slice(-1)
            const next = current.padEnd(length, " ").split("")
            next[index] = digit
            update(next.join("").replace(/\s/g, ""))
            if (digit && index < length - 1)
              inputsRef.current[index + 1]?.focus()
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !current[index] && index > 0) {
              inputsRef.current[index - 1]?.focus()
            }
          }}
          onPaste={(event) => {
            if (index !== 0) return
            const pasted = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, length)
            if (!pasted) return
            event.preventDefault()
            update(pasted)
            inputsRef.current[Math.min(pasted.length, length) - 1]?.focus()
          }}
        />
      ))}
    </Inline>
  )
}
export function FileField(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return <Input type="file" {...props} />
}
export function Form({
  children,
  ...props
}: FormHTMLAttributes<HTMLFormElement> & XStyleProps) {
  const { xstyle, className, ...rest } = props
  return (
    <form className={withClass(sx(ui.field, xstyle), className)} {...rest}>
      {children}
    </form>
  )
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  children,
}: {
  items: Array<{ value: string; label: string }>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: ReactNode | ((value: string) => ReactNode)
}) {
  const tabsId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [internal, setInternal] = useState(
    defaultValue ?? items[0]?.value ?? "",
  )
  const current = value ?? internal
  const select = (next: string) => {
    setInternal(next)
    onValueChange?.(next)
  }
  return (
    <div className={sx(ui.field)}>
      <div
        role="tablist"
        className={withClass(sx(ui.tabsList), "nui-tabs-list")}
        aria-label="Tabs"
      >
        {items.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={current === item.value}
            aria-controls={`${tabsId}-panel`}
            id={`${tabsId}-${item.value}`}
            key={item.value}
            ref={(node) => {
              tabRefs.current[item.value] = node
            }}
            className={withClass(
              sx(ui.tab, current === item.value ? ui.tabActive : null),
              "nui-tab",
            )}
            onClick={() => select(item.value)}
            onKeyDown={(event) => {
              const index = items.findIndex(({ value }) => value === item.value)
              if (
                index < 0 ||
                !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
              )
                return
              event.preventDefault()
              const nextIndex =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? items.length - 1
                    : (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        items.length) %
                      items.length
              const next = items[nextIndex]
              select(next.value)
              tabRefs.current[next.value]?.focus()
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id={`${tabsId}-panel`}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`${tabsId}-${current}`}
      >
        {typeof children === "function" ? children(current) : children}
      </div>
    </div>
  )
}
export function TabList({ children }: { children: ReactNode }) {
  return (
    <div role="tablist" className={sx(ui.tabsList)}>
      {children}
    </div>
  )
}
export function Tab({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={sx(ui.tab, active ? ui.tabActive : null)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
export function TabPanel({ children }: { children: ReactNode }) {
  return <div role="tabpanel">{children}</div>
}
export function Accordion({
  items,
}: {
  items: Array<{ value: string; title: ReactNode; content: ReactNode }>
}) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className={withClass(sx(ui.accordion), "nui-accordion")}>
      {items.map((item) => (
        <div
          className={withClass(sx(ui.accordionItem), "nui-accordion-item")}
          key={item.value}
        >
          <button
            type="button"
            className={sx(ui.accordionTrigger)}
            aria-expanded={open === item.value}
            onClick={() => setOpen(open === item.value ? null : item.value)}
          >
            <span className={sx(ui.accordionTitle)}>{item.title}</span>
            <span aria-hidden="true" className={sx(ui.accordionIcon)}>
              {open === item.value ? "−" : "+"}
            </span>
          </button>
          {open === item.value && (
            <div
              className={withClass(
                sx(ui.accordionContent),
                "nui-accordion-content",
              )}
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={withClass(sx(ui.accordion), "nui-accordion")}>
      <button
        type="button"
        className={sx(ui.accordionTrigger)}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={sx(ui.accordionTitle)}>{title}</span>
        <span aria-hidden="true" className={sx(ui.accordionIcon)}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div
          className={withClass(
            sx(ui.accordionContent),
            "nui-accordion-content",
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav aria-label="Breadcrumb">
      <Inline gap={8}>
        {items.map((item, index) => (
          <span key={item.label}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              item.label
            )}
            {index < items.length - 1 && <span aria-hidden="true">/</span>}
          </span>
        ))}
      </Inline>
    </nav>
  )
}
export function Pagination({
  page,
  pages,
  onPageChange,
}: {
  page: number
  pages: number
  onPageChange?: (page: number) => void
}) {
  return (
    <Inline>
      <Button
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        Previous
      </Button>
      <Badge tone="accent">
        {page} / {pages}
      </Badge>
      <Button
        size="sm"
        disabled={page >= pages}
        onClick={() => onPageChange?.(page + 1)}
      >
        Next
      </Button>
    </Inline>
  )
}
export function Stepper({
  steps,
  current,
}: {
  steps: Array<{ label: string; description?: string }>
  current: number
}) {
  return (
    <Inline gap={0} wrap={false}>
      {steps.map((step, index) => (
        <div
          key={step.label}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <div
            className={sx({
              display: "grid",
              gap: 2,
              textAlign: "center",
              minWidth: 70,
            } as never)}
          >
            <Badge tone={index <= current ? "accent" : "neutral"}>
              {String(index + 1).padStart(2, "0")}
            </Badge>
            <small>{step.label}</small>
          </div>
          {index < steps.length - 1 && (
            <Separator xstyle={{ width: 36 } as never} />
          )}
        </div>
      ))}
    </Inline>
  )
}
export function Menu({
  items,
}: {
  items: Array<{ label: string; onSelect?: () => void }>
}) {
  return (
    <nav className={sx(ui.field)}>
      {items.map((item) => (
        <button
          type="button"
          className={sx(ui.button, ui.buttonGhost)}
          style={{
            justifyContent: "flex-start",
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          key={item.label}
          onClick={item.onSelect}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
export function DropdownMenu({
  label,
  items,
}: {
  label: ReactNode
  items: Array<{ label: string; onSelect?: () => void }>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", close)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", close)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])
  return (
    <div ref={containerRef} className={sx(ui.relative)}>
      <Button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
      </Button>
      {open && (
        <div className={sx(ui.popover)} role="menu">
          {items.map((item) => (
            <button
              type="button"
              role="menuitem"
              className={sx(ui.button, ui.buttonGhost, ui.buttonSmall)}
              style={{ width: "100%", justifyContent: "flex-start" }}
              key={item.label}
              onClick={() => {
                item.onSelect?.()
                setOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export function ContextMenu({
  children,
  items,
  defaultOpen = false,
}: {
  children: ReactNode
  items: Array<{ label: string; onSelect?: () => void }>
  defaultOpen?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    defaultOpen ? { x: 0, y: 0 } : null,
  )
  const open = position !== null
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setPosition(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPosition(null)
    }
    document.addEventListener("mousedown", close)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", close)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])
  return (
    <div
      ref={containerRef}
      className={sx(ui.relative)}
      tabIndex={0}
      onContextMenu={(event) => {
        event.preventDefault()
        setPosition({ x: event.clientX, y: event.clientY })
      }}
      onKeyDown={(event) => {
        if (event.key === "F10" && event.shiftKey) {
          event.preventDefault()
          setPosition({ x: 12, y: 12 })
        }
      }}
      aria-haspopup="menu"
      aria-expanded={open}
    >
      {children}
      {open && (
        <div
          className={sx(ui.popover)}
          role="menu"
          style={
            defaultOpen
              ? { position: "static", marginTop: 10 }
              : { position: "fixed", top: position.y, left: position.x }
          }
        >
          {items.map((item) => (
            <button
              type="button"
              role="menuitem"
              className={sx(ui.button, ui.buttonGhost, ui.buttonSmall)}
              style={{ width: "100%", justifyContent: "flex-start" }}
              key={item.label}
              onClick={() => {
                item.onSelect?.()
                setPosition(null)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
export function Menubar({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Menu bar">
      <Inline>{children}</Inline>
    </nav>
  )
}
export function NavigationMenu({
  items,
}: {
  items: Array<{ label: string; href: string }>
}) {
  return (
    <nav aria-label="Primary">
      <Inline>
        {items.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </Inline>
    </nav>
  )
}
export function Sidebar({
  children,
  title = "Navigation",
}: {
  children: ReactNode
  title?: ReactNode
}) {
  return (
    <aside className={sx(ui.card)}>
      <CardHeader>
        <strong>{title}</strong>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </aside>
  )
}
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div role="toolbar">
      <Inline>{children}</Inline>
    </div>
  )
}

type DialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  trigger?: ReactNode
  children: ReactNode
  footer?: ReactNode
  tone?: "default" | "danger"
  surface?: "dialog" | "drawer"
  role?: "dialog" | "alertdialog"
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}
export function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  footer,
  surface = "dialog",
  role = "dialog",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [internal, setInternal] = useState(defaultOpen)
  const current = open ?? internal
  const setOpen = (value: boolean) => {
    setInternal(value)
    onOpenChange?.(value)
  }
  useEffect(() => {
    if (!current) return
    const previousFocus = document.activeElement as HTMLElement | null
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== "Tab") return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", close)
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      window.removeEventListener("keydown", close)
      previousFocus?.focus()
    }
  }, [current, closeOnEscape])
  return (
    <>
      {trigger && <span onClick={() => setOpen(true)}>{trigger}</span>}
      {current && (
        <div
          className={sx(
            ui.overlay,
            surface === "drawer" ? ui.drawerOverlay : null,
          )}
          role="presentation"
          onMouseDown={(event) => {
            if (closeOnOverlayClick && event.target === event.currentTarget)
              setOpen(false)
          }}
        >
          <section
            ref={dialogRef}
            className={sx(surface === "drawer" ? ui.drawer : ui.dialog)}
            role={role}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
          >
            <header className={sx(ui.dialogHeader)}>
              <div className={sx(ui.field)}>
                <h2 id={titleId} style={{ margin: 0, fontSize: 20 }}>
                  {title}
                </h2>
                {description && (
                  <div id={descriptionId} className={sx(ui.description)}>
                    {description}
                  </div>
                )}
              </div>
              <IconButton
                ref={closeRef}
                label="Close"
                tone="ghost"
                onClick={() => setOpen(false)}
              >
                ×
              </IconButton>
            </header>
            <div className={sx(ui.dialogBody)}>{children}</div>
            {footer && (
              <footer className={sx(ui.dialogFooter)}>{footer}</footer>
            )}
          </section>
        </div>
      )}
    </>
  )
}
export function AlertDialog(props: DialogProps) {
  return (
    <Dialog
      {...props}
      role="alertdialog"
      closeOnOverlayClick={false}
      closeOnEscape={false}
    />
  )
}
export function Drawer(props: DialogProps) {
  return <Dialog {...props} surface="drawer" />
}
export function Popover({
  trigger,
  children,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
}: {
  trigger: ReactNode
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [internal, setInternal] = useState(defaultOpen)
  const open = controlled ?? internal
  const setOpen = (value: boolean) => {
    setInternal(value)
    onOpenChange?.(value)
  }
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", close)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", close)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])
  return (
    <div ref={containerRef} className={sx(ui.relative)}>
      <span
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </span>
      {open && (
        <div className={sx(ui.popover)} role="dialog">
          {children}
        </div>
      )}
    </div>
  )
}
export function Tooltip({
  content,
  children,
}: {
  content: ReactNode
  children: ReactNode
}) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()
  return (
    <span
      className={sx(ui.tooltipAnchor)}
      aria-describedby={visible ? tooltipId : undefined}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span id={tooltipId} role="tooltip" className={sx(ui.tooltip)}>
          {content}
        </span>
      )}
    </span>
  )
}
export function HoverCard({
  content,
  children,
}: {
  content: ReactNode
  children: ReactNode
}) {
  return <Tooltip content={content}>{children}</Tooltip>
}
export function Toast({
  title,
  description,
  open,
  onOpenChange,
}: {
  title: ReactNode
  description?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internal, setInternal] = useState(open ?? true)
  const current = open ?? internal
  return current ? (
    <div role="status" className={sx(ui.alert)}>
      <Inline wrap={false} style={{ justifyContent: "space-between" }}>
        <strong>{title}</strong>
        <IconButton
          label="Dismiss"
          tone="ghost"
          size="sm"
          onClick={() => {
            setInternal(false)
            onOpenChange?.(false)
          }}
        >
          ×
        </IconButton>
      </Inline>
      {description && <div className={sx(ui.description)}>{description}</div>}
    </div>
  ) : null
}
export function Toaster({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 50,
        width: "min(360px, calc(100vw - 40px))",
      }}
    >
      {children}
    </div>
  )
}
export function Command({
  items,
  placeholder = "Search commands…",
  onSelect,
}: {
  items: Array<{ value: string; label: string; hint?: string }>
  placeholder?: string
  onSelect?: (value: string) => void
}) {
  const [query, setQuery] = useState("")
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div className={sx(ui.field)}>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <div role="listbox" className={sx(ui.field)}>
        {filtered.map((item) => (
          <button
            type="button"
            key={item.value}
            className={sx(ui.button, ui.buttonGhost)}
            style={{ justifyContent: "space-between" }}
            onClick={() => onSelect?.(item.value)}
          >
            <span>{item.label}</span>
            {item.hint && <Kbd>{item.hint}</Kbd>}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CommandInput(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return (
    <Input {...props} aria-label={props["aria-label"] ?? "Search commands"} />
  )
}

export function CommandList({
  children,
  xstyle,
  className,
  ...props
}: DivProps) {
  return (
    <div
      role="listbox"
      className={withClass(sx(ui.field, xstyle), className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function Alert({
  title,
  children,
  tone = "neutral",
}: {
  title?: ReactNode
  children?: ReactNode
  tone?: "neutral" | "danger" | "success"
}) {
  return (
    <div
      role="alert"
      className={sx(
        ui.alert,
        tone === "danger"
          ? ui.alertDanger
          : tone === "success"
            ? ui.alertSuccess
            : null,
      )}
    >
      <strong>
        {title ?? (tone === "danger" ? "Something needs attention" : "Notice")}
      </strong>
      {children && <div className={sx(ui.description)}>{children}</div>}
    </div>
  )
}
export function Banner(props: ComponentProps<typeof Alert>) {
  return <Alert {...props} />
}
export function Callout(props: ComponentProps<typeof Alert>) {
  return <Alert {...props} />
}
export function Progress({
  value = 0,
  label,
}: {
  value?: number
  label?: ReactNode
}) {
  const normalized = Math.max(0, Math.min(value, 100))
  return (
    <div
      className={sx(ui.field)}
      aria-label={typeof label === "string" ? label : "Progress"}
      role="progressbar"
      aria-valuenow={normalized}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {label && (
        <Inline wrap={false} style={{ justifyContent: "space-between" }}>
          <span>{label}</span>
          <strong>{normalized}%</strong>
        </Inline>
      )}
      <div className={sx(ui.progressTrack)}>
        <div
          className={sx(ui.progressBar)}
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  )
}
export function ProgressCircle({ value = 0 }: { value?: number }) {
  const normalized = Math.max(0, Math.min(value, 100))
  return (
    <div
      aria-label={`${normalized}% complete`}
      role="progressbar"
      aria-valuenow={normalized}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        display: "grid",
        placeItems: "center",
        width: 72,
        height: 72,
        borderRadius: 999,
        background: `conic-gradient(${tokens.accent} ${normalized}%, ${tokens.surfaceInset} 0)`,
      }}
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: 56,
          height: 56,
          borderRadius: 999,
          background: tokens.surface,
          fontWeight: 800,
        }}
      >
        {normalized}%
      </div>
    </div>
  )
}
export function Meter({
  value = 0,
  max = 100,
  label,
}: {
  value?: number
  max?: number
  label?: ReactNode
}) {
  return <Progress value={max > 0 ? (value / max) * 100 : 0} label={label} />
}
export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      style={{
        display: "inline-block",
        width: 18,
        height: 18,
        border: `2px solid ${tokens.surfaceInset}`,
        borderTopColor: tokens.accent,
        borderRadius: 999,
        animation: "nui-spin 700ms linear infinite",
      }}
    />
  )
}
export function Skeleton({
  width = "100%",
  height = 16,
}: {
  width?: string | number
  height?: string | number
}) {
  return (
    <div
      aria-hidden="true"
      className={sx(ui.skeleton)}
      style={{ width, minHeight: height }}
    />
  )
}
export function LoadingOverlay({
  children,
  loading,
}: {
  children: ReactNode
  loading: boolean
}) {
  return (
    <div className={sx(ui.relative)}>
      {children}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            backgroundColor:
              "color-mix(in srgb, var(--nui-surface) 72%, transparent)",
          }}
        >
          <Spinner />
        </div>
      )}
    </div>
  )
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        placeItems: "center",
        padding: 38,
        textAlign: "center",
        border: `1px dashed ${tokens.borderStrong}`,
        borderRadius: tokens.radiusLg,
      }}
    >
      <strong>{title}</strong>
      {description && <div className={sx(ui.description)}>{description}</div>}
      {action}
    </div>
  )
}
export function ErrorState({
  title = "We could not load this",
  retry,
}: {
  title?: ReactNode
  retry?: () => void
}) {
  return (
    <Alert tone="danger" title={title}>
      {retry && (
        <Button tone="danger" size="sm" onClick={retry}>
          Try again
        </Button>
      )}
    </Alert>
  )
}
export function Result({
  status,
  title,
  description,
}: {
  status: "success" | "error" | "pending"
  title: ReactNode
  description?: ReactNode
}) {
  return (
    <Alert
      tone={
        status === "error"
          ? "danger"
          : status === "success"
            ? "success"
            : "neutral"
      }
      title={title}
    >
      {description}
    </Alert>
  )
}
export function Status({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "accent" | "danger"
}) {
  return <Badge tone={tone}>{children}</Badge>
}

type TableProps = {
  children: ReactNode
  caption?: ReactNode
  tableClassName?: string
} & Omit<
  TableHTMLAttributes<HTMLTableElement>,
  "children" | "className" | "caption"
> &
  XStyleProps

export function Table({
  children,
  caption,
  tableClassName,
  xstyle,
  className,
  ...tableProps
}: TableProps) {
  return (
    <div
      className={withClass(
        withClass(sx(ui.tableWrap, xstyle), "nui-table-wrap"),
        className,
      )}
    >
      <table
        {...tableProps}
        className={withClass(
          withClass(sx(ui.table), "nui-table"),
          tableClassName,
        )}
      >
        {caption && (
          <caption className={sx(ui.tableCaption)}>{caption}</caption>
        )}
        {children}
      </table>
    </div>
  )
}

export type DataTableColumn<T extends Record<string, unknown>> = {
  key: keyof T & string
  header: ReactNode
  render?: (value: T[keyof T], row: T) => ReactNode
  align?: "left" | "center" | "right"
  width?: CSSProperties["width"]
  sortable?: boolean
}

export type DataTableRowKey<T extends Record<string, unknown>> =
  | (keyof T & string)
  | ((row: T, index: number) => string | number)

export type DataTableKey = string | number

export type DataTableSort<T extends Record<string, unknown>> = {
  key: keyof T & string
  direction: "asc" | "desc"
  onChange: (key: keyof T & string, direction: "asc" | "desc") => void
}

export type DataTableSelection<T extends Record<string, unknown>> = {
  selectedKeys?: DataTableKey[]
  defaultSelectedKeys?: DataTableKey[]
  onSelectedKeysChange?: (keys: DataTableKey[]) => void
  getRowLabel?: (row: T, index: number) => string
  selectAllLabel?: string
}

export type DataTableResponsive = "scroll" | "stack" | "auto"

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  caption,
  emptyState = "No records to display.",
  loading = false,
  loadingState = "Loading records…",
  rowKey,
  getRowProps,
  density = "default",
  layout = "fixed",
  minWidth,
  responsive = "scroll",
  stickyHeader = false,
  striped = false,
  selection,
  sort,
  tableProps,
  tableClassName,
  xstyle,
  className,
}: {
  data: T[]
  columns: Array<DataTableColumn<T>>
  caption?: ReactNode
  emptyState?: ReactNode
  loading?: boolean
  loadingState?: ReactNode
  rowKey?: DataTableRowKey<T>
  getRowProps?: (row: T, index: number) => HTMLAttributes<HTMLTableRowElement>
  density?: "default" | "compact"
  layout?: CSSProperties["tableLayout"]
  minWidth?: CSSProperties["minWidth"]
  responsive?: DataTableResponsive
  stickyHeader?: boolean
  striped?: boolean
  selection?: DataTableSelection<T>
  sort?: DataTableSort<T>
  tableProps?: Omit<
    TableHTMLAttributes<HTMLTableElement>,
    "children" | "className" | "caption"
  >
  tableClassName?: string
} & XStyleProps) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<
    DataTableKey[]
  >(selection?.defaultSelectedKeys ?? [])
  const getKey = (row: T, index: number): string | number => {
    const value =
      typeof rowKey === "function"
        ? rowKey(row, index)
        : rowKey
          ? row[rowKey]
          : index
    return typeof value === "string" || typeof value === "number"
      ? value
      : String(value ?? index)
  }
  const rowsWithKeys = data.map((row, index) => {
    const key = getKey(row, index)
    return { row, index, key, keyString: String(key) }
  })
  const selectedKeys = selection?.selectedKeys ?? internalSelectedKeys
  const selectedKeySet = new Set(selectedKeys.map((key) => String(key)))
  const visibleKeySet = new Set(rowsWithKeys.map((entry) => entry.keyString))
  const visibleSelectedCount = rowsWithKeys.filter((entry) =>
    selectedKeySet.has(entry.keyString),
  ).length
  const allVisibleSelected =
    rowsWithKeys.length > 0 && visibleSelectedCount === rowsWithKeys.length
  const someVisibleSelected = visibleSelectedCount > 0 && !allVisibleSelected
  const updateVisibleSelection = (nextVisibleKeys: Set<string>) => {
    const next = selectedKeys.filter((key) => !visibleKeySet.has(String(key)))
    for (const entry of rowsWithKeys) {
      if (nextVisibleKeys.has(entry.keyString)) next.push(entry.key)
    }
    setInternalSelectedKeys(next)
    selection?.onSelectedKeysChange?.(next)
  }
  const defaultMinWidth =
    columns.length >= 4 ? 620 : columns.length === 3 ? 500 : undefined
  const hasSelection = Boolean(selection)
  const columnCount = columns.length + (hasSelection ? 1 : 0)

  return (
    <Table
      {...tableProps}
      data-responsive={responsive}
      style={{
        ...tableProps?.style,
        tableLayout: tableProps?.style?.tableLayout ?? layout,
        minWidth: tableProps?.style?.minWidth ?? minWidth ?? defaultMinWidth,
      }}
      aria-busy={loading ? true : tableProps?.["aria-busy"]}
      caption={caption}
      xstyle={xstyle}
      className={className}
      tableClassName={withClass(
        withClass(
          sx(density === "compact" ? ui.tableCompact : null),
          withClass(
            "nui-data-table",
            [
              striped ? "nui-table-striped" : undefined,
              hasSelection ? "nui-data-table-selectable" : undefined,
            ]
              .filter(Boolean)
              .join(" "),
          ),
        ),
        tableClassName,
      )}
    >
      <colgroup>
        {hasSelection && <col style={{ width: 44 }} />}
        {columns.map((column) => (
          <col key={column.key} style={{ width: column.width }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {hasSelection && (
            <th
              className={sx(
                ui.th,
                ui.thSelection,
                density === "compact" ? ui.thCompact : null,
                stickyHeader ? ui.thSticky : null,
              )}
              scope="col"
            >
              <span
                className={withClass(
                  sx(ui.selectionControl),
                  "nui-selection-control",
                )}
              >
                <Checkbox
                  aria-label={selection?.selectAllLabel ?? "Select all rows"}
                  checked={
                    someVisibleSelected ? "indeterminate" : allVisibleSelected
                  }
                  onCheckedChange={(checked) => {
                    updateVisibleSelection(
                      checked === true ? new Set(visibleKeySet) : new Set(),
                    )
                  }}
                />
              </span>
            </th>
          )}
          {columns.map((column) => (
            <th
              className={sx(
                ui.th,
                density === "compact" ? ui.thCompact : null,
                stickyHeader ? ui.thSticky : null,
              )}
              key={column.key}
              scope="col"
              aria-sort={
                column.sortable
                  ? sort?.key === column.key
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                  : undefined
              }
              style={{ textAlign: column.align, width: column.width }}
            >
              {column.sortable && sort ? (
                <button
                  type="button"
                  className={sx(ui.thButton)}
                  aria-label={`Sort by ${
                    typeof column.header === "string" ||
                    typeof column.header === "number"
                      ? String(column.header)
                      : "column"
                  }${
                    sort.key === column.key
                      ? `, currently ${sort.direction === "asc" ? "ascending" : "descending"}`
                      : ""
                  }`}
                  onClick={() =>
                    sort.onChange(
                      column.key,
                      sort.key === column.key && sort.direction === "asc"
                        ? "desc"
                        : "asc",
                    )
                  }
                >
                  {column.header}
                  <span className={sx(ui.thSortIcon)} aria-hidden="true">
                    {sort.key === column.key
                      ? sort.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </button>
              ) : (
                column.header
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              className={withClass(
                sx(ui.tableEmptyCell),
                "nui-table-empty-cell",
              )}
              colSpan={Math.max(columnCount, 1)}
            >
              {loadingState}
            </td>
          </tr>
        ) : data.length > 0 ? (
          rowsWithKeys.map(({ row, index, key, keyString }) => {
            const rowProps = getRowProps?.(row, index)
            const rowSelected = selectedKeySet.has(keyString)
            return (
              <tr
                {...rowProps}
                className={withClass(
                  sx(
                    rowSelected ? ui.tableRowSelected : null,
                    striped && index % 2 === 1 ? ui.tableRowStriped : null,
                  ),
                  rowProps?.className,
                )}
                key={key}
                data-row-key={keyString}
                data-state={rowSelected ? "selected" : undefined}
              >
                {hasSelection && (
                  <td
                    className={withClass(
                      sx(ui.td, ui.selectionCell),
                      "nui-selection-cell",
                    )}
                  >
                    <span
                      className={withClass(
                        sx(ui.selectionControl),
                        "nui-selection-control",
                      )}
                    >
                      <Checkbox
                        aria-label={
                          selection?.getRowLabel?.(row, index) ??
                          `Select row ${keyString}`
                        }
                        checked={rowSelected}
                        onCheckedChange={(checked) => {
                          const nextVisibleKeys = new Set(
                            rowsWithKeys
                              .filter((entry) =>
                                selectedKeySet.has(entry.keyString),
                              )
                              .map((entry) => entry.keyString),
                          )
                          if (checked === true) nextVisibleKeys.add(keyString)
                          else nextVisibleKeys.delete(keyString)
                          updateVisibleSelection(nextVisibleKeys)
                        }}
                      />
                    </span>
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    className={sx(
                      ui.td,
                      density === "compact" ? ui.tdCompact : null,
                    )}
                    key={column.key}
                    data-label={
                      typeof column.header === "string" ||
                      typeof column.header === "number"
                        ? String(column.header)
                        : undefined
                    }
                    style={{ textAlign: column.align }}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            )
          })
        ) : (
          <tr>
            <td
              className={withClass(
                sx(ui.tableEmptyCell),
                "nui-table-empty-cell",
              )}
              colSpan={Math.max(columnCount, 1)}
            >
              {emptyState}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}
export function DataGrid<T extends Record<string, unknown>>(
  props: {
    data: T[]
    columns: Array<{
      key: keyof T & string
      header: string
      render?: (value: T[keyof T], row: T) => ReactNode
    }>
  } & XStyleProps,
) {
  return <DataTable {...props} minWidth="100%" responsive="auto" />
}
export function List({
  items,
}: {
  items: Array<{
    title: ReactNode
    description?: ReactNode
    action?: ReactNode
  }>
}) {
  return (
    <div className={sx(ui.field)}>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            padding: 14,
            borderBottom: `1px solid ${tokens.border}`,
          }}
        >
          <div className={sx(ui.field)}>
            <strong>{item.title}</strong>
            {item.description && (
              <span className={sx(ui.description)}>{item.description}</span>
            )}
          </div>
          {item.action}
        </div>
      ))}
    </div>
  )
}
export function ListItem({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 12, borderBottom: `1px solid ${tokens.border}` }}>
      {children}
    </div>
  )
}
export function DescriptionList({
  items,
}: {
  items: Array<{ label: ReactNode; value: ReactNode }>
}) {
  return (
    <dl className={sx(ui.field)}>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px, 0.4fr) 1fr",
            gap: 16,
            paddingBlock: 10,
            borderBottom: `1px solid ${tokens.border}`,
          }}
        >
          <dt className={sx(ui.description)}>{item.label}</dt>
          <dd style={{ margin: 0 }}>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
export function Stat({
  label,
  value,
  detail,
}: {
  label: ReactNode
  value: ReactNode
  detail?: ReactNode
}) {
  return (
    <div className={sx(ui.stat)}>
      <span className={sx(ui.statLabel)}>{label}</span>
      <strong className={sx(ui.statValue)}>{value}</strong>
      {detail && <span className={sx(ui.description)}>{detail}</span>}
    </div>
  )
}
export function StatsGrid({ children }: { children: ReactNode }) {
  return <Grid columns="repeat(auto-fit, minmax(160px, 1fr))">{children}</Grid>
}
export function Timeline({
  items,
}: {
  items: Array<{ title: ReactNode; description?: ReactNode; time?: ReactNode }>
}) {
  return (
    <div className={sx(ui.timeline)}>
      {items.map((item, index) => (
        <div className={sx(ui.timelineItem)} key={index}>
          <span className={sx(ui.timelineDot)} />
          <div className={sx(ui.field)}>
            <Inline wrap={false} style={{ justifyContent: "space-between" }}>
              <strong>{item.title}</strong>
              {item.time && (
                <span className={sx(ui.description)}>{item.time}</span>
              )}
            </Inline>
            {item.description && (
              <span className={sx(ui.description)}>{item.description}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
export function Tree({
  nodes,
}: {
  nodes: Array<{ label: ReactNode; children?: ReactNode }>
}) {
  return (
    <div role="tree" className={sx(ui.field)}>
      {nodes.map((node, index) => (
        <details key={index}>
          <summary>{node.label}</summary>
          {node.children && (
            <div style={{ paddingLeft: 18 }}>{node.children}</div>
          )}
        </details>
      ))}
    </div>
  )
}
export function FileList({
  files,
}: {
  files: Array<{ name: string; size?: string }>
}) {
  return (
    <List
      items={files.map((file) => ({
        title: file.name,
        description: file.size,
      }))}
    />
  )
}
export function DiffViewer({
  before,
  after,
}: {
  before: string
  after: string
}) {
  return (
    <Grid
      className="nui-diff-viewer"
      columns="repeat(auto-fit, minmax(min(100%, 280px), 1fr))"
    >
      <CodeBlock code={before} />
      <CodeBlock code={after} />
    </Grid>
  )
}
export function ResizablePanels({ children }: { children: ReactNode }) {
  return (
    <div
      className="nui-resizable-panels"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: 1,
        backgroundColor: tokens.border,
      }}
    >
      {children}
    </div>
  )
}

export function PromptComposer({
  onSubmit,
  placeholder = "Describe the outcome…",
  disabled = false,
}: {
  onSubmit?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState("")
  return (
    <form
      className={sx(ui.prompt)}
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim()) return
        onSubmit?.(value.trim())
        setValue("")
      }}
    >
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
      />
      <Inline style={{ justifyContent: "space-between" }} wrap={false}>
        <span className={sx(ui.description)}>
          Agents should propose before they act.
        </span>
        <Button
          type="submit"
          tone="primary"
          disabled={disabled || !value.trim()}
        >
          Send <span aria-hidden="true">↗</span>
        </Button>
      </Inline>
    </form>
  )
}
export function Conversation({ children }: { children: ReactNode }) {
  return (
    <div aria-live="polite" className={sx(ui.field)}>
      {children}
    </div>
  )
}
export function Message({
  role,
  children,
  name,
}: {
  role: "human" | "agent" | "system"
  children: ReactNode
  name?: string
}) {
  return (
    <div
      className={sx(
        ui.message,
        role === "human" ? ui.messageHuman : ui.messageAgent,
      )}
    >
      <small style={{ display: "block", marginBottom: 4, opacity: 0.72 }}>
        {name ??
          (role === "human" ? "You" : role === "agent" ? "Agent" : "System")}
      </small>
      {children}
    </div>
  )
}
export function MessageGroup({ children }: { children: ReactNode }) {
  return <div className={sx(ui.field)}>{children}</div>
}
export function StreamingText({
  children,
  streaming = false,
}: {
  children: ReactNode
  streaming?: boolean
}) {
  return (
    <span>
      {children}
      {streaming && <span aria-label="Streaming">▌</span>}
    </span>
  )
}
export function ToolCall({
  name,
  input,
  output,
  status = "running",
}: {
  name: string
  input?: ReactNode
  output?: ReactNode
  status?: "queued" | "running" | "succeeded" | "failed"
}) {
  return (
    <div className={sx(ui.tool)}>
      <Inline wrap={false} style={{ justifyContent: "space-between" }}>
        <strong>{name}</strong>
        <Status
          tone={
            status === "failed"
              ? "danger"
              : status === "succeeded"
                ? "accent"
                : "neutral"
          }
        >
          {status}
        </Status>
      </Inline>
      {input && (
        <div className={sx(ui.description)}>
          Input: <Code>{input}</Code>
        </div>
      )}
      {output && <div>{output}</div>}
    </div>
  )
}
export function ToolStatus({
  status,
  label,
}: {
  status: "queued" | "running" | "succeeded" | "failed"
  label?: string
}) {
  return (
    <Inline wrap={false}>
      <span
        className={sx(ui.statusDot)}
        style={{
          backgroundColor:
            status === "failed"
              ? tokens.danger
              : status === "running"
                ? tokens.warning
                : tokens.success,
        }}
      />
      {label ?? status}
    </Inline>
  )
}
export function ApprovalCard({
  title = "Approval required",
  description,
  approveLabel = "Approve",
  onApprove,
  onReject,
}: {
  title?: ReactNode
  description?: ReactNode
  approveLabel?: string
  onApprove?: () => void
  onReject?: () => void
}) {
  return (
    <Card>
      <CardBody>
        <Stack gap={12}>
          <Badge tone="accent">HUMAN GATE</Badge>
          <strong>{title}</strong>
          {description && (
            <div className={sx(ui.description)}>{description}</div>
          )}
          <ButtonGroup>
            <Button tone="ghost" onClick={onReject}>
              Reject
            </Button>
            <Button tone="primary" onClick={onApprove}>
              {approveLabel}
            </Button>
          </ButtonGroup>
        </Stack>
      </CardBody>
    </Card>
  )
}
export function HumanApproval(props: ComponentProps<typeof ApprovalCard>) {
  return <ApprovalCard {...props} />
}
export function RunTimeline({
  runs,
}: {
  runs: Array<{
    title: ReactNode
    status: "queued" | "running" | "succeeded" | "failed"
    detail?: ReactNode
  }>
}) {
  return (
    <Timeline
      items={runs.map((run) => ({
        title: (
          <Inline wrap={false}>
            <ToolStatus status={run.status} />
            {run.title}
          </Inline>
        ),
        description: run.detail,
      }))}
    />
  )
}
export function CitationList({
  citations,
}: {
  citations: Array<{ title: string; href?: string; excerpt?: string }>
}) {
  return (
    <List
      items={citations.map((citation) => ({
        title: citation.href ? (
          <Link href={citation.href}>{citation.title}</Link>
        ) : (
          citation.title
        ),
        description: citation.excerpt,
      }))}
    />
  )
}
export function SourceCard({
  title,
  excerpt,
  href,
}: {
  title: string
  excerpt?: string
  href?: string
}) {
  return (
    <Card>
      <CardBody>
        <Stack gap={8}>
          <strong>{href ? <Link href={href}>{title}</Link> : title}</strong>
          {excerpt && <span className={sx(ui.description)}>{excerpt}</span>}
        </Stack>
      </CardBody>
    </Card>
  )
}
export function ModelPicker({
  models,
  value,
  onValueChange,
}: {
  models: string[]
  value?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <Select
      aria-label="Model"
      value={value}
      onChange={(event) => onValueChange?.(event.target.value)}
      options={models.map((model) => ({ value: model, label: model }))}
    />
  )
}
export function TokenUsage({
  input,
  output,
  limit,
}: {
  input: number
  output: number
  limit?: number
}) {
  return (
    <Stat
      label="Token usage"
      value={`${input + output}`}
      detail={
        limit
          ? `${limit - input - output} remaining`
          : `in ${input} · out ${output}`
      }
    />
  )
}
export function ActivityFeed({
  items,
}: {
  items: Array<{
    title: ReactNode
    detail?: ReactNode
    time?: ReactNode
    tone?: "neutral" | "accent" | "danger"
  }>
}) {
  return (
    <div className={sx(ui.activity)}>
      {items.map((item, index) => (
        <div className={sx(ui.activityItem)} key={index}>
          <span
            className={sx(ui.statusDot)}
            style={{
              backgroundColor:
                item.tone === "danger"
                  ? tokens.danger
                  : item.tone === "accent"
                    ? tokens.accent
                    : tokens.success,
            }}
          />
          <div>
            <strong>{item.title}</strong>
            {item.detail && (
              <div className={sx(ui.description)}>{item.detail}</div>
            )}
          </div>
          {item.time && <time className={sx(ui.description)}>{item.time}</time>}
        </div>
      ))}
    </div>
  )
}

const standard = stylex.create({
  frame: {
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surface,
  },
  muted: { color: tokens.textMuted },
  icon: {
    display: "inline-grid",
    placeItems: "center",
    width: 40,
    height: 40,
    borderRadius: tokens.radiusMd,
    backgroundColor: "var(--nui-accent-soft)",
    color: tokens.accentStrong,
    fontSize: 20,
    fontWeight: 800,
  },
  bubble: {
    maxWidth: "78%",
    padding: "10px 13px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surfaceRaised,
    lineHeight: 1.45,
  },
  bubbleAccent: {
    marginLeft: "auto",
    borderColor: tokens.accent,
    backgroundColor: tokens.accent,
    color: tokens.accentText,
    borderBottomRightRadius: tokens.radiusSm,
  },
  carousel: { display: "grid", gap: 14, padding: 18 },
  carouselControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: tokens.borderStrong,
  },
  dotActive: { backgroundColor: tokens.accent },
  chartWrap: { padding: "14px 14px 10px" },
  chart: { width: "100%", height: 150, display: "block" },
  chartLabels: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    color: tokens.textFaint,
    fontFamily: tokens.fontMono,
    fontSize: 10,
  },
  marker: {
    paddingInline: 3,
    borderRadius: 3,
    backgroundColor: "var(--nui-accent-soft)",
    color: tokens.accentStrong,
  },
  empty: {
    display: "grid",
    placeItems: "center",
    gap: 10,
    minHeight: 170,
    padding: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: tokens.borderStrong,
    borderRadius: tokens.radiusLg,
    textAlign: "center",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  itemBody: { display: "grid", gap: 3, flex: 1, minWidth: 0 },
  itemAction: { marginLeft: "auto" },
  attachment: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    borderRadius: tokens.radiusMd,
    backgroundColor: tokens.surfaceRaised,
  },
  attachmentBody: { display: "grid", gap: 2, flex: 1, minWidth: 0 },
  select: {
    display: "grid",
    gap: 8,
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
  },
  selectOption: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: tokens.radiusMd,
    backgroundColor: "transparent",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 140ms ease, border-color 140ms ease",
    ":hover": {
      backgroundColor: tokens.surfaceInset,
    },
  },
  selectOptionActive: {
    borderColor: "transparent",
    backgroundColor: tokens.surfaceRaised,
    boxShadow: "inset 3px 0 0 var(--nui-accent)",
  },
  sheet: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 41,
    width: "min(440px, calc(100vw - 28px))",
    overflow: "auto",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: tokens.borderStrong,
    backgroundColor: tokens.surface,
    boxShadow: tokens.shadowStrong,
  },
  sheetHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
  },
  sheetBody: { padding: 20 },
  resize: { display: "grid", gap: 12, minWidth: 0 },
  resizePanes: {
    display: "grid",
    gap: 1,
    minWidth: 0,
    backgroundColor: tokens.border,
  },
  resizePane: {
    minWidth: 0,
    minHeight: 110,
    padding: 16,
    overflow: "hidden",
    backgroundColor: tokens.surface,
  },
  resizeLabel: {
    display: "grid",
    gap: 6,
    color: tokens.textMuted,
    fontSize: 12,
  },
  typeDisplay: { fontSize: 28, fontWeight: 850, letterSpacing: "-0.05em" },
  typeLead: { fontSize: 18, lineHeight: 1.5 },
})

export function AspectRatio({
  ratio = 16 / 9,
  children,
  xstyle,
  className,
}: { ratio?: number; children: ReactNode } & XStyleProps) {
  return (
    <div
      className={withClass(sx(standard.frame, xstyle), className)}
      style={{ aspectRatio: ratio }}
    >
      {children}
    </div>
  )
}

export function Attachment({
  name,
  size,
  status = "ready",
  onRemove,
  xstyle,
  className,
}: {
  name: string
  size?: string
  status?: "ready" | "uploading" | "error"
  onRemove?: () => void
} & XStyleProps) {
  return (
    <div className={withClass(sx(standard.attachment, xstyle), className)}>
      <span className={sx(standard.icon)} aria-hidden="true">
        ↗
      </span>
      <div className={sx(standard.attachmentBody)}>
        <strong>{name}</strong>
        <span className={sx(standard.muted)}>
          {status === "uploading"
            ? "Uploading…"
            : status === "error"
              ? "Upload failed"
              : (size ?? "Ready to use")}
        </span>
      </div>
      {onRemove && (
        <IconButton
          label={`Remove ${name}`}
          tone="ghost"
          size="sm"
          onClick={onRemove}
        >
          ×
        </IconButton>
      )}
    </div>
  )
}

export function Bubble({
  children,
  tone = "default",
  xstyle,
  className,
}: { children: ReactNode; tone?: "default" | "accent" } & XStyleProps) {
  return (
    <div
      className={withClass(
        sx(
          standard.bubble,
          tone === "accent" ? standard.bubbleAccent : null,
          xstyle,
        ),
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Carousel({
  slides,
  initialIndex = 0,
  label = "Carousel",
}: {
  slides: ReactNode[]
  initialIndex?: number
  label?: string
}) {
  const [index, setIndex] = useState(
    Math.min(initialIndex, Math.max(0, slides.length - 1)),
  )
  const total = slides.length
  if (total === 0) return null
  return (
    <div
      className={sx(standard.frame)}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className={sx(standard.carousel)}>
        <div aria-live="polite">{slides[index]}</div>
        <div className={sx(standard.carouselControls)}>
          <Button
            size="sm"
            onClick={() => setIndex((value) => (value - 1 + total) % total)}
            aria-label="Previous slide"
          >
            ←
          </Button>
          <div
            className={sx(ui.inline)}
            aria-label={`Slide ${index + 1} of ${total}`}
          >
            {slides.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={sx(
                  standard.dot,
                  dotIndex === index ? standard.dotActive : null,
                )}
              />
            ))}
          </div>
          <Button
            size="sm"
            tone="primary"
            onClick={() => setIndex((value) => (value + 1) % total)}
            aria-label="Next slide"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Chart({
  data,
  labels,
  height = 150,
  label = "Chart",
}: {
  data: number[]
  labels?: string[]
  height?: number
  label?: string
}) {
  const max = Math.max(...data, 1)
  const points = data
    .map(
      (value, index) =>
        `${(index / Math.max(data.length - 1, 1)) * 100},${height - (value / max) * (height - 24) - 12}`,
    )
    .join(" ")
  return (
    <div className={sx(standard.frame)}>
      <div className={sx(standard.chartWrap)}>
        <svg
          className={sx(standard.chart)}
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={label}
        >
          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              x2="100"
              y1={height * fraction}
              y2={height * fraction}
              stroke="var(--nui-border)"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path
            d={`M 0 ${height - 12} L ${points} L 100 ${height - 12} Z`}
            fill="var(--nui-accent-soft)"
            stroke="none"
          />
          <path
            d={`M ${points}`}
            fill="none"
            stroke="var(--nui-accent)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((value, index) => {
            const x = (index / Math.max(data.length - 1, 1)) * 100
            const y = height - (value / max) * (height - 24) - 12
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2.8"
                fill="var(--nui-surface)"
                stroke="var(--nui-accent)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              >
                <title>
                  {labels?.[index] ?? `Point ${index + 1}`}: {value}
                </title>
              </circle>
            )
          })}
        </svg>
        {labels && (
          <div className={sx(standard.chartLabels)} aria-hidden="true">
            {labels.map((entry) => (
              <span key={entry}>{entry}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Direction({
  dir = "ltr",
  children,
  xstyle,
  className,
}: { dir?: "ltr" | "rtl"; children: ReactNode } & XStyleProps) {
  return (
    <div dir={dir} className={withClass(sx(ui.root, xstyle), className)}>
      {children}
    </div>
  )
}

export function Empty({
  icon = "○",
  title,
  description,
  action,
  xstyle,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
} & XStyleProps) {
  return (
    <div className={withClass(sx(standard.empty, xstyle), className)}>
      <span className={sx(standard.icon)} aria-hidden="true">
        {icon}
      </span>
      <strong>{title}</strong>
      {description && <span className={sx(standard.muted)}>{description}</span>}
      {action}
    </div>
  )
}

export function Item({
  icon,
  title,
  description,
  action,
  xstyle,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
} & XStyleProps) {
  return (
    <div className={withClass(sx(standard.item, xstyle), className)}>
      {icon && (
        <span className={sx(standard.icon)} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={sx(standard.itemBody)}>
        <strong>{title}</strong>
        {description && (
          <span className={sx(standard.muted)}>{description}</span>
        )}
      </div>
      {action && <span className={sx(standard.itemAction)}>{action}</span>}
    </div>
  )
}

export function Marker({
  children,
  xstyle,
  className,
}: { children: ReactNode } & XStyleProps) {
  return (
    <mark className={withClass(sx(standard.marker, xstyle), className)}>
      {children}
    </mark>
  )
}

export function MessageScroller({
  messages,
  maxHeight = 220,
}: {
  messages: Array<{ role?: "human" | "agent"; children: ReactNode }>
  maxHeight?: number
}) {
  return (
    <div
      style={{
        maxHeight,
        overflow: "auto",
        display: "grid",
        gap: 10,
        padding: 14,
      }}
      aria-label="Messages"
    >
      {messages.map((message, index) => (
        <Bubble
          key={index}
          tone={message.role === "human" ? "accent" : "default"}
        >
          {message.children}
        </Bubble>
      ))}
    </div>
  )
}

export function NativeSelect({
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options?: Array<{ value: string; label: string }>
} & XStyleProps) {
  return <Select {...props} options={options} />
}

export function Questionnaire({
  question,
  options,
  value,
  defaultValue,
  onValueChange,
}: {
  question: ReactNode
  options: Array<{ value: string; label: ReactNode; description?: ReactNode }>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [internal, setInternal] = useState(defaultValue ?? "")
  const current = value ?? internal
  return (
    <fieldset className={withClass(sx(standard.select), "nui-questionnaire")}>
      <legend>
        <strong>{question}</strong>
      </legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={withClass(
            sx(
              standard.selectOption,
              current === option.value ? standard.selectOptionActive : null,
            ),
            "nui-question-option",
          )}
          data-state={current === option.value ? "checked" : "unchecked"}
        >
          <span className={sx(ui.controlBox)}>
            <input
              type="radio"
              name="nifra-questionnaire"
              value={option.value}
              checked={current === option.value}
              className={sx(ui.checkboxInput)}
              onChange={() => {
                setInternal(option.value)
                onValueChange?.(option.value)
              }}
            />
            <span
              aria-hidden="true"
              className={sx(
                ui.radioIndicator,
                current === option.value ? ui.radioIndicatorSelected : null,
              )}
            >
              {current === option.value && <span className={sx(ui.radioDot)} />}
            </span>
          </span>
          <span className={sx(standard.itemBody)}>
            <strong>{option.label}</strong>
            {option.description && (
              <span className={sx(standard.muted)}>{option.description}</span>
            )}
          </span>
        </label>
      ))}
    </fieldset>
  )
}

export function Resizable({
  children,
  defaultSplit = 50,
}: {
  children: ReactNode
  defaultSplit?: number
}) {
  const [split, setSplit] = useState(defaultSplit)
  const panes = Array.isArray(children) ? children : [children]
  return (
    <div className={sx(standard.resize)}>
      <div
        className={sx(standard.resizePanes)}
        style={{
          gridTemplateColumns: `minmax(0, ${split}fr) minmax(0, ${100 - split}fr)`,
        }}
      >
        <div className={sx(standard.resizePane)}>{panes[0]}</div>
        <div className={sx(standard.resizePane)}>{panes[1] ?? null}</div>
      </div>
      <label className={sx(standard.resizeLabel)}>
        <span>Split</span>
        <Slider
          aria-label="Split"
          min={25}
          max={75}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
        />
      </label>
    </div>
  )
}

export function Sheet(props: DialogProps) {
  return <Dialog {...props} surface="drawer" />
}

export function Typography({
  as = "p",
  variant = "body",
  children,
  xstyle,
  className,
}: {
  as?: "p" | "h1" | "h2" | "h3" | "span"
  variant?: "display" | "lead" | "body" | "muted"
  children: ReactNode
} & XStyleProps) {
  const Tag = as
  const variantStyle =
    variant === "display"
      ? standard.typeDisplay
      : variant === "lead"
        ? standard.typeLead
        : variant === "muted"
          ? standard.muted
          : null
  return (
    <Tag className={withClass(sx(variantStyle, xstyle), className)}>
      {children}
    </Tag>
  )
}

export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return <Breadcrumbs items={items} />
}

export function InputOTP(props: ComponentProps<typeof OTPInput>) {
  return <OTPInput {...props} />
}

export type { ThemeName }
