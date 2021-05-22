import React from 'react'
import Layout from '../components/layout'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'

const MapPage = ({ google }) => {
	return (
		<Layout title="Map" noPadding={true}>
			<div style={{ height: '100%' }}>
				<Map google={google} zoom={14}>
					{/* <Marker onClick={this.onMarkerClick} name={'Current location'} />

				
				<InfoWindow onClose={this.onInfoWindowClose}>
					<div>
						<h1>{this.state.selectedPlace.name}</h1>
					</div>
				</InfoWindow> */}
				</Map>
			</div>
		</Layout>
	)
}
export default GoogleApiWrapper({
	apiKey: 'AIzaSyCMSL0SaWn10CCGkILYDmFLz-DntlTvWus',
})(MapPage)
