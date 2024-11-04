export const isBetweenTimes = (time, startTime, endTime) => {
	const timeParts = time.split(":");
	const startParts = startTime.split(":");
	const endParts = endTime.split(":");

	const timeInMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
	const startInMinutes =
		parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
	const endInMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

	return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
};


export const isStartBeforeEnd = (startTime, endTime) => {
	const startParts = startTime.split(":");
	const endParts = endTime.split(":");

	const startInMinutes =
		parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
	const endInMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

	return startInMinutes < endInMinutes;
}