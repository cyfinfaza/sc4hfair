/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

const fs = require('fs')
const path = require('path')

// manually override favicons that gatsby-plugin-manifest generates
exports.onPostBootstrap = async () => {
	try {
		fs.copyFileSync(path.join('src', 'images', 'favicon.svg'), path.join('public', 'favicon.svg'))
		fs.copyFileSync(
			path.join('static', 'favicon-32x32.png'),
			path.join('public', 'favicon-32x32.png')
		)
	} catch (e) {
		console.error('Failed to override favicon', e)
	}
}

// populate offline page template with built resources
const offlineFile = 'public/offline.html'
exports.onPostBuild = async () => {
	if (!fs.existsSync(offlineFile)) return console.error(`${offlineFile} not found`)

	const appLogo = fs.readFileSync('src/images/favicon.svg', 'utf8')

	const offlinePage = fs.readFileSync(offlineFile, 'utf8')
	fs.writeFileSync(offlineFile, offlinePage.replace('{appLogo}', appLogo))
}

// https://github.com/gatsbyjs/gatsby/discussions/30169
exports.onCreateWebpackConfig = ({ stage, actions, getConfig, loaders, plugins }) => {
	const config = getConfig()
	const miniCssExtractPluginIndex = config.plugins.findIndex(
		plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
	)

	if (miniCssExtractPluginIndex > -1) {
		// remove miniCssExtractPlugin from plugins list
		config.plugins.splice(miniCssExtractPluginIndex, 1)

		// re-add mini-css-extract-plugin
		if (stage === 'build-javascript') {
			config.plugins.push(
				plugins.extractText({
					filename: `[name].[contenthash].css`,
					chunkFilename: `[name].[contenthash].css`,
					ignoreOrder: true,
				})
			)
		} else {
			config.plugins.push(
				plugins.extractText({
					filename: `[name].css`,
					chunkFilename: `[id].css`,
					ignoreOrder: true,
				})
			)
		}
	}
	actions.replaceWebpackConfig(config)
}

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions
	const typeDefs = `
	  type ContentfulSponsorSpot implements Node {
		description: ContentfulSponsorSpotDescription
	  }
	  type ContentfulSponsorSpotDescription {
		description: String
	  }
	`
	createTypes(typeDefs)
}
