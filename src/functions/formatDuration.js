// This code is yuck so it is in a function
// It takes a moment.duration() input and formats it into a human readable duration
export default function formatDuration(duration) {
	let formattedDuration = ''
	if (duration._data.years) {
		formattedDuration +=
			duration._data.years +
			' year' +
			(duration._data.years !== 1 ? 's' : '') +
			' '
	}
	if (duration._data.months) {
		formattedDuration +=
			duration._data.months +
			' month' +
			(duration._data.months !== 1 ? 's' : '') +
			' '
	}
	if (duration._data.days) {
		formattedDuration +=
			duration._data.days +
			' day' +
			(duration._data.days !== 1 ? 's' : '') +
			' '
	}
	if (duration._data.hours) {
		formattedDuration +=
			duration._data.hours +
			' hour' +
			(duration._data.hours !== 1 ? 's' : '') +
			' '
	}
	if (duration._data.minutes) {
		formattedDuration +=
			duration._data.minutes +
			' minute' +
			(duration._data.minutes !== 1 ? 's' : '')
	}
	return formattedDuration
}
