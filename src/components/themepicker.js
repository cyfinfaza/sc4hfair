import { useState, useEffect } from 'react'
import * as themePickerStyle from './themepicker.module.css'
import * as buttonStyle from './button.module.css'
import { getTheme, setTheme } from 'logic/theming'

const myThemes = [
	{
		id: 'theme-light',
		name: 'Light theme',
		icon: 'light_mode',
	},
	{
		id: 'theme-dark',
		name: 'Dark theme',
		icon: 'dark_mode',
	},
]

export default function ThemePicker({ navbar = false }) {
	const isBrowser = typeof window !== 'undefined'
	const [theme, switchTheme] = useState(isBrowser ? getTheme() : 'theme-light')
	useEffect(
		_ => {
			if (isBrowser) setTheme(theme)
		},
		[theme] // eslint-disable-line react-hooks/exhaustive-deps
	)
	var nextThemeID
	var currentThemeIndex
	const currentTheme =
		myThemes.filter((item, index) => {
			if (item.id === theme) {
				nextThemeID = myThemes.length - 1 === index ? myThemes[0].id : myThemes[index + 1].id
				currentThemeIndex = index
				return true
			}
			return false
		})[0] || myThemes[0]
	// console.log(currentTheme, nextThemeID, currentThemeIndex)
	const [clickCounter, setClickCounter] = useState(0)
	useEffect(() => {
		if (clickCounter === 30) {
			console.log('ur dedicated, have some comic sans :)')
			document.styleSheets[0].addRule(
				'*:not(.material-icons)',
				'font-family: "Comic Sans MS" !important'
			)
		}
	}, [clickCounter])
	function handleClick(e) {
		switchTheme(nextThemeID)
		setClickCounter(clickCounter + 1)
	}
	return (
		<div
			className={`${themePickerStyle.themepickerContainer} ${buttonStyle.button}`}
			onClick={handleClick}
			onKeyPress={handleClick}
			role="button"
			tabIndex="0"
			style={{
				backgroundColor: navbar ? 'var(--navbar-accent)' : null,
			}}
		>
			<i
				className="material-icons"
				style={{
					cursor: 'pointer',
					userSelect: 'none',
					transform: 'rotate(' + currentThemeIndex * 360 + 'deg)',
					animation: navbar ? null : 'none',
				}}
				key={currentTheme.id}
				aria-label={`${currentTheme.name}`}
			>
				{currentTheme.icon}
			</i>
			Switch theme
		</div>
	)
}
