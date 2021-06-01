import * as React from 'react'
// import ReactMarkdown from 'react-markdown'
import * as style from './event.module.css'
import moment from 'moment'
import formatDuration from '../functions/formatDuration'

const EventBox = ({
	title,
	content,
	time,
	endTime,
	index = 0,
	imgURL = null,
}) => {
	var duration = moment.duration(moment(endTime).diff(moment(time))),
		formattedDuration = formatDuration(duration) + ' long'

	return (
		<div
			className={style.container}
			style={{
				animationDelay: index * 0.1 + 's',
				backgroundImage: imgURL ? `var(--image-dimmer), url(${imgURL})` : null,
				// TODO make this have nice transition, below code does not work
				// transition: '--image-dimmer var(--theme-transition)',
			}}
		>
			<div className={style.left}>
				<h1 className={style.title}>{title}</h1>
				<p className={style.desc}>{content}</p>
			</div>
			<div className={style.right}>
				<h2 className={style.time}>
					{moment(time).format('MMMM D [at] h:mmA')}
				</h2>
				<p>{formattedDuration}</p>
			</div>
		</div>
	)
}

export default EventBox
