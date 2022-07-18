import * as React from 'react'
import { graphql } from 'gatsby'
import { useEffect, useState } from 'react'
import * as style from './schedule.module.css'

import EventBox from 'components/event'
import ToggleButton from 'components/toggleButton'
import Layout from 'components/layout'

const SchedulePage = ({
	data: {
		allContentfulScheduledEvent: { nodes: pageContent },
	},
}) => {
	const [selectedCategory, setSelectedCategory] = useState('All')
	const [showingPast, setShowingPast] = useState(false)
	const categoryList = pageContent.reduce(
		(last, current) => {
			if (last.indexOf(current.category) < 0) {
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
						console.log('that hook')
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
					? pageContent
							.filter(
								element =>
									(selectedCategory === 'All' || selectedCategory === element.category) &&
									(new Date(element.time).getTime() > Date.now() || showingPast)
							)
							.map((event, i) => {
								console.log(event)
								console.log(new Date(event.time).getTime() > Date.now())
								return (
									<EventBox
										key={event.title}
										title={event.title}
										time={event.time}
										endTime={event.endTime}
										content={event.description.description}
										imgURL={event.coverImage && event.coverImage.url}
										index={i}
									/>
								)
							})
					: null}
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
		allContentfulScheduledEvent {
			nodes {
				title
				time
				endTime
				description {
					description
				}
				coverImage {
					url
				}
				category
			}
		}
	}
`

export default SchedulePage
