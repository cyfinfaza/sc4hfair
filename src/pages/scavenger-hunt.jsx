import React from 'react'
import Layout from '../components/layout'
import { useState, useRef, useEffect } from 'react'
import LinkButton from '../components/linkbutton'
import QrScanner from 'qr-scanner'
import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js'
QrScanner.WORKER_PATH = QrScannerWorkerPath

export default function ScavengerHuntPage() {
	const videoElement = useRef(null)
	const [output, setOutput] = useState(null)
	useEffect(() => {
		const qrScanner = new QrScanner(videoElement.current, result =>
			setOutput(result)
		)
		qrScanner.start()
	}, [])

	return (
		<Layout title="Scavenger Hunt">
			<h1>Scavenger Hunt</h1>
			<div>{output}</div>
			<video ref={videoElement} style={{ width: '100%' }}></video>
		</Layout>
	)
}
