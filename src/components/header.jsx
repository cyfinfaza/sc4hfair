import { useEffect, useState } from 'react'
import * as headerStyle from './header.module.scss'
import Logo from 'assets/logo.inline.svg'
import FourH from 'assets/fourh.inline.svg'
import ThemePicker from './themepicker'
import LinkButton from './linkbutton'
import SponsorSpot from './sponsorSpot'
import * as buttonStyle from './button.module.css'
import { Helmet } from 'react-helmet'
// import { graphql, useStaticQuery } from 'gatsby'

const Header = ({ offsetContent = true }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	function toggleMenu() {
		setMenuOpen(!menuOpen)
	}
	const isBrowser = typeof window !== 'undefined'
	const [isOnline, setIsOnline] = useState(true)
	useEffect(() => {
		window.setMenuOpen = setMenuOpen
		setIsOnline(navigator.onLine)
		window.addEventListener('offline', _ => {
			setIsOnline(false)
		})
		window.addEventListener('online', _ => {
			setIsOnline(true)
		})
	}, [])
	useEffect(
		_ => {
			if (isOnline) {
				document.body.style.removeProperty('--status-bar')
			} else {
				document.body.style.setProperty('--status-bar', '#888888')
			}
			document
				.querySelector('meta[name="theme-color"]')
				.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--status-bar'))
		},
		[isOnline]
	)

	return (
		<>
			<Helmet meta={[{ name: 'theme-color' }]} />
			<div className={headerStyle.invisible} style={offsetContent ? {} : { height: 0 }}>
				<div
					className={headerStyle.visible}
					style={{
						height: menuOpen ? '100vh' : null,
						background: isOnline ? 'var(--navbar)' : 'var(--navbar-grey)',
					}}
				>
					<div className={headerStyle.topBar}>
						<Logo
							className={headerStyle.headerLogo}
							onClick={() => {
								window.location.href = '/'
							}}
							style={{ cursor: 'pointer' }}
						/>
						<div className="horizPanel2" style={{ gap: '12px' }}>
							{!isOnline && <span className="material-icons">cloud_off</span>}
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
					</div>
					<div className={headerStyle.menuArea}>
						<div className={headerStyle.menuGrid}>
							<LinkButton label="Latest" icon="home" linksTo="/" big opaque={false} />
							<LinkButton label="Map" icon="map" linksTo="/map" big opaque={false} />
							<LinkButton
								label="Schedule"
								icon="event_note"
								linksTo="/schedule"
								big
								opaque={false}
							/>
							<LinkButton label="Clubs" icon="groups" linksTo="/clubs" big opaque={false} />
							<LinkButton
								label="Interest List"
								icon="list_alt"
								linksTo="/interests"
								big
								opaque={false}
								disabled={!isOnline}
							/>
							<LinkButton
								label="Scavenger Hunt"
								icon="travel_explore"
								linksTo="/scavenger-hunt"
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
							<LinkButton
								label="About 4-H"
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
								href="https://4histops.org"
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
		</>
	)
}
export default Header
