/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

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
