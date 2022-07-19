// import ReactMarkdown from 'react-markdown'
import * as style from './event.module.css'
import Moment from 'react-moment'

const EventBox = ({ title, content, time, endTime, index = 0, imgURL = null }) => {
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
					<Moment interval={0} date={time} format="MMMM D [at] h:mmA" />
				</h2>
				<p>
					<Moment
						interval={0} // these are static dates
						duration={time}
						date={endTime}
						trim="both"
						format="y [years]  M [months] d [days] h [hours] m [minutes]"
					/>
					{' long'}
				</p>
			</div>
		</div>
	)
}

export default EventBox
