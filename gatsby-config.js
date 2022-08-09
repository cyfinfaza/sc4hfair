const os = require('os')

const dotenv = require('dotenv')
dotenv.config()
dotenv.config({
	path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
	siteMetadata: {
		title: `Somerset County 4-H Fair`,
		shortTitle: `SC 4H Fair`,
		description: `The Somerset County 4-H Fair App`,
		author: `Somerset County 4-H`,
		buildLocation: os.hostname(),
	},
	trailingSlash: 'never',
	jsxRuntime: 'automatic',
	plugins: [
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-image`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: `gatsby-source-contentful`,
			options: {
				spaceId: process.env.CONTENTFUL_SPACE_ID || 'e34g9w63217k',
				accessToken:
					process.env.CONTENTFUL_ACCESS_TOKEN || 'TRlCo1BlTmpwyKIOHJ08X2lYAaNNlceF415KMmKkMFk',
				downloadLocal: true,
			},
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Somerset County 4-H Fair`,
				short_name: `SC 4H Fair`,
				start_url: `/`,
				related_applications: [
					{
						platform: `webapp`,
						url: `https://sc4hfair.app/manifest.json`,
					},
				],
				background_color: `#009959`,
				theme_color: `#009959`,
				display: `standalone`,
				icon: `src/images/app-icon.svg`, // This path is relative to the root of the site.
				icon_options: {
					purpose: `any maskable`,
				},
				legacy: false, // only used below our minimum supported safari version
			},
		},
		`gatsby-plugin-sass`,
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// {
		// 	resolve: `gatsby-plugin-offline`,
		// 	options: {
		// 		appendScript: require.resolve(`./src/logic/sw_append.js`),
		// 		// precachePages: ['**/*'],
		// 		workboxConfig: {
		// 			globPatterns: ['**/offline.html'],
		// 			// runtimeCaching: [
		// 			// 	{
		// 			// 		urlPattern: /^https:\/\/graphql.contentful.com/,
		// 			// 		handler: 'NetworkFirst',
		// 			// 	},
		// 			// ],
		// 		},
		// 	},
		// },
		// `gatsby-plugin-remove-serviceworker`,
		{
			resolve: 'gatsby-plugin-react-svg',
			options: {
				rule: {
					include: /\.inline\.svg$/,
				},
			},
		},
		{
			resolve: `gatsby-plugin-google-gtag`,
			options: {
				// You can add multiple tracking ids and a pageview event will be fired for all of them.
				trackingIds: ['G-QYEGYTKG7B'],
			},
		},
		`gatsby-source-local-git`,
		`gatsby-plugin-root-import`,
	],
}
