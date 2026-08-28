<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let disabled: boolean | undefined = undefined
export let name: string | undefined = undefined
export let placeholder: string | undefined = undefined
export let readonly: boolean | undefined = undefined
export let required: boolean | undefined = undefined
export let type: string | undefined = undefined
export let value: string | undefined = undefined
</script>

<NifraElement {disabled} {name} {placeholder} {readonly} {required} {type} {value} tag="nui-input" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
