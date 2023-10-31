import requests
import asyncio
import nats
import json
import redis


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

async def get_contributors(GITHUB_TOKEN):
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

async def main(GITHUB_TOKEN):
    contributors = await get_contributors(GITHUB_TOKEN)
    await send_data_to_nats("github_contributors", json.dumps(contributors))

if __name__ == '__main__':
    GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
