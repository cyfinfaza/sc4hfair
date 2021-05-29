import { graphql } from 'gatsby'
import * as React from 'react'
// import { StaticImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import LinkButton from '../components/linkbutton'
import * as pageStyle from './ClubPage.module.css'

export default function page({ data }) {
	var thisClub = data.allSitePage.edges[0].node.context
	return (
		<Layout title={thisClub.name}>
			<div className={pageStyle.container}>
				<div>
					<LinkButton
						label="See all clubs"
						icon="arrow_back_ios_new"
						linksTo="/clubs"
						inline
					/>
					<h1>{thisClub.name}</h1>
					<div className={pageStyle.optionsButtonsPanel}>
						<LinkButton
							label="Add to interest list"
							icon="add"
							linksTo="/clubs"
							inline
							lightFont
						/>
						<LinkButton
							label="Locate at fair"
							icon="place"
							linksTo="/clubs"
							inline
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
