import { graphql } from 'gatsby'
import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
// import { StaticImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'
import * as pageStyle from './ClubPage.module.css'
import CloudInterestManager from '../logic/CloudInterestManager'

export default function ClubPage({ data }) {
	var thisClub = data.allSitePage.edges[0].node.context
	const [linkBack, setLinkBack] = useState('/clubs')
	const [session, setSession] = useState(null)
	const [slugList, setSlugList] = useState([])
	const im = useRef()
	useEffect(async function () {
		im.current = new CloudInterestManager(setSession, setSlugList)
		await im.current.init()
	}, [])
	return (
		<Layout title={thisClub.name}>
			<div className={pageStyle.container}>
				<div>
					<div className="horizPanel" style={{ whiteSpace: 'nowrap' }}>
						<LinkButton
							label="See all clubs"
							icon="groups"
							linksTo={linkBack}
							inline
							opaque
						/>
						<LinkButton
							label="View interest list"
							icon="list"
							linksTo="/interests"
							inline
							opaque
						/>
					</div>
					<h1>{thisClub.name}</h1>
					<div className={pageStyle.optionsButtonsPanel}>
						{slugList.indexOf(thisClub.slug) > -1 ? (
							<LinkButton
								label="Remove from interest list"
								icon="remove"
								onClick={() => im.current.removeInterest(thisClub.slug)}
								inline
								opaque
								lightFont
							/>
						) : (
							<LinkButton
								label="Add to interest list"
								icon="add"
								onClick={() => im.current.addInterest(thisClub.slug)}
								inline
								opaque
								lightFont
							/>
						)}
						<LinkButton
							label="Locate at fair"
							icon="place"
							linksTo={'/map/?locate=' + thisClub.slug}
							inline
							opaque
							lightFont
						/>
					</div>
					<p>{thisClub.description}</p>
					<p>
						<strong>Where: </strong>
						{thisClub.meeting_where}
					</p>
					<p>
						<strong>When: </strong>
						{thisClub.meeting_when}
					</p>
					<p>
						<strong>Grades: </strong>
						{thisClub.grades}
					</p>
					<p>
						<a href={'https://4histops.org/' + thisClub.slug}>
							View on 4histops.org
						</a>
					</p>
				</div>
			</div>
		</Layout>
	)
}

export const query = graphql`
	query($path: String!) {
		allSitePage(filter: { path: { eq: $path } }) {
			edges {
				node {
					context {
						name
						description
						meeting_where
						meeting_when
						grades
						slug
					}
				}
			}
		}
	}
`
