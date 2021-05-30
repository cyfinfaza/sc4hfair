const express = require('express')
const { google } = require('googleapis')
require('dotenv').config()

const jwtClient = new google.auth.JWT(
	process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
	null,
	process.env.GOOGLE_PRIVATE_KEY,
	['https://www.googleapis.com/auth/spreadsheets'],
	null
)

const sheets = google.sheets({
	version: 'v4',
	auth: jwtClient,
})

function addRow({ name, email, message }) {
	sheets.spreadsheets.values.append({
		// The ID of the spreadsheet to update.
		spreadsheetId: process.env.RESPONSES_SPREADSHEET_ID,

		// The A1 notation of a range to search for a logical table of data.
		// Values are appended after the last row of the table.
		range: 'A:D',

		// How the input data should be interpreted.
		valueInputOption: 'RAW',

		// How the input data should be inserted.
		insertDataOption: 'INSERT_ROWS',

		resource: {
			values: [[new Date(Date.now()).toISOString(), name, email, message]],
		},
	})
}

const app = express()
app.use(express.urlencoded({ extended: true }))
const port = 3000

app.post('/api/contact', (req, res) => {
	let data = req.body
	if (data.name && data.email && data.message) {
		try {
			addRow(data)
			res.status(201)
			res.send({
				type: 'success',
				message: 'Message recorded',
			})
		} catch (err) {
			res.status(500)
			res.send({
				type: 'error',
				message: 'Internal server error',
			})
		}
	} else {
		res.status(400)
		res.send({
			type: 'error',
			message: 'Missing required parameters',
		})
	}
})

app.get('/api', (req, res) => {
	res.send('Hello, world!')
})

module.exports = app
app.listen(5000, '0.0.0.0')
