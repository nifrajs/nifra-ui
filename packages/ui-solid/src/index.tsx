import {
  createComponent,
  createEffect,
  type JSX,
  onCleanup,
  onMount,
  type ParentProps,
  splitProps,
} from "solid-js"
import { Dynamic } from "solid-js/web"
import "@nifrajs/ui-elements"
import {
  crossFrameworkComponents,
  crossFrameworkComponentTags,
} from "@nifrajs/ui-adapters"
import type {
  DataTableColumn,
  DataTableRow,
  NifraChangeDetail,
  RadioOption,
  TabDefinition,
  TabPanelDefinition,
} from "@nifrajs/ui-elements"

export type {
  DataTableColumn,
  DataTableRow,
  NifraChangeDetail,
  RadioOption,
  TabDefinition,
  TabPanelDefinition,
}

export const adapterTarget = "solid" as const
export const supportedComponents = crossFrameworkComponents

type NativeProps = Omit<JSX.HTMLAttributes<HTMLElement>, "onChange">

export type NifraElementProps = ParentProps &
  NativeProps & {
    as: string
    data?: unknown
    columns?: unknown
    selectedKeys?: Array<string | number>
    items?: TabDefinition[]
    panels?: TabPanelDefinition[]
    options?: unknown
    rowKey?: string
    onChange?: (detail: NifraChangeDetail) => void
    onClose?: (detail: NifraChangeDetail) => void
    onSelectionChange?: (detail: NifraChangeDetail) => void
    onSortChange?: (detail: NifraChangeDetail) => void
  }

function NifraElement(props: NifraElementProps) {
  const [local, rest] = splitProps(props, [
    "as",
    "children",
    "columns",
    "data",
    "items",
    "onChange",
    "onClose",
    "onSelectionChange",
    "onSortChange",
    "panels",
    "options",
    "rowKey",
    "selectedKeys",
  ])
  let element: HTMLElement | undefined

  createEffect(() => {
    if (!element) return
    if (local.data !== undefined) (element as any).data = local.data
    if (local.columns !== undefined) (element as any).columns = local.columns
    if (local.selectedKeys !== undefined)
      (element as any).selectedKeys = local.selectedKeys
    if (local.items !== undefined) (element as any).items = local.items
    if (local.panels !== undefined) (element as any).panels = local.panels
    if (local.options !== undefined) (element as any).options = local.options
  })

  onMount(() => {
    if (!element) return
    const bindings = [
      ["nui-change", local.onChange],
      ["nui-close", local.onClose],
      ["nui-selection-change", local.onSelectionChange],
      ["nui-sort-change", local.onSortChange],
    ] as const
    const listeners: Array<[string, EventListener]> = []
    for (const [eventName, callback] of bindings) {
      if (!callback) continue
      const listener: EventListener = (event) =>
        callback((event as CustomEvent<NifraChangeDetail>).detail)
      element.addEventListener(eventName, listener)
      listeners.push([eventName, listener])
    }
    onCleanup(() => {
      for (const [eventName, listener] of listeners)
        element?.removeEventListener(eventName, listener)
    })
  })

  const elementProps = { ...rest } as Record<string, unknown>
  if (local.rowKey !== undefined) elementProps["row-key"] = local.rowKey

  return Dynamic({
    component: local.as,
    ...elementProps,
    ref: (node: HTMLElement) => {
      element = node
    },
    children: local.children,
  } as any)
}

type ComponentProps = Omit<
  NifraElementProps,
  "as" | "columns" | "data" | "rowKey" | "selectedKeys"
> & {
  checked?: boolean
  density?: "default" | "compact" | string
  disabled?: boolean
  empty?: string
  indeterminate?: boolean
  label?: string
  legend?: string
  loading?: string | boolean
  name?: string
  open?: boolean
  options?: unknown
  placeholder?: string
  readonly?: boolean
  required?: boolean
  responsive?: "scroll" | "stack" | "auto" | string
  rowKey?: string
  selectable?: boolean
  size?: string
  striped?: boolean
  title?: string
  tone?: string
  type?: string
  value?: string
}

export type DataTableProps = ComponentProps & {
  caption?: string
  columns?: DataTableColumn[]
  data?: DataTableRow[]
  density?: "default" | "compact"
  empty?: string
  loading?: string | boolean
  responsive?: "scroll" | "stack" | "auto"
  rowKey?: string
  selectable?: boolean
  selectedKeys?: Array<string | number>
  striped?: boolean
}

export const Button = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Button,
    ...props,
  })
export const Badge = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Badge,
    ...props,
  })
export const Card = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Card,
    ...props,
  })
export const Checkbox = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Checkbox,
    ...props,
  })
export const Input = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Input,
    ...props,
  })
export const RadioGroup = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.RadioGroup,
    ...props,
  })
export const Switch = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Switch,
    ...props,
  })
export const Tabs = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Tabs,
    ...props,
  })
export const Dialog = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Dialog,
    ...props,
  })
export const Table = (props: ComponentProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.Table,
    ...props,
  })
export const DataTable = (props: DataTableProps) =>
  createComponent(NifraElement, {
    as: crossFrameworkComponentTags.DataTable,
    ...props,
  })

export type Tab = TabDefinition
export type TabPanel = TabPanelDefinition

export { NifraElement }
