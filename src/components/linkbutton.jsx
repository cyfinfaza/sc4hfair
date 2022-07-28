import * as linkButtonStyle from './linkbutton.module.css'
import { Link } from 'gatsby'
import * as buttonStyle from './button.module.css'

const LinkButton = ({
	label,
	linksTo = null, // use gatsby link
	href = null,
	onClick = null, // use js
	icon, // material icon id
	iconElement = null, // svg icon
	iconStyle = {},
	index = 0, // used for animating in after a delay
	big = false, // not inline
	opaque = true, // set to false for no background
	acrylic = false, // overrides opaque
	lightFont = false, // light font weight
	disabled = false, // prevent click
	alert = false,
	className = '', // custom classes
	style = {}, // custom styles
}) => {
	const sharedProps = {
		className: `${linkButtonStyle.container} ${buttonStyle.button} ${
			alert ? buttonStyle.alert : ''
		} ${big ? null : linkButtonStyle.containerInline} ${className}`,
		style: {
			animationDelay: index * 0.1 + 's',
			background: acrylic ? 'var(--light-blur)' : opaque ? 'var(--light)' : null,
			backdropFilter: acrylic ? 'var(--backdrop-blur)' : null,
			...style,
		},
		disabled: disabled,
	}
	const sharedContent = (
		<>
			{iconElement ? (
				<div className={linkButtonStyle.iconElementContainer}>{iconElement}</div>
			) : (
				<i className="material-icons" style={iconStyle}>
					{icon}
				</i>
			)}
			<span style={{ fontWeight: lightFont ? 'unset' : null }}>{label}</span>
		</>
	)
	if (linksTo && !disabled) {
		return (
			<Link to={linksTo} {...sharedProps}>
				{sharedContent}
			</Link>
		)
	} else if (href && !disabled) {
		return (
			<a href={href} {...sharedProps}>
				{sharedContent}
			</a>
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
