export function exactSearch(objList, priorityKey, secondaryKeys, query) {
	query = query.toLowerCase()
	if (query) {
		// search for exact match, returning first objects that match primary key, then secondary key
		return objList
			.filter(obj => {
				return (
					eval('obj.' + priorityKey)
						.toLowerCase()
						.indexOf(query) !== -1
				)
			})
			.concat(
				objList.filter(obj => {
					return (
						secondaryKeys.some(key => {
							return (
								eval('obj.' + key)
									.toLowerCase()
									.indexOf(query) !== -1
							)
						}) &&
						eval('obj.' + priorityKey)
							.toLowerCase()
							.indexOf(query) === -1
					)
				})
			)
	} else {
		return objList
	}
}
