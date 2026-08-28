type ElementConstructor = new () => HTMLElement

// Keep the module import-safe for SSR/build tools that inspect the package in
// Node. Registration happens only when a browser custom-elements registry
// exists, so importing the package never requires a DOM runtime.
const ElementBase = (
  typeof HTMLElement === "undefined" ? class {} : HTMLElement
) as ElementConstructor

export type NifraChangeDetail = {
  value?: string | boolean | string[]
  checked?: boolean
  selectedKeys?: string[]
  key?: string
  direction?: "asc" | "desc"
}

export type RadioOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export type TabDefinition = { value: string; label: string }
export type TabPanelDefinition = { value: string; content: string }

export type DataTableRow = Record<string, unknown>
export type DataTableColumn = {
  key: string
  header: string
  width?: string
  align?: "left" | "center" | "right"
  sortable?: boolean
  render?: (value: unknown, row: DataTableRow) => Node | string | null
}

function emitChange(target: HTMLElement, detail: NifraChangeDetail) {
  target.dispatchEvent(new CustomEvent("nui-change", { bubbles: true, detail }))
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function boolAttr(element: HTMLElement, name: string) {
  return element.hasAttribute(name) && element.getAttribute(name) !== "false"
}

function setBoolAttr(element: HTMLElement, name: string, value: boolean) {
  if (value) element.setAttribute(name, "")
  else element.removeAttribute(name)
}

function displayValue(value: unknown) {
  if (value === null || value === undefined) return ""
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

abstract class NifraElement extends ElementBase {
  protected mounted = false

  connectedCallback() {
    if (this.mounted) return
    this.mounted = true
    this.mount()
  }

  protected abstract mount(): void
}

export class NifraButton extends NifraElement {
  static observedAttributes = ["disabled", "size", "tone", "type"]
  private control?: HTMLButtonElement

  protected mount() {
    if (typeof document === "undefined") return
    const content = document.createDocumentFragment()
    while (this.firstChild) content.append(this.firstChild)
    const button = document.createElement("button")
    button.className = this.buttonClassName()
    button.type = this.buttonType()
    button.disabled = boolAttr(this, "disabled")
    button.append(content)
    this.replaceChildren(button)
    this.control = button
  }

  attributeChangedCallback(name: string) {
    if (!this.control) return
    if (name === "disabled") this.control.disabled = boolAttr(this, "disabled")
    if (name === "type") this.control.type = this.buttonType()
    if (name === "size" || name === "tone")
      this.control.className = this.buttonClassName()
  }

  private buttonClassName() {
    return [
      "nui-button",
      `nui-button-${this.getAttribute("tone") ?? "neutral"}`,
      `nui-button-${this.getAttribute("size") ?? "md"}`,
    ].join(" ")
  }

  private buttonType(): HTMLButtonElement["type"] {
    const type = this.getAttribute("type")
    return type === "submit" || type === "reset" ? type : "button"
  }
}

export class NifraBadge extends NifraElement {
  static observedAttributes = ["tone", "size"]

  protected mount() {
    this.syncClassName()
  }

  attributeChangedCallback() {
    this.syncClassName()
  }

  private syncClassName() {
    this.className = [
      "nui-badge",
      `nui-badge-${this.getAttribute("tone") ?? "neutral"}`,
      `nui-badge-${this.getAttribute("size") ?? "md"}`,
    ].join(" ")
  }
}

export class NifraCard extends NifraElement {
  protected mount() {
    this.classList.add("nui-card")
  }
}

export class NifraInput extends NifraElement {
  static observedAttributes = [
    "aria-describedby",
    "aria-invalid",
    "aria-label",
    "aria-labelledby",
    "disabled",
    "name",
    "placeholder",
    "readonly",
    "required",
    "type",
    "value",
  ]
  private control?: HTMLInputElement

  protected mount() {
    if (typeof document === "undefined") return
    const input = document.createElement("input")
    input.className = "nui-input-control"
    this.copyInputAttributes(input)
    if (this.hasAttribute("value"))
      input.value = this.getAttribute("value") ?? ""
    input.addEventListener("change", () => {
      emitChange(this, { value: input.value })
    })
    this.replaceChildren(input)
    this.control = input
  }

  attributeChangedCallback(name: string) {
    if (!this.control) return
    if (name === "value") {
      this.control.value = this.getAttribute("value") ?? ""
      return
    }
    this.copyInputAttributes(this.control)
  }

  get value() {
    return this.control?.value ?? this.getAttribute("value") ?? ""
  }

  set value(value: string) {
    if (this.control) this.control.value = value
    else this.setAttribute("value", value)
  }

  focus(options?: FocusOptions) {
    this.control?.focus(options)
  }

  private copyInputAttributes(input: HTMLInputElement) {
    input.disabled = boolAttr(this, "disabled")
    input.readOnly = boolAttr(this, "readonly")
    input.required = boolAttr(this, "required")
    input.type = this.getAttribute("type") ?? "text"
    input.name = this.getAttribute("name") ?? ""
    input.placeholder = this.getAttribute("placeholder") ?? ""
    for (const name of [
      "aria-describedby",
      "aria-invalid",
      "aria-label",
      "aria-labelledby",
    ]) {
      const value = this.getAttribute(name)
      if (value) input.setAttribute(name, value)
      else input.removeAttribute(name)
    }
  }
}

export class NifraCheckbox extends NifraElement {
  static observedAttributes = [
    "aria-describedby",
    "aria-label",
    "aria-labelledby",
    "aria-invalid",
    "checked",
    "disabled",
    "indeterminate",
    "label",
    "name",
    "value",
  ]
  private control?: HTMLInputElement

  protected mount() {
    if (typeof document === "undefined") return
    const label = document.createElement("label")
    label.className = "nui-checkbox"
    const copy = document.createElement("span")
    copy.className = "nui-checkbox-label"
    copy.textContent =
      this.getAttribute("label") ?? this.textContent?.trim() ?? ""

    const input = document.createElement("input")
    input.type = "checkbox"
    input.className = "nui-checkbox-input"
    input.name = this.getAttribute("name") ?? ""
    input.value = this.getAttribute("value") ?? "on"
    this.copyAriaAttributes(input)
    input.addEventListener("change", () => {
      this.checked = input.checked
      this.syncInput(input)
      emitChange(this, { checked: input.checked, value: input.checked })
    })

    const indicator = document.createElement("span")
    indicator.className = "nui-checkbox-indicator"
    indicator.setAttribute("aria-hidden", "true")
    label.append(input, indicator, copy)
    this.replaceChildren(label)
    this.control = input
    this.syncInput(input)
  }

  attributeChangedCallback() {
    if (this.control) this.syncInput(this.control)
  }

  get checked() {
    return this.control?.checked ?? boolAttr(this, "checked")
  }

  set checked(value: boolean) {
    setBoolAttr(this, "checked", value)
    if (this.control) this.syncInput(this.control)
  }

  private syncInput(input: HTMLInputElement) {
    input.checked = boolAttr(this, "checked")
    input.disabled = boolAttr(this, "disabled")
    input.indeterminate = boolAttr(this, "indeterminate")
    this.copyAriaAttributes(input)
    const indicator = this.querySelector(".nui-checkbox-indicator")
    if (indicator) {
      indicator.textContent = input.indeterminate
        ? "−"
        : input.checked
          ? "✓"
          : ""
      indicator.toggleAttribute(
        "data-checked",
        input.checked || input.indeterminate,
      )
    }
    this.toggleAttribute("data-checked", input.checked)
    this.toggleAttribute("data-indeterminate", input.indeterminate)
    const label = this.querySelector<HTMLElement>(".nui-checkbox-label")
    if (label)
      label.textContent = this.getAttribute("label") ?? label.textContent ?? ""
  }

  private copyAriaAttributes(input: HTMLInputElement) {
    input.name = this.getAttribute("name") ?? ""
    input.value = this.getAttribute("value") ?? "on"
    for (const name of [
      "aria-label",
      "aria-describedby",
      "aria-labelledby",
      "aria-invalid",
    ]) {
      const value = this.getAttribute(name)
      if (value) input.setAttribute(name, value)
      else input.removeAttribute(name)
    }
  }
}

export class NifraSwitch extends NifraElement {
  static observedAttributes = ["aria-label", "checked", "disabled", "label"]
  private control?: HTMLButtonElement
  private labelNode?: HTMLSpanElement

  protected mount() {
    if (typeof document === "undefined") return
    const copy = this.getAttribute("label") ?? this.textContent?.trim() ?? ""
    const row = document.createElement("span")
    row.className = "nui-switch-row"
    const button = document.createElement("button")
    button.type = "button"
    button.className = "nui-switch-control"
    button.setAttribute("role", "switch")
    button.addEventListener("click", () => {
      this.checked = !this.checked
      emitChange(this, { checked: this.checked, value: this.checked })
    })
    const thumb = document.createElement("span")
    thumb.className = "nui-switch-thumb"
    thumb.setAttribute("aria-hidden", "true")
    button.append(thumb)
    const label = document.createElement("span")
    label.className = "nui-switch-label"
    label.id = `${this.id || "nui-switch"}-label`
    label.textContent = copy
    row.append(button, label)
    this.replaceChildren(row)
    this.control = button
    this.labelNode = label
    this.syncButton(button)
  }

  attributeChangedCallback() {
    if (this.control) this.syncButton(this.control)
  }

  get checked() {
    return boolAttr(this, "checked")
  }

  set checked(value: boolean) {
    setBoolAttr(this, "checked", value)
    if (this.control) this.syncButton(this.control)
  }

  private syncButton(button: HTMLButtonElement) {
    const checked = this.checked
    button.disabled = boolAttr(this, "disabled")
    button.setAttribute("aria-checked", String(checked))
    const ariaLabel = this.getAttribute("aria-label")
    if (ariaLabel) {
      button.setAttribute("aria-label", ariaLabel)
      button.removeAttribute("aria-labelledby")
    } else if (this.labelNode?.textContent?.trim()) {
      button.setAttribute("aria-labelledby", this.labelNode.id)
      button.removeAttribute("aria-label")
    }
    button.toggleAttribute("data-checked", checked)
    this.toggleAttribute("data-checked", checked)
  }
}

export class NifraRadioGroup extends NifraElement {
  static observedAttributes = [
    "aria-describedby",
    "aria-label",
    "aria-labelledby",
    "aria-invalid",
    "default-value",
    "disabled",
    "legend",
    "name",
    "options",
    "value",
  ]
  private currentValue = ""
  private controls = new Map<string, HTMLInputElement>()
  private optionDisabled = new Map<string, boolean>()
  private optionDefinitions: RadioOption[] = []
  private optionsProvided = false

  get options() {
    return this.optionDefinitions
  }

  set options(value: RadioOption[]) {
    this.optionsProvided = true
    this.optionDefinitions = Array.isArray(value) ? value : []
    if (this.mounted) this.renderGroup()
  }

  protected mount() {
    if (typeof document === "undefined") return
    if (!this.optionsProvided) this.optionDefinitions = this.readOptions()
    this.currentValue = this.getAttribute("value") ?? this.currentValue
    if (!this.currentValue)
      this.currentValue =
        this.getAttribute("default-value") ??
        this.optionDefinitions[0]?.value ??
        ""
    this.renderGroup()
  }

  private readOptions() {
    const childOptions = Array.from(this.children)
      .filter((child) => child.localName === "nui-radio")
      .map((child) => ({
        value: child.getAttribute("value") ?? "",
        label: child.getAttribute("label") ?? child.textContent?.trim() ?? "",
        description: child.getAttribute("description") ?? undefined,
        disabled: boolAttr(child as HTMLElement, "disabled"),
      }))
      .filter((option) => option.value)
    return childOptions.length
      ? childOptions
      : parseJson<RadioOption[]>(this.getAttribute("options"), [])
  }

  private renderGroup() {
    if (typeof document === "undefined") return
    const options = this.optionDefinitions
    this.controls.clear()
    this.optionDisabled.clear()

    const fieldset = document.createElement("fieldset")
    fieldset.className = "nui-radio-group"
    const legendText = this.getAttribute("legend")
    if (legendText) {
      const legend = document.createElement("legend")
      legend.textContent = legendText
      fieldset.append(legend)
    }
    for (const name of [
      "aria-label",
      "aria-describedby",
      "aria-labelledby",
      "aria-invalid",
    ]) {
      const value = this.getAttribute(name)
      if (value) fieldset.setAttribute(name, value)
    }
    const name = this.getAttribute("name") ?? this.id ?? "nui-radio-group"
    for (const option of options) {
      const label = document.createElement("label")
      label.className = "nui-radio-row"
      const input = document.createElement("input")
      input.type = "radio"
      input.name = name
      input.value = option.value
      input.disabled = Boolean(option.disabled) || boolAttr(this, "disabled")
      input.checked = option.value === this.currentValue
      input.addEventListener("change", () => {
        this.currentValue = input.value
        this.syncOptions()
        emitChange(this, { value: this.currentValue })
      })
      const indicator = document.createElement("span")
      indicator.className = "nui-radio-indicator"
      indicator.setAttribute("aria-hidden", "true")
      const copy = document.createElement("span")
      copy.className = "nui-radio-copy"
      const title = document.createElement("strong")
      title.textContent = option.label
      copy.append(title)
      if (option.description) {
        const description = document.createElement("small")
        description.textContent = option.description
        copy.append(description)
      }
      label.append(input, indicator, copy)
      fieldset.append(label)
      this.controls.set(option.value, input)
      this.optionDisabled.set(option.value, Boolean(option.disabled))
    }
    this.replaceChildren(fieldset)
    this.syncOptions()
  }

  attributeChangedCallback(name: string) {
    if (!this.mounted) return
    if (name === "options" && !this.optionsProvided) {
      this.optionDefinitions = this.readOptions()
      this.renderGroup()
      return
    }
    if (name === "value") {
      this.currentValue = this.getAttribute("value") ?? ""
      this.syncOptions()
    }
    if (name === "default-value" && !this.getAttribute("value")) {
      this.currentValue = this.getAttribute("default-value") ?? ""
      this.syncOptions()
    }
    if (name === "disabled") this.syncOptions()
    if (
      name === "aria-describedby" ||
      name === "aria-label" ||
      name === "aria-labelledby" ||
      name === "aria-invalid" ||
      name === "legend" ||
      name === "name"
    )
      this.renderGroup()
  }

  get value() {
    return this.currentValue
  }

  set value(value: string) {
    this.currentValue = value
    this.syncOptions()
  }

  private syncOptions() {
    for (const [value, input] of this.controls) {
      input.checked = value === this.currentValue
      input.disabled =
        Boolean(this.optionDisabled.get(value)) || boolAttr(this, "disabled")
      const row = input.closest(".nui-radio-row")
      row?.toggleAttribute("data-checked", input.checked)
    }
  }
}

export class NifraTabs extends NifraElement {
  static observedAttributes = ["items", "panels", "value"]
  private currentValue = ""
  private buttons = new Map<string, HTMLButtonElement>()
  private panelElements = new Map<string, HTMLElement>()
  private tabDefinitions: TabDefinition[] = []
  private panelDefinitions: TabPanelDefinition[] = []
  private panelContent = new Map<string, Node[]>()
  private itemsProvided = false
  private panelsProvided = false

  get items() {
    return this.tabDefinitions
  }

  set items(value: TabDefinition[]) {
    this.itemsProvided = true
    this.tabDefinitions = Array.isArray(value) ? value : []
    if (this.mounted) this.renderTabs()
  }

  get panels() {
    return this.panelDefinitions
  }

  set panels(value: TabPanelDefinition[]) {
    this.panelsProvided = true
    this.panelDefinitions = Array.isArray(value) ? value : []
    this.panelContent.clear()
    if (this.mounted) this.renderTabs()
  }

  protected mount() {
    if (typeof document === "undefined") return
    const childTabs = Array.from(this.children).filter(
      (child) => child.localName === "nui-tab",
    )
    const childPanels = Array.from(this.children).filter(
      (child) => child.localName === "nui-tab-panel",
    )
    if (!this.itemsProvided) {
      this.tabDefinitions = childTabs.length
        ? childTabs.map((tab, index) => ({
            value: tab.getAttribute("value") ?? `tab-${index + 1}`,
            label: tab.getAttribute("label") ?? tab.textContent?.trim() ?? "",
          }))
        : parseJson<TabDefinition[]>(this.getAttribute("items"), [])
    }
    if (!this.panelsProvided) {
      this.panelDefinitions = childPanels.length
        ? childPanels.map((panel, index) => ({
            value: panel.getAttribute("value") ?? `tab-${index + 1}`,
            content: panel.textContent?.trim() ?? "",
          }))
        : parseJson<TabPanelDefinition[]>(this.getAttribute("panels"), [])
      this.panelContent = new Map(
        childPanels.map((panel, index) => [
          panel.getAttribute("value") ?? `tab-${index + 1}`,
          Array.from(panel.childNodes).map((node) => node.cloneNode(true)),
        ]),
      )
    }
    this.currentValue = this.getAttribute("value") ?? this.currentValue
    if (!this.currentValue)
      this.currentValue = this.tabDefinitions[0]?.value ?? ""
    this.renderTabs()
  }

  private renderTabs() {
    if (typeof document === "undefined") return
    if (!this.tabDefinitions.some((tab) => tab.value === this.currentValue))
      this.currentValue = this.tabDefinitions[0]?.value ?? ""
    this.buttons.clear()
    this.panelElements.clear()

    const root = document.createElement("div")
    root.className = "nui-tabs"
    const tablist = document.createElement("div")
    tablist.className = "nui-tabs-list"
    tablist.setAttribute("role", "tablist")
    this.tabDefinitions.forEach((tab, index) => {
      const value = tab.value || `tab-${index + 1}`
      const button = document.createElement("button")
      button.type = "button"
      button.className = "nui-tab"
      button.id = `${this.id || "nui-tabs"}-${value}-tab`
      button.textContent = tab.label || value
      button.setAttribute("role", "tab")
      button.setAttribute(
        "aria-controls",
        `${this.id || "nui-tabs"}-${value}-panel`,
      )
      button.addEventListener("click", () => this.select(value))
      tablist.append(button)
      this.buttons.set(value, button)
    })
    tablist.addEventListener("keydown", (event) => this.handleTabKey(event))
    root.append(tablist)

    const panelRoot = document.createElement("div")
    panelRoot.className = "nui-tabs-panels"
    this.panelDefinitions.forEach((panel, index) => {
      const value = panel.value || `tab-${index + 1}`
      const panelElement = document.createElement("section")
      panelElement.className = "nui-tab-panel"
      panelElement.id = `${this.id || "nui-tabs"}-${value}-panel`
      panelElement.setAttribute("role", "tabpanel")
      panelElement.setAttribute(
        "aria-labelledby",
        `${this.id || "nui-tabs"}-${value}-tab`,
      )
      const childNodes = this.panelContent.get(value)
      if (childNodes) {
        for (const node of childNodes) panelElement.append(node.cloneNode(true))
      } else {
        panelElement.textContent = panel.content
      }
      panelRoot.append(panelElement)
      this.panelElements.set(value, panelElement)
    })
    root.append(panelRoot)
    this.replaceChildren(root)
    this.syncTabs()
  }

  attributeChangedCallback(name: string) {
    if (!this.mounted) return
    if (name === "items" && !this.itemsProvided) {
      this.tabDefinitions = parseJson<TabDefinition[]>(
        this.getAttribute("items"),
        [],
      )
      this.renderTabs()
    }
    if (name === "panels" && !this.panelsProvided) {
      this.panelDefinitions = parseJson<TabPanelDefinition[]>(
        this.getAttribute("panels"),
        [],
      )
      this.panelContent.clear()
      this.renderTabs()
    }
    if (name === "value") {
      this.currentValue = this.getAttribute("value") ?? ""
      this.syncTabs()
    }
  }

  get value() {
    return this.currentValue
  }

  set value(value: string) {
    if (!this.mounted) this.currentValue = value
    else this.select(value)
  }

  private select(value: string) {
    if (!this.buttons.has(value)) return
    this.currentValue = value
    this.syncTabs()
    emitChange(this, { value })
  }

  private syncTabs() {
    for (const [value, button] of this.buttons) {
      const active = value === this.currentValue
      button.setAttribute("aria-selected", String(active))
      button.tabIndex = active ? 0 : -1
      button.toggleAttribute("data-active", active)
    }
    for (const [value, panel] of this.panelElements) {
      panel.hidden = value !== this.currentValue
    }
  }

  private handleTabKey(event: KeyboardEvent) {
    const buttons = Array.from(this.buttons.values())
    const currentIndex = buttons.indexOf(
      document.activeElement as HTMLButtonElement,
    )
    if (currentIndex < 0) return
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % buttons.length
        : event.key === "ArrowLeft"
          ? (currentIndex - 1 + buttons.length) % buttons.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? buttons.length - 1
              : -1
    if (nextIndex < 0) return
    event.preventDefault()
    buttons[nextIndex]?.focus()
    const nextValue = [...this.buttons.entries()][nextIndex]?.[0]
    if (nextValue) this.select(nextValue)
  }
}

export class NifraDialog extends NifraElement {
  static observedAttributes = ["open"]
  private dialog?: HTMLDialogElement

  protected mount() {
    if (typeof document === "undefined") return
    const content = document.createElement("div")
    content.className = "nui-dialog-content"
    while (this.firstChild) content.append(this.firstChild)
    const dialog = document.createElement("dialog")
    dialog.className = "nui-dialog"
    const title = this.getAttribute("title")
    if (title) {
      const heading = document.createElement("h2")
      heading.textContent = title
      heading.id = `${this.id || "nui-dialog"}-title`
      dialog.setAttribute("aria-labelledby", heading.id)
      dialog.append(heading)
    }
    const close = document.createElement("button")
    close.type = "button"
    close.className = "nui-dialog-close"
    close.setAttribute("aria-label", "Close dialog")
    close.textContent = "×"
    close.addEventListener("click", () => this.close())
    dialog.append(close, content)
    dialog.addEventListener("close", () => {
      this.removeAttribute("open")
      this.dispatchEvent(new CustomEvent("nui-close", { bubbles: true }))
    })
    this.replaceChildren(dialog)
    this.dialog = dialog
    if (boolAttr(this, "open")) this.showModal()
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    value: string | null,
  ) {
    if (name !== "open" || !this.dialog || value === oldValue) return
    if (value === null) this.close()
    else this.showModal()
  }

  showModal() {
    if (!this.dialog) return
    setBoolAttr(this, "open", true)
    if (typeof this.dialog.showModal === "function" && !this.dialog.open)
      this.dialog.showModal()
    else this.dialog.setAttribute("open", "")
  }

  show() {
    this.showModal()
  }

  close() {
    if (!this.dialog) return
    this.removeAttribute("open")
    if (this.dialog.open && typeof this.dialog.close === "function")
      this.dialog.close()
    else this.dialog.removeAttribute("open")
  }
}

export class NifraTable extends NifraElement {
  static observedAttributes = ["density", "striped"]

  protected mount() {
    this.classList.add("nui-table-wrap")
    this.syncTable()
  }

  attributeChangedCallback() {
    this.syncTable()
  }

  private syncTable() {
    const table = this.querySelector("table")
    if (!table) return
    table.classList.add("nui-table")
    table.classList.toggle("nui-table-striped", this.hasAttribute("striped"))
    table.classList.toggle(
      "nui-table-compact",
      this.getAttribute("density") === "compact",
    )
    table.querySelectorAll("thead th").forEach((header) => {
      if (!header.hasAttribute("scope")) header.setAttribute("scope", "col")
    })
  }
}

export class NifraDataTable extends NifraElement {
  static observedAttributes = [
    "caption",
    "columns",
    "data",
    "density",
    "empty",
    "loading",
    "responsive",
    "row-key",
    "selectable",
    "striped",
  ]
  private rows: DataTableRow[] = []
  private columnDefinitions: DataTableColumn[] = []
  private selectedKeySet = new Set<string>()
  private sortKey = ""
  private sortDirection: "asc" | "desc" = "asc"

  protected mount() {
    this.readAttributes()
    this.renderTable()
  }

  attributeChangedCallback() {
    if (!this.mounted) return
    this.readAttributes()
    this.renderTable()
  }

  get data() {
    return this.rows
  }

  set data(value: DataTableRow[]) {
    this.rows = value
    this.renderTable()
  }

  get columns() {
    return this.columnDefinitions
  }

  set columns(value: DataTableColumn[]) {
    this.columnDefinitions = value
    this.renderTable()
  }

  get selectedKeysList() {
    return [...this.selectedKeySet]
  }

  get selectedKeys() {
    return this.selectedKeysList
  }

  set selectedKeys(value: Array<string | number>) {
    this.selectedKeySet = new Set(value.map(String))
    this.renderTable()
  }

  private readAttributes() {
    if (!this.rows.length || this.hasAttribute("data"))
      this.rows = parseJson<DataTableRow[]>(this.getAttribute("data"), [])
    if (!this.columnDefinitions.length || this.hasAttribute("columns"))
      this.columnDefinitions = parseJson<DataTableColumn[]>(
        this.getAttribute("columns"),
        [],
      )
    if (this.columnDefinitions.length === 0 && this.rows[0]) {
      this.columnDefinitions = Object.keys(this.rows[0]).map((key) => ({
        key,
        header: key,
      }))
    }
  }

  private rowKey(row: DataTableRow, index: number) {
    return displayValue(row[this.getAttribute("row-key") ?? "id"] ?? index)
  }

  private orderedRows() {
    const rows = this.rows.map((row, index) => ({ row, index }))
    if (!this.sortKey) return rows
    return rows.sort((left, right) => {
      const a = displayValue(left.row[this.sortKey])
      const b = displayValue(right.row[this.sortKey])
      const comparison = a.localeCompare(b, undefined, { numeric: true })
      return this.sortDirection === "asc" ? comparison : -comparison
    })
  }

  private renderTable() {
    if (typeof document === "undefined") return
    const wrap = document.createElement("div")
    wrap.className = "nui-table-wrap"
    const table = document.createElement("table")
    table.className = [
      "nui-table",
      "nui-data-table",
      this.hasAttribute("selectable") ? "nui-data-table-selectable" : "",
      this.hasAttribute("striped") ? "nui-table-striped" : "",
      this.getAttribute("density") === "compact" ? "nui-table-compact" : "",
    ]
      .filter(Boolean)
      .join(" ")
    table.dataset.responsive = this.getAttribute("responsive") ?? "auto"
    table.style.tableLayout = "fixed"
    table.style.minWidth = "100%"
    table.setAttribute("aria-busy", String(this.hasAttribute("loading")))

    const caption = document.createElement("caption")
    caption.className = "nui-table-caption"
    caption.textContent = this.getAttribute("caption") ?? "Data table"
    table.append(caption)

    const colgroup = document.createElement("colgroup")
    if (this.hasAttribute("selectable")) {
      const col = document.createElement("col")
      col.style.width = "44px"
      colgroup.append(col)
    }
    for (const column of this.columnDefinitions) {
      const col = document.createElement("col")
      if (column.width) col.style.width = column.width
      colgroup.append(col)
    }
    table.append(colgroup)

    const head = document.createElement("thead")
    const headRow = document.createElement("tr")
    if (this.hasAttribute("selectable")) headRow.append(this.selectionHeader())
    for (const column of this.columnDefinitions) {
      const header = document.createElement("th")
      header.scope = "col"
      header.textContent = column.header
      header.style.textAlign = column.align ?? "left"
      if (column.width) header.style.width = column.width
      if (column.sortable) {
        const button = document.createElement("button")
        button.type = "button"
        button.className = "nui-table-sort-button"
        button.setAttribute(
          "aria-label",
          `Sort by ${column.header}${
            this.sortKey === column.key
              ? `, currently ${this.sortDirection === "asc" ? "ascending" : "descending"}`
              : ""
          }`,
        )
        button.textContent = column.header
        const icon = document.createElement("span")
        icon.className = "nui-table-sort-icon"
        icon.setAttribute("aria-hidden", "true")
        icon.textContent =
          this.sortKey === column.key
            ? this.sortDirection === "asc"
              ? "↑"
              : "↓"
            : "↕"
        button.append(icon)
        button.addEventListener("click", () => this.sortBy(column.key))
        header.replaceChildren(button)
        header.setAttribute(
          "aria-sort",
          this.sortKey === column.key
            ? this.sortDirection === "asc"
              ? "ascending"
              : "descending"
            : "none",
        )
      }
      headRow.append(header)
    }
    head.append(headRow)
    table.append(head)

    const body = document.createElement("tbody")
    const span = Math.max(
      this.columnDefinitions.length + (this.hasAttribute("selectable") ? 1 : 0),
      1,
    )
    if (this.hasAttribute("loading")) {
      const row = document.createElement("tr")
      const cell = document.createElement("td")
      cell.className = "nui-table-empty-cell"
      cell.colSpan = span
      cell.textContent = this.getAttribute("loading") || "Loading records…"
      row.append(cell)
      body.append(row)
    } else if (this.orderedRows().length === 0) {
      const row = document.createElement("tr")
      const cell = document.createElement("td")
      cell.className = "nui-table-empty-cell"
      cell.colSpan = span
      cell.textContent = this.getAttribute("empty") ?? "No records to display."
      row.append(cell)
      body.append(row)
    } else {
      for (const { row: dataRow, index } of this.orderedRows()) {
        const key = this.rowKey(dataRow, index)
        const tableRow = document.createElement("tr")
        tableRow.dataset.rowKey = key
        if (this.selectedKeySet.has(key)) tableRow.dataset.state = "selected"
        if (this.hasAttribute("selectable"))
          tableRow.append(this.selectionCell(key))
        for (const column of this.columnDefinitions) {
          const cell = document.createElement("td")
          cell.dataset.label = column.header
          cell.style.textAlign = column.align ?? "left"
          const rendered = column.render?.(dataRow[column.key], dataRow)
          if (rendered instanceof Node) cell.append(rendered)
          else if (rendered !== undefined && rendered !== null)
            cell.textContent = String(rendered)
          else cell.textContent = displayValue(dataRow[column.key])
          tableRow.append(cell)
        }
        body.append(tableRow)
      }
    }
    table.append(body)
    wrap.append(table)
    this.replaceChildren(wrap)
  }

  private selectionHeader() {
    const header = document.createElement("th")
    header.scope = "col"
    header.className = "nui-selection-cell"
    const input = document.createElement("input")
    input.type = "checkbox"
    input.className = "nui-selection-input"
    input.setAttribute("aria-label", "Select all rows")
    const keys = this.rows.map((row, index) => this.rowKey(row, index))
    input.checked =
      keys.length > 0 && keys.every((key) => this.selectedKeySet.has(key))
    input.indeterminate =
      keys.some((key) => this.selectedKeySet.has(key)) && !input.checked
    input.addEventListener("change", () => {
      if (input.checked) keys.forEach((key) => this.selectedKeySet.add(key))
      else keys.forEach((key) => this.selectedKeySet.delete(key))
      this.renderTable()
      this.emitSelection()
    })
    header.append(input)
    return header
  }

  private selectionCell(key: string) {
    const cell = document.createElement("td")
    cell.className = "nui-selection-cell"
    const input = document.createElement("input")
    input.type = "checkbox"
    input.className = "nui-selection-input"
    input.checked = this.selectedKeySet.has(key)
    input.setAttribute("aria-label", `Select row ${key}`)
    input.addEventListener("change", () => {
      if (input.checked) this.selectedKeySet.add(key)
      else this.selectedKeySet.delete(key)
      this.renderTable()
      this.emitSelection()
    })
    cell.append(input)
    return cell
  }

  private emitSelection() {
    this.dispatchEvent(
      new CustomEvent("nui-selection-change", {
        bubbles: true,
        detail: { selectedKeys: this.selectedKeysList },
      }),
    )
  }

  private sortBy(key: string) {
    if (this.sortKey === key)
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    else {
      this.sortKey = key
      this.sortDirection = "asc"
    }
    this.renderTable()
    this.dispatchEvent(
      new CustomEvent("nui-sort-change", {
        bubbles: true,
        detail: { key: this.sortKey, direction: this.sortDirection },
      }),
    )
  }
}

export const elementDefinitions = [
  ["nui-button", NifraButton],
  ["nui-badge", NifraBadge],
  ["nui-card", NifraCard],
  ["nui-input", NifraInput],
  ["nui-checkbox", NifraCheckbox],
  ["nui-switch", NifraSwitch],
  ["nui-radio-group", NifraRadioGroup],
  ["nui-tabs", NifraTabs],
  ["nui-dialog", NifraDialog],
  ["nui-table", NifraTable],
  ["nui-data-table", NifraDataTable],
] as const

export function defineNifraElements(registry?: CustomElementRegistry) {
  const target =
    registry ??
    (typeof customElements === "undefined" ? undefined : customElements)
  if (!target) return
  for (const [name, constructor] of elementDefinitions) {
    if (!target.get(name)) target.define(name, constructor)
  }
}

if (typeof customElements !== "undefined") defineNifraElements()
