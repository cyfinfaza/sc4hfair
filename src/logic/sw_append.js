// self.addEventListener('push', function (e) {
// 	var options = {
// 		body: 'This notification was generated from a push!',
// 		vibrate: [100, 50, 100],
// 	}
// 	e.waitUntil(self.registration.showNotification('Fair Update', options))
// })

class ExpirationStrategy {
	_cacheName
	_maxAgeSeconds

	constructor(options) {
		this._cacheName = workbox.core._private.cacheNames.getRuntimeName(options.cacheName)
		this._maxAgeSeconds = options.maxAgeSeconds
		if (!this._maxAgeSeconds) throw new Error('Missing maxAgeSeconds')

		this._plugins = []
		this._fetchOptions = options.fetchOptions || null
		this._matchOptions = options.matchOptions || null
	}

	async handle({ event, request }) {
		return this.makeRequest({
			event,
			request: request || event.request,
		})
	}

	async _responseIsFresh(cachedResponse) {
		let date
		if (cachedResponse.headers.has('date')) {
			date = cachedResponse.headers.get('date')
		} else {
			// stupid cors
			date = await idbKeyval.get(`${this._cacheName}:${cachedResponse.url}`)
		}
		date = new Date(date).getTime()

		// If the Date header was invalid for some reason, parsedDate.getTime() will return NaN.
		if (isNaN(date)) return false

		// If we have a valid date, then our response is fresh if the date plus maxAgeSeconds is greater than the current time.
		// console.error('now', Date.now(), 'date', date, this._maxAgeSeconds)
		return date >= Date.now() - this._maxAgeSeconds * 1000
	}

	async makeRequest({ event, request }) {
		if (typeof request === 'string') request = new Request(request)

		const cachedResponse = await workbox.core._private.cacheWrapper.match({
			cacheName: this._cacheName,
			request,
			event,
			matchOptions: this._matchOptions,
			plugins: this._plugins,
		})
		// console.error(cachedResponse, 'is fresh', cachedResponse && await this._responseIsFresh(cachedResponse))
		if (cachedResponse && (await this._responseIsFresh(cachedResponse))) {
			console.info(cachedResponse, 'using cached response')
			return cachedResponse // still good to use the cache
		}

		// try to fetch the request and cache it
		try {
			// _getFromNetwork() will handle both the network request and updating the cache.
			const fetchAndCache = await this._getFromNetwork({ request, event })
			console.info(fetchAndCache, 'updated cached version')
			return fetchAndCache
		} catch (e) {
			console.error(cachedResponse, 'failed to update from origin', e)
			return cachedResponse
		}
	}

	async _getFromNetwork({ request, event }) {
		const response = await workbox.core._private.fetchWrapper.fetch({
			request,
			event,
			fetchOptions: this._fetchOptions,
			plugins: this._plugins,
		})
		idbKeyval.set(`${this._cacheName}:${response.url}`, Date.now())

		const cachePutPromise = workbox.core._private.cacheWrapper.put({
			cacheName: this._cacheName,
			request,
			response: response.clone(),
			event,
			plugins: this._plugins,
		})

		if (event) {
			try {
				event.waitUntil(cachePutPromise)
			} catch (e) {}
		}

		return response
	}
}

workbox.routing.registerRoute(
	/^https:\/\/graphql.contentful.com/,
	new ExpirationStrategy({
		cacheName: 'contentful',
		maxAgeSeconds: 60,
	}),
	'GET'
)
