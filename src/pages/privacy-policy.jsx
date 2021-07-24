import * as React from 'react'
import Layout from '../components/layout'
import { Link } from 'gatsby'

export default function privaceePolicee() {
	return (
		<Layout title="Privacy Policy">
			<p>
				Your privacy is important to us. It is Somerset County 4H Fair App's
				policy to respect your privacy regarding any information we may collect
				from you across our website, <Link to="/">sc4hfair</Link>.
			</p>
			<p>
				We only ask for personal information when we need it to provide services
				to you. We collect it by fair and lawful means, with your knowledge and
				consent. We also let you know why we’re collecting it and how it will be
				used.
			</p>
			<p>
				If you create an account, your name, email address, and profile picture
				(from the external account you use to create it) will be stored. Using
				multiple external accounts with the same email address will only use one
				account. Additional information may be managed in the{' '}
				<Link to="/settings">user settings</Link>.
			</p>
			<p>
				Viewing any pages on the website will automatically collect analytical
				data. This data consists of the timestamp, URL of the page, browser user
				agent, when user first viewed a page, and how many pages the user has
				viewed, all stored under a tracking ID. The tracking ID is unique to
				your browser session and does not contain any traceable information like
				your IP address.
			</p>
			<p>
				We’ll protect any data we store within commercially acceptable means to
				prevent loss and theft, as well as unauthorized access, disclosure,
				copying, use or modification.
			</p>
			<p>
				We don’t share any personally identifying information publicly or with
				third-parties besides Somerset County 4H, except when required to by
				law. If you use the <Link to="/interests">club interest manager</Link>,
				your name, email address, and other relavent information will be shared
				with leaders of the clubs you are interested in.
			</p>
			<p>
				Our website may link to external sites that are not operated by us.
				Please be aware that we have no control over the content and practices
				of these sites, and cannot accept responsibility or liability for their
				respective privacy policies.
			</p>
			<p>
				You are free to refuse our request for your personal information, with
				the understanding that we may be unable to provide you with some of your
				desired services.
			</p>
			<p>
				Your continued use of our website will be regarded as acceptance of our
				practices around privacy and personal information. If you have any
				questions about how we handle user data and personal information, feel
				free to <Link to="/feedback">contact us</Link>.
			</p>
			<p>This policy was last updated and effective as of July 24, 2021.</p>
		</Layout>
	)
}
