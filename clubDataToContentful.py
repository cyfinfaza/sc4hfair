"""

Converts clubData.json to Contentful's API export format
https://github.com/contentful/contentful-cli/tree/master/docs/space/import

python clubDataToContentful.py

contentful space import --content-file contentful-export-ready.json --skip-content-model --skip-content-publishing  --management-token YOUR_MANAGEMENT_TOKEN --space-id YOUR_SPACE_ID

"""

import json

data = json.load(open('clubData.json'))

entries = []

for club in data:
	entry = {
		"metadata": {
			"tags": []
		},
		"sys": {
			"space": {
				"sys": {
					"type": "Link",
					"linkType": "Space",
					"id": "e34g9w63217k"
				}
			},
			"id": club['slug'], # "7pJ2cg6oW7CI4gUjK1F8Gv",
			"type": "Entry",
			# "createdAt": "2022-07-18T21:28:52.225Z",
			# "updatedAt": "2022-07-18T21:35:52.487Z",
			"environment": {
				"sys": {
					"id": "master",
					"type": "Link",
					"linkType": "Environment"
				}
			},
			# "publishedVersion": 17,
			# "publishedAt": "2022-07-18T21:35:52.487Z",
			# "firstPublishedAt": "2022-07-18T21:35:52.487Z",
			"createdBy": {
				"sys": {
					"type": "Link",
					"linkType": "User",
					"id": "0zInKWmHbwXwqFylt4anl2"
				}
			},
			"updatedBy": {
				"sys": {
					"type": "Link",
					"linkType": "User",
					"id": "0zInKWmHbwXwqFylt4anl2"
				}
			},
			# "publishedCounter": 1,
			# "version": 18,
			"publishedBy": {
				"sys": {
					"type": "Link",
					"linkType": "User",
					"id": "0zInKWmHbwXwqFylt4anl2"
				}
			},
			"contentType": {
				"sys": {
					"type": "Link",
					"linkType": "ContentType",
					"id": "club"
				}
			}
		},
		"fields": {
			"name": {
				"en-US": club['name']
			},
			"slug": {
				"en-US": club['slug']
			},
			"description": {
				"en-US": club['description']
			},
			"meetingLocation": {
				"en-US": club['meeting_where'] if 'meeting_where' in club else "",
			},
			"meetingWhen": {
				"en-US": club['meeting_when'] if 'meeting_when' in club else ""
			},
			"grades": {
				"en-US": club['grades'] if 'grades' in club else ""
			},
			"clubWebsite": {
				"en-US": club['website'] if 'website' in club else ""
			},
			"listingWebsite": {
				"en-US": 'https://4histops.org/' + club['slug']
			}
		}
	}

	entries.append(entry)

with open('contentful-export-ready.json', 'w') as file:
	json.dump({
		'entries': entries
	}, file, indent='\t')
	file.close()