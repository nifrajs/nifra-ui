<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let disabled: boolean | undefined = undefined
export let legend: string | undefined = undefined
export let name: string | undefined = undefined
export let options: unknown = undefined
export let value: string | undefined = undefined
</script>

<NifraElement {disabled} {legend} {name} {options} {value} tag="nui-radio-group" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
