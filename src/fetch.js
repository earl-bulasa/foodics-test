// const API_URL = process.env.VUE_APP_API_BASE_URL;
const BEARER_TOKEN = process.env.VUE_APP_API_BEARER_TOKEN;

async function fetchAPI(path, params, method = "GET") {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Accept", "application/json");
	headers.append("Authorization", `Bearer ${BEARER_TOKEN}`);
	
	let body = null;

	if (["POST", "PUT", "PATCH"].includes(method)) {
		body = JSON.stringify(params);
	} else {
		path += `?${new URLSearchParams(params).toString()}`;
	}
	
	const response = await fetch(`${path}`, {
		method,
		headers,
		body,
	});
	return response.json();
}

export default fetchAPI;
