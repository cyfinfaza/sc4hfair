import React from 'react'
import * as headerStyle from './header.module.scss'
import Logo from '../assets/logo.inline.svg'
import { graphql, useStaticQuery, Link } from 'gatsby'
import { useState } from 'react'
import ThemePicker from './themepicker'
import LinkButton from './linkbutton'

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
          <Logo className={headerStyle.headerLogo} />
          <button className={headerStyle.menuButton} onClick={toggleMenu}>
            <div className={headerStyle.menuIconContainer}>
              <span
                className="material-icons"
                style={!menuOpen ? {} : { transform: 'scale(0.5)', opacity: 0 }}
              >
                menu
              </span>
              <span
                className="material-icons"
                style={menuOpen ? {} : { transform: 'scale(0.5)', opacity: 0 }}
              >
                close
              </span>
            </div>
            <span className={headerStyle.menuButtonLabel}>Menu</span>
          </button>
        </div>
        <div className={headerStyle.menuArea}>
          <div className={headerStyle.menuGrid}>
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
          <LinkButton label="Map" icon="room" linksTo="/map" />
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