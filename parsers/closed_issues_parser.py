import os
import requests
import asyncio
import nats
import json
import redis


async def main():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
    if GITHUB_TOKEN is None:
        raise ValueError("The environment variable GITHUB_TOKEN is not set.")

    HEADERS = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"
    params = {
        "per_page": 100,
        "state": "closed"
    }

    def get_issues(page):
        params["page"] = page
        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()
        return response.json()

    redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

    redis_data = redis_client.get("closed_issues")

    if redis_data:
        result = redis_data.decode('utf-8')
    else:
        closed_issues_by_year = {}

        page = 1
        while True:
            issues = get_issues(page)
            if not issues:
                break

            for issue in issues:
                closed_at = issue["closed_at"]
                if closed_at:
                    year = closed_at[:4]
                    closed_issues_by_year[year] = closed_issues_by_year.get(year, 0) + 1

            page += 1

        result = [{"Dates": year, "Closed Issues": count} for year, count in closed_issues_by_year.items()]

        redis_client.setex("closed_issues", 4 * 60 * 60, json.dumps(result))

    async def send_result_to_nats():
        nc = await nats.connect("nats")

        await nc.publish("closed_issues", result.encode())

        await nc.close()

    await send_result_to_nats()

if __name__ == '__main__':
    asyncio.run(main())
