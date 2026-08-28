<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let size: string | undefined = undefined
export let tone: string | undefined = undefined
</script>

<NifraElement {size} {tone} tag="nui-badge" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
