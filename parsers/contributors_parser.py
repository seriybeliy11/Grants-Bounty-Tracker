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

async def get_contributors():
    GITHUB_TOKEN = get_github_token()
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    url = "https://api.github.com/repos/ton-society/grants-and-bounties/contributors"
    redis_conn = redis.StrictRedis(host='redis', port=6379, db=0)

    contributors_data = get_data_from_redis(redis_conn, 'github_contributors')

    if contributors_data:
        contributors_list = contributors_data
    else:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        contributors_data = response.json()
        contributors_list = [
            {
                "login": contributor["login"],
                "contributions": float(contributor["contributions"])
            }
            for contributor in contributors_data
        ]
        save_data_to_redis(redis_conn, 'github_contributors', contributors_list, 4 * 3600)

    return contributors_list

async def main():
    contributors = await get_contributors()
    await send_data_to_nats("github_contributors", json.dumps(contributors))

if __name__ == '__main__':
    asyncio.run(main())
