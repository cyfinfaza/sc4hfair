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
					'wow- you found this! you probably looked at the code so..... consider joining the 4h computers club!'
				)
				kkeys = []
			}
		},
		true
	)
}
