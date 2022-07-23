import { graphql } from 'gatsby'
import { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import * as style from './clubs.module.css'

import Layout from 'components/layout'
import LinkButton from 'components/linkbutton'
import CloudInterestManager from 'logic/CloudInterestManager'

const ClubsPage = ({
	data: {
		allContentfulClub: { nodes: clubData },
	},
}) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [session, setSession] = useState(null) // eslint-disable-line no-unused-vars
	const [slugList, setSlugList] = useState([])
	const im = useRef()
	useEffect(function () {
		let lastQuery = localStorage.getItem('clubs_search_query')
		if (lastQuery) setSearchQuery(lastQuery)
		async function startCIM() {
			im.current = new CloudInterestManager(setSession, setSlugList)
			await im.current.init()
		}
		startCIM()
	}, [])
	useEffect(() => {
		localStorage.setItem('clubs_search_query', searchQuery)
	}, [searchQuery])
	const ClubEntry = ({ club }) => (
		<div className={style.clubEntry}>
			<h2>{club.name}</h2>
			{/* we only want to allow inline things */}
			<ReactMarkdown
				allowedElements={['a', 'br', 'p', 'span', 'b', 'strong', 'i', 'em', 'tt', 'code']}
			>
				{club.description.description.substring(0, 400) +
					(club.description.description.length > 400 ? '…' : '')}
			</ReactMarkdown>
			<div className={style.actionButtonsPanel}>
				{club.tent && (
					<LinkButton label="Map" icon="place" linksTo={`/map?locate=${club.tent}`} lightFont />
				)}
				{slugList.indexOf(club.slug) > -1 ? (
					<LinkButton
						label="Remove"
						icon="remove"
						onClick={() => im.current.removeInterest(club.slug)}
						lightFont
					/>
				) : (
					<LinkButton label="Add" icon="add" linksTo={`/interests?add=${club.slug}`} lightFont />
				)}
				<LinkButton label="View" icon="open_in_new" linksTo={`/club/${club.slug}`} lightFont />
			</div>
		</div>
	)
	return (
		<Layout title="Clubs">
			<div style={{ textAlign: 'center' }}>
				<h1>Clubs</h1>
				<p>
					Tap the +Add button to add a club to your interest list.{' '}
					<a href="/interests">View interest list</a>
				</p>
			</div>
			<div className={style.filterOptions}>
				<input
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={event => setSearchQuery(event.target.value)}
				/>
				<button
					style={{ display: searchQuery === '' ? 'none' : null }}
					onClick={() => setSearchQuery('')}
				>
					Clear
				</button>
			</div>
			<div className="columnCentered">
				{clubData.map(club => {
					if (
						searchQuery === '' ||
						club.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
					) {
						return <ClubEntry key={club.slug} club={club} />
					} else return null
				})}
				{clubData.map(club => {
					if (
						searchQuery !== '' &&
						club.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1 &&
						(club.description.description.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
							club.meetingWhen.meetingWhen.toLowerCase().indexOf(searchQuery.toLowerCase()) !==
								-1 ||
							club.meetingLocation.meetingLocation
								.toLowerCase()
								.indexOf(searchQuery.toLowerCase()) !== -1 ||
							club.grades.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
					) {
						return <ClubEntry key={club.slug} club={club} />
					} else return null
				})}
			</div>
		</Layout>
	)
}

export const query = graphql`
	query {
		allContentfulClub {
			nodes {
				slug
				name
				meetingLocation {
					meetingLocation
				}
				clubWebsite
				description {
					description
				}
				grades
				meetingWhen {
					meetingWhen
				}
				listingWebsite
				tent
			}
		}
	}
`

export default ClubsPage
