<template>
	<form class="flex flex-col gap-y-2" @submit.prevent="saveBranch">
		<div class="flex justify-between">
			<p>
				Branch working hours: {{ branch.opening_from }}
				{{ branch.opening_to }}
			</p>
			<button
				type="submit"
				class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit">
				Save Branch
			</button>
		</div>
		<div class="flex flex-col gap-y-1 mb-2">
			<label for="reservation-duration"
				>Reservation Duration (Minutes)</label
			>
			<input
				type="number"
				step="1"
				:value="formData.reservation_duration"
				class="border px-1.5 py-1 w-full" />
		</div>
		<div class="flex flex-col gap-y-1 mb-2">
			<label for="branch">Tables</label>
			<div class="flex gap-x-2 justify-between">
				<select
					id="tables"
					v-model="selectedTable"
					class="border px-1.5 py-1 w-1/2">
					<option
						v-for="table in tableOptions"
						:key="table.value"
						:value="table.value">
						{{ table.text }}
					</option>
				</select>
				<button
					type="button"
					class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit"
					@click="addTable">
					Add Table
				</button>
			</div>
		</div>

		<div class="flex flex-col gap-y-2">
			<div
				class="flex items-center gap-x-2 justify-between"
				v-for="table in formData.tables"
				:key="table">
				{{ getTableName(table) }}
				<button
					type="button"
					@click="removeTable(table)"
					class="bg-red-700 text-white rounded-md px-2 py-1 w-fit">
					Remove
				</button>
			</div>
		</div>
		<div class="flex flex-col gap-y-2">
			<div
				class="flex flex-col gap-y-2"
				v-for="(times, day) in formData.reservation_times"
				:key="day">
				<button
					v-if="day === 'saturday'"
					@click="applyToAllDays"
					type="button"
					class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit">
					Apply on all days
				</button>
				<div class="flex gap-x-2 justify-between">
					<label :for="day" class="capitalize font-bold">{{
						day
					}}</label>
					<div class="flex gap-x-2" :id="day">
						<input
							type="time"
							:value="reservationTimeTemp[day].start"
							@input="
								reservationTimeTemp[day].start =
									$event.target.value
							"
							class="border px-1.5 py-1" />
						<input
							type="time"
							:value="reservationTimeTemp[day].end"
							@input="
								reservationTimeTemp[day].end =
									$event.target.value
							"
							class="border px-1.5 py-1" />
						<button
							type="button"
							class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit"
							@click="addTime(day)">
							{{reservationTimeTemp[day].index !== null ? 'Update' : 'Add'}}
						</button>
					</div>
				</div>
				<div
					class="flex items-center gap-x-2 justify-between"
					v-for="(time, i) in times"
					:key="i">
					{{ time[0] }} - {{ time[1] }}
					<div class="flex gap-x-2">
						<button
							type="button"
							@click="selectTime(day, i)"
							class="bg-blue-700 text-white rounded-md px-2 py-1 w-fit">
							Update
						</button>
						<button
							type="button"
							@click="removeTime(day, i)"
							class="bg-red-700 text-white rounded-md px-2 py-1 w-fit">
							Remove
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>

<script>
	import { updateBranchRequest } from "@/services/branch.service";
