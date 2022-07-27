import * as pageStyle from './scavenger-hunt.module.scss'
import Layout from '../components/layout'
import { useState, useRef, useEffect } from 'react'
import QrScanner from 'qr-scanner'
import LinkButton from 'components/linkbutton'
import { Link } from 'gatsby'

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
	{
		clue: "You've finished the scavenger hunt! Go to the info tent to claim your prize!",
	},
]

const getIndexFromCode = code => clues.findIndex(clue => clue.code === code)
const getOffsetIndexFromCode = code => getIndexFromCode(code) + 1

let atIndexVar = 0

export default function ScavengerHuntPage() {
	const isBrowser = typeof window !== 'undefined'

	const [atIndex, setAtIndex] = useState(0)
	useEffect(() => {
		atIndexVar = atIndex
		console.log('atIndex', atIndex)
		if (atIndex > 0) localStorage.setItem('sh_code', clues[atIndex - 1].code)
	}, [atIndex])

	const videoElement = useRef(null)
	const qrScanner = useRef(null)
	const [compatible, setCompatible] = useState(false)
	const [scanning, setScanning] = useState(false)
	const [scannerMessage, setScannerMessage] = useState('')
	useEffect(() => {
		if (isBrowser) {
			let tmp = getOffsetIndexFromCode(localStorage.getItem('sh_code'))
			setAtIndex(tmp)
			atIndexVar = tmp // i hate react

			checkCode(new URLSearchParams(window.location.search).get('code'), true) // Code from a scanned URL bringing them here
			window.history.replaceState(null, null, window.location.pathname)
		}

		;(async () => {
			let c = false
			try {
				c = typeof navigator === 'object' && (await QrScanner.hasCamera())
				setCompatible(c)
			} catch (e) {}
			if (!c) return () => {}

			try {
				qrScanner.current = new QrScanner(
					videoElement.current,
					({ data: code }) => {
						// Extract the code from a URL
						try {
							let tempCode = new URLSearchParams(new URL(code).search).get('code')
							if (typeof tempCode === 'string') code = tempCode
						} catch (e) {} // if it fails, it isn't a URL with a code

						checkCode(code)
					},
					{
						preferredCamera: 'environment',
					}
				)
			} catch (e) {
				console.error(e)
				setCompatible(false)
			}
		})()
	}, [])

	useEffect(() => {
		console.log(scannerMessage)

		if (compatible) {
			if (scanning)
				qrScanner.current.start().catch(e => {
					console.error(e)
					setCompatible(false)
				})
			else {
				setScannerMessage('')
				qrScanner.current.stop()
			}
		}
	}, [scanning, compatible])

	function checkCode(code, fromUrl = false) {
		let index = getIndexFromCode(code)
		console.table({ fromUrl, atIndexVar })
		if (typeof code !== 'string' || !code) {
			console.log('doing nothing')
		} else if (index === -1) {
			if (fromUrl) setScanning(true)
			setScannerMessage('Invalid code. Make sure you are scanning scavenger hunt codes.\xa0🙃')
		} else if (index < atIndexVar) {
			if (fromUrl) setScanning(true)
			setScannerMessage("You've already scanned that code\xa0😡")
		} else if (index > atIndexVar) {
			if (fromUrl && atIndexVar > 0) setScanning(true)
			setScannerMessage("This isn't the right code. Keep looking!\xa0😁")
		} else {
			atIndexVar = index + 1
			setAtIndex(index + 1)
			setScanning(false)
		}
		console.table({
			code,
			index: index,
			'current code': clues[atIndexVar].code,
			'current index': atIndexVar,
			'current clue': clues[atIndexVar].clue,
		})
	}

	function Clue({ index }) {
		let winner = index === clues.length - 1
		return (
			<div
				className={`${pageStyle.clueCard} ${index > atIndex ? pageStyle.disabled : ''} ${
					winner ? pageStyle.winner : ''
				}`}
			>
				<h2 className={pageStyle.clueIndexLabel}>
					{winner ? (
						<span
							className="material-icons"
							style={{
								display: 'flex',
								alignItems: 'center',
								fontSize: '1em',
							}}
						>
							star
						</span>
					) : (
						index + 1
					)}
				</h2>
				{index <= atIndex ? (
					<div className={pageStyle.clue}>
						<p>{clues[index].clue}</p>
						{index < atIndex ? (
							<span className={`material-icons ${pageStyle.checkIcon}`}>check</span>
						) : (
							clues[index].code && (
								<LinkButton label="Scan" onClick={_ => setScanning(true)} icon="qr_code_scanner" />
							)
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
							Go to <Link to="/settings">settings</Link> to reset the scavenger hunt.
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
					<video ref={videoElement} /> {/* eslint-disable-line jsx-a11y/media-has-caption */}
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
