import * as React from 'react'
// import {useState} from 'react'
import * as style from './toggleButton.module.css'

const ToggleButton = ({ on = false, children, onClick }) => {
	return (
		<button
			className={style.theButton}
			style={{ backgroundColor: on ? 'var(--accent)' : null }}
			onClick={onClick}
		>
			{children}
		</button>
	)
}

export default ToggleButton
