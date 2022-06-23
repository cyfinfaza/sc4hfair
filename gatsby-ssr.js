import React from 'react'
import { refreshTheme } from './src/logic/theming'

export function onRenderBody({ setPreBodyComponents }) {
	setPreBodyComponents([
		<script
			dangerouslySetInnerHTML={{ __html: `${refreshTheme} refreshTheme()` }}
		/>,
	])
}
