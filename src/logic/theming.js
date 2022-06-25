import { Observable, Subject } from 'rxjs'

export const onThemeChange = new Subject(sub => sub.next(getTheme()))

export function getTheme() {
	return (
		localStorage.getItem('theme') ||
		(window.matchMedia('(prefers-color-scheme: light)').matches
			? 'theme-light'
			: 'theme-dark')
	)
}

export function setTheme(newTheme) {
	if (newTheme && newTheme != getTheme()) {
		window.localStorage.setItem('theme', newTheme)
		onThemeChange.next(refreshTheme())
	}
}

export function refreshTheme() {
	const selectedThemeId =
		localStorage.getItem('theme') ||
		(window.matchMedia('(prefers-color-scheme: light)').matches
			? 'theme-light'
			: 'theme-dark')
	document.body.classList.forEach(className => {
		if (className.startsWith('theme-') && className != selectedThemeId)
			document.body.classList.remove(className)
	})
	document.body.classList.add(selectedThemeId)
	return selectedThemeId
}
