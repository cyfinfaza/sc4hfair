import csv
import json
import sys

string = sys.argv[1]
csvFile = csv.reader(filter(lambda row: row[0:1] != "//", string.splitlines()))

output = {}

for row in csvFile:
    if len(row) == 2:
        output[row[1]] = row[0]

print(json.dumps(output, indent=4))
