<script lang="ts">
import type { TabDefinition, TabPanelDefinition } from "@nifrajs/ui-elements"
import NifraElement from "./NifraElement.svelte"
export let items: TabDefinition[] | undefined = undefined
export let panels: TabPanelDefinition[] | undefined = undefined
export let value: string | undefined = undefined
</script>

<NifraElement
  {items}
  {panels}
  {value}
  tag="nui-tabs"
  {...$$restProps}
  on:change
  on:close
  on:selection-change
  on:sort-change
>
  <slot />
</NifraElement>
