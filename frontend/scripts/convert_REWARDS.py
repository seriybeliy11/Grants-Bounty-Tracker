import csv
import json

csv_file = 'rewards.csv'
json_file = 'rewards.json'

data = []

with open(csv_file, 'r') as csvfile:
    csvreader = csv.DictReader(csvfile)
    for row in csvreader:
        rewards_thousands = float(row["Rewards (th. $)"])
        rewards_int = int(rewards_thousands * 1000)
        row["Rewards (th. $)"] = rewards_int
        data.append(row)

json_filename = 'rewards.json'
json_file_path = os.path.join('..', 'public', json_filename)

with open(json_file_path, 'w') as json_file:
    json.dump(data, json_file, indent=2)

print(f'JSON data written to "../public/{json_filename}".')
