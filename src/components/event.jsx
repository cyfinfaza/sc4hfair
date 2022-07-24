// import ReactMarkdown from 'react-markdown'
import LinkButton from './linkbutton'
import { share, canWebShare } from 'logic/webshare'
import * as style from './event.module.css'
import Moment from 'react-moment'
import { useEffect } from 'react'

const EventBox = ({ event, index = 0 }) => {
	const isBrowser = typeof window !== 'undefined'
	const targeted = isBrowser && window.location?.hash === '#' + event.id
	// only make it larger once, otherwise keep it normal
	// useEffect(() => {
	// 	if (targeted)
	// 		window.history?.replaceState('', null, window.location.pathname + window.location.search)
	// }, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			className={`${style.container} ${targeted ? style.targeted : ''} ${
				new Date(event.endTime).getTime() < Date.now() ? style.past : ''
			}`}
			id={event.id}
			style={{
				animationDelay: index * 0.1 + 's',
				// backgroundImage: event.coverImage?.url
				// 	? `var(--image-dimmer), url(${event.coverImage.url})`
				// 	: null,
				// TODO make this have nice transition, below code does not work
				// transition: '--image-dimmer var(--theme-transition)',
			}}
		>
			<div className={style.top}>
				<h1 className={style.title}>{event.title}</h1>
				<p className={style.desc}>{event.content}</p>
			</div>
			<div className={style.bottom}>
				<div className={style.buttonPanel}>
					{isBrowser && canWebShare() && (
						<LinkButton
							label="Share"
							icon="share"
							onClick={() => {
								let loc = new URL(window.location.href)
								loc.hash = event.id
								share(event.title, loc.toString())
							}}
							lightFont
						/>
					)}
					{event.tent && (
						<LinkButton label="Map" icon="place" linksTo={`/map?locate=${event.tent}`} lightFont />
					)}
				</div>
				<div className={style.timeData}>
					<h2 className={style.time}>
						<Moment interval={0} date={event.time} format="MMMM D [at] h:mmA" />
					</h2>
					<p>
						<Moment
							interval={0} // these are static dates
							duration={event.time}
							date={event.endTime}
							trim="both"
							format="y [years]  M [months] d [days] h [hours] m [minutes]"
						/>
						{' long'}
					</p>
				</div>
			</div>
		</div>
	)
}

export default EventBox
