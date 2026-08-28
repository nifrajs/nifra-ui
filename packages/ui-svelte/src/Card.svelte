<script lang="ts">
import NifraElement from "./NifraElement.svelte"
</script>

<NifraElement tag="nui-card" {...$$restProps} on:change on:close on:selection-change on:sort-change>
  <slot />
</NifraElement>
