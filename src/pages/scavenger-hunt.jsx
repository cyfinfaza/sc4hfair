import React from 'react'
import Layout from '../components/layout'
import { useState } from 'react'
import LinkButton from '../components/linkbutton'
import Html5QrcodeScannerPlugin from '../components/qrScan'

export default function ScavengerHuntPage() {
	return (
		<Layout title="Scavenger Hunt">
			<h1>calum hello</h1>
			<Html5QrcodeScannerPlugin
				fps={10}
				qrBox={250}
				disableFlip={false}
				qrCodeSuccessCallback={console.log}
				qrCodeErrorCallback={console.error}
			/>
		</Layout>
	)
}
