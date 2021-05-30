const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const doc = new GoogleSpreadsheet(process.env.RESPONSES_SPREADSHEET_ID);

doc.useServiceAccountAuth(
	{
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY,
	},
	(err) => {
		console.log(err);
	}
);

doc.loadInfo().then(() => {
	sheet = doc.sheetsByIndex[0];
});

function addRow({ name, email, message }) {
	sheet
		.addRow({
			Timestamp: new Date(Date.now()).toISOString(),
			Name: name,
			Email: email,
			Message: message,
		})
		.then((rows) => {
			console.log(rows);
		});
}

const app = express();
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.post('/contact', (req, res) => {
	let data = req.body;
	if (data.name && data.email && data.message) {
		try {
			addRow(data);
			res.status(201);
			res.send({
				type: 'success',
				message: 'Message recorded',
			});
		} catch (err) {
			res.status(500);
			res.send({
				type: 'error',
				message: 'Internal server error',
			});
		}
	} else {
		res.status(400);
		res.send({
			type: 'error',
			message: 'Missing required parameters',
		});
	}
});

module.exports = app;
