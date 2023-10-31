import os
import requests
import asyncio
import nats
import redis
import json

def get_github_token():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("Environment variable GITHUB_TOKEN is not set.")
    
    return GITHUB_TOKEN

async def get_issues(session, url, params, page, headers):
    params["page"] = page
    response = session.get(url, params=params, headers=headers)
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
    await nc.publish(topic, json.dumps(data).encode())
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

    redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

    saved_data = get_data_from_redis(redis_client, "issue_type")

    if saved_data:
        result = saved_data
    else:
        issue_counts = {
            "open": 0,
            "closed": 0
        }

        with requests.Session() as session:
            page = 1
            while True:
                issues = await get_issues(session, url, params, page, HEADERS)
                if not issues:
                    break

                for issue in issues:
                    state = issue["state"]
                    issue_counts[state] += 1

                page += 1

        result = [{"state": [{"state": state, "value": count} for state, count in issue_counts.items()]}]
        save_data_to_redis(redis_client, "issue_type", result, 14400)

    await send_data_to_nats("issue_type", result)

if __name__ == '__main__':
    asyncio.run(main())
