<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let density: string | undefined = undefined
export let striped: boolean | undefined = undefined
</script>

<NifraElement {density} {striped} tag="nui-table" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
