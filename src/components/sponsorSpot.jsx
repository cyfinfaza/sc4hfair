import { useEffect, useState } from 'react'
import * as componentStyle from './sponsorSpot.module.scss'
import LinkButton from './linkbutton'
import { graphql, useStaticQuery } from 'gatsby'

export default function SponsorSpot() {
	const [adContent, setAdContent] = useState(null)
	const ads = useStaticQuery(graphql`
		query {
			allContentfulSponsorSpot {
				nodes {
					heading
					image {
						url
					}
					description {
						description
					}
					link
					tier
				}
			}
		}
	`).allContentfulSponsorSpot.nodes
	useEffect(_ => {
		let chosenTier = Math.random()
		if (chosenTier < 0.45) chosenTier = 'gold' // 45% chance
		else if (chosenTier < 0.8) chosenTier = 'silver' // 35% chance
		else chosenTier = 'bronze' // 20% chance

		let filteredAds = ads.filter(ad => ad.tier === chosenTier)

		setAdContent(filteredAds[Math.floor(Math.random() * filteredAds.length)])
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	// window.setAdIndex = i => setAdContent(ads[i])
	return (
		adContent && (
			<div className={componentStyle.container}>
				<img src={adContent.image.url} alt="" className={componentStyle.adImage} />
				<div className={componentStyle.adText}>
					<h2>
						<span className={componentStyle.disclosure}>
							{adContent.tier
								? adContent.tier.charAt(0).toUpperCase() + adContent.tier.slice(1) + ' '
								: ''}
							Fair Sponsor
						</span>
						{adContent.heading}
					</h2>
					{adContent.description && <p>{adContent.description.description}</p>}
					{adContent.link && (
						<LinkButton
							href={adContent.link}
							label="Visit"
							icon="open_in_new"
							inline
							style={{
								background: 'var(--navbar-accent)',
							}}
						/>
					)}
				</div>
			</div>
		)
	)
}
