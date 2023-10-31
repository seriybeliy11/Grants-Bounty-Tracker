import requests
from datetime import datetime
import json
import time
import os

def get_github_data_all_pages(repo_name, year):
    base_url = f'https://api.github.com/repos/{repo_name}/issues'
    params = {"state": "all", "per_page": 100, "page": 1}

    result = []

    while True:
        response = requests.get(base_url, params=params)

        if response.status_code == 200:
            issues = response.json()

            if not issues:
                break

            for issue in issues:
                created_at = datetime.strptime(issue["created_at"].split("T")[0], "%Y-%m-%d")
                closed_at = issue["closed_at"]

                if isinstance(closed_at, str):
                    closed_at = datetime.strptime(closed_at.split("T")[0], "%Y-%m-%d")

                if created_at.year == year:
                    if closed_at:
                        duration = (closed_at - created_at).days
                    else:
                        duration = 0

                    result.append({
                        "number": str(issue["number"]),
                        "duration": float(duration)
                    })

            link_header = response.headers.get("Link", "")
            if 'rel="next"' not in link_header:
                break
            else:
                params["page"] += 1
                time.sleep(0.1)
        else:
            print(f"Failed to retrieve data from GitHub API. Status code: {response.status_code}")
            return None

    return result

repo_name = 'ton-society/grants-and-bounties'

years = [2022, 2023]

all_data = {}
for year in years:
    github_data = get_github_data_all_pages(repo_name, year)
    all_data[str(year)] = github_data

output_filename = 'InitialChartData.json'
output_file_path = os.path.join('..', 'public', output_filename)

with open(output_file_path, 'w') as json_file:
    json.dump(all_data, json_file, indent=4)

print(f'Data saved to {output_filename}')
