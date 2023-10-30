import os
import requests
import asyncio
import nats
import json
import redis

def get_github_token():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("The environment variable GITHUB_TOKEN is not set.")

    return GITHUB_TOKEN

def get_data_from_redis():
    r = redis.StrictRedis(host='redis', port=6379, db=0)
    data = r.get('approved_issues')
    if data:
        return json.loads(data.decode('utf-8'))
    return None

def save_data_to_redis(data):
    r = redis.StrictRedis(host='redis', port=6379, db=0)
    r.setex('approved_issues', 4 * 60 * 60, json.dumps(data))

async def main():
    cached_data = get_data_from_redis()
    
    if cached_data:
        result = cached_data
    else:
        GITHUB_TOKEN = get_github_token()

        HEADERS = {
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        }

        url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"

        params = {
            "per_page": 100,
            "state": "all"
        }

        def get_issues(page):
            params["page"] = page
            response = requests.get(url, headers=HEADERS, params=params)
            response.raise_for_status()
            return response.json()

        issues_by_year = {}

        approved_label = None
        labels_url = "https://api.github.com/repos/ton-society/grants-and-bounties/labels"

        response = requests.get(labels_url, headers=HEADERS)
        response.raise_for_status()
        labels = response.json()

        for label in labels:
            if label["name"] == "Approved":
                approved_label = label
                break

        page = 1
        while True:
            issues = get_issues(page)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                year_data = issues_by_year.setdefault(created_at, {"ClosedApprovedIssues": 0, "ClosedTotalIssues": 0})

                if issue["state"] == "closed":
                    year_data["ClosedTotalIssues"] += 1

                    if approved_label and approved_label in issue["labels"]:
                        year_data["ClosedApprovedIssues"] += 1

            page += 1

        result = [{"Date": year, "ClosedApprovedIssues": str(data["ClosedApprovedIssues"]), "ClosedTotalIssues": str(data["ClosedTotalIssues"])} for year, data in issues_by_year.items()]

        save_data_to_redis(result)

    nc = await nats.connect("nats")

    await nc.publish("approved_issues", json.dumps(result).encode())

    await nc.close()

if __name__ == '__main__':
    asyncio.run(main())
