import { useEffect, useState } from 'react'
import * as componentStyle from './sponsorSpot.module.scss'
import LinkButton from './linkbutton'
import { graphql, useStaticQuery } from 'gatsby'

const DEFAULT_SPONSOR_DESCRIPTION = 'The 4-H fair is made possible by our sponsors.'

export default function SponsorSpot({ sponsorId, listMode }) {
	const [adContent, setAdContent] = useState(null)
	const ads = useStaticQuery(graphql`
		query sponsorSpotQuery {
			allContentfulSponsorSpot {
				nodes {
					heading
					image {
						localFile {
							publicURL
						}
					}
					description {
						description
					}
					link
					tier
					id
				}
			}
		}
	`).allContentfulSponsorSpot.nodes
	useEffect(() => {
		if (sponsorId) {
			const sponsor = ads.find(sponsor => sponsor.id === sponsorId)
			setAdContent(sponsor)
		} else {
			let chosenTier = Math.random()
			if (chosenTier < 0.45) chosenTier = 'gold' // 45% chance
			else if (chosenTier < 0.8) chosenTier = 'silver' // 35% chance
			else chosenTier = 'bronze' // 20% chance

			let filteredAds = ads.filter(ad => ad.tier === chosenTier)

			setAdContent(filteredAds[Math.floor(Math.random() * filteredAds.length)])
		}
	}, [sponsorId]) // eslint-disable-line react-hooks/exhaustive-deps
	// window.setAdIndex = i => setAdContent(ads[i])
	return (
		adContent && (
			<div className={`${componentStyle.container} ${listMode ? componentStyle.listMode : ''}`}>
				<img src={adContent.image.localFile.publicURL} alt="" className={componentStyle.adImage} />
				<div className={componentStyle.adText}>
					<h2>
						{!listMode && (
							<span className={componentStyle.disclosure}>
								{adContent.tier
									? adContent.tier.charAt(0).toUpperCase() + adContent.tier.slice(1) + ' '
									: ''}
								Fair Sponsor
							</span>
						)}
						{adContent.heading}
					</h2>
					{adContent.description ? (
						<p>{adContent.description.description}</p>
					) : listMode ? null : (
						<p>{DEFAULT_SPONSOR_DESCRIPTION}</p>
					)}
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
