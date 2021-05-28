import { graphql } from 'gatsby'
import * as React from 'react'
// import { StaticImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'

export default function page({ data }) {
	var thisClub = data.allSitePage.edges[0].node.context
	return (
		<Layout title="About">
			<h1>{thisClub.name}</h1>
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
					}
				}
			}
		}
	}
`
