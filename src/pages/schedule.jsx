import * as React from 'react'
import { graphql } from 'gatsby'
import { useEffect, useState } from 'react'

import Event from '../components/event'
import Layout from '../components/layout'

const contentfulQuery = `
{
  scheduledEventCollection (order: time_ASC) {
    items {
      title
      time
			endTime
			description
    }
  }
}
`

const IndexPage = ({ data }) => {
	const [pageContent, setPageContent] = useState(null)
	useEffect(() => {
		window
			.fetch(`https://graphql.contentful.com/content/v1/spaces/e34g9w63217k/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Authenticate the request
					Authorization: `Bearer ${atob(
						'VFJsQ28xQmxUbXB3eUtJT0hKMDhYMmxZQWFOTmxjZUY0MTVLTW1La01Gaw=='
					)}`,
				},
				// send the GraphQL query
				body: JSON.stringify({ query: contentfulQuery }),
			})
			.then(response => response.json())
			.then(({ data, errors }) => {
				if (errors) {
					console.error(errors)
				}

				// rerender the entire component with new data
				setPageContent(data.scheduledEventCollection)
			})
	}, [])
	return (
		<Layout>
			<div style={{ textAlign: 'center' }}>
				<h2>Events</h2>
			</div>
			<div className="columnCentered">
				{pageContent
					? pageContent.items.map((event, i) => {
							console.log(event)
							return (
								<Event
									key={event.title}
									title={event.title}
									time={event.time}
									endTime={event.endTime}
									content={event.description}
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
	}
`

export default IndexPage
