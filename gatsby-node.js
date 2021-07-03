/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)
const clubData = require(`./static/clubData.json`)

exports.createPages = async ({ graphql, actions, reporter }) => {
	const { createPage } = actions
	const ClubPageTemplate = path.resolve('./src/templates/ClubPage.jsx')
	clubData.forEach(club => {
		createPage({
			path: `/club/${club.slug}`,
			component: ClubPageTemplate,
			context: club,
		})
	})
}
