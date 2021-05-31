/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react'
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
			/>
			<Header offsetContent={!noHeaderPadding && !fixedHeightContent} />
			<div
				className={layoutStyle.content}
				style={{
					padding: noPadding ? '0' : null,
					paddingTop:
						fixedHeightContent && !noHeaderPadding ? 'var(--nav-height)' : '0',
					height: fixedHeightContent ? '100vh' : null,
					boxSizing: 'border-box',
				}}
			>
				<div style={{ maxWidth: fullWidth ? 'unset' : null }}>{children}</div>
			</div>
		</>
	)
}

Layout.propTypes = {
	description: PropTypes.string,
	title: PropTypes.string,
}

export default Layout
