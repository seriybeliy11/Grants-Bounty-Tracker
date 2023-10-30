import os
import requests
import asyncio
import nats
import redis
import json

async def get_issues(session, url, params, page):
    params["page"] = page
    response = session.get(url, params=params)
    response.raise_for_status()
    return response.json()

def save_data_to_redis(redis_client, data):
    redis_client.set("issue_type", json.dumps(data), ex=14400)

def get_data_from_redis(redis_client):
    data = redis_client.get("issue_type")
    if data:
        return json.loads(data)
    return None

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

    redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

    saved_data = get_data_from_redis(redis_client)

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
                issues = await get_issues(session, url, params, page)
                if not issues:
                    break

                for issue in issues:
                    state = issue["state"]
                    issue_counts[state] += 1

                page += 1

        result = [{"state": [{"state": state, "value": count} for state, count in issue_counts.items()]}]
        save_data_to_redis(redis_client, result)


    nc = nats.Connection()
    nc.connect("nats")

    nc.publish("issue_type", json.dumps(result).encode())

    nc.close()

if __name__ == '__main__':
    asyncio.run(main())
