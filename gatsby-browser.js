/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

import './src/styles/global.css'

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
					'Wow, you found this! You probably looked at the code so..... consider joining the 4H Computers Club!'
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
