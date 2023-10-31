import os
import requests
import asyncio
import json
import nats
import redis
from datetime import datetime, timedelta

def get_github_token():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("Environment variable GITHUB_TOKEN is not set.")
    
    return GITHUB_TOKEN

def get_issues(page, url, params, headers):
    params["page"] = page
    response = requests.get(url, headers=headers, params=params)
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

def save_data_to_redis(redis_client, key, data, expiration):
    redis_client.setex(key, expiration, json.dumps(data))

def get_data_from_redis(redis_client, key):
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None

async def send_data_to_nats(topic, data):
    nc = await nats.connect("nats")
    await nc.publish(topic, data.encode())
    await nc.close()

async def main():
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

    redis_client = redis.Redis(host='redis', port=6379, db=0)

    cached_result = get_data_from_redis(redis_client, "issue_stats")
    if cached_result is not None:
        result = cached_result
    else:
        page = 1
        duration_by_year = {}

        while True:
            issues = get_issues(page, url, params, HEADERS)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                duration = calculate_duration(issue)

                duration_by_year.setdefault(created_at, []).append({"number": str(issue["number"]), "duration": duration})

            page += 1

        result = [{year: issues} for year, issues in duration_by_year.items()]
        save_data_to_redis(redis_client, "issue_stats", result, timedelta(hours=4))

    await send_data_to_nats("issue_stats", json.dumps(result))

if __name__ == '__main__':
    asyncio.run(main())
