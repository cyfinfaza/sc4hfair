self.addEventListener('push', function (e) {
	var options = {
		body: 'This notification was generated from a push!',
		vibrate: [100, 50, 100],
	}
	e.waitUntil(self.registration.showNotification('Fair Update', options))
})
