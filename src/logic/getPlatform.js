export function getPlatform() {
	if (typeof window === 'undefined') return 'other'

	var userAgent = navigator.userAgent || navigator.vendor

	if (/android/i.test(userAgent)) {
		if (/wv|FBAV/.test(userAgent)) return 'android-other'

		return 'android'
	}

	if (/iPad|iPhone|iPod|iOS/.test(userAgent) || navigator.vendor === 'Apple Computer, Inc.') {
		if (/CriOS|FxiOS|EdgiOS|FBIOS/.test(userAgent)) return 'ios-other'

		return 'ios'
	}

	// if (/chrome/i.test(userAgent)) return 'desktop'

	return 'other'
}

export function isStandalone() {
	return (
		typeof window !== 'undefined' &&
		(window.navigator.standalone ||
			['standalone', 'fullscreen', 'minimal-ui'].some(
				mode => window.matchMedia(`(display-mode: ${mode})`).matches
			))
	)
}
