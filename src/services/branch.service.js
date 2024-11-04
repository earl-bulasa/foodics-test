import fetchAPI from "@/fetch"

export const getBranchesRequest = () => {
	return fetchAPI("/api/branches", {
		'include[0]': 'sections',
		'include[1]': 'sections.tables',
	});	
}

export const updateBranchRequest = (branchId, data) => {
	return fetchAPI(`/api/branches/${branchId}`, data, "PUT");
}

export const getBranchRequest = (branchId) => {
	return fetchAPI(`/api/branches/${branchId}`, {
		'include[0]': 'sections',
		'include[1]': 'sections.tables',
	});	
}