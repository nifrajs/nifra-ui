<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let disabled: boolean | undefined = undefined
export let size: string | undefined = undefined
export let tone: string | undefined = undefined
export let type: string | undefined = undefined
</script>

<NifraElement {disabled} {size} {tone} {type} tag="nui-button" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
