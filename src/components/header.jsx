import React from 'react'
import * as headerStyle from './header.module.scss'
import Logo from '../assets/logo.inline.svg'
import FourH from '../assets/fourh.inline.svg'
import { graphql, useStaticQuery, Link } from 'gatsby'
import { useState } from 'react'
import ThemePicker from './themepicker'
import LinkButton from './linkbutton'
import * as buttonStyle from './button.module.css'

const Header = ({ offsetContent = true }) => {
	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					title
				}
			}
		}
	`)
	const [menuOpen, setMenuOpen] = useState(false)
	function toggleMenu() {
		setMenuOpen(!menuOpen)
	}
	return (
		<div
			className={headerStyle.invisible}
			style={offsetContent ? {} : { height: 0 }}
		>
			<div
				className={headerStyle.visible}
				style={{ height: menuOpen ? '100vh' : null }}
			>
				<div className={headerStyle.topBar}>
					<Link to="/">
						<Logo className={headerStyle.headerLogo} />
					</Link>
					<button
						className={`${headerStyle.menuButton} ${buttonStyle.button}`}
						onClick={toggleMenu}
					>
						<div className={headerStyle.menuIconContainer}>
							<span
								className="material-icons"
								style={!menuOpen ? {} : { transform: 'scale(0.6)', opacity: 0 }}
							>
								menu
							</span>
							<span
								className="material-icons"
								style={menuOpen ? {} : { transform: 'scale(0.6)', opacity: 0 }}
							>
								close
							</span>
						</div>
						<span className={headerStyle.menuButtonLabel}>Menu</span>
					</button>
				</div>
				<div className={headerStyle.menuArea}>
					<div className={headerStyle.menuGrid}>
						<LinkButton label="Latest" icon="home" linksTo="/" />
						<LinkButton label="Map" icon="room" linksTo="/map" />
						<LinkButton label="Schedule" icon="event_note" linksTo="/schedule" />
						<LinkButton
							label="Interest List"
							icon="list_alt"
							linksTo="/about"
						/>
						<LinkButton label="Queuing" icon="query_builder" linksTo="/queuing" />
						<LinkButton
							label="Live Cams"
							icon="video_camera_back"
							linksTo="/cams"
						/>
						<LinkButton label="Join 4H" icon="groups" linksTo="/join" />
						<LinkButton
							label="Donate"
							icon="monetization_on"
							linksTo="/donate"
						/>
						<LinkButton
							label="About 4H"
							icon={
								<FourH style={{ height: '100%', fill: 'var(--navbar-text)' }} />
							}
							linksTo="/4h"
						/>
						<LinkButton label="App Info" icon="info" linksTo="/about" />
					</div>
					<div className={headerStyle.menuBottom}>
						<ThemePicker />
					</div>
				</div>
			</div>
		</div>
	)
}
export default Header
