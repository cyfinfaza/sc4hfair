import json

with open(input("geojson file: ")) as file:
    data = json.load(file)

with open(input("tent names file: ")) as file:
    tentNames = json.load(file)

for feature in data["features"]:
    feature['properties']['name'] = tentNames[feature['properties']['slug']]

with open(input("output file: "), 'w') as file:
    json.dump(data, file)
