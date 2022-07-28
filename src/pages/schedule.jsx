import { graphql } from 'gatsby'
import { useState } from 'react'
import * as style from './schedule.module.css'

import EventBox from 'components/event'
import ToggleButton from 'components/toggleButton'
import Layout from 'components/layout'
import { exactSearch } from 'logic/search'

const SchedulePage = ({
	data: {
		allContentfulScheduledEvent: { nodes: pageContent },
	},
}) => {
	const isBrowser = typeof window !== 'undefined'
	const [selectedCategory, setSelectedCategory] = useState('All')
	const [showingPast, setShowingPast] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
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
			</div>
			<div className="columnCentered">
				{pageContent
					? exactSearch(
							pageContent.filter(
								element =>
									((selectedCategory === 'All' || selectedCategory === element.category) &&
										(Date.now() < new Date(element.endTime).getTime() || showingPast)) ||
									(isBrowser && window.location?.hash === '#' + element.id)
							),
							'title',
							['description.description'],
							searchQuery
					  ).map((event, i) => {
							// console.log(event)
							return <EventBox key={event.id} event={event} index={i} />
					  })
					: null}
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
