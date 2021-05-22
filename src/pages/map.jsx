import React from 'react'
// import Layout from '../components/layout'
import Header from '../components/header'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'

const MapPage = ({ google }) => {
	return (
		<div style={{ height: '100%' }}>
			<Header offsetContent={false} containerStyle={{ height: '100%' }} />
			<Map google={google} zoom={14}>
				<Marker name={'Current location'} />
				{/* <Marker onClick={this.onMarkerClick} name={'Current location'} /> */}

				<InfoWindow>
					{/* <InfoWindow onClose={this.onInfoWindowClose}> */}
					<div>
						<h1>{this.state.selectedPlace.name}</h1>
					</div>
				</InfoWindow>
			</Map>
		</div>
	)
}
export default GoogleApiWrapper({
	apiKey: 'AIzaSyCMSL0SaWn10CCGkILYDmFLz-DntlTvWus',
})(MapPage)
