import React from 'react'
import PropTypes from 'prop-types'

export default function HTML(props) {
	return (
		<html {...props.htmlAttributes}>
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="x-ua-compatible" content="ie=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				{props.headComponents}
			</head>
			<body {...props.bodyAttributes}>
				{props.preBodyComponents}
				<div
					key={`body`}
					id="___gatsby"
					dangerouslySetInnerHTML={{ __html: props.body }}
				/>
				{props.postBodyComponents}
			</body>
			<script
				dangerouslySetInnerHTML={{
					__html: `
          fetch("${
						process.env.PVT_URL || '/api/pvt'
					}", {method:'POST', body:window.location.href, credentials:'include'}).then(response=>response.text().then(status=>{
            console.log("track:", status);
            if(status=="unconfirmed"){
              fetch("${
								process.env.PVT_URL || '/api/pvt'
							}", {method:'POST', body:window.location.href, credentials:'include'})
            }
          }));
        `,
				}}
			/>
		</html>
	)
}

HTML.propTypes = {
	htmlAttributes: PropTypes.object,
	headComponents: PropTypes.array,
	bodyAttributes: PropTypes.object,
	preBodyComponents: PropTypes.array,
	body: PropTypes.string,
	postBodyComponents: PropTypes.array,
}
