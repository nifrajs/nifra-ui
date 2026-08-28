<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let caption: string | undefined = undefined
export let columns: unknown = undefined
export let data: unknown = undefined
export let density: string | undefined = undefined
export let empty: string | undefined = undefined
export let loading: string | boolean | undefined = undefined
export let responsive: string | undefined = undefined
export let rowKey: string | undefined = undefined
export let selectable: boolean | undefined = undefined
export let selectedKeys: Array<string | number> | undefined = undefined
export let striped: boolean | undefined = undefined
</script>

<NifraElement
  {columns}
  {data}
  {selectedKeys}
  {caption}
  {density}
  {empty}
  {loading}
  {responsive}
  {selectable}
  {striped}
  tag="nui-data-table"
  row-key={rowKey}
  {...$$restProps}
  on:change
  on:close
  on:selection-change
  on:sort-change
>
  <slot />
</NifraElement>
