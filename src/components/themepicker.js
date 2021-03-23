import React, { useContext } from 'react'
import { ThemeContext } from 'gatsby-plugin-theme-switcher';

const myThemes = [
	{
		id: 'theme-light',
		name: 'Light theme',
		icon: 'light_mode'
	},
	{
		id: 'theme-dark',
		name: 'Dark theme',
		icon: 'dark_mode'
	}
]

export default function ThemePicker() {
	const { theme, switchTheme } = useContext(ThemeContext);
	return (
		<>
			{myThemes.map((item, index) => {
				const nextTheme = myThemes.length -1 === index ? myThemes[0].id : myThemes[index + 1].id;
			
				return item.id === theme ? (
					<span className="material-icons" style={{cursor: 'pointer'}} key={item.id} aria-label={`${item.name}`} onClick={() => switchTheme(nextTheme)}>
						{item.icon}
					</span>
				) : null;
			})}
		</>
	);
};