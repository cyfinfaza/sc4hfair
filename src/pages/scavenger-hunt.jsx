import React from 'react'
import * as pageStyle from './scavenger-hunt.module.css'
import Layout from '../components/layout'
import { useState, useRef, useEffect } from 'react'
import QrScanner from 'qr-scanner'
import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js'
QrScanner.WORKER_PATH = QrScannerWorkerPath

// If you look at the source code to cheat and get to the end, then congrats
// I'm not going to try and do a fancy thing or whatever to prevent it
// You win, come join the 4H Computers club

const clues = {
	initial: 'Go to 1',
	c1: 'Go to 2',
	c2: 'Go to 3',
	c3: 'Go to 4',
	c4: 'Go to 5',
	c5: true,
}
const codes = Object.keys(clues)

export default function ScavengerHuntPage() {
	const videoElement = useRef(null)
	const [currentCodeState, setCurrentCodeState] = useState(
		(typeof window !== 'undefined' && localStorage.getItem('scavenger-hunt')) || 'initial'
	)
	var currentCode = currentCodeState
	const [status, setStatus] = useState('')
	const [clue, setClue] = useState(clues[currentCode])
	function checkCode(result) {
		if (
			typeof result !== 'string' ||
			(typeof result === 'string' && result.length < 1)
		) {
		} else if (!codes.includes(result)) {
			setStatus('Invalid code')
		} else if (codes.indexOf(result) < codes.indexOf(currentCode)) {
			setStatus("You've already scanned that code")
		} else if (codes.indexOf(result) > codes.indexOf(currentCode) + 1) {
			setStatus("This isn't the right code, make sure to follow the clues")
		} else {
			setStatus('')
			setCurrentCodeState(result)
			currentCode = result
			localStorage.setItem('scavenger-hunt', result)
		}
		console.table({
			result,
			'result index': codes.indexOf(result),
			currentCode,
			'code index': codes.indexOf(currentCode),
			hint: clues[result],
		})
	}
	useEffect(() => {
		let lastCode = localStorage.getItem('scavenger-hunt')
		if (lastCode) {
			setCurrentCodeState(lastCode)
			currentCode = lastCode
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
	useEffect(() => {
		setClue(clues[currentCodeState])
		currentCode = currentCodeState
	}, [currentCodeState])
	const compatible = typeof navigator === 'object' && QrScanner.hasCamera()
	return (
		<Layout
			title="Scavenger Hunt"
			noPadding
			noHeaderPadding
			fixedHeightContent
			fullWidth
		>
			{compatible ? (
				<div className={pageStyle.container}>
					<video ref={videoElement} className={pageStyle.video} />
					<h1>Scavenger Hunt</h1>
					<div className={pageStyle.clue}>
						{clues[currentCode] === true ? 'You won!' : clue}
					</div>
					<div className={pageStyle.status}>{status}</div>
				</div>
			) : (
				<p>The scavenger hunt requires a camera.</p>
			)}
		</Layout>
	)
}