import { updateTableRequest } from "@/services/table.service";
import { isBetweenTimes, isStartBeforeEnd } from "@/utils/times";

	export default {
		name: "EditBranchForm",
		data() {
			return {
				selectedTable: null,
				reservationTimeTemp: {
					saturday: {
						start: null,
						end: null,
						index: null,
					},
					sunday: {
						start: null,
						end: null,
						index: null,
					},
					monday: {
						start: null,
						end: null,
						index: null,
					},
					tuesday: {
						start: null,
						end: null,
						index: null,
					},
					wednesday: {
						start: null,
						end: null,
						index: null,
					},
					thursday: {
						start: null,
						end: null,
						index: null,
					},
					friday: {
						start: null,
						end: null,
						index: null,
					},
				},
				formData: {
					reservation_duration: null,
					reservation_times: {
						saturday: [],
						sunday: [],
						monday: [],
						tuesday: [],
						wednesday: [],
						thursday: [],
						friday: [],
					},
					tables: [],
				},
			};
		},
		props: {
			branch: {
				type: Object,
				required: true,
			},
		},
		methods: {
			addTable() {
				this.formData.tables.push(this.selectedTable);
				this.selectedTable = null;
			},
			removeTable() {
				this.formData.tables = this.formData.tables.filter(
					(table) => table !== this.selectedTable
				);
			},
			getTableName(id) {
				return this.allTableOptions.find((table) => table.value === id)
					.text;
			},
			addTime(day) {
				console.log({
					start: this.reservationTimeTemp[day].start,
					end: this.reservationTimeTemp[day].end,
					isBeforeEnd: isStartBeforeEnd(
						this.reservationTimeTemp[day].start,
						this.reservationTimeTemp[day].end
					),
					isBetweenStart: isBetweenTimes(
						this.reservationTimeTemp[day].start,
						this.branch.opening_from,
						this.branch.opening_to
					),
					isBetweenEnd: isBetweenTimes(
						this.reservationTimeTemp[day].end,
						this.branch.opening_from,
						this.branch.opening_to
					),
				});
				if (
					this.reservationTimeTemp[day].start &&
					this.reservationTimeTemp[day].end &&
					this.formData.reservation_times[day].length < 3 &&
					isStartBeforeEnd(
						this.reservationTimeTemp[day].start,
						this.reservationTimeTemp[day].end
					) &&
					isBetweenTimes(
						this.reservationTimeTemp[day].start,
						this.branch.opening_from,
						this.branch.opening_to
					) &&
					isBetweenTimes(
						this.reservationTimeTemp[day].end,
						this.branch.opening_from,
						this.branch.opening_to
					)
				) {
					if (this.reservationTimeTemp[day].index !== null) {
						this.formData.reservation_times[day] =
							this.formData.reservation_times[day].map(
								(time, i) => {
									if (
										i ===
										this.reservationTimeTemp[day].index
									) {
										return [
											this.reservationTimeTemp[day].start,
											this.reservationTimeTemp[day].end,
										];
									}

									return time;
								}
							);
					} else {
						this.formData.reservation_times[day].push([
							this.reservationTimeTemp[day].start,
							this.reservationTimeTemp[day].end,
						]);
					}
					this.reservationTimeTemp[day].start = null;
					this.reservationTimeTemp[day].end = null;
					this.reservationTimeTemp[day].index = null;
				}
			},
			removeTime(day, i) {
				this.formData.reservation_times[day].splice(i, 1);
			},
			selectTime(day, i) {
				console.log(this.formData.reservation_times[day], day, i);
				this.reservationTimeTemp[day].start =
					this.formData.reservation_times[day][i][0];
				this.reservationTimeTemp[day].end =
					this.formData.reservation_times[day][i][1];
				this.reservationTimeTemp[day].index = i;
			},
			applyToAllDays() {
				Object.keys(this.formData.reservation_times).forEach((key) => {
					this.formData.reservation_times[key] =
						this.formData.reservation_times.saturday;
				});
			},
			saveBranch() {
				Promise.all(
					[...this.formData.tables.map((table) => {
						return updateTableRequest(table, {
							accepts_reservations: true,
						});
					}), updateBranchRequest(this.branch.id, {
						reservation_duration: this.formData.reservation_duration,
						reservation_times: this.formData.reservation_times,
					})]
				).then(() => {
					this.$emit("save-branch-success", this.branch.id);
				});
			}
		},
		computed: {
			allTableOptions: function () {
				return this.branch.sections
					.map((section) => {
						return section.tables.map((table) => {
							return {
								text: `${section.name} - ${table.name}`,
								value: table.id,
							};
						});
					})
					.flat();
			},
			tableOptions: function () {
				return this.branch.sections
					.map((section) => {
						return section.tables
							.filter((table) => {
								return (
									!table.accepts_reservations &&
									!this.formData.tables.includes(table.id)
								);
							})
							.map((table) => {
								return {
									text: `${section.name} - ${table.name}`,
									value: table.id,
								};
							});
					})
					.flat();
			},
		},
		watch: {
			branch: {
				handler(val) {
					if (val) {
						this.formData.reservation_duration =
							val.reservation_duration;
						this.formData.tables = val.sections
							.map((section) => {
								return section.tables
									.filter(
										(table) => table.accepts_reservations
									)
									.map((table) => table.id);
							})
							.flat();

						Object.keys(this.formData.reservation_times).forEach(
							(key) => {
								this.formData.reservation_times[key] =
									val.reservation_times[key] ?? [];
							}
						);
					} else {
						this.formData.reservation_duration = null;
						this.formData.reservation_times = [];
					}
				},
				immediate: true,
			},
		},
	};
</script>
