<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let checked: boolean | undefined = undefined
export let disabled: boolean | undefined = undefined
export let label: string | undefined = undefined
</script>

<NifraElement {checked} {disabled} {label} tag="nui-switch" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
