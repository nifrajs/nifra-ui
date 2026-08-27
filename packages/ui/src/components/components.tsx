import type { StyleXStyles } from "@stylexjs/stylex"
import * as stylex from "@stylexjs/stylex"
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type FormHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useId,
  useState,
} from "react"
import { applyTheme, type ThemeName, tokens } from "../tokens/tokens.stylex"

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
    border: `1px solid ${tokens.borderStrong}`,
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
  buttonSmall: { minHeight: 32, paddingInline: 10, fontSize: 13 },
  buttonLarge: { minHeight: 46, paddingInline: 18, fontSize: 15 },
  iconButton: { width: 38, paddingInline: 0 },
  link: {
    color: tokens.accentStrong,
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  card: {
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surface,
    boxShadow: tokens.shadow,
  },
  cardHeader: { padding: 20, borderBottom: `1px solid ${tokens.border}` },
  cardBody: { padding: 20 },
  cardFooter: {
    padding: 16,
    borderTop: `1px solid ${tokens.border}`,
    backgroundColor: tokens.surfaceRaised,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 24,
    borderRadius: 999,
    paddingInline: 9,
    backgroundColor: tokens.surfaceInset,
    color: tokens.textMuted,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
  },
  badgeAccent: {
    backgroundColor: "var(--nui-accent-soft)",
    color: tokens.accentStrong,
  },
  badgeDanger: {
    backgroundColor: "var(--nui-danger-soft)",
    color: tokens.danger,
  },
  field: { display: "grid", gap: 7 },
  label: { color: tokens.text, fontSize: 13, fontWeight: 800 },
  description: { color: tokens.textMuted, fontSize: 13, lineHeight: 1.45 },
  error: { color: tokens.danger, fontSize: 13, lineHeight: 1.45 },
  input: {
    width: "100%",
    minHeight: 40,
    border: `1px solid ${tokens.borderStrong}`,
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
  textarea: {
    width: "100%",
    minHeight: 100,
    resize: "vertical",
    border: `1px solid ${tokens.borderStrong}`,
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
  controlRow: { display: "flex", alignItems: "center", gap: 10 },
  checkbox: { width: 18, height: 18, accentColor: tokens.accent },
  select: {
    appearance: "none",
    width: "100%",
    minHeight: 40,
    border: `1px solid ${tokens.borderStrong}`,
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
  tabsList: {
    display: "flex",
    gap: 4,
    borderBottom: `1px solid ${tokens.border}`,
    overflowX: "auto",
  },
  tab: {
    border: 0,
    borderBottom: "2px solid transparent",
    padding: "10px 12px",
    backgroundColor: "transparent",
    color: tokens.textMuted,
    fontWeight: 800,
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
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.radiusMd,
    overflow: "hidden",
  },
  accordionItem: {
    borderBottom: `1px solid ${tokens.border}`,
    ":last-child": { borderBottom: 0 },
  },
  accordionTrigger: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    border: 0,
    padding: 16,
    backgroundColor: tokens.surface,
    color: tokens.text,
    textAlign: "left",
    fontWeight: 800,
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
    backgroundColor: "rgba(10, 18, 14, 0.58)",
  },
  dialog: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "80vh",
    overflow: "auto",
    border: `1px solid ${tokens.borderStrong}`,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.surface,
    color: tokens.text,
    boxShadow: tokens.shadowStrong,
  },
  dialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: 20,
    borderBottom: `1px solid ${tokens.border}`,
  },
  dialogBody: { padding: 20 },
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: 16,
    borderTop: `1px solid ${tokens.border}`,
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
    border: `1px solid ${tokens.borderStrong}`,
    borderRadius: tokens.radiusMd,
    backgroundColor: tokens.surface,
    boxShadow: tokens.shadowStrong,
  },
  relative: { position: "relative" },
  alert: {
    display: "grid",
    gap: 4,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.radiusMd,
    padding: 14,
    backgroundColor: tokens.surfaceRaised,
  },
  alertDanger: {
    borderColor: "var(--nui-danger-border)",
    backgroundColor: "var(--nui-danger-soft)",
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
    width: "100%",
    overflowX: "auto",
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.radiusMd,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    padding: "11px 14px",
    backgroundColor: tokens.surfaceRaised,
    color: tokens.textMuted,
    textAlign: "left",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 14px",
    borderTop: `1px solid ${tokens.border}`,
    color: tokens.text,
  },
  stat: {
    display: "grid",
    gap: 6,
    padding: 16,
    border: `1px solid ${tokens.border}`,
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
    border: `1px solid ${tokens.border}`,
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
    border: `1px solid ${tokens.border}`,
    borderBottomLeftRadius: tokens.radiusSm,
  },
  prompt: {
    display: "grid",
    gap: 10,
    padding: 12,
    border: `1px solid ${tokens.borderStrong}`,
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
  xstyle,
  className,
  ...props
}: DivProps) {
  return (
    <Inline
      gap={6}
      wrap={false}
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
  xstyle,
  className,
}: {
  children: ReactNode
  tone?: "neutral" | "accent" | "danger"
} & XStyleProps) {
  return (
    <span
      className={withClass(
        sx(
          ui.badge,
          tone === "accent"
            ? ui.badgeAccent
            : tone === "danger"
              ? ui.badgeDanger
              : null,
          xstyle,
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
    >
      {src ? (
        <img src={src} alt={name} width={size} height={size} />
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
        border: `1px solid ${tokens.borderStrong}`,
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
        backgroundColor: "#10201a",
        color: "#bcebd3",
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
    <div className={withClass(sx(ui.field, xstyle), className)}>
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
  return (
    <input
      ref={ref}
      className={withClass(sx(ui.input, xstyle), className)}
      {...props}
    />
  )
})
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & XStyleProps
>(function Textarea({ xstyle, className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={withClass(sx(ui.textarea, xstyle), className)}
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
            border: `1px solid ${tokens.borderStrong}`,
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
export function Checkbox({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  xstyle,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (value: boolean) => void
} & XStyleProps) {
  const [internal, setInternal] = useState(defaultChecked ?? false)
  const value = checked ?? internal
  return (
    <label className={sx(ui.controlRow)}>
      <input
        {...props}
        type="checkbox"
        checked={value}
        className={withClass(sx(ui.checkbox, xstyle), className)}
        onChange={(event) => {
          setInternal(event.target.checked)
          onCheckedChange?.(event.target.checked)
          props.onChange?.(event)
        }}
      />
      {label}
    </label>
  )
}
export function CheckboxGroup({
  options,
  value = [],
  onValueChange,
  name,
}: {
  options: Array<{ value: string; label: string }>
  value?: string[]
  onValueChange?: (value: string[]) => void
  name?: string
}) {
  return (
    <Stack gap={10}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          checked={value.includes(option.value)}
          onCheckedChange={(checked) =>
            onValueChange?.(
              checked
                ? [...value, option.value]
                : value.filter((entry) => entry !== option.value),
            )
          }
        />
      ))}
    </Stack>
  )
}
export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
}: {
  options: Array<{ value: string; label: string }>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
}) {
  const [internal, setInternal] = useState(defaultValue ?? "")
  const current = value ?? internal
  return (
    <Stack gap={10}>
      {options.map((option) => (
        <label key={option.value} className={sx(ui.controlRow)}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={current === option.value}
            onChange={() => {
              setInternal(option.value)
              onValueChange?.(option.value)
            }}
          />
          {option.label}
        </label>
      ))}
    </Stack>
  )
}
export function Switch({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  xstyle,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (value: boolean) => void
} & XStyleProps) {
  const [internal, setInternal] = useState(defaultChecked ?? false)
  const value = checked ?? internal
  return (
    <label className={sx(ui.controlRow)}>
      <input
        {...props}
        type="checkbox"
        role="switch"
        checked={value}
        className={withClass(sx(ui.checkbox, xstyle), className)}
        onChange={(event) => {
          setInternal(event.target.checked)
          onCheckedChange?.(event.target.checked)
          props.onChange?.(event)
        }}
      />
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
    <select className={withClass(sx(ui.select, xstyle), className)} {...rest}>
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
  onValueChange,
  placeholder = "Choose…",
  ...props
}: {
  options: Array<{ value: string; label: string }>
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
} & InputHTMLAttributes<HTMLInputElement> &
  XStyleProps) {
  const [query, setQuery] = useState("")
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <div className={sx(ui.field)}>
      <Input
        {...props}
        value={
          query || options.find((option) => option.value === value)?.label || ""
        }
        placeholder={placeholder}
        role="combobox"
        aria-expanded="true"
        onChange={(event) => setQuery(event.target.value)}
      />
      {query && (
        <div className={sx(ui.popover, ui.relative)} role="listbox">
          {filtered.map((option) => (
            <button
              type="button"
              key={option.value}
              className={sx(ui.button, ui.buttonGhost, ui.buttonSmall)}
              style={{ width: "100%", justifyContent: "flex-start" }}
              onClick={() => {
                onValueChange?.(option.value)
                setQuery("")
              }}
            >
              {option.label}
            </button>
          ))}
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
export function Slider(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return (
    <Input
      type="range"
      {...props}
      xstyle={[{ accentColor: tokens.accent } as never, props.xstyle] as never}
    />
  )
}
export function DatePicker(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return <Input type="date" {...props} />
}
export function Calendar({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <DatePicker
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      aria-label="Choose date"
    />
  )
}
export function TimeField(
  props: InputHTMLAttributes<HTMLInputElement> & XStyleProps,
) {
  return <Input type="time" {...props} />
}
export function OTPInput({
  length = 6,
  value = "",
  onChange,
}: {
  length?: number
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <Inline gap={8} wrap={false}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          inputMode="numeric"
          maxLength={1}
          value={value[index] ?? ""}
          aria-label={`Digit ${index + 1}`}
          xstyle={{ textAlign: "center", paddingInline: 0 } as never}
          onChange={(event) => {
            const next = value.split("")
            next[index] = event.target.value.replace(/\D/g, "").slice(-1)
            onChange?.(next.join(""))
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
  const [internal, setInternal] = useState(
    defaultValue ?? items[0]?.value ?? "",
  )
  const current = value ?? internal
  return (
    <div className={sx(ui.field)}>
      <div role="tablist" className={sx(ui.tabsList)}>
        {items.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={current === item.value}
            key={item.value}
            className={sx(ui.tab, current === item.value ? ui.tabActive : null)}
            onClick={() => {
              setInternal(item.value)
              onValueChange?.(item.value)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
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
    <div className={sx(ui.accordion)}>
      {items.map((item) => (
        <div className={sx(ui.accordionItem)} key={item.value}>
          <button
            type="button"
            className={sx(ui.accordionTrigger)}
            aria-expanded={open === item.value}
            onClick={() => setOpen(open === item.value ? null : item.value)}
          >
            <span>{item.title}</span>
            <span aria-hidden="true">{open === item.value ? "−" : "+"}</span>
          </button>
          {open === item.value && (
            <div className={sx(ui.accordionContent)}>{item.content}</div>
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
    <div className={sx(ui.accordion)}>
      <button
        type="button"
        className={sx(ui.accordionTrigger)}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className={sx(ui.accordionContent)}>{children}</div>}
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
          style={{ justifyContent: "flex-start" }}
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
  const [open, setOpen] = useState(false)
  return (
    <div className={sx(ui.relative)}>
      <Button onClick={() => setOpen(!open)} aria-expanded={open}>
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
}: {
  children: ReactNode
  items: Array<{ label: string; onSelect?: () => void }>
}) {
  return <DropdownMenu label={children} items={items} />
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
      <CardBody>
        <Menu items={[]} />
        {children}
      </CardBody>
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
}: DialogProps) {
  const titleId = useId()
  const [internal, setInternal] = useState(defaultOpen)
  const current = open ?? internal
  const setOpen = (value: boolean) => {
    setInternal(value)
    onOpenChange?.(value)
  }
  useEffect(() => {
    if (!current) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [current])
  return (
    <>
      {trigger && <span onClick={() => setOpen(true)}>{trigger}</span>}
      {current && (
        <div
          className={sx(ui.overlay)}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <section
            className={sx(ui.dialog)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <header className={sx(ui.dialogHeader)}>
              <div className={sx(ui.field)}>
                <h2 id={titleId} style={{ margin: 0, fontSize: 20 }}>
                  {title}
                </h2>
                {description && (
                  <div className={sx(ui.description)}>{description}</div>
                )}
              </div>
              <IconButton
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
  return <Dialog {...props} />
}
export function Drawer(props: DialogProps) {
  return <Dialog {...props} />
}
export function Popover({
  trigger,
  children,
  open: controlled,
  onOpenChange,
}: {
  trigger: ReactNode
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internal, setInternal] = useState(false)
  const open = controlled ?? internal
  const setOpen = (value: boolean) => {
    setInternal(value)
    onOpenChange?.(value)
  }
  return (
    <div className={sx(ui.relative)}>
      <span onClick={() => setOpen(!open)}>{trigger}</span>
      {open && <div className={sx(ui.popover)}>{children}</div>}
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
  return (
    <span title={typeof content === "string" ? content : undefined}>
      {children}
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
  open = true,
  onOpenChange,
}: {
  title: ReactNode
  description?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return open ? (
    <div role="status" className={sx(ui.alert)}>
      <Inline wrap={false} style={{ justifyContent: "space-between" }}>
        <strong>{title}</strong>
        <IconButton
          label="Dismiss"
          tone="ghost"
          size="sm"
          onClick={() => onOpenChange?.(false)}
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
      className={sx(ui.alert, tone === "danger" ? ui.alertDanger : null)}
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
  return (
    <div
      className={sx(ui.field)}
      aria-label={typeof label === "string" ? label : "Progress"}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {label && (
        <Inline wrap={false} style={{ justifyContent: "space-between" }}>
          <span>{label}</span>
          <strong>{value}%</strong>
        </Inline>
      )}
      <div className={sx(ui.progressTrack)}>
        <div
          className={sx(ui.progressBar)}
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
    </div>
  )
}
export function ProgressCircle({ value = 0 }: { value?: number }) {
  return (
    <div
      aria-label={`${value}% complete`}
      role="progressbar"
      style={{
        display: "grid",
        placeItems: "center",
        width: 72,
        height: 72,
        borderRadius: 999,
        background: `conic-gradient(${tokens.accent} ${value}%, ${tokens.surfaceInset} 0)`,
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
        {value}%
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
  return <Progress value={(value / max) * 100} label={label} />
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

export function Table({
  children,
  caption,
}: {
  children: ReactNode
  caption?: string
}) {
  return (
    <div className={sx(ui.tableWrap)}>
      <table className={sx(ui.table)}>
        {caption && (
          <caption
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          >
            {caption}
          </caption>
        )}
        {children}
      </table>
    </div>
  )
}
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
}: {
  data: T[]
  columns: Array<{
    key: keyof T & string
    header: string
    render?: (value: T[keyof T], row: T) => ReactNode
  }>
}) {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th className={sx(ui.th)} key={column.key}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td className={sx(ui.td)} key={column.key}>
                {column.render
                  ? column.render(row[column.key], row)
                  : String(row[column.key] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
export function DataGrid<T extends Record<string, unknown>>(props: {
  data: T[]
  columns: Array<{
    key: keyof T & string
    header: string
    render?: (value: T[keyof T], row: T) => ReactNode
  }>
}) {
  return <DataTable {...props} />
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
    <Grid columns="1fr 1fr">
      <CodeBlock code={before} />
      <CodeBlock code={after} />
    </Grid>
  )
}
export function ResizablePanels({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

export type { ThemeName }
