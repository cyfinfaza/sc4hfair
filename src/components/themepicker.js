import React, { useContext } from 'react'
import { ThemeContext } from 'gatsby-plugin-theme-switcher';

const myThemes = [
	{
		id: 'theme-light',
		name: 'Light',
	},
	{
		id: 'theme-dark',
		name: 'Dark',
	}
]

export default function ThemePicker() {
	const { theme, switchTheme } = useContext(ThemeContext);
	return (
		<div>
			{myThemes.map((item, index) => {
				const nextTheme = myThemes.length -1 === index ? myThemes[0].id : myThemes[index + 1].id;
			
				return item.id === theme ? (
					<div key={item.id} className={item.id}>
						<button aria-label={`${item.name} Theme`} onClick={() => switchTheme(nextTheme)}>
							{item.name}
						</button>
					</div>
				) : null;
			})}
		</div>
	);
};