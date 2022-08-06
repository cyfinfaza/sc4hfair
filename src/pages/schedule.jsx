import { graphql } from 'gatsby'
import { useEffect, useState } from 'react'
import * as style from './schedule.module.css'

import EventBox, { eventIsFuture } from 'components/event'
import ToggleButton from 'components/toggleButton'
import Layout from 'components/layout'
import { exactSearch } from 'logic/search'
import tentSlugs from '../../static/tentSlugs.json'

const SchedulePage = ({
	data: {
		allContentfulScheduledEvent: { nodes: pageContent },
	},
}) => {
	const isBrowser = typeof window !== 'undefined'
	const [selectedTent, setSelectedTent] = useState('All')
	const [showingPast, setShowingPast] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [starredEvents, setStarredEvents] = useState([])
	const [showingOnlyStarredEvents, setShowingOnlyStarredEvents] = useState(false)

	useEffect(_ => {
		if (isBrowser) {
			setStarredEvents(JSON.parse(localStorage.getItem('starredEvents') || '[]'))
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(
		_ => {
			if (isBrowser) {
				localStorage.setItem('starredEvents', JSON.stringify(starredEvents))
			}
		},
		[starredEvents] // eslint-disable-line react-hooks/exhaustive-deps
	)

	function toggleStarredEvent(id) {
		if (starredEvents.includes(id)) {
			setStarredEvents(starredEvents.filter(event => event !== id))
		} else {
			setStarredEvents([...starredEvents, id])
		}
	}

	const eventTentsList = pageContent.reduce(
		(last, current) => {
			if (last.indexOf(current.tent) < 0 && current.tent && current.tent !== '---') {
				return [...last, current.tent]
			}
			return last
		},
		['All']
	)
	return (
		<Layout title="Schedule">
			<div style={{ textAlign: 'center' }}>
				<h1>Events</h1>
			</div>
			<div className={style.filterOptions}>
				<p>Filter: </p>
				{/* eslint-disable-next-line jsx-a11y/no-onchange */}
				<select
					onChange={e => {
						setSelectedTent(e.target.value)
					}}
					name="Tent"
				>
					{eventTentsList.map(tent => (
						<option value={tent} key={tent}>
							{tentSlugs[tent] || tent}
						</option>
					))}
				</select>
				<input
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={event => setSearchQuery(event.target.value)}
				/>
				<ToggleButton
					on={showingPast}
					onClick={() => {
						setShowingPast(!showingPast)
					}}
				>
					Show Past Events
				</ToggleButton>
				<ToggleButton
					on={showingOnlyStarredEvents}
					onClick={() => {
						setShowingOnlyStarredEvents(!showingOnlyStarredEvents)
					}}
				>
					Show Only Starred Events
				</ToggleButton>
			</div>
			<div className="columnCentered">
				{exactSearch(
					pageContent
						.filter(
							element =>
								((selectedTent === 'All' || selectedTent === element.tent) &&
									(eventIsFuture(element) || showingPast)) ||
								(isBrowser && window.location?.hash === '#' + element.id)
						)
						.map(element => {
							return {
								...element,
								tentName: tentSlugs[element.tent] || element.tent,
								description: { description: element.description?.description || '' },
							}
						}),
					'title',
					['description.description', 'tentName'],
					searchQuery
				)
					.filter(element => !showingOnlyStarredEvents || starredEvents.includes(element.id))
					.map((event, i) => {
						// console.log(event)
						return (
							<EventBox
								key={event.id}
								starred={starredEvents.includes(event.id)}
								toggleStarredEvent={toggleStarredEvent}
								event={event}
								index={i}
							/>
						)
					})}
			</div>
		</Layout>
	)
}

export const query = graphql`
	query {
		allContentfulScheduledEvent(sort: { order: ASC, fields: [time] }) {
			nodes {
				id: contentful_id
				title
				time
				# endTime
				# description {
				# 	description
				# }
				tent
			}
		}
	}
`

export default SchedulePage
