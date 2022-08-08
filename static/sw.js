const CACHE_NAME = 'offline-cache-v1'
const PRECACHE = ['/', '/offline']

self.addEventListener('install', function (event) {
	self.skipWaiting()
	console.log('Service worker installing')
	event.waitUntil(
		(async _ => {
			const cache = await caches.open(CACHE_NAME)
			await cache.addAll(PRECACHE)
			console.log('PRECACHE COMPLETE')
		})()
	)
})

function staleWhileEtagRevalidate(event) {
	event.respondWith(
		(async function () {
			const cache = await caches.open(CACHE_NAME)
			const cachedResponse = await cache.match(event.request)
			console.log(cachedResponse)
			if (cachedResponse) {
				const cacheEtag = cachedResponse.headers.get('etag')
				console.log('CACHED: ', cachedResponse.url, cacheEtag)
				event.waitUntil(
					(async _ => {
						const headRequest = await fetch(event.request.url, { method: 'HEAD' })
						const headEtag = headRequest.headers.get('etag')
						console.log('REVALIDATE HEAD CHECK: ', cachedResponse.url, cacheEtag)
						if (headEtag && cacheEtag !== headEtag) {
							console.log('REVALIDATING: ', cachedResponse.url)
							await cache.delete(event.request)
							await cache.add(event.request)
						}
					})()
				)
				return cachedResponse
			} else {
				console.log('CACHE MISS: ', event.request.url)
				let resp
				try {
					resp = await fetch(event.request)
				} catch (e) {
					console.log('FETCH ERROR: ', e)
					return cache.match('/offline')
				}
				event.waitUntil(cache.put(event.request, resp.clone()))
				return resp
			}
		})()
	)
}

function networkFirst(event) {
	event.respondWith(
		(async function () {
			const cache = await caches.open(CACHE_NAME)
			console.log('NETWORKFIRST: ', event.request.url)
			let resp
			try {
				resp = await fetch(event.request)
			} catch (e) {
				console.log('FETCH ERROR: ', e)
				const cachedResponse = await caches.match(event.request)
				if (cachedResponse) {
					return cachedResponse
				} else {
					return cache.match('/offline')
				}
			}
			event.waitUntil(cache.put(event.request, resp.clone()))
			return resp
		})()
	)
}

self.addEventListener('fetch', function (event) {
	if (new URL(event.request.url).hostname === 'graphql.contentful.com') {
		networkFirst(event)
	} else {
		staleWhileEtagRevalidate(event)
	}
})
