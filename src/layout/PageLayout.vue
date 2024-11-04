<template>
	<div>
		<div class="w-full">
			<div class="flex justify-between p-5 bg-white py-2 px-5">
				<h1 class="text-xl">{{ title }}</h1>
				<slot name="actions"></slot>
			</div>
			<div class="p-5 rounded-md">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "PageLayout",
		props: {
			title: {
				type: String,
				required: true,
			},
		},
	};
</script>
