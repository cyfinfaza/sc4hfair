import { graphql } from 'gatsby'
import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
// import { StaticImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'
import * as pageStyle from './ClubPage.module.css'
import CloudInterestManager from '../logic/CloudInterestManager'
import { share, canWebShare } from '../logic/webshare'

export default function ClubPage({ data }) {
	const isBrowser = typeof window !== 'undefined'
	var thisClub = data.allSitePage.nodes[0].pageContext
	// const [linkBack, setLinkBack] = useState('/clubs')
	const [session, setSession] = useState(null) // eslint-disable-line no-unused-vars
	const [slugList, setSlugList] = useState([])
	const im = useRef()
	useEffect(function () {
		async function startCIM() {
			im.current = new CloudInterestManager(setSession, setSlugList)
			await im.current.init()
		}
		startCIM()
	}, [])
	return (
		<Layout title={thisClub.name}>
			<div
				className="horizPanel"
				style={{
					whiteSpace: 'nowrap',
					justifyContent: 'flex-start',
					marginTop: '16px',
				}}
			>
				<LinkButton label="See all clubs" icon="groups" linksTo="/clubs" inline opaque />
				<LinkButton label="View interest list" icon="list" linksTo="/interests" inline opaque />
			</div>
			<h1 style={{ textTransform: 'uppercase' }}>{thisClub.name}</h1>
			<div className={pageStyle.optionsButtonsPanel}>
				{slugList.indexOf(thisClub.slug) > -1 ? (
					<LinkButton
						label="Remove from interest list"
						icon="remove"
						onClick={() => im.current.removeInterest(thisClub.slug)}
						lightFont
					/>
				) : (
					<LinkButton
						label="Add to interest list"
						icon="add"
						onClick={() => im.current.addInterest(thisClub.slug)}
						lightFont
					/>
				)}
				{thisClub.tent && (
					<LinkButton
						label="Locate at fair"
						icon="place"
						linksTo={'/map/?locate=' + thisClub.tent}
						lightFont
					/>
				)}
				{isBrowser && canWebShare() && (
					<LinkButton
						label="Share"
						icon="share"
						onClick={() => share(`${thisClub.name}`, window.location.href)}
						lightFont
					/>
				)}
				{thisClub.website && (
					<LinkButton label="Website" icon="language" linksTo={thisClub.website} lightFont />
				)}
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
				<a href={'https://4histops.org/' + thisClub.slug}>View on 4histops.org</a>
			</p>
		</Layout>
	)
}

export const query = graphql`
	query ($path: String!) {
		allSitePage(filter: { path: { eq: $path } }) {
			nodes {
				pageContext
			}
		}
	}
`
