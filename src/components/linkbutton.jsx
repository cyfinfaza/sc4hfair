import * as React from 'react'
import * as linkButtonStyle from './linkbutton.module.css'
// import { Link } from 'gatsby'
import * as buttonStyle from './button.module.css'

const LinkButton = ({ label, linksTo, icon, iconStyle = {}, index = 0 }) => {
	return (
		<a
			className={`${linkButtonStyle.container} ${buttonStyle.button}`}
			style={{ animationDelay: index * 0.1 + 's' }}
			href={linksTo}
		>
			<i className="material-icons" style={iconStyle}>
				{icon}
			</i>
			<p>{label}</p>
		</a>
	)
}

export default LinkButton
