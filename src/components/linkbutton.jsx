import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import * as linkButtonStyle from './linkbutton.module.css'
import { Link } from 'gatsby'

const LinkButton = ({ label, linksTo, icon, index = 0 }) => {
  return (
    <a className={linkButtonStyle.container} style={{ animationDelay: index * 0.1 + 's' }} href={linksTo}>
      <i className="material-icons">{icon}</i>
	  	<p>{label}</p>
    </a>
  )
}

export default LinkButton
