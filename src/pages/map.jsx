import React from 'react'
import Layout from '../components/layout'
import mapboxgl from '!mapbox-gl'
import { useRef, useEffect, useState } from 'react'
import * as pageStyle from './map.module.scss'
import LinkButton from '../components/linkbutton'
import 'mapbox-gl/dist/mapbox-gl.css'
import './map.addon.css'
import { getTheme, onThemeChange } from '../logic/theming'

const clubData = require('../../static/clubData.json')
const mapboxColorThemes = {
	light: require('../../static/mapbox-color-themes/theme-light.json'),
	dark: require('../../static/mapbox-color-themes/theme-dark.json'),
}

mapboxgl.accessToken =
	'pk.eyJ1IjoiY3lmaW5mYXphIiwiYSI6ImNrYXBwN2N4ZTEyd3gycHF0bHhzZXIwcWEifQ.8Dx5dx27ity49fAGyZNzPQ'

let previouslySelectedFeature = null

const MapPage = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const geolocate = useRef(null)
	const [lng, setLng] = useState(-74.677043)
	const [lat, setLat] = useState(40.577636)
	const [zoom, setZoom] = useState(16)
	const [viewingTent, setViewingTent] = useState('')
	const [selectedFeature, setSelectedFeature] = useState(null)

	function changeTheme(theme) {
		const themeData =
			mapboxColorThemes[{ 'theme-light': 'light', 'theme-dark': 'dark' }[theme]]
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

		map.current.on('click', 'fair-tileset-test-1', function (e) {
			const feature = e.features[0]
			console.log(selectedFeature, feature)
			setSelectedFeature(feature)
		})

		// Locator
		var toLocate = new URLSearchParams(window.location.search).get('locate')
		var club = clubData.find(club => club.slug === toLocate)
		if (club) {
			if (!club.location) return console.warn('No location data for', toLocate)

			// new mapboxgl.Marker()
			// 	.setLngLat(club.location)
			// 	.setPopup(new mapboxgl.Popup().setHTML(`<p>look it's ${club.name}</p>`))
			// 	.addTo(map.current)
			// 	.togglePopup() // Open popup by default

			// find item in map
			let features = map.current.querySourceFeatures(
				'cyfinfaza.ckpe2ul0t1vfg21p6lhii0p4x-97748'
			)
			console.log(features)

			map.current.flyTo({
				// Center on club
				center: club.location,
				zoom: zoom,
			})
		}
	}, [])

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
				className={`${pageStyle.mapContainer} ${
					clickCounter >= 50 && pageStyle.easterEgg
				}`}
				ref={mapContainer}
			/>

			<div
				className={`${pageStyle.tentInfo} ${
					!selectedFeature && pageStyle.hidden
				}`}
			>
				<div>
					<h1>
						Tent info{' '}
						<LinkButton
							label="Close"
							icon="close"
							onClick={() => {
								setSelectedFeature(null)
							}}
							acrylic
						/>
					</h1>
					{selectedFeature?.properties.name}
				</div>
			</div>
		</Layout>
	)
}

export default MapPage
