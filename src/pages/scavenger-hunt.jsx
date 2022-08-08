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
		code: '2ykpybp9',
		clue: 'Be PREPared to see shows on the stage, do crafts, and play games in this tent',
		hint: 'The clubs in this tent are aimed at grades K-3.',
	},
	{
		code: '42lxyxg5',
		clue: 'Where would you look for the state animal?',
		hint: 'You wear a saddle when riding it.',
	},
	{
		code: '3h2zun63',
		clue: 'Come & get a combination platter of music & munchies!',
	},
	{
		code: '272xszh4',
		clue: 'Baa! Ram! Ewe! Baa! Ram! Ewe! Looking for wool, then you know what to do!',
		hint: 'Look towards the front post of this tent.',
	},
	{
		code: 'gbw3900j',
		clue: "How's this for a twist? What is the process of turning fiber like wool into yarn?",
	},
	{
		code: 'yxw7ymrc',
		clue: "Where is the talking hands' stage?",
		hint: 'This stage has small shows with small actors. Well, cloth-covered hands.',
	},
	{
		code: 'pyc1nxwm',
		clue: 'This tent shows more than 1 species of animal, which are typically prey animals. They also sent four exhibitors to the Round Robin competition.',
		hint: 'These animals are the opposite of big.',
	},
	{
		code: 'dqw4w9wg',
		clue: 'Which club wrote this app?',
		hint: "It's written in the app settings.",
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

	const [hintsUsed, setHintsUsed] = useState([])
	useEffect(() => {
		if (hintsUsed.length) localStorage.setItem('sh_hints', JSON.stringify(hintsUsed))
	}, [hintsUsed])

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

			let hints = JSON.parse(localStorage.getItem('sh_hints'))
			if (hints && hints.length > 0) setHintsUsed(hints)

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
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// console.log(scannerMessage)

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
		if (!clues[atIndexVar]) return
		console.table({
			code,
			index: index,
			'current code': clues[atIndexVar].code,
			'current index': atIndexVar,
			'current clue': clues[atIndexVar].clue,
		})
	}

	function Clue({ index }) {
		let winner = index === clues.length
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
						{winner ? (
							<p>
								You've finished the scavenger hunt{' '}
								{hintsUsed.length
									? `with ${hintsUsed.length === 1 ? 'only 1 hint' : `${hintsUsed.length} hints`}`
									: 'without any hints'}
								! Now that you're at the 4-H Computers booth, you can claim your prize!
							</p>
						) : (
							<>
								<p>{clues[index].clue}</p>
								{clues[index].hint && hintsUsed.includes(clues[index].code) && (
									<p>
										<strong>Hint:</strong> {clues[index].hint}
									</p>
								)}
								{index < atIndex ? (
									<span className={`material-icons ${pageStyle.checkIcon}`}>check</span>
								) : (
									clues[index].code && (
										<div className="horizPanel">
											{clues[index].hint && !hintsUsed.includes(clues[index].code) && (
												<LinkButton
													label="Hint"
													onClick={_ => setHintsUsed([...hintsUsed, clues[index].code])}
													icon="emoji_objects"
												/>
											)}
											<LinkButton
												label="Scan"
												onClick={_ => setScanning(true)}
												icon="qr_code_scanner"
											/>
										</div>
									)
								)}
							</>
						)}
					</div>
				) : (
					<span className="material-icons">lock</span>
				)}
			</div>
		)
	}
	return (
		<Layout title="Scavenger Hunt">
			<div style={{ textAlign: 'center' }}>
				<h1>Scavenger Hunt</h1>
				<p>
					Welcome to the 4-H Fair Scavenger Hunt! Each clue will lead you to a QR Code, and when you
					scan it, it will unlock the next clue. The last clue will lead you to your prize!
				</p>
				<p>
					If you're stuck on a clue, try looking at the <Link to="/map">fair map</Link>, talking to
					other 4-Hers, or searching for information online. You can get a hint on each clue, but if
					you choose to you won't get a perfect score. Go to <Link to="/settings">settings</Link> to
					reset the scavenger hunt, though only one prize may be claimed per person.
				</p>
				<p>Hints used: {hintsUsed.length}</p>
				{clues.map((clue, index) => (
					<Clue key={clue.code} index={index} />
				))}
				<Clue index={clues.length} /> {/* winner */}
			</div>
			{/* this div needs to always be rendered so the qr library doesn't die */}
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
			{/* copy of scanner box for uncompatible devices */}
			<div
				className={`${pageStyle.scanner} ${pageStyle.fallback} ${
					!scanning || compatible ? pageStyle.hidden : ''
				}`}
			>
				<div className={pageStyle.scannerOverlay}>
					<LinkButton
						label="Close"
						icon="close"
						onClick={() => {
							setScanning(false)
						}}
						acrylic
					/>
					<p className={pageStyle.scannerMessage}>
						{scannerMessage
							? scannerMessage
							: 'The scavenger hunt requires a QR scanner. Check that your browser is allowing the app access to use the built-in one or use an external scanner.'}
					</p>
				</div>
			</div>
		</Layout>
	)
}
