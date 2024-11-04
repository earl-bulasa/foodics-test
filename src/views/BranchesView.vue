<template>
	<div class="w-full">
		<PageLayout title="Branches">
			<template v-slot:actions>
				<button
					class="bg-blue-700 text-white rounded-md px-2 py-1"
					@click="disableReservations">
					Disable Reservations
				</button>
			</template>
			<div class="flex flex-col gap-y-2">
				<button
					class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit self-end"
					@click="openForm">
					Add Branch
				</button>
				<ReservationTable :branches="openForReservation" @update-branch="getBranch" />
			</div>
		</PageLayout>
		<dialog
			class="p-5 rounded-lg w-1/2 max-w-96"
			ref="branchForm"
			@close="closeForm"
			@click.self="handleBackdropClick">
			<AddBranchForm
				:branches="closeForReservation"
				@enable-reservation="toggleReservations" />
		</dialog>
	</div>
</template>
<script>
	import ReservationTable from "@/components/ReservationTable.vue";
	import PageLayout from "@/layout/PageLayout.vue";
	import AddBranchForm from "@/components/AddBranchForm.vue";
	import {
		getBranchesRequest,
		getBranchRequest,
		updateBranchRequest,
	} from "@/services/branch.service";

	export default {
		name: "BranchesView",
		components: {
			ReservationTable,
			PageLayout,
			AddBranchForm,
		},
		data() {
			return {
				branches: [],
			};
		},
		computed: {
			openForReservation: function () {
				return this.branches.filter(
					(branch) => branch.accepts_reservations
				);
			},
			closeForReservation: function () {
				return this.branches.filter(
					(branch) => !branch.accepts_reservations
				);
			},
		},
		mounted() {
			this.getBranches();
		},
		methods: {
			toggleReservations(data) {
				this.branches = this.branches.map((branch) => {
					if (data.branches.includes(branch.id)) {
						branch.accepts_reservations = data.acceptsReservations;
					}
					return branch;
				});
				this.closeForm();
			},
			disableReservations() {
				Promise.all(
					this.openForReservation.map((branch) => {
						return updateBranchRequest(branch.id, {
							accepts_reservations: false,
						});
					})
				).then(() => {
					this.toggleReservations({
						branches: this.openForReservation.map(
							(branch) => branch.id
						),
						acceptsReservations: false,
					});
				});
			},
			getBranches() {
				getBranchesRequest().then((res) => {
					this.branches = res.data;
				});
			},
			getBranch(id) {
				getBranchRequest(id).then((res) => {
					this.branches = this.branches.map((branch) => {
						if (branch.id === id) {
							return res.data;
						}
						return branch;
					});
				});
			},
			openForm() {
				this.$refs.branchForm.showModal();
			},
			closeForm() {
				this.$refs.branchForm.close();
			},
			handleBackdropClick(event) {
				if (event.target === this.$refs.branchForm) {
					this.closeForm();
				}
			},
		},
	};
</script>
