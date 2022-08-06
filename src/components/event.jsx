// import ReactMarkdown from 'react-markdown'
import LinkButton from './linkbutton'
import { share, canWebShare } from 'logic/webshare'
import * as style from './event.module.scss'
import Moment from 'react-moment'
import momentCalendarStrings from 'logic/momentCalendarStrings'
import tentSlugs from '../../static/tentSlugs.json'
// import { useEffect } from 'react'

function addHoursToDate(date, hours) {
	return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

const DEFAULT_EVENT_DURATION_HOURS = 2

export const eventIsFuture = event =>
	Date.now() <
	(event.endTime
		? new Date(event.endTime)
		: addHoursToDate(new Date(event.time), DEFAULT_EVENT_DURATION_HOURS)
	).getTime()

const timeLabels = {
	past: {
		label: 'Past',
		style: {
			background: 'var(--grey)',
			color: 'var(--grey-text)',
		},
	},
	future: {
		label: 'Scheduled',
		style: {
			background: 'var(--yellow)',
			color: 'var(--yellow-text)',
		},
	},
	now: {
		label: 'Now',
		style: {
			background: 'var(--green)',
			color: 'var(--green-text)',
		},
	},
}

const EventBox = ({ event, index = 0, starred, toggleStarredEvent }) => {
	const isBrowser = typeof window !== 'undefined'
	const targeted = isBrowser && window.location?.hash === '#' + event.id
	// only make it larger once, otherwise keep it normal
	// useEffect(() => {
	// 	if (targeted)
	// 		window.history?.replaceState('', null, window.location.pathname + window.location.search)
	// }, []) // eslint-disable-line react-hooks/exhaustive-deps
	var timeLabel
	// console.log(event.time)
	if (!eventIsFuture(event)) {
		timeLabel = timeLabels.past
	} else {
		if (new Date(event.time) > new Date()) {
			timeLabel = timeLabels.future
		} else {
			timeLabel = timeLabels.now
		}
	}
	return (
		<div
			className={`${style.container} ${targeted ? style.targeted : ''}`}
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
				<h2>{event.title}</h2>
				{event.description && <p>{event.description.description}</p>}
			</div>
			<div className={style.bottom}>
				<div className={style.timeData}>
					<h3>
						<div className={style.eventTimeLabel} style={timeLabel.style}>
							{timeLabel.label}
						</div>
						<Moment interval={0} date={event.time} calendar={momentCalendarStrings} />
					</h3>
					{event.endTime && (
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
					)}
				</div>
				<div className={style.buttonPanel}>
					{event.tent && event.tent !== '---' && (
						<LinkButton
							label={tentSlugs[event.tent] || event.tent}
							disabled={!tentSlugs[event.tent]}
							icon="place"
							linksTo={`/map?locate=${event.tent}`}
						/>
					)}
					{isBrowser && canWebShare() && (
						<LinkButton
							// label="Share"
							icon="share"
							onClick={() => {
								let loc = new URL(window.location.href)
								loc.hash = event.id
								share(event.title, loc.toString())
							}}
							lightFont
						/>
					)}
					<LinkButton
						// label={starred ? 'Starred' : 'Star'}
						icon="star"
						accent={starred}
						onClick={_ => toggleStarredEvent(event.id)}
					/>
				</div>
			</div>
		</div>
	)
}

export default EventBox
