<script lang="ts">
import { createEventDispatcher, onMount } from "svelte"
import "@nifrajs/ui-elements"
import type {
  NifraChangeDetail,
  TabDefinition,
  TabPanelDefinition,
} from "@nifrajs/ui-elements"

export let tag: string
export let data: unknown = undefined
export let columns: unknown = undefined
export let selectedKeys: Array<string | number> | undefined = undefined
export let items: TabDefinition[] | undefined = undefined
export let panels: TabPanelDefinition[] | undefined = undefined
export let options: unknown = undefined

let element: HTMLElement
const dispatch = createEventDispatcher<{
  change: NifraChangeDetail
  close: NifraChangeDetail
  "selection-change": NifraChangeDetail
  "sort-change": NifraChangeDetail
}>()

function syncProperties() {
  if (!element) return
  if (data !== undefined) (element as any).data = data
  if (columns !== undefined) (element as any).columns = columns
  if (selectedKeys !== undefined) (element as any).selectedKeys = selectedKeys
  if (items !== undefined) (element as any).items = items
  if (panels !== undefined) (element as any).panels = panels
  if (options !== undefined) (element as any).options = options
}

onMount(() => {
  syncProperties()
  const bindings = [
    ["nui-change", "change"],
    ["nui-close", "close"],
    ["nui-selection-change", "selection-change"],
    ["nui-sort-change", "sort-change"],
  ] as const
  const listeners = bindings.map(([eventName, emittedName]) => {
    const listener = (event: Event) =>
      dispatch(emittedName, (event as CustomEvent<NifraChangeDetail>).detail)
    element.addEventListener(eventName, listener)
    return [eventName, listener] as const
  })
  return () => {
    for (const [eventName, listener] of listeners)
      element.removeEventListener(eventName, listener)
  }
})

$: syncProperties()
</script>

<svelte:element this={tag} bind:this={element} {...$$restProps}>
  <slot />
</svelte:element>
