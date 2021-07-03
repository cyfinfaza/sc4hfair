import * as React from 'react'
// import { StaticImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import { graphql, Link } from 'gatsby'
import ThemePicker from '../components/themepicker'
import * as buttonStyle from '../components/button.module.css'
// import { repository } from '../../package.json'

const FancyButton = ({ name, currentName = name, icon, handleClick }) => {
	return (
		<div
			className={`${buttonStyle.fancyButtonContainer} ${buttonStyle.button}`}
			onClick={handleClick}
			onKeyPress={handleClick}
			role="button"
			tabIndex="0"
		>
			<i
				className="material-icons"
				style={{
					cursor: 'pointer',
					userSelect: 'none',
				}}
				key={currentName}
				aria-label={`${currentName}`}
			>
				{icon}
			</i>
			{name}
		</div>
	)
}

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
	//     reg.showNotification('Hello world!', options);
	// });
	// navigator.serviceWorker.ready.then(registration => {
	//     registration.showNotification('Vibration Sample', {
	//         body: 'Buzz! Buzz!',
	//         tag: 'vibration-sample'
	//     });
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
	return (
		<Layout title="Settings">
			<div className="horizPanel" style={{ marginTop: '16px' }}>
				<ThemePicker />
				<FancyButton
					name="Request notification"
					icon="notifications"
					handleClick={requestNoti}
				/>
				<FancyButton
					name="Subscribe"
					icon="subscriptions"
					handleClick={subscribeUser}
				/>
				<FancyButton
					name="Test notification"
					icon="notifications_active"
					handleClick={testNotification}
				/>
			</div>
			<h1>About</h1>
			This app was created by the{' '}
			<a href="https://4hcomputers.club">Somerset County 4H Computers Club</a>.
			You can leave feedback on the app <Link to="/feedback">here</Link>.
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
