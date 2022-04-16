import React, { useEffect } from 'react'
import * as headerStyle from './header.module.scss'
import Logo from '../assets/logo.inline.svg'
import FourH from '../assets/fourh.inline.svg'
import { useState } from 'react'
import ThemePicker from './themepicker'
import LinkButton from './linkbutton'
import SponsorSpot from './sponsorSpot'
import * as buttonStyle from './button.module.css'

const Header = ({ offsetContent = true }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	function toggleMenu() {
		setMenuOpen(!menuOpen)
	}
	useEffect(() => {
		window.setMenuOpen = setMenuOpen
	}, [])
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
					<Logo
						className={headerStyle.headerLogo}
						onClick={() => {
							window.location.href = '/'
						}}
						style={{ cursor: 'pointer' }}
					/>
					<button
						className={`${headerStyle.menuButton} ${buttonStyle.button}`}
						onClick={toggleMenu}
					>
						<div className={headerStyle.menuIconContainer}>
							<i
								className="material-icons"
								style={!menuOpen ? {} : { transform: 'scale(0.6)', opacity: 0 }}
							>
								menu
							</i>
							<i
								className="material-icons"
								style={menuOpen ? {} : { transform: 'scale(0.6)', opacity: 0 }}
							>
								close
							</i>
						</div>
						<span className={headerStyle.menuButtonLabel}>Menu</span>
					</button>
				</div>
				<div className={headerStyle.menuArea}>
					<div className={headerStyle.menuGrid}>
						<LinkButton
							label="Latest"
							icon="home"
							linksTo="/"
							big
							opaque={false}
						/>
						<LinkButton
							label="Map"
							icon="map"
							linksTo="/map"
							big
							opaque={false}
						/>
						<LinkButton
							label="Schedule"
							icon="event_note"
							linksTo="/schedule"
							big
							opaque={false}
						/>
						<LinkButton
							label="Clubs"
							icon="groups"
							linksTo="/clubs"
							big
							opaque={false}
						/>
						<LinkButton
							label="Interest List"
							icon="list_alt"
							linksTo="/interests"
							big
							opaque={false}
						/>
						{/* <LinkButton
							label="Queuing"
							icon="query_builder"
							linksTo="/queuing"
							big opaque={false}
						/>
						<LinkButton
							label="Live Cams"
							icon="video_camera_back"
							linksTo="/cams"
							big opaque={false}
						/> */}
						{/* <LinkButton
							label="Join 4H"
							icon="person_add"
							linksTo="https://4histops.org/membership"
							big opaque={false}
						/>
						<LinkButton
							label="Donate"
							icon="monetization_on"
							linksTo="https://4histops.org/donate"
							big opaque={false}
						/> */}
						<LinkButton
							label="About 4H"
							icon={
								<FourH
									style={{
										height: '100%',
										// fill: 'var(--navbar-text)',
										fill: 'var(--text)',
										transition: 'fill var(--theme-transition)',
									}}
								/>
							}
							linksTo="https://4histops.org"
							big
							opaque={false}
						/>
					</div>
					<div className={headerStyle.menuBottom}>
						<ThemePicker navbar />
						<LinkButton
							label="Settings"
							icon="settings"
							linksTo="/settings"
							opaque={false}
							lightFont
						/>
					</div>
					<div className={headerStyle.sponsorArea}>
						<SponsorSpot />
					</div>
				</div>
			</div>
		</div>
	)
}
export default Header
