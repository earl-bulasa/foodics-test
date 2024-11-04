<template>
	<tr class="cursor-pointer" @click="selectBranch">
		<td class="py-2 px-3">{{ branch.name }}</td>
		<td class="py-2 px-3">{{ branch.reference }}</td>
		<td class="py-2 px-3">{{ tables }}</td>
		<td class="py-2 px-3">{{ branch.reservation_duration }} Minutes</td>
	</tr>
</template>

<script>
	export default {
		name: "ReservationTableRow",
		props: {
			branch: {
				type: Object,
				required: true,
			},
		},
		computed: {
			tables() {
				return this.branch.sections.reduce((acc, section) => {
					return acc + section.tables.reduce((acc, table) => {
						return acc + table.accepts_reservations;
					}, 0);
				}, 0);
			},
		},
		methods: {
			selectBranch() {
				this.$emit("select-branch", this.branch);
			},
		},
	};
</script>
