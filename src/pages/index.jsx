import { graphql } from 'gatsby'
// import { StaticImage } from 'gatsby-plugin-image'
import { useEffect, useState } from 'react'
// import ReactMarkdown from 'react-markdown'

import Post from 'components/post'
import Layout from 'components/layout'
import LinkButton from 'components/linkbutton'

import { getPlatform } from '../logic/getPlatform'

import * as postStyle from 'components/post.module.css'

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
				setPageContent(data.postCollection)
			})
	}, [])

	const isBrowser = typeof window !== 'undefined'
	const platform = getPlatform()
	const [showAppInstall, setShowAppInstall] = useState(
		isBrowser &&
			localStorage.getItem('install_splash') !== '1' &&
			!window.matchMedia(
				'(display-mode: fullscreen) or (display-mode: standalone) or (display-mode: minimal-ui)'
			).matches // if they already installed the pwa don't annoy them
	)
	useEffect(() => {
		if (showAppInstall === false) localStorage.setItem('install_splash', '1')
	}, [showAppInstall])

	return (
		<Layout>
			<h1 className="center">Welcome to the Somerset County 4-H Fair.</h1>

			{showAppInstall && (
				<div
					className={`${postStyle.container} ${postStyle.noTitle}`}
					style={{
						marginTop: '20px',
						background: 'none',
						border: '2px solid var(--text-translucent)',
					}}
				>
					<p>
						<LinkButton
							label="Close"
							icon="close"
							onClick={() => setShowAppInstall(false)}
							acrylic
							style={{ float: 'right' }}
						/>
						For the best experience, please add this as an app{platform === 'other' ? '.' : ':'}
					</p>
					{platform === 'android' && (
						<>
							<p>You should see a prompt asking you to install.</p>
							<p>
								If not, tap <i className="material-icons">more_vert</i> and then tap "Add to Home
								screen".
							</p>
							<p>You will then be able to launch the app from your home screen.</p>
						</>
					)}
					{platform === 'ios-other' && <p>You must use Safari to install 😔</p>}
					{platform === 'ios' && (
						<>
							<p>
								Tap <i className="material-icons">ios_share</i> and then tap "Add to Home Screen".
							</p>
							<p>If you don't see it, ensure you're using an up to date version of Safari.</p>
							<p>You will then be able to launch the app from your home screen.</p>
						</>
					)}
					<span style={{ clear: 'both' }} />
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
