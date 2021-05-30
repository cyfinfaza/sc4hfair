import * as React from 'react'
// import { StaticImage } from 'gatsby-plugin-image'
import Layout from '../components/layout'
import { Link } from 'gatsby'

// @todo: add contact form
export default function page() {
	return (
		<Layout title="About">
			This app was created by the{' '}
			<a href="https://4hcomputers.club">Somerset County 4H Computers Club</a>.
			You can leave feedback on the app <Link to="/feedback">here</Link>.
		</Layout>
	)
}
