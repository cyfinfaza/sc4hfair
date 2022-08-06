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
	// const isBrowser = typeof window !== 'undefined'
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

	const Button = props => (
		<LinkButton
			header={props.header ?? true}
			className={props.header === false ? headerStyle.button : null}
			lightFont={!(props.header ?? true)}
			opaque={false}
			onClick={_ => {
				if (typeof window === 'undefined') return
				// close the menu if we're already on the page
				if (window.location.pathname === props.linksTo) setMenuOpen(false)
			}}
			{...props}
		/>
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
							<Button label="Latest" icon="home" linksTo="/" />
							<Button label="Map" icon="map" linksTo="/map" />
							<Button label="Schedule" icon="event_note" linksTo="/schedule" />
							<Button label="Clubs" icon="groups" linksTo="/clubs" />
							<Button
								label="Interest List"
								icon="list_alt"
								linksTo="/interests"
								disabled={!isOnline}
							/>
							<Button label="Scavenger Hunt" icon="travel_explore" linksTo="/scavenger-hunt" />
						</div>
						<div className={headerStyle.menuBottom}>
							<ThemePicker navbar />
							<Button label="Settings" icon="settings" linksTo="/settings" header={false} />
							<Button
								label="About 4-H"
								icon={
									<FourH
										style={{
											height: '100%',
											fill: 'currentColor',
											transition: 'fill var(--theme-transition)',
										}}
									/>
								}
								href="https://4histops.org"
								header={false}
							/>
						</div>
						<div className={headerStyle.sponsorArea}>
							<SponsorSpot />
						</div>
						<Button
							label="See all sponsors"
							icon="monetization_on"
							linksTo="/sponsors"
							header={false}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
export default Header
