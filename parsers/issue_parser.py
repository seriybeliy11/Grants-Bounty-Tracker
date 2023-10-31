import os
import requests
import asyncio
import json
import nats
import redis

def get_github_token():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("Environment variable GITHUB_TOKEN is not set.")
    
    return GITHUB_TOKEN

def get_issues(url, params, headers, page):
    params["page"] = page
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

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

    r = redis.Redis(host='redis', port=6379, db=0)

    cached_data = get_data_from_redis(r, "count_issues")
    
    if cached_data:
        result = cached_data
    else:
        issues_by_year = {}
        page = 1
        while True:
            issues = get_issues(url, params, HEADERS, page)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                issues_by_year[created_at] = issues_by_year.get(created_at, 0) + 1

            page += 1

        result = [{"Dates": year, "All Issues": count} for year, count in issues_by_year.items()]

        save_data_to_redis(r, "count_issues", result, 14400)

    await send_data_to_nats("count_issues", json.dumps(result))

if __name__ == '__main__':
    asyncio.run(main())
