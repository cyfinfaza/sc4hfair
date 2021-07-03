const os = require('os')

module.exports = {
	siteMetadata: {
		title: `Somerset County 4H Fair`,
		shortTitle: `SC 4H Fair`,
		description: `The Somerset County 4H Fair App`,
		author: `Somerset County 4H`,
		buildLocation: os.hostname(),
	},
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
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Somerset County 4H Fair`,
				short_name: `SC 4H Fair`,
				start_url: `/`,
				background_color: `#EDEDED`,
				theme_color: `#009959`,
				display: `standalone`,
				icon: `src/images/favicon.svg`, // This path is relative to the root of the site.
				icon_options: {
					purpose: `any maskable`,
				},
				legacy: true, // this will add apple-touch-icon links to <head>
			},
		},
		`gatsby-plugin-gatsby-cloud`,
		`gatsby-plugin-sass`,
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// {
		// 	resolve: `gatsby-plugin-offline`,
		// 	options: {
		// 		appendScript: require.resolve(`./src/logic/sw_append.js`),
		// 	},
		// },
		`gatsby-plugin-remove-serviceworker`,
		{
			resolve: 'gatsby-plugin-react-svg',
			options: {
				rule: {
					include: /\.inline\.svg$/,
				},
			},
		},
		{
			resolve: 'gatsby-plugin-theme-switcher',
			options: {
				defaultDarkTheme: 'theme-dark',
				defaultLightTheme: 'theme-light',
			},
		},
		{
			resolve: `gatsby-plugin-google-gtag`,
			options: {
				// You can add multiple tracking ids and a pageview event will be fired for all of them.
				trackingIds: ['G-QYEGYTKG7B'],
			},
		},
		`gatsby-plugin-react-helmet`,
		`gatsby-source-local-git`,
	],
}
