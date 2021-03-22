import React from "react"
import * as headerStyle from "./header.module.scss"
import { StaticImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"
import { useState } from "react"

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
        style={{ height: menuOpen ? "100vh" : null }}
      >
        <div className={headerStyle.topBar}>
          <img
            className={headerStyle.headerLogo}
            src="4h-fair_plain.svg"
            alt="4H Fair"
          />
          <button className={headerStyle.menuButton} onClick={toggleMenu}>
            <div className={headerStyle.menuIconContainer}>
              <span
                className="material-icons"
                style={!menuOpen ? {} : { transform: "scale(0.5)", opacity: 0 }}
              >
                menu
              </span>
              <span
                className="material-icons"
                style={menuOpen ? {} : { transform: "scale(0.5)", opacity: 0 }}
              >
                close
              </span>
            </div>
            <span className={headerStyle.menuButtonLabel}>Menu</span>
          </button>
        </div>
        <div className={headerStyle.menuArea}>
          Lorem ipsum carrots enhanced rebates. For that will only rationally,
          but in itself? Of the Blessed has been said to pay, of life, which the
          practice of rejecting some of sorrows, toil, and the architect, who
          has done it, some times! Lorem ipsum carrots enhanced rebates
          developer. Is a great easy to carry messages, the option of denouncing
          it or the weakness of impedes! No pain on the right! Open less
          pleasure pain, come responsibilities option spirit! Lorem ipsum
          carrots enhanced rebates. But in any pain, sleep encounter unfold
          solved! So welcome the fault avoidance Never. The Lesser, and they are
          offices of the of corrupt when the weakness of some of these option!
          Lorem ipsum carrots enhanced rebates. from; The sorrows of pain from
          him, nothing is less to praise with canticles, to be cast to follow.
          Receives a small but intense open, the body rejects of all some people
          were. Lorem ipsum carrots enhanced rebates developer. How, criticized
          by the, because it is the pain of the moment, she refused to the AB
          will not be the fault of pleasure, but to betake himself, therefore,
          to pay result from the pains difference paid the most? Lorem ipsum
          carrots enhanced rebates. Runs inventor refused to be acceptable Born
          film soothing pleasures of the body is beneficial hardship think! Now
          from the time of choosing the pleasure of the body, the lack of any as
          snacks. Lorem ipsum carrots enhanced rebates. rejected blind man!
          Furthermore, simply open our fault flies worthy of the sayings of some
          of the blessed? In order that the hardships of life and what cities
          will, indeed, that the needs of the id. Lorem ipsum dolor sit amet,
          consectetur rebates. These have been cut free of the annoying And he
          rejects the poorest and most worthy of the system, who discovered
          provident! Very welcome and pain symptoms at all! Lorem Ipsum
          consumer, carrots enhanced rebates. And abandon provide in the least,
          enhanced to the right of the nature of the debts born. no We accuse
          the whole of life was born, was selected for the aspect of bulk has
          been accepted offices?
        </div>
      </div>
    </div>
  )
}
export default Header
