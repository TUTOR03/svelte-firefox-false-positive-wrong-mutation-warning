<script lang="ts">
	import Wrapper from '$lib/Wrapper.svelte';
</script>

{#snippet children(props: Record<string, unknown>)}
	<span {...props}>Snippet from App</span>
{/snippet}

<Wrapper {children} />
