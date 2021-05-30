import gspread
import time
import datetime
from flask import Flask, request, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
credz = os.environ.get("SHEETS_API")
with open('credz.json', 'w') as file:
	file.write(credz)

app = Flask(__name__)
cors = CORS(app)

gc = gspread.service_account(filename="credz.json")

sh = gc.open("A sheet that will be read")

worksheet = sh.sheet1

@app.route("/", methods=['GET', 'POST'])
def index():
	if request.method == 'GET':
		return render_template("formpage.html")
	if request.method == 'POST':
		rown = len(worksheet.col_values(1))+1
		worksheet.update(f'A{rown}:C{rown}', [[str(datetime.datetime.now()), request.form['identifier'], request.form['comment']]])
		return "success"

if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000)

# while True:
# 	rown = len(worksheet.col_values(1))+1
# 	worksheet.update(f'A{rown}:B{rown}', [[str(datetime.datetime.now()), input('Your Message: ')]])
