<script lang="ts">
	type Props = {
		text: string;
	};

	const { text }: Props = $props();
</script>

<span> dummy with text: {text} </span>
