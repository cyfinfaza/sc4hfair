"""

Create a color theme JSON file from a Mapbox style example:

python3 makeMapboxColorTheme.py mapbox-style.json >> color-theme.json

"""

import json
import sys

with open(sys.argv[1]) as file:
    data = json.load(file)

output = []

for layer in data["layers"]:
    if "paint" in layer:
        for property in layer["paint"].keys():
            if property[-5:] == "color" and type(layer["paint"][property]) == str:
                modObj = [layer["id"], None, None]
                modObj[1] = property
                modObj[2] = layer["paint"][property]
                output.append(modObj)

print(json.dumps(output))
