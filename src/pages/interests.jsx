import * as React from 'react'
import { graphql } from 'gatsby'
import { useEffect, useState, useRef } from 'react'

import * as clubsStyle from './clubs.module.css'
import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'
import CloudInterestManager from '../logic/CloudInterestManager'
import * as pageStyle from './interests.module.css'

const clubData = require('../../static/clubData.json')

const InterestsPage = ({ data }) => {
	const ClubEntry = ({ club }) => (
		<div className={clubsStyle.clubEntry}>
			<h2>{club.name}</h2>
			<p>{club.description}</p>
			<div className={clubsStyle.actionButtonsPanel}>
				<LinkButton
					label="Remove"
					icon="remove"
					onClick={() => im.current.removeInterest(club.slug)}
					inline
					opaque
				/>
				<LinkButton
					label="View"
					icon="open_in_new"
					linksTo={`/club/${club.slug}`}
					inline
					opaque
				/>
			</div>
		</div>
	)
	const [reqLoginMessage, setReqLoginMessage] = useState(false)
	const [session, setSession] = useState(null)
	const [slugList, setSlugList] = useState([])
	const [ready, setReady] = useState(false)
	const im = useRef()
	useEffect(function () {
		async function startCIM() {
			im.current = new CloudInterestManager(setSession, setSlugList)
			await im.current.init()
			setReady(true)
			var searcher = new URLSearchParams(window.location.search)
			const [add, remove] = [searcher.get('add'), searcher.get('remove')]
			if (add) {
				im.current.addInterest(add)
			}
			if (remove) {
				im.current.removeInterest(remove)
			}
			if (searcher.get('reqLoginMessage')) {
				setReqLoginMessage(true)
			}
		}
		startCIM()
	}, [])
	return (
		<Layout title="Interest List">
			<div style={{ textAlign: 'center' }}>
				<h1>Interest List</h1>
				<p>Keep a list of clubs you are interested in.</p>
				<p>
					{ready &&
						(session ? (
							<>
								Signed in as <strong>{session.user.email}</strong>
							</>
						) : (
							'You are not signed in.'
						))}
				</p>
				{reqLoginMessage && (
					<p style={{ color: 'red' }}>
						Sign in to add this item to your interest list.
					</p>
				)}
				<p className="horizPanel" style={{ whiteSpace: 'nowrap' }}>
					{session ? (
						<>
							<LinkButton
								label="Add Clubs to List"
								icon="open_in_new"
								linksTo="/clubs"
								inline
								opaque
							/>
							<LinkButton
								label="Sign out"
								icon="logout"
								onClick={() => im.current.logout()}
								inline
								opaque
							/>
						</>
					) : (
						<div className={pageStyle.signInButtonsContainer}>
							<LinkButton
								label="Sign in with Google"
								iconElement={
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
										<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
									</svg>
								}
								onClick={() => im.current.login('google')}
								inline
								opaque
							/>
							<LinkButton
								label="Sign in with Twitter"
								iconElement={
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
										<path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
									</svg>
								}
								onClick={() => im.current.login('twitter')}
								inline
								opaque
							/>
							<LinkButton
								label="Sign in with Facebook"
								iconElement={
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 512">
										<path d="M76.7 512V283H0v-91h76.7v-71.7C76.7 42.4 124.3 0 193.8 0c33.3 0 61.9 2.5 70.2 3.6V85h-48.2c-37.8 0-45.1 18-45.1 44.3V192H256l-11.7 91h-73.6v229" />
									</svg>
								}
								onClick={() => im.current.login('facebook')}
								inline
								opaque
							/>
							<LinkButton
								label="Sign in with Discord"
								iconElement={
									<svg viewBox="0 0 71 55">
										<g clipPath="url(#clip0)">
											<path d="M60.1045 4.8978c-4.5253-2.0764-9.378-3.6062-14.4518-4.48238-.0924-.01691-.1847.025349-.2323.109869C44.7963 1.6353 44.105 3.0834 43.6209 4.2216c-5.4572-.817-10.8864-.817-16.2317 0-.4842-1.1635-1.2006-2.5863-1.8275-3.696311-.0476-.0817-.1399-.123959-.2323-.109869-5.071.87338-9.9237 2.40318-14.4518 4.48238-.0392.0169-.0728.0451-.0951.0817C1.57795 18.7309-.943561 32.1443.293408 45.3914c.005597.0648.041978.1268.092353.1662C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195c.0924.0282.1903-.0056.2491-.0817 1.3657-1.865 2.5831-3.8315 3.6269-5.8995.0616-.1211.0028-.2648-.1231-.3127-1.931-.7325-3.7697-1.6256-5.5384-2.6398-.1399-.0817-.1511-.2818-.0224-.3776.3722-.2789.7445-.5691 1.0999-.8621.0643-.0535.1539-.0648.2295-.031 11.6196 5.3051 24.1992 5.3051 35.6817 0 .0756-.0366.1652-.0253.2323.0282.3555.293.7277.586 1.1027.8649.1287.0958.1203.2959-.0196.3776-1.7687 1.0339-3.6074 1.9073-5.5412 2.637-.1259.0479-.1819.1944-.1203.3155 1.0662 2.0651 2.2836 4.0316 3.6241 5.8967.056.0789.1567.1127.2491.0845 5.8014-1.7946 11.684-4.5021 17.7569-8.9619.0532-.0394.0868-.0986.0924-.1634 1.4804-15.3151-2.4796-28.6185-10.4975-40.4119-.0196-.0394-.0531-.0676-.0923-.0845zM23.7259 37.3253c-3.4983 0-6.3808-3.2117-6.3808-7.156 0-3.9443 2.8266-7.156 6.3808-7.156 3.5821 0 6.4367 3.2399 6.3807 7.156 0 3.9443-2.8266 7.156-6.3807 7.156zm23.5919 0c-3.4982 0-6.3807-3.2117-6.3807-7.156 0-3.9443 2.8265-7.156 6.3807-7.156 3.5822 0 6.4367 3.2399 6.3808 7.156 0 3.9443-2.7986 7.156-6.3808 7.156z" />
										</g>
										<defs>
											<clipPath id="clip0">
												<path fill="#fff" d="M0 0h71v55H0z" />
											</clipPath>
										</defs>
									</svg>
								}
								onClick={() => im.current.login('discord')}
								inline
								opaque
							/>
							<LinkButton
								label="Sign in with GitHub"
								iconElement={
									<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
										/>
									</svg>
								}
								onClick={() => im.current.login('github')}
								inline
								opaque
							/>
						</div>
					)}
				</p>
			</div>
			<div className="columnCentered">
				{clubData.map(club => {
					// console.log(club.slug, slugList.indexOf(club.slug))
					if (slugList.indexOf(club.slug) > -1) {
						return <ClubEntry key={club.slug} club={club} />
					} else return null
				})}
			</div>
		</Layout>
	)
}

export const query = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
	}
`

export default InterestsPage
