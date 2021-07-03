import React from 'react'
import Layout from '../components/layout'
import mapboxgl from '!mapbox-gl'
import { useRef, useEffect, useState, useContext } from 'react'
import { ThemeContext } from 'gatsby-plugin-theme-switcher'
import * as pageStyle from './map.module.css'
import LinkButton from '../components/linkbutton'
import 'mapbox-gl/dist/mapbox-gl.css'

const clubData = require('../../static/clubData.json')

mapboxgl.accessToken =
	'pk.eyJ1IjoiY3lmaW5mYXphIiwiYSI6ImNrYXBwN2N4ZTEyd3gycHF0bHhzZXIwcWEifQ.8Dx5dx27ity49fAGyZNzPQ'

const MapPage = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const geolocate = useRef(null)
	const [lng, setLng] = useState(-74.677043)
	const [lat, setLat] = useState(40.577636)
	const [zoom, setZoom] = useState(16)
	const { theme } = useContext(ThemeContext)
	useEffect(() => {
		if (map.current) return // Initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/cyfinfaza/ckpc2xa2e14mx18qxuqwb4icf',
			center: [lng, lat],
			zoom: zoom,
		})
		window.map = map.current
		geolocate.current = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		})

		// Add the control to the map
		map.current.addControl(geolocate.current)
		map.current.on('click', 'fair-tileset-test-1', function (e) {
			let feature = e.features[0]
			console.log(feature)
			map.current.setFeatureState(
				{
					source: feature.source,
					id: feature.id,
					sourceLayer: feature.source,
				},
				{
					click: true,
					hover: true,
				}
			)
		})

		// Locator
		var searcher = new URLSearchParams(window.location.search)
		var toLocate = searcher.get('locate')
		if (
			toLocate &&
			clubData.filter(item => item.slug === toLocate).length > 0
		) {
			const thisClubData = clubData.filter(item => item.slug === toLocate)[0]
			if (!thisClubData.location)
				return console.warn('No location data for', toLocate)
			console.log('Locating', toLocate)
			new mapboxgl.Marker()
				.setLngLat(thisClubData.location)
				.setPopup(
					new mapboxgl.Popup().setHTML(`<p>look it's ${thisClubData.name}</p>`)
				)
				.addTo(map.current)
				.togglePopup() // Open popup by default

			map.current.flyTo({
				// Center on club
				center: thisClubData.location,
				zoom: zoom,
			})
		}
	})

	const [clickCounter, setClickCounter] = useState(0)
	return (
		<Layout title="Map" noPadding noHeaderPadding fixedHeightContent fullWidth>
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
					inline
					acrylic
				/>
				<LinkButton
					label="Locate me"
					icon="my_location"
					onClick={() => {
						geolocate.current.trigger()
					}}
					lightFont
					inline
					acrylic
				/>
			</div>
			<div className={pageStyle.mapContainer} ref={mapContainer} />
			<style>
				{clickCounter >= 50
					? `.${pageStyle.mapContainer} .mapboxgl-canvas {
					background-color: red;
					animation: hue_rotate 3s infinite;
				}
				@keyframes hue_rotate {
					0% {
						filter: hue-rotate(0deg);
					}
					100% {
						filter: hue-rotate(360deg);
					}
				}`
					: null}
			</style>
		</Layout>
	)
}

export default MapPage
