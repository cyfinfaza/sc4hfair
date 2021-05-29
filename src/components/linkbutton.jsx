import * as React from 'react'
import * as linkButtonStyle from './linkbutton.module.css'
// import { Link } from 'gatsby'
import * as buttonStyle from './button.module.css'

const LinkButton = ({
	label,
	linksTo,
	icon,
	iconStyle = {},
	index = 0,
	inline = false,
	lightFont = false,
	opaque = false,
}) => {
	return (
		<a
			className={`${linkButtonStyle.container} ${buttonStyle.button} ${
				inline ? linkButtonStyle.containerInline : null
			}`}
			style={{
				animationDelay: index * 0.1 + 's',
				backgroundColor: opaque ? 'var(--light)' : null,
			}}
			href={linksTo}
		>
			<i className="material-icons" style={iconStyle}>
				{icon}
			</i>
			<p style={{ fontWeight: lightFont ? 'unset' : null }}>{label}</p>
		</a>
	)
}

export default LinkButton
