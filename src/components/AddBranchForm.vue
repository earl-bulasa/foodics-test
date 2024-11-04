<template>
	<form @submit.prevent="enableReservation">
		<div class="flex flex-col gap-y-1 mb-2">
			<label for="branch">Select Branch</label>
			<div class="flex gap-x-2 justify-between">
				<select
					id="branch"
					v-model="selectedBranch"
					class="border px-1.5 py-1 w-1/2">
					<option
						v-for="branch in branchOptions"
						:key="branch.value"
						:value="branch.value">
						{{ branch.text }}
					</option>
				</select>
				<button
					type="button"
					class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit"
					@click="addBranch">
					Add Branch
				</button>
			</div>
		</div>
		<div class="flex flex-col gap-y-2">
			<div
				class="flex items-center gap-x-2 justify-between"
				v-for="branch in selectedBranches"
				:key="branch">
				{{ getBranchName(branch) }}
				<button
					type="button"
					@click="removeBranch(branch)"
					class="bg-red-700 text-white rounded-md px-2 py-1 w-fit">
					Remove
				</button>
			</div>
		</div>

		<button
			type="submit"
			class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit">
			Save
		</button>
	</form>
</template>

<script>
	import { updateBranchRequest } from "@/services/branch.service";

	export default {
		data() {
			return {
				selectedBranches: [],
				selectedBranch: null,
			};
		},
		name: "AddBranchForm",
		props: {
			branches: {
				type: Array,
				required: true,
			},
		},
		computed: {
			branchOptions: function () {
				return this.branches
					.filter((branch) => {
						return !this.selectedBranches.includes(branch.id);
					})
					.map((branch) => {
						return {
							value: branch.id,
							text: branch.name,
						};
					});
			},
		},
		methods: {
			addBranch() {
				this.selectedBranches.push(this.selectedBranch);
				this.selectedBranch = null;
			},
			removeBranch(id) {
				this.selectedBranches = this.selectedBranches.filter(
					(branch) => branch !== id
				);
			},
			getBranchName(id) {
				return this.branches.find((branch) => branch.id === id).name;
			},
			enableReservation() {
				Promise.all(
					this.selectedBranches.map((branch) => {
						return updateBranchRequest(branch, {
							accepts_reservations: true,
						});
					})
				).then(() => {
					this.$emit("enable-reservation", {
						branches: this.selectedBranches,
						acceptsReservations: true,
					});
					this.selectedBranches = [];
				});
			},
		},
	};
</script>
