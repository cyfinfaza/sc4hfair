import { graphql } from 'gatsby'
import Layout from 'components/layout'
import SponsorSpot from 'components/sponsorSpot'

const SponsorsPage = ({
	data: {
		allContentfulSponsorSpot: { nodes: sponsors },
	},
}) => {
	return (
		<Layout title="Sponsors">
			<div style={{ textAlign: 'center' }}>
				<h1>Sponsors</h1>
				<p>The 4-H fair is made possible by our sponsors.</p>
			</div>
			<div className="columnCentered">
				<h2>Gold</h2>
				{sponsors
					.filter(sponsor => sponsor.tier === 'gold')
					.map(sponsor => (
						<SponsorSpot key={sponsor.id} listMode sponsorId={sponsor.id} />
					))}
				<h2>Silver</h2>
				{sponsors
					.filter(sponsor => sponsor.tier === 'silver')
					.map(sponsor => (
						<SponsorSpot key={sponsor.id} listMode sponsorId={sponsor.id} />
					))}
				<h2>Bronze</h2>
				{sponsors
					.filter(sponsor => sponsor.tier === 'bronze')
					.map(sponsor => (
						<SponsorSpot key={sponsor.id} listMode sponsorId={sponsor.id} />
					))}
			</div>
		</Layout>
	)
}

export const query = graphql`
	query sponsorsQuery {
		allContentfulSponsorSpot {
			nodes {
				id
				tier
			}
		}
	}
`

export default SponsorsPage
