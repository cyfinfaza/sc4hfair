import { graphql, Link } from 'gatsby'
// import { StaticImage } from 'gatsby-plugin-image'
import { useEffect, useState } from 'react'
// import ReactMarkdown from 'react-markdown'

import * as pageStyle from './index.module.scss'

import Post from 'components/post'
import Layout from 'components/layout'
import LinkButton from 'components/linkbutton'
import InstallInstructions from 'components/installInstructions'

import { getPlatform, isStandalone } from '../logic/getPlatform'

const contentfulQuery = `
{
	postCollection(order:sys_firstPublishedAt_DESC) {
		items {
			title
			contentText
			sys {
				publishedAt
			}
		}
	}
}
`

const IndexPage = ({ data }) => {
	const [pageContent, setPageContent] = useState(null)
	useEffect(() => {
		window
			.fetch(
				`https://graphql.contentful.com/content/v1/spaces/e34g9w63217k/?query=${encodeURIComponent(
					contentfulQuery
				)}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${atob(
							'VFJsQ28xQmxUbXB3eUtJT0hKMDhYMmxZQWFOTmxjZUY0MTVLTW1La01Gaw=='
						)}`,
					},
				}
			)
			.then(response => response.json())
			.then(({ data, errors }) => {
				if (errors) {
					console.error(errors)
				}

				// rerender the entire component with new data
				setPageContent(data.postCollection)
			})
	}, [])

	const isBrowser = typeof window !== 'undefined'
	const platform = isBrowser && getPlatform()
	console.log(platform)
	const [showAppInstall, setShowAppInstall] = useState(
		isBrowser && localStorage.getItem('install_splash') !== '1'
	)
	useEffect(() => {
		if (showAppInstall === false) localStorage.setItem('install_splash', '1')
	}, [showAppInstall])
	useEffect(() => {
		if (isStandalone()) setShowAppInstall(false)
	}, [])

	return (
		<Layout>
			<h1 className="center">Welcome to the Somerset County 4-H Fair.</h1>

			{showAppInstall && (
				<div className={`${pageStyle.welcomeModal}`}>
					<p>
						<strong>Finish installing the fair app by adding it to your home screen:</strong>
					</p>
					<InstallInstructions />
					<p>
						<strong>
							You can find these instructions later in <Link to="/settings">settings</Link>.
						</strong>
						<LinkButton
							label="Dismiss"
							icon="close"
							onClick={() => setShowAppInstall(false)}
							acrylic
							style={{ whiteSpace: 'nowrap' }}
						/>
					</p>
				</div>
			)}

			<div className="horizPanel">
				<LinkButton label="Schedule" icon="event_note" linksTo="/schedule" />
				<LinkButton label="Map" icon="map" linksTo="/map" />
				<LinkButton label="More" icon="add" onClick={() => window.setMenuOpen(true)} />
			</div>

			<h2 className="center">Latest Updates</h2>
			<div className="columnCentered">
				{pageContent
					? pageContent.items.map((post, i) => {
							console.log(post)
							return <Post key={post.title} data={post} index={i} />
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
