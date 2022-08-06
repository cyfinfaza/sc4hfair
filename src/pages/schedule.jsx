import { graphql } from 'gatsby'
import { useEffect, useState } from 'react'
import * as style from './schedule.module.css'

import EventBox from 'components/event'
import ToggleButton from 'components/toggleButton'
import Layout from 'components/layout'
import { exactSearch } from 'logic/search'

function addHoursToDate(date, hours) {
	return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

const DEFAULT_EVENT_DURATION_HOURS = 2

export const eventIsFuture = event =>
	Date.now() <
	(event.endTime
		? new Date(event.endTime)
		: addHoursToDate(new Date(event.time), DEFAULT_EVENT_DURATION_HOURS)
	).getTime()

const SchedulePage = ({
	data: {
		allContentfulScheduledEvent: { nodes: pageContent },
	},
}) => {
	const isBrowser = typeof window !== 'undefined'
	const [selectedCategory, setSelectedCategory] = useState('All')
	const [showingPast, setShowingPast] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [starredEvents, setStarredEvents] = useState([])
	const [showingOnlyStarredEvents, setShowingOnlyStarredEvents] = useState(false)

	useEffect(_ => {
		if (isBrowser) {
			setStarredEvents(JSON.parse(localStorage.getItem('starredEvents') || '[]'))
		}
	}, [])

	useEffect(
		_ => {
			if (isBrowser) {
				localStorage.setItem('starredEvents', JSON.stringify(starredEvents))
			}
		},
		[starredEvents]
	)

	function toggleStarredEvent(id) {
		if (starredEvents.includes(id)) {
			setStarredEvents(starredEvents.filter(event => event !== id))
		} else {
			setStarredEvents([...starredEvents, id])
		}
	}

	const categoryList = pageContent.reduce(
		(last, current) => {
			if (last.indexOf(current.category) < 0 && current.category) {
				return [...last, current.category]
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
						setSelectedCategory(e.target.value)
					}}
					name="Category"
				>
					{categoryList.map(category => (
						<option value={category} key={category}>
							{category}
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
					pageContent.filter(
						element =>
							((selectedCategory === 'All' || selectedCategory === element.category) &&
								(eventIsFuture(element) || showingPast)) ||
							(isBrowser && window.location?.hash === '#' + element.id)
					),
					'title',
					['description.description'],
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
				endTime
				description {
					description
				}
				category
				tent
			}
		}
	}
`

export default SchedulePage
