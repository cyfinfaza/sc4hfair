import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
// import { StaticImage } from 'gatsby-plugin-image'

import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'
import SignInButtons from '../components/signInButtons'

import CloudInterestManager from '../logic/CloudInterestManager'

function requestNoti() {
	Notification.requestPermission(function (status) {
		console.log('Notification permission status:', status)
	})
}
function testNotification() {
	// var options = {
	// 	body: 'This is a test notification',
	// 	icon: 'images/cy2.png',
	// 	vibrate: [100, 50, 100, 50, 100],
	// 	data: {
	// 		dateOfArrival: Date.now(),
	// 		primaryKey: '2',
	// 	},
	// 	actions: [
	// 		{
	// 			action: 'explore',
	// 			title: 'Explore this new world',
	// 			icon: 'images/sc1.jpg',
	// 		},
	// 		{
	// 			action: 'close',
	// 			title: 'Close',
	// 			icon: 'images/sc2.jpg',
	// 		},
	// 	],
	// }
	console.log('sending test notif')
	// self.registration.showNotification('Hello world!', options)
	// Notification.showNotification('Hello world!', options)
	// navigator.serviceWorker.getRegistration().then(function(reg) {
	// 	reg.showNotification('Hello world!', options);
	// });
	// navigator.serviceWorker.ready.then(registration => {
	// 	registration.showNotification('Vibration Sample', {
	// 		body: 'Buzz! Buzz!',
	// 		tag: 'vibration-sample'
	// 	});
	// });
	// new Notification('Hello world!', options)
	var img = '/to-do-notifications/img/icon-128.png'
	var text = 'HEY! Your task is now overdue.'
	new Notification('To do list', { body: text, icon: img })
}
function subscribeUser() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(function (reg) {
			console.log(
				'CURR SUB INFO: ',
				JSON.stringify(reg.pushManager.getSubscription())
			)
			reg.pushManager
				.subscribe({
					userVisibleOnly: true,
					applicationServerKey:
						'BPdGHyMpEwouUwnrZK2i3ldPR7XnVX1fbOnHQS8u8oG64RtnVvC7pvDRSdED0QNZ0VH46qNAEHasuej1-X4R_Mw',
				})
				.then(function (sub) {
					console.log('SUB INFO: ', JSON.stringify(sub))
					// document.getElementById('readout').innerHTML = JSON.stringify(sub)
				})
				.catch(function (e) {
					if (Notification.permission === 'denied') {
						console.warn('Permission for notifications was denied')
					} else {
						console.error('Unable to subscribe to push', e)
					}
				})
		})
	}
}

export default function SettingsPage({ data }) {
	const [ready, setReady] = useState(false)
	const [session, setSession] = useState(null) // eslint-disable-line no-unused-vars
	const im = useRef()
	const [form, setForm] = useState({})

	useEffect(function () {
		async function startCIM() {
			im.current = new CloudInterestManager(setSession, _ => {})
			await im.current.init()
			setReady(true) // make the ui refresh or something idk it makes it work
		}
		startCIM()
	}, [])

	function handleInput(event) {
		let { name, value } = event.target
		setForm({
			...form,
			[name]: value,
		})
		console.log(form)
	}
	const LabeledInput = ({ name, type = 'text', label, ...props }) => (
		<tr>
			<td>
				<label htmlFor={name}>{label}</label>
			</td>
			<td>
				<input
					type={type}
					name={name}
					value={form[name]}
					onChange={handleInput}
					{...props}
				/>
			</td>
		</tr>
	)

	return (
		<Layout title="Settings">
			{/* <div className="horizPanel" style={{ marginTop: '16px' }}>
				<ThemePicker />
				<LinkButton
					label="Request notification"
					icon="notifications"
					onClick={requestNoti}
					inline
					opaque
				/>
				<LinkButton
					label="Subscribe"
					icon="subscriptions"
					onClick={subscribeUser}
					inline
					opaque
				/>
				<LinkButton
					label="Test notification"
					icon="notifications_active"
					onClick={testNotification}
					inline
					opaque
				/>
			</div> */}
			<h1>Account</h1>
			{ready && session ? (
				<>
					You are signed in as {session?.user.email}
					<p>
						<LinkButton
							label="Sign out"
							icon="logout"
							onClick={() => im.current.logout()}
							inline
							opaque
						/>
					</p>
					<h2>
						Additional information <small>(optional)</small>
					</h2>
					<table style={{ width: '100%', margin: '1rem 0' }}>
						<LabeledInput name="name" label="Full name" />
						<LabeledInput name="email" label="Preferred email" type="email" />
						<LabeledInput name="phone" label="Phone number" type="tel" />
						<LabeledInput
							name="graduation"
							label="Graduation year"
							type="number"
							min="1900"
							max="2099"
							step="1"
						/>
					</table>
					<LinkButton
						label="Save"
						icon="save"
						onClick={() => im.current.supabase.auth.update({ data: form })}
						inline
						opaque
					/>
				</>
			) : (
				<>
					You are not signed in.
					<SignInButtons im={im.current} redirect="/settings" />
				</>
			)}
			<h1>About</h1>
			This app was created by the{' '}
			<a href="https://4hcomputers.club">Somerset County 4H Computers Club</a>.
			<p>
				<LinkButton
					label="Send feedback"
					linksTo="/feedback"
					icon="message"
					inline
					opaque
				/>
			</p>
			<p>
				<Link to="/privacy-policy">Privacy Policy</Link>
			</p>
			<div style={{ opacity: 0.5 }}>
				<h2>Build info</h2>
				Commit: <code>{data.gitBranch.commit}</code>
				<br />
				Branch: <code>{data.gitBranch.name}</code>
				<br />
				Built at: <code>{data.siteBuildMetadata.buildTime}</code>
				<br />
				Build location:{' '}
				<code>
					{process.env.BUILD_LOCATION_NAME ||
						data.site.siteMetadata.buildLocation}
				</code>
			</div>
		</Layout>
	)
}
export const query = graphql`
	query MyQuery {
		# gitCommit {
		# 	hash
		# }
		site {
			siteMetadata {
				buildLocation
			}
		}
		siteBuildMetadata {
			buildTime
		}
		gitBranch(current: { eq: true }) {
			name
			commit
		}
	}
`
