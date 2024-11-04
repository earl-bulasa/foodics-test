import fetchAPI from "@/fetch";

export const updateTableRequest = (tableId, data) => {
	return fetchAPI(`/api/tables/${tableId}`, data, "PUT");
}