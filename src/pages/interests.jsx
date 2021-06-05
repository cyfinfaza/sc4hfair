import * as React from 'react'
import { graphql } from 'gatsby'
import { useEffect, useState, useRef } from 'react'

import * as clubsStyle from './clubs.module.css'
import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'
import CloudInterestManager from '../logic/CloudInterestManager'

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
					{ready && (session ? (
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
						<>
							<LinkButton
								label="Sign in with Google"
								icon="login"
								onClick={() => im.current.login('google')}
								inline
								opaque
							/>
						</>
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
