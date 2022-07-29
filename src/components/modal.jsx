import { useEffect, useState } from 'react'
import LinkButton from './linkbutton'
import * as style from './modal.module.css'

const Modal = ({
	show,
	onClose = () => {}, // when cancelling
	onConfirm = () => {}, // when confirming
	confirmation = false, // show confirm/cancel buttons instad of just close
	danger = true, // when you're deleting something
	children, // contents
}) => {
	const [showing, setShowing] = useState(show)
	useEffect(() => setShowing(show), [show])

	const close = (e, confirmed = false) => {
		// only close if its not actually the modal
		if (
			e === null ||
			e.target.className === style.wrapper ||
			e.target.className.includes(style.close)
		) {
			if (confirmed) onConfirm()
			else onClose()
			setShowing(false)
			console.trace('closing modal')
		}
	}

	return showing ? (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
		<div className={style.wrapper} onClick={close} role="dialog">
			<div className={style.content}>
				{!confirmation && (
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
				)}
				{children}
				{confirmation && (
					<div className="horizPanel" style={{ marginTop: '.75em' }}>
						<LinkButton icon="close" label="Cancel" onClick={() => close(null, false)} />
						<LinkButton
							icon={danger ? 'delete' : 'check'}
							label="Confirm"
							onClick={() => close(null, true)}
							style={danger ? { backgroundColor: 'var(--red)', color: 'var(--red-text)' } : null}
						/>
					</div>
				)}
			</div>
		</div>
	) : null
}

export default Modal
