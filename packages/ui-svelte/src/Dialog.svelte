<script lang="ts">
import NifraElement from "./NifraElement.svelte"
export let open: boolean | undefined = undefined
export let title: string | undefined = undefined
</script>

<NifraElement {open} {title} tag="nui-dialog" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
