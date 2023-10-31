import requests
from plate import token
import json
import os

url_issues = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/vnd.github.v3+json"
}

def get_all_issues(url, params):
    all_data = []
    per_page = params.get("per_page", 30)
    page = 1

    while True:
        params["page"] = page
        params["per_page"] = per_page

        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            print(f"Failed to fetch data. Status code: {response.status_code}")
            break

        data = response.json()
        all_data.extend(data)
        if len(data) < per_page:
            break

        page += 1

    return all_data

params_all = {
    "state": "all",
    "per_page": 100
}

all_issues = get_all_issues(url_issues, params_all)

count_2022 = sum(1 for issue in all_issues if issue.get("created_at", "").startswith("2022"))
count_2023 = sum(1 for issue in all_issues if issue.get("created_at", "").startswith("2023"))

data = [
    {"Dates": "2022", "All Issues": int(count_2022)},
    {"Dates": "2023", "All Issues": int(count_2023)}
]

json_data = json.dumps(data, indent=2)

file_path = 'github_all_issues.json'

with open(file_path, 'w') as json_file:
    json.dump(data, json_file, indent=2)
