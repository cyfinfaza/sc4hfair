import { refreshTheme } from './src/logic/theming'

export function onRenderBody({ setPreBodyComponents }) {
	setPreBodyComponents([
		<script key={0} dangerouslySetInnerHTML={{ __html: `${refreshTheme} refreshTheme()` }} />,
	])
}
