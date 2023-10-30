import os
import requests
import asyncio
import nats
import redis
import json

def get_contributors():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("The environment variable GITHUB_TOKEN is not set.")

    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    url = "https://api.github.com/repos/ton-society/grants-and-bounties/contributors"

    redis_conn = redis.StrictRedis(host='redis', port=6379, db=0)

    contributors_data = redis_conn.get('github_contributors')

    if contributors_data:
        contributors_list = json.loads(contributors_data.decode())
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
        redis_conn.setex('github_contributors', 4 * 3600, json.dumps(contributors_list))

    return contributors_list

async def send_result_to_nats(contributors_list):
    nc = await nats.connect("nats")

    await nc.publish("github_contributors", json.dumps(contributors_list).encode())
    await nc.close()

async def main():
    contributors = get_contributors()
    await send_result_to_nats(contributors)

if __name__ == '__main__':
    asyncio.run(main())
