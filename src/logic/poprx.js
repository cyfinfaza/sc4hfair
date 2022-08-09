export default function start_poprx(addr) {
	let txid = window.localStorage.getItem('poprx-txid')
	if (!txid) {
		txid = Math.floor(Math.random() * 900000) + 100000
		window.localStorage.setItem('poprx-txid', txid)
	}
	const client = new WebSocket(addr)
	client.onmessage = function (event) {
		const data = JSON.parse(event.data)
		console.log('poprx:', data)
	}
	client.onopen = function (event) {
		client.send(
			JSON.stringify({
				type: 'txinit',
				data: { id: txid, agent: navigator.userAgent, path: window.location.pathname },
			})
		)
	}
}
