import os
import requests
import asyncio
import json
import nats
import redis
from datetime import datetime, timedelta

async def main():
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

    def calculate_duration(issue):
        if issue["state"] == "open":
            created_at = datetime.fromisoformat(issue["created_at"][:-1])
            now = datetime.now()
            duration = (now - created_at).days
        else:
            duration = 0.0
        return duration

    redis_client = redis.Redis(host='redis', port=6379, db=0)

    duration_by_year = {}

    async def send_result_to_nats(result):
        nc = await nats.connect("nats")
        await nc.publish("issue_stats", result.encode())
        await nc.close()

    cached_result = redis_client.get("issue_stats")
    if cached_result is not None:
        result = cached_result.decode('utf-8')
    else:
        page = 1
        while True:
            issues = get_issues(page)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                duration = calculate_duration(issue)

                duration_by_year.setdefault(created_at, []).append({"number": str(issue["number"]), "duration": duration})

            page += 1

        result = [{year: issues} for year, issues in duration_by_year.items()]
        redis_client.setex("issue_stats", timedelta(hours=4), json.dumps(result))

    await send_result_to_nats(result)

if __name__ == '__main__':
    asyncio.run(main())
