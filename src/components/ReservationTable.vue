<template>
	<div>
		<table class="w-full text-left bg-white border border-1 rounded-lg border-slate-200">
			<thead>
				<tr>
					<th class="py-2 px-3">Name</th>
					<th class="py-2 px-3">Reference</th>
					<th class="py-2 px-3">Tables</th>
					<th class="py-2 px-3">Reservation Duration</th>
				</tr>
			</thead>
			<tbody>
				<ReservationTableRow v-for="branch in branches" :key="branch.id" :branch="branch" @select-branch="selectBranch" />
			</tbody>
		</table>
		<dialog
			class="p-5 rounded-lg w-1/2 max-w-2xl"
			ref="editBranchForm"
			@saveBranchSuccess="saveBranchSuccess"
			@close="closeForm"
			@click.self="handleBackdropClick">
			<EditBranchForm :branch="selectedBranch" v-if="selectedBranch" @save-branch-success="saveBranchSuccess" />
		</dialog>
	</div>
</template>
<script>
	import ReservationTableRow from "@/components/ReservationTableRow.vue";
	import EditBranchForm from "./EditBranchForm.vue";

	export default {
		name: "ReservationTable",
		components: {
			ReservationTableRow,
			EditBranchForm
		},
		data() {
			return {
				selectedBranch: null,
			}
		},
		props: {
			branches: {
				type: Array,
				required: true,
			},
		},
		methods: {
			selectBranch(branch) {
				this.selectedBranch = branch;
				this.$refs.editBranchForm.showModal();
			},
			closeForm() {
				this.selectedBranch = null;
				this.$refs.editBranchForm.close();
			},
			handleBackdropClick(event) {
				if (event.target === this.$refs.editBranchForm) {
					this.closeForm();
				}
			},
			saveBranchSuccess(id) {
				this.$emit("update-branch", id);
				this.closeForm();
			},
		},
	};
</script>
