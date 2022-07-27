import * as pageStyle from './scavenger-hunt.module.scss'
import Layout from '../components/layout'
import { useState, useRef, useEffect } from 'react'
import QrScanner from 'qr-scanner'
import LinkButton from 'components/linkbutton'

// If you look at the source code to cheat and get to the end, then congrats
// I'm not going to try and do a fancy thing or whatever to prevent it
// You win, come join the 4-H Computers club

const clues = [
	{
		code: 'abcd1234',
		clue: 'This is the initial clue',
	},
	{
		code: 'abcd1235',
		clue: 'This is the second clue',
	},
	{
		code: 'abcd1236',
		clue: 'Where might you go to get some tech help during the fair?',
	},
]

const getIndexFromCode = code => clues.findIndex(clue => clue.code === code)
const getGameIndexFromCode = code => (getIndexFromCode(code) > 0 ? getIndexFromCode(code) : 0)

export default function ScavengerHuntPage() {
	const isBrowser = typeof window !== 'undefined'

	const [atIndex, setAtIndex] = useState(
		(isBrowser && getGameIndexFromCode(localStorage.getItem('sh_code'))) || 0
	)
	useEffect(() => {
		if (atIndex > 0) localStorage.setItem('sh_code', clues[atIndex - 1].code)
	}, [atIndex])

	const videoElement = useRef(null)
	const qrScanner = useRef(null)
	const [compatible, setCompatible] = useState(false)
	const [scanning, setScanning] = useState(false)
	const [scannerMessage, setScannerMessage] = useState('')
	useEffect(async () => {
		let c = false
		try {
			c = typeof navigator === 'object' && (await QrScanner.hasCamera())
			setCompatible(c)
		} catch (e) {}
		if (!c) return () => {}

		try {
			qrScanner.current = new QrScanner(
				videoElement.current,
				result => {
					// Extract the code from a URL
					try {
						let tempCode = new URLSearchParams(new URL(result).search).get('code')
						if (typeof tempCode === 'string') result = tempCode
					} catch (e) {} // if it fails, it isn't a URL with a code

					checkCode(result)
				},
				{
					preferredCamera: 'environment',
				}
			)
		} catch (e) {
			console.error(e)
			setCompatible(false)
		}
	}, [])

	useEffect(() => {
		console.log(scannerMessage)

		if (compatible) {
			if (scanning)
				qrScanner.current.start().catch(e => {
					console.error(e)
					setCompatible(false)
				})
			else qrScanner.current.stop()
		}
	}, [scanning, compatible])

	function checkCode(code, fromUrl = false) {
		let index = getIndexFromCode(code)
		if (typeof code !== 'string' || !code) {
		} else if (index === -1) {
			setScanning(true)
			setScannerMessage('Invalid code. Make sure you are scanning scavenger hunt codes. 🙃')
		} else if (index < atIndex) {
			setScanning(true)
			setScannerMessage("You've already scanned that code 😡")
		} else if (index > atIndex) {
			if (atIndex > 0 && !fromUrl) setScanning(true) // don't pop it up the first time
			setScannerMessage("This isn't the right code. 😞 Keep looking! 😁")
		} else {
			setScanning(false)
			setAtIndex(index)
		}
		console.table({
			code,
			index: index,
			'current code': clues[atIndex].code,
			'current index': atIndex,
			'current clue': clues[atIndex].clue,
		})
	}
	useEffect(() => {
		checkCode(new URLSearchParams(window.location.search).get('code'), true) // Code from a scanned URL bringing them here
	}, [])

	function Clue({ index }) {
		return (
			<div className={pageStyle.clueCard + (index > atIndex ? ' ' + pageStyle.disabled : '')}>
				<h2 className={pageStyle.clueIndexLabel}>{index + 1}</h2>
				{index <= atIndex ? (
					<div className={pageStyle.clue}>
						<p>{clues[index].clue}</p>
						{index < atIndex ? (
							<span className={`material-icons ${pageStyle.checkIcon}`}>check</span>
						) : (
							<LinkButton label="Scan" onClick={_ => setScanning(true)} icon="qr_code_scanner" />
						)}
					</div>
				) : (
					// material icons lock span
					<span className="material-icons">lock</span>
				)}
			</div>
		)
	}
	return (
		<Layout title="Scavenger Hunt">
			<div style={{ textAlign: 'center' }}>
				<h1>Scavenger Hunt</h1>
				{compatible ? (
					<>
						<p>
							Welcome to the 4-H Fair Scavenger Hunt! Each clue will lead you to a QR Code, and when
							you scan it, it will unlock the next clue. The last clue will lead you to your prize!
						</p>
						{/* <div className={pageStyle.clue}>{clues[currentCode] === true ? 'You won!' : clue}</div>
					<div className={pageStyle.status}>{status}</div> */}
						{clues.map((clue, index) => (
							<Clue key={clue.code} index={index} />
						))}
					</>
				) : (
					<p>
						The scavenger hunt requires a camera. Check that you have given the app permission to
						use your camera.
					</p>
				)}
			</div>
			<div className={`${pageStyle.scanner} ${!scanning || !compatible ? pageStyle.hidden : ''}`}>
				<div>
					<video ref={videoElement} />
					<div className={pageStyle.scannerOverlay}>
						<LinkButton
							label="Close"
							icon="close"
							onClick={() => {
								setScanning(false)
							}}
							acrylic
						/>
						<p className={pageStyle.scannerMessage}>{scannerMessage}</p>
					</div>
				</div>
			</div>
		</Layout>
	)
}
