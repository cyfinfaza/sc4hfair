import Layout from 'components/layout'
import mapboxgl from '!mapbox-gl'
import polylabel from 'polylabel'
import { useRef, useEffect, useState } from 'react'
import * as pageStyle from './map.module.scss'
import LinkButton from 'components/linkbutton'
import 'mapbox-gl/dist/mapbox-gl.css'
import './map.addon.css'
import { getTheme, onThemeChange } from 'logic/theming'
import Tabs from 'components/tabs'
import { Link, graphql } from 'gatsby'
import Moment from 'react-moment'

const mapboxColorThemes = {
	light: require('../../static/mapbox-color-themes/theme-light.json'),
	dark: require('../../static/mapbox-color-themes/theme-dark.json'),
}

// the source/layer that contains our features
const source = 'composite',
	sourceLayer = 'Fair_Tileset_Test_1',
	sourceLayerId = 'fair-tileset-test-1'

mapboxgl.accessToken =
	'pk.eyJ1IjoiY3lmaW5mYXphIiwiYSI6ImNrYXBwN2N4ZTEyd3gycHF0bHhzZXIwcWEifQ.8Dx5dx27ity49fAGyZNzPQ'

let previouslySelectedFeature = null

const MapPage = ({
	data: {
		allContentfulClub: { nodes: clubData },
		allContentfulScheduledEvent: { nodes: eventData },
	},
}) => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const geolocate = useRef(null)
	/* eslint-disable no-unused-vars */
	const [lng, setLng] = useState(-74.677043)
	const [lat, setLat] = useState(40.577636)
	const [zoom, setZoom] = useState(16)
	/* eslint-enable no-unused-vars */
	const [selectedFeature, setSelectedFeature] = useState(null)

	function changeTheme(theme) {
		const themeData = mapboxColorThemes[{ 'theme-light': 'light', 'theme-dark': 'dark' }[theme]]
		themeData.forEach(property => {
			map.current.setPaintProperty(...property)
		})
	}

	useEffect(() => {
		if (map.current) return // Initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/cyfinfaza/ckpc2xa2e14mx18qxuqwb4icf',
			center: [lng, lat],
			zoom: zoom,
			attributionControl: false,
		})

		map.current.on('load', _ => {
			changeTheme(getTheme())
			onThemeChange.subscribe(next => {
				changeTheme(next)
			})

			// Locate a tent by its slug
			let toLocate = new URLSearchParams(window.location.search).get('locate')
			if (toLocate) {
				let query = map.current.querySourceFeatures(source, {
					sourceLayer: sourceLayer,
					filter: ['==', 'slug', toLocate], // check tent slug
				})
				if (query.length !== 0) {
					// assuming that the biggest id is actually the one shown because otherwise i have no idea how to get the correct one
					let element = query.reduce((a, b) => (a.id > b.id ? a : b))
					console.log(element, query)

					map.current.flyTo({
						center: polylabel(element.geometry.coordinates), // use the center of the tent
						zoom: 18.5,
						speed: 2.7, // this is done once on page load so make it go fast
					})
					map.current.once('moveend', () => {
						setSelectedFeature({
							source,
							sourceLayer,
							...element,
						})
					})
				} else {
					console.warn('No tent found for', toLocate)
				}
			}
		})

		window.map = map.current
		window.changeTheme = changeTheme
		window.mapboxColorThemes = mapboxColorThemes

		geolocate.current = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		})
		map.current.addControl(geolocate.current)

		const scale = new mapboxgl.ScaleControl({
			unit: 'imperial',
		})
		map.current.addControl(scale)

		map.current.on('click', sourceLayerId, function (e) {
			const feature = e.features[0]
			console.log(selectedFeature, feature)
			setSelectedFeature(feature)
		})
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(
		_ => {
			previouslySelectedFeature &&
				map.current.setFeatureState(
					{
						source: previouslySelectedFeature.source,
						id: previouslySelectedFeature.id,
						sourceLayer: previouslySelectedFeature.sourceLayer,
					},
					{
						click: false,
					}
				)
			if (selectedFeature) {
				map.current.setFeatureState(
					{
						source: selectedFeature.source,
						id: selectedFeature.id,
						sourceLayer: selectedFeature.sourceLayer,
					},
					{
						click: true,
					}
				)
				previouslySelectedFeature = selectedFeature
			} else {
				previouslySelectedFeature = null
			}
		},
		[selectedFeature]
	)

	var filteredEventData = eventData.filter(
		event =>
			event.tent === selectedFeature?.properties.slug &&
			Date.now() < new Date(event.endTime).getTime()
	)
	var filteredClubData = clubData.filter(club => club.tent === selectedFeature?.properties.slug)

	const [clickCounter, setClickCounter] = useState(0)
	return (
		<Layout
			title="Map"
			noPadding
			noHeaderPadding
			fixedHeightContent
			fullWidth
			style={{ overflow: 'hidden' }}
		>
			<div className={pageStyle.controlsContainer}>
				<LinkButton
					label="Center on fair"
					icon="place"
					onClick={() => {
						setClickCounter(clickCounter + 1)
						map.current.flyTo({
							center: [lng, lat],
							zoom: zoom,
						})
					}}
					lightFont
					acrylic
				/>
				<LinkButton
					label="Locate me"
					icon="my_location"
					onClick={() => {
						geolocate.current.trigger()
					}}
					lightFont
					acrylic
				/>
			</div>
			<div
				className={`${pageStyle.mapContainer} ${clickCounter >= 50 && pageStyle.easterEgg}`}
				ref={mapContainer}
			/>

			<div className={`${pageStyle.tentInfo} ${!selectedFeature ? pageStyle.hidden : ''}`}>
				<div>
					<h2 className={pageStyle.tentInfoHeading}>
						{selectedFeature?.properties.name || '-'}
						<LinkButton
							label="Close"
							icon="close"
							onClick={() => {
								setSelectedFeature(null)
							}}
							acrylic
						/>
					</h2>
					<p>Info about {selectedFeature?.properties.name} tent goes here</p>
					<Tabs
						tabs={[
							{
								name: 'events',
								content: filteredEventData.length ? (
									<ul>
										{filteredEventData.map(event => (
											<li key={event.title}>
												<Link to={'/schedule#' + event.id}>{event.title}</Link>{' '}
												<small>
													(<Moment interval={0} date={event.time} format="MMMM D [at] h:mmA" />)
												</small>
											</li>
										))}
									</ul>
								) : (
									<p>No events found</p>
								),
							},
							{
								name: 'clubs',
								content: filteredClubData.length ? (
									<ul>
										{filteredClubData.map(club => (
											<li key={club.slug}>
												<Link to={'/' + club.slug}>{club.name}</Link>
											</li>
										))}
									</ul>
								) : (
									<p>No clubs found</p>
								),
							},
						]}
					/>
				</div>
			</div>
		</Layout>
	)
}

// filter: { endTime: { gt: ${new Date().toISOString()} } }
export const query = graphql`
	query {
		allContentfulClub {
			nodes {
				slug
				name
				tent
			}
		}
		allContentfulScheduledEvent(sort: { order: ASC, fields: [time] }) {
			nodes {
				id: contentful_id
				title
				time
				endTime
				description {
					description
				}
				category
				tent
			}
		}
	}
`

export default MapPage
