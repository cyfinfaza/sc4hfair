import { useState } from 'react'
import * as style from './modal.module.css'

const Modal = ({ show, onClose, children }) => {
	const [closed, setClosed] = useState(!show)
	const close = e => {
		// only close if its not actually the modal
		if (e.target.className === style.wrapper || e.target.className.includes(style.close)) {
			onClose()
			setClosed(true)
		}
	}
	return closed ? null : (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
		<div className={style.wrapper} onClick={close} role="dialog">
			<div className={style.content}>
				<i
					className={`${style.close} material-icons`}
					onClick={close}
					onKeyDown={close}
					role="button"
					aria-label="Close"
					tabIndex={0}
				>
					close
				</i>
				{children}
			</div>
		</div>
	)
}

export default Modal
