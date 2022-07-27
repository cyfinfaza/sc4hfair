"""

Fetches the list of clubs and their details from the 4-H website

python3 updateClubData.py ./clubData.json

"""

import json
import sys
import requests
import bs4
import re
from time import sleep

oldClubData = {} # transforming to an object for ease of use
with open(sys.argv[1]) as file:
	data = json.load(file)
	for club in data:
		oldClubData[club['slug']] = club

clubData = []
doneSlugs = [] # because of course some listings are duplicated

for clubListing in ['https://4histops.org/clubs', 'https://4histops.org/4-h-prep-club']:
	page = requests.get(clubListing)
	soup = bs4.BeautifulSoup(page.content, 'html.parser')

	# navigate to each club
	for club in soup.select('ul h3 a'):
		while True:
			slug = club.get('href').strip()
			if slug.startswith('http'): slug = slug[len('https://4histops.org/'):]
			if slug.startswith('/'): slug = slug[1:]

			if slug in doneSlugs: break
			print(slug)

			page = requests.get('https://4histops.org/' + slug)
			soup = bs4.BeautifulSoup(page.content, 'html.parser')
			block = soup.select_one('.sqs-layout')

			if page.status_code == 429:
				sleep(5)
				continue # retry this club
			elif page.status_code != 200:
				print('Error:', page.status_code)
				break

			try:
				data = {
					'slug': slug,
					'name': block.find('h2').text.title().replace('And', 'and').strip(), # it's transformed to upper case so the actual value is random cases
					'description': block.find('p').text.strip(),
					'meeting_where': '',
					'meeting_when': '',
					'grades': '',
				}

				for field in block.find_all('p'):
					value = field.text.strip().split(':')
					key = value.pop(0).lower()
					value = ':'.join(value).strip()

					if key == 'where': data['meeting_where'] = value
					elif key == 'when': data['meeting_when'] = value
					elif key == 'grades':
						short = re.search(r'^(K|\d{1,2})\s?-\s?(\d{1,2})$', value) # formats things like "K - 12" or "1 -3"
						if short != None: value = short.group(1) + '-' + short.group(2)
						data['grades'] = value

				# move over old values
				if slug in oldClubData:
					for key in oldClubData[slug]:
						if key not in data:
							data[key] = oldClubData[slug][key]

				doneSlugs.append(slug)
				clubData.append(data)

			except AttributeError as e: # couldn't find one of the items
				print(e)
				print('---')
				print(page.status_code)
				print('---')
				print(block)
				print('---')
				print(soup.select_one('.Main-content'))
				continue

			sleep(1)
			break # exit this infinite loop and go to the next club

with open(sys.argv[1], 'w') as file:
	json.dump(clubData, file, indent='\t')
	file.close()