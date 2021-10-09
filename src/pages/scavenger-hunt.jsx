import React from 'react'
import Layout from '../components/layout'
import { useState, useRef, useEffect } from 'react'
import LinkButton from '../components/linkbutton'
import QrScanner from 'qr-scanner'
import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js'
QrScanner.WORKER_PATH = QrScannerWorkerPath

// I'm not going to try and do a fancy thing or whatever to prevent it
// You win, come join the 4H Computers club
// You win, come join the 4H Computers club

export default function ScavengerHuntPage() {
	const videoElement = useRef(null)
	var code = null // Last "good" code
	const [status, setStatus] = useState('')
	const clues = {
		c1: 'Go to 2',
		c2: 'Go to 3',
		c3: 'Go to 4',
		c4: 'Go to 5',
		c5: true,
	}
	const codes = Object.keys(clues)
	const checkCode = result => {
		if (
			typeof result !== 'string' ||
			(typeof result === 'string' && result.length < 1)
		) {
		} else if (!codes.includes(result)) {
			setStatus('Invalid code')
		} else if (codes.indexOf(result) < codes.indexOf(code)) {
			setStatus("You've already scanned that code")
		} else if (codes.indexOf(result) > codes.indexOf(code) + 1) {
			setStatus("This isn't the right code, make sure to follow the clues")
		} else {
			setStatus(clues[result])
			code = result
			localStorage.setItem('scavenger-hunt', code)
		}
		console.table({
			result,
			'result index': codes.indexOf(result),
			code,
			'code index': codes.indexOf(code),
			hint: clues[result],
		})
	}
	useEffect(() => {
		let lastCode = localStorage.getItem('scavenger-hunt')
		if (lastCode) {
			code = lastCode
			setStatus(clues[code])
		} // Load previously scanned code

		checkCode(new URLSearchParams(window.location.search).get('code')) // Code from a scanned URL bringing them here

		const qrScanner = new QrScanner(videoElement.current, result => {
			// Extract the code from a URL
			try {
				let tempCode = new URLSearchParams(new URL(result).search).get('code')
				if (typeof tempCode === 'string') result = tempCode
			} catch (_) {} // If it fails, it isn't a URL with a code

			checkCode(result)
		})
		qrScanner.start()
	}, [])

	return (
		<Layout title="Scavenger Hunt">
			<h1>Scavenger Hunt</h1>
			{typeof navigator === 'object' && QrScanner.hasCamera() ? (
				clues[code] === true ? (
					<div>You win!</div>
				) : (
					<div>
						{status}
						<video ref={videoElement} style={{ width: '100%' }}></video>
					</div>
				)
			) : (
				<p>The scavenger hunt requires a camera.</p>
			)}
		</Layout>
	)
}
