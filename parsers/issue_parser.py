import os
import requests
import asyncio
import json
import nats
import redis

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

if GITHUB_TOKEN is None:
    raise ValueError("Environment variable GITHUB_TOKEN is not set.")
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

async def main():
    r = redis.Redis(host='redis', port=6379, db=0)

    cached_data = r.get("count_issues")
    if cached_data:
        result = cached_data.decode('utf-8')
    else:
        issues_by_year = {}
        page = 1
        while True:
            issues = get_issues(page)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                issues_by_year[created_at] = issues_by_year.get(created_at, 0) + 1

            page += 1

        result = [{"Dates": year, "All Issues": count} for year, count in issues_by_year.items()]

        r.setex("count_issues", 14400, json.dumps(result))

    nc = await nats.connect("nats")
    await nc.publish("count_issues", result.encode())
    await nc.close()

if __name__ == '__main__':
    asyncio.run(main())
