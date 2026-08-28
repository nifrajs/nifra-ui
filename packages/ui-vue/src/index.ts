import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  onUpdated,
  type PropType,
  ref,
} from "vue"
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

export const adapterTarget = "vue" as const
export const supportedComponents = crossFrameworkComponents

type PropSpec = {
  attribute?: string
  property?: string
}

type PropSpecs = Record<string, PropSpec>

const anyProp = { type: null as unknown as PropType<unknown> }

const eventPairs = [
  ["nui-change", "change"],
  ["nui-close", "close"],
  ["nui-selection-change", "selection-change"],
  ["nui-sort-change", "sort-change"],
] as const

function createNifraComponent<const T extends PropSpecs>(
  name: string,
  tag: string,
  specs: T,
) {
  const entries = Object.entries(specs) as Array<[keyof T & string, PropSpec]>
  return defineComponent({
    name,
    inheritAttrs: false,
    props: Object.fromEntries(entries.map(([key]) => [key, anyProp])) as Record<
      keyof T & string,
      typeof anyProp
    >,
    emits: eventPairs.map(([, emittedName]) => emittedName),
    setup(props, { attrs, emit, slots }) {
      const element = ref<HTMLElement | null>(null)
      const listeners = new Map<string, EventListener>()
      const currentProps = props as Record<string, unknown>

      const syncProperties = () => {
        if (!element.value) return
        for (const [key, spec] of entries) {
          const property = spec.property
          if (!property) continue
          const value = currentProps[key]
          if (value !== undefined) Reflect.set(element.value, property, value)
        }
      }

      onMounted(() => {
        syncProperties()
        for (const [eventName, emittedName] of eventPairs) {
          const listener: EventListener = (event) => {
            emit(emittedName, (event as CustomEvent<NifraChangeDetail>).detail)
          }
          element.value?.addEventListener(eventName, listener)
          listeners.set(eventName, listener)
        }
      })

      onUpdated(syncProperties)

      onUnmounted(() => {
        for (const [eventName, listener] of listeners) {
          element.value?.removeEventListener(eventName, listener)
        }
        listeners.clear()
      })

      return () => {
        const elementProps = { ...attrs } as Record<string, unknown>
        for (const [key, spec] of entries) {
          if (spec.property) continue
          const value = currentProps[key]
          if (value === undefined) continue
          const attribute = spec.attribute ?? key
          if (typeof value === "boolean") {
            if (value) elementProps[attribute] = ""
            else delete elementProps[attribute]
          } else {
            elementProps[attribute] = value
          }
        }
        return h(tag, { ...elementProps, ref: element }, slots.default?.())
      }
    },
  })
}

const buttonSpecs = {
  disabled: {},
  size: {},
  tone: {},
  type: {},
} as const

const inputSpecs = {
  disabled: {},
  name: {},
  placeholder: {},
  readonly: {},
  required: {},
  type: {},
  value: {},
} as const

const checkboxSpecs = {
  checked: {},
  disabled: {},
  indeterminate: {},
  label: {},
} as const

const switchSpecs = {
  checked: {},
  disabled: {},
  label: {},
} as const

const radioGroupSpecs = {
  disabled: {},
  legend: {},
  name: {},
  options: { property: "options" },
  value: {},
} as const

const tabsSpecs = {
  items: { property: "items" },
  panels: { property: "panels" },
  value: {},
} as const

const dialogSpecs = { open: {}, title: {} } as const

const tableSpecs = { density: {}, striped: {} } as const

const dataTableSpecs = {
  caption: {},
  columns: { property: "columns" },
  data: { property: "data" },
  density: {},
  empty: {},
  loading: {},
  responsive: {},
  rowKey: { attribute: "row-key" },
  selectable: {},
  selectedKeys: { property: "selectedKeys" },
  striped: {},
} as const

export const Button = createNifraComponent(
  "NifraButton",
  crossFrameworkComponentTags.Button,
  buttonSpecs,
)
export const Badge = createNifraComponent(
  "NifraBadge",
  crossFrameworkComponentTags.Badge,
  { size: {}, tone: {} },
)
export const Card = createNifraComponent(
  "NifraCard",
  crossFrameworkComponentTags.Card,
  {},
)
export const Checkbox = createNifraComponent(
  "NifraCheckbox",
  crossFrameworkComponentTags.Checkbox,
  checkboxSpecs,
)
export const Input = createNifraComponent(
  "NifraInput",
  crossFrameworkComponentTags.Input,
  inputSpecs,
)
export const RadioGroup = createNifraComponent(
  "NifraRadioGroup",
  crossFrameworkComponentTags.RadioGroup,
  radioGroupSpecs,
)
export const Switch = createNifraComponent(
  "NifraSwitch",
  crossFrameworkComponentTags.Switch,
  switchSpecs,
)
export const Tabs = createNifraComponent(
  "NifraTabs",
  crossFrameworkComponentTags.Tabs,
  tabsSpecs,
)
export const Dialog = createNifraComponent(
  "NifraDialog",
  crossFrameworkComponentTags.Dialog,
  dialogSpecs,
)
export const Table = createNifraComponent(
  "NifraTable",
  crossFrameworkComponentTags.Table,
  tableSpecs,
)
export const DataTable = createNifraComponent(
  "NifraDataTable",
  crossFrameworkComponentTags.DataTable,
  dataTableSpecs,
)

export type DataTableProps = {
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

export type RadioGroupProps = {
  disabled?: boolean
  legend?: string
  name?: string
  options?: RadioOption[]
  value?: string
}

export type TabsProps = {
  items?: TabDefinition[]
  panels?: TabPanelDefinition[]
  value?: string
}

export type Tab = TabDefinition
export type TabPanel = TabPanelDefinition
