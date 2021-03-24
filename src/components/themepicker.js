import React, { useContext } from 'react'
import { ThemeContext } from 'gatsby-plugin-theme-switcher'
import * as themePickerStyle from './themepicker.module.css'
import * as buttonStyle from './button.module.css'

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

export default function ThemePicker() {
	const { theme, switchTheme } = useContext(ThemeContext)
	var nextThemeID
	var currentThemeIndex
	const currentTheme =
		myThemes.filter((item, index) => {
			if (item.id === theme) {
				nextThemeID =
					myThemes.length - 1 === index
						? myThemes[0].id
						: myThemes[index + 1].id
				currentThemeIndex = index
				return true
			}
			return false
		})[0] || myThemes[0]
	console.log(currentTheme, nextThemeID, currentThemeIndex)
	return (
		<div
			className={`${themePickerStyle.themepickerContainer} ${buttonStyle.button}`}
			onClick={() => switchTheme(nextThemeID)}
		>
			<i
				className="material-icons"
				style={{
					cursor: 'pointer',
					'user-select': 'none',
					transform: 'rotate(' + currentThemeIndex * 360 + 'deg)',
				}}
				key={currentTheme.id}
				aria-label={`${currentTheme.name}`}
			>
				{currentTheme.icon}
			</i>
			Switch Theme
		</div>
	)
}
