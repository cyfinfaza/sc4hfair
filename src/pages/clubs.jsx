import * as React from 'react'
import { graphql } from 'gatsby'
import { useEffect, useState } from 'react'
import * as style from './clubs.module.css'

import EventBox from '../components/event'
import ToggleButton from '../components/toggleButton'
import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'

const clubData = require('../../static/clubData.json')

const ClubsPage = ({ data }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const ClubEntry = ({ club }) => (
		<div className={style.clubEntry}>
			<h2>{club.name}</h2>
			<p>{club.description}</p>
			<div className={style.actionButtonsPanel}>
				<LinkButton
					label="Locate"
					icon="place"
					linksTo={`/map?locate=${club.slug}`}
					inline
					opaque
				/>
				<LinkButton
					label="Add"
					icon="add"
					linksTo={`/interests?add=${club.slug}`}
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
			</div>
			<div className="columnCentered">
				{clubData.map(club => {
					if (
						searchQuery == '' ||
						club.name.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1
					) {
						return <ClubEntry key={club.slug} club={club} />
					}
				})}
				{clubData.map(club => {
					if (
						searchQuery != '' &&
						club.name.toLowerCase().indexOf(searchQuery.toLowerCase()) == -1 &&
						(club.description
							.toLowerCase()
							.indexOf(searchQuery.toLowerCase()) != -1 ||
							club.meeting_when
								.toLowerCase()
								.indexOf(searchQuery.toLowerCase()) != -1 ||
							club.meeting_where
								.toLowerCase()
								.indexOf(searchQuery.toLowerCase()) != -1 ||
							club.grades.toLowerCase().indexOf(searchQuery.toLowerCase()) !=
								-1)
					) {
						return <ClubEntry key={club.slug} club={club} />
					}
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

export default ClubsPage
