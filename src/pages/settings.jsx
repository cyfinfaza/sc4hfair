import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { graphql } from 'gatsby'
// import { StaticImage } from 'gatsby-plugin-image'

import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'
import SignInButtons from '../components/signInButtons'

import CloudInterestManager from '../logic/CloudInterestManager'

// since this is a controlled input, it needs to be outside of the layout to not break when the components refresh
function handleInput(event, form, setForm) {
	let { name, value } = event.target
	setForm({
		...form,
		[name]: value,
	})
}
const LabeledInput = ({
	form: [form, setForm],
	name,
	type = 'text',
	label,
	...props
}) => (
	<tr>
		<td>
			<label htmlFor={name}>{label}</label>
		</td>
		<td>
			<input
				type={type}
				name={name}
				value={form[name]}
				onChange={e => handleInput(e, form, setForm)}
				{...props}
			/>
		</td>
	</tr>
)
function isInfoFormDisabled(a, b) {
	// only check certain properties
	return ['fullName', 'preferredEmail', 'phone', 'graduation'].every(
		key => a[key] === b[key]
	)
	// return JSON.stringify(a) === JSON.stringify(b)
}

export default function SettingsPage({ data }) {
	const [ready, setReady] = useState(false)
	const [session, setSession] = useState(null)
	const im = useRef()
	const [form, setForm] = useState({}) // current form user input
	const [cloudForm, setCloudForm] = useState({}) // supabase form data
	const [showingAdditionalBuildInfo, setShowingAdditionalBuildInfo] = useState(
		false
	)

	useEffect(function () {
		function setFormSession(s) {
			if (!s) return
			setCloudForm(s.user.user_metadata) // load from the cloud on init
			setForm(s.user.user_metadata)
		}
		async function startCIM() {
			im.current = new CloudInterestManager(setSession, _ => {})
			await im.current.init()

			let sess = await im.current.supabase.auth.session()
			if (sess) setFormSession(sess) // try to load on init
			// but if you just signed in then it's weird so wait until it's actually loaded
			im.current.supabase.auth.onAuthStateChange((e, s) => {
				setFormSession(s)
			})

			setReady(true)
		}
		startCIM()
	}, [])

	return (
		<Layout title="Settings">
			<h1>Account</h1>
			{ready && session ? (
				<>
					You are signed in as {session?.user.email}
					<p>
						<LinkButton
							label="Sign out"
							icon="logout"
							onClick={() => im.current.logout()}
						/>
					</p>
					<h2>
						Additional information <small>(optional)</small>
					</h2>
					<table style={{ width: '100%', margin: '1rem 0' }}>
						<tbody>
							<LabeledInput
								form={[form, setForm]}
								name="fullName"
								label="Full name"
							/>
							<LabeledInput
								form={[form, setForm]}
								name="preferredEmail"
								label="Preferred email"
								type="email"
							/>
							<LabeledInput
								form={[form, setForm]}
								name="phone"
								label="Phone number"
								type="tel"
							/>
							<LabeledInput
								form={[form, setForm]}
								name="graduation"
								label="Graduation year"
								type="number"
								min="1900"
								max="2099"
								step="1"
							/>
						</tbody>
					</table>
					<LinkButton
						label="Save"
						icon="save"
						onClick={() => {
							im.current.supabase.auth.update({ data: form })
							setCloudForm(form)
						}}
						disabled={isInfoFormDisabled(form, cloudForm)}
						alert={!isInfoFormDisabled(form, cloudForm)}
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
			<a href="https://4hcomputers.club">Somerset County 4-H Computer Club</a>.
			<p>
				<LinkButton label="Send feedback" linksTo="/feedback" icon="message" />{' '}
				<LinkButton
					label="Privacy Policy"
					linksTo="/privacy-policy"
					icon="policy"
				/>
			</p>
			<div style={{ opacity: 0.5 }}>
				<code onClick={_ => setShowingAdditionalBuildInfo(true)}>
					{process.env.GATSBY_VERCEL_GIT_COMMIT_REF || data.gitBranch.name}/
					{data.gitBranch.commit}
				</code>
				{showingAdditionalBuildInfo && (
					<>
						<br />
						<code>{data.siteBuildMetadata.buildTime}</code>
						<br />
						<code>
							{process.env.BUILD_LOCATION_NAME ||
								data.site.siteMetadata.buildLocation}
						</code>
					</>
				)}
			</div>
			{/* <div className="horizPanel" style={{ marginTop: '16px' }}>
				<ThemePicker />
				<LinkButton
					label="Request notification"
					icon="notifications"
					onClick={requestNoti}
				/>
				<LinkButton
					label="Subscribe"
					icon="subscriptions"
					onClick={subscribeUser}
				/>
				<LinkButton
					label="Test notification"
					icon="notifications_active"
					onClick={testNotification}
				/>
			</div> */}
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

// eslint-disable-next-line no-unused-vars
function requestNoti() {
	Notification.requestPermission(function (status) {
		console.log('Notification permission status:', status)
	})
}
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
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
