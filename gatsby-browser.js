/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import './src/styles/global.css'
import './src/styles/material-icons.css'
import { setTheme } from './src/logic/theming'

if (window.addEventListener) {
	var kkeys = [],
		konami =
			'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,KeyB,KeyA'
	window.addEventListener(
		'keydown',
		function (e) {
			kkeys.push(e.code)

			if (kkeys.toString().indexOf(konami) >= 0) {
				alert(
					'Wow, you found this! You probably looked at the code so..... consider joining the 4-H Computer Club!'
				)
				kkeys = []
			}
		},
		true
	)
}

fetch(`${process.env.GASTBY_PVT_URL || '/api/pvt'}`, {
	method: 'POST',
	body: window.location.href,
	credentials: 'include',
}).then(response =>
	response.text().then(status => {
		console.log('track:', status)
		if (status === 'unconfirmed') {
			fetch(`${process.env.GASTBY_PVT_URL || '/api/pvt'}`, {
				method: 'POST',
				body: window.location.href,
				credentials: 'include',
			})
		}
	})
)

if (
	typeof localStorage.getItem('theme') == 'string' &&
	localStorage.getItem('theme').startsWith('"')
) {
	setTheme(JSON.parse(localStorage.getItem('theme')))
}

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
	if (navigator.serviceWorker.controller) {
		console.log('Active service worker found')
	} else {
		navigator.serviceWorker
			.register('sw.js', {
				scope: './',
			})
			.then(function (reg) {
				console.log('Service worker registered')
			})
	}
}
