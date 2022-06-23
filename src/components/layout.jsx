/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'

import Header from './header'
import * as layoutStyle from './layout.module.css'

const Layout = ({
	children,
	title,
	description,
	noPadding = false,
	noHeaderPadding = false,
	fixedHeightContent = false,
	fullWidth = false,
	style,
}) => {
	const metadata = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						author
					}
				}
			}
		`
	)
	const metaDescription = description || metadata.site.siteMetadata.description
	const isBrowser = typeof window !== 'undefined'

	return (
		<>
			<Helmet
				title={(title ? title + ' | ' : '') + metadata.site.siteMetadata.title}
				meta={[
					{
						name: `description`,
						content: metaDescription,
					},
					{
						property: `og:title`,
						content: title,
					},
					{
						property: `og:description`,
						content: metaDescription,
					},
					{
						property: `og:type`,
						content: `website`,
					},
					{
						name: `twitter:card`,
						content: `summary`,
					},
					{
						name: `twitter:creator`,
						content: metadata.site.siteMetadata?.author || ``,
					},
					{
						name: `twitter:title`,
						content: title,
					},
					{
						name: `twitter:description`,
						content: metaDescription,
					},
				]}
			>
				{isBrowser && (
					<body style={fixedHeightContent ? 'overflow: hidden' : null} />
				)}
			</Helmet>
			<a href="#content" className={layoutStyle.skipToContentButton}>
				Skip to content
			</a>
			<Header offsetContent={!noHeaderPadding && !fixedHeightContent} />
			<div
				className={layoutStyle.content}
				id="content"
				style={{
					padding: noPadding ? '0' : null,
					paddingTop:
						fixedHeightContent && !noHeaderPadding ? 'var(--nav-height)' : '0',
					height: fixedHeightContent ? '100vh' : null,
					boxSizing: 'border-box',
					overflow: fixedHeightContent ? 'hidden' : null,
				}}
			>
				<div style={{ maxWidth: fullWidth ? 'unset' : null, ...style }}>
					{children}
				</div>
			</div>
		</>
	)
}

Layout.propTypes = {
	description: PropTypes.string,
	title: PropTypes.string,
}

export default Layout
