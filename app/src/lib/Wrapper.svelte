<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getPropsCreator } from 'dummy-lib';
	type Props = {
		children: Snippet<[Record<string, unknown>]>;
	};

	let { children }: Props = $props();

	const createProps = getPropsCreator();
</script>

{@render children(createProps())}
