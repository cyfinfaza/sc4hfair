import Fuse from 'fuse.js'

export async function search(dataset, keys, input) {
	const fuse = new Fuse(dataset, {
		keys: keys,
		ignoreLocation: true,
	})
	return fuse.search(input)
}
