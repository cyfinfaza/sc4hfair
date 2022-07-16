import React, { useEffect, useState } from 'react'
import * as componentStyle from './sponsorSpot.module.scss'
import LinkButton from './linkbutton'

const contentfulQuery = `
{
	sponsorSpotCollection {
		items {
			heading
			image {
				url
			}
			description
			link
		}
	}
}`

export default function SponsorSpot() {
	const [adContent, setAdContent] = useState(null)
	useEffect(() => {
		fetch(`https://graphql.contentful.com/content/v1/spaces/e34g9w63217k/`, {
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
				console.log(data)
				// rerender the entire component with new data
				const ads = data.sponsorSpotCollection.items
				setAdContent(ads[Math.floor(Math.random() * ads.length)])
			})
	}, [])
	return (
		adContent && (
			<div className={componentStyle.container}>
				<img src={adContent.image.url} alt="" className={componentStyle.adImage} />
				<div className={componentStyle.adText}>
					<h2>
						<span className={componentStyle.disclosure}>Fair Sponsor</span>
						{adContent.heading}
					</h2>
					<p>{adContent.description}</p>
					{adContent.link && (
						<LinkButton
							href={adContent.link}
							label="Visit"
							icon="open_in_new"
							inline
							opaque={false}
						/>
					)}
				</div>
			</div>
		)
	)
}
