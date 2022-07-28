import Layout from 'components/layout'
import { Link } from 'gatsby'

export default function privaceePolicee() {
	return (
		<Layout title="Privacy Policy">
			<h1>Privacy Policy</h1>
			<p>
				Your privacy is important to us. It is Somerset County 4-H Fair App's policy to respect your
				privacy regarding any information we may collect from you across our website,{' '}
				<Link to="/">sc4hfair</Link>.
			</p>
			<p>
				We only ask for personal information when we need it to provide services to you. We collect
				it by fair and lawful means, with your knowledge and consent. We also let you know why we're
				collecting it and how it will be used.
			</p>
			<p>
				If you create an account, your name, email address, and profile picture (from the external
				account you use to create it) will be stored. Accounts are managed by email address.
				Different providers that share the same email address will always sign you in to the same
				account. Additional account information may be managed in the{' '}
				<Link to="/settings">user settings</Link>.
			</p>
			<p>
				Each page contains a client-side script that keeps track of your navigation through our
				site. We collect data about the time of viewing, the device you viewed the page on, and how
				many pages you have viewed, as well as your progression from page to page. We identify who
				you are through an anonymous tracking ID (generated the first time you view our site), and
				we do not track you across other websites.
			</p>
			<p>
				We'll protect any data we store within commercially acceptable means to prevent loss and
				theft, as well as unauthorized access, disclosure, copying, use or modification.
			</p>
			<p>
				We don't share any personally identifying information publicly or with third-parties besides{' '}
				<a href="https://4histops.org/">Somerset County 4-H</a>, except when required to by law. If
				you use the <Link to="/interests">club interest manager</Link>, your provided name, email
				address, phone number, and other relavent information may be shared with leaders of the
				clubs you marked as interested in.
			</p>
			<p>
				Our website may link to external sites that are not operated by us. Please be aware that we
				have no control over the content and practices of these sites, and cannot accept
				responsibility or liability for their respective privacy policies.
			</p>
			<p>
				Your continued use of our website will be regarded as acceptance of our practices around
				privacy and personal information. If you have any questions about how we handle user data
				and personal information, feel free to <Link to="/feedback">contact us</Link>.
			</p>
			<p>This policy was last updated and effective as of June 27, 2022.</p>
		</Layout>
	)
}
