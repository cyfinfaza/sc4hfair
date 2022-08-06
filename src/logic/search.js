/* eslint-disable no-eval */

export function exactSearch(objList, priorityKey, secondaryKeys, query) {
	function prepare(text) {
		return text
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
	}
	query = prepare(query)
	if (query) {
		// search for exact match, returning first objects that match primary key, then secondary key
		return objList
			.filter(obj => {
				return prepare(eval('obj.' + priorityKey)).indexOf(query) !== -1
			})
			.concat(
				objList.filter(obj => {
					return (
						secondaryKeys.some(key => {
							return prepare(eval('obj.' + key)).indexOf(query) !== -1
						}) && prepare(eval('obj.' + priorityKey)).indexOf(query) === -1
					)
				})
			)
	} else {
		return objList
	}
}
