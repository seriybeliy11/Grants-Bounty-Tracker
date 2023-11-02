import requests
import pandas as pd
from plate import token
import time
import json
from datetime import datetime, timedelta
import os

headers = {
    "Authorization": token,
    "Accept": "application/vnd.github.v3+json"
}

url_closed = "https://api.github.com/repos/ton-society/ton-footsteps/issues"

dates = [
    '2022-01-31T09:39:52Z',
    '2023-01-31T09:39:52Z'
]

data = []
session = requests.Session()
session.headers.update(headers)

for date_str in dates:
    date = datetime.fromisoformat(date_str[:-1])
    end_date = date + timedelta(days=11*30)

    params_closed = {
        "state": "closed",
        "per_page": 100,
        "page": 1,
        "since": date.isoformat() + 'Z',
        "until": end_date.isoformat() + 'Z'
    }

    try:
        response_closed = session.get(url_closed, params=params_closed)
        response_closed.raise_for_status()

        closed_issues = response_closed.json()
        all_closed_issues = len(closed_issues)

        params_approved = {
            "state": "closed",
            "labels": "approved",
            "per_page": 100,
            "page": 1,
            "since": date.isoformat() + 'Z',
            "until": end_date.isoformat() + 'Z'
        }

        time.sleep(4)

        try:
            response_approved = session.get(url_closed, params=params_approved)
            response_approved.raise_for_status()

            approved_issues = response_approved.json()
            closed_approved_issues = len(approved_issues)

            data.append({"Date": date.isoformat(), "Closed Approved Issues": closed_approved_issues, "Closed Issues": all_closed_issues})

        except requests.exceptions.RequestException as e:
            print("Failed to retrieve closed approved issues for date", date.isoformat(), ":", e)

    except requests.exceptions.RequestException as e:
        print("Failed to retrieve closed issues for date", date.isoformat(), ":", e)

df = pd.DataFrame(data)

json_data = []
for index, row in df.iterrows():
    json_data.append({
        "Date": row["Date"],
        "ClosedApprovedIssues": str(row["Closed Approved Issues"]),
        "ClosedTotalIssues": str(row["Closed Issues"])
    })

file_path = os.path.join('..','public', 'dates_data.json')

with open(file_path, 'w') as json_file:
    json.dump(json_data, json_file, indent=2)

print("Conversion from CSV to JSON completed.")
