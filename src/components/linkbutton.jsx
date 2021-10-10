import * as React from 'react'
import * as linkButtonStyle from './linkbutton.module.css'
import { Link } from 'gatsby'
import * as buttonStyle from './button.module.css'

const LinkButton = ({
	label,
	linksTo = null,
	onClick = null,
	icon,
	iconElement = null,
	iconStyle = {},
	index = 0,
	inline = false,
	lightFont = false,
	opaque = false,
	acrylic = false,
}) => {
	const sharedProps = {
		className: `${linkButtonStyle.container} ${buttonStyle.button} ${
			inline ? linkButtonStyle.containerInline : null
		}`,
		style: {
			animationDelay: index * 0.1 + 's',
			background: acrylic
				? 'var(--light-blur)'
				: opaque
				? 'var(--light)'
				: null,
			backdropFilter: acrylic ? 'var(--backdrop-blur)' : null,
		},
	}
	const sharedContent = (
		<>
			{iconElement ? (
				<div className={linkButtonStyle.iconElementContainer}>
					{iconElement}
				</div>
			) : (
				<i className="material-icons" style={iconStyle}>
					{icon}
				</i>
			)}
			<span style={{ fontWeight: lightFont ? 'unset' : null }}>{label}</span>
		</>
	)
	if (linksTo) {
		return (
			<Link to={linksTo} {...sharedProps}>
				{sharedContent}
			</Link>
		)
	} else {
		return (
			<button onClick={onClick} {...sharedProps}>
				{sharedContent}
			</button>
		)
	}
}

export default LinkButton
