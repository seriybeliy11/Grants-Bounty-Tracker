import os
import requests
import asyncio
import json
import nats
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

    redis_client = redis.StrictRedis(host='redis', port=6379, db=0, decode_responses=True)

    cached_data = get_data_from_redis(redis_client, "labels_stats")

    if cached_data:
        labels_result = cached_data
    else:
        labels_count = {}

        page = 1
        while True:
            issues = get_issues(url, params, HEADERS, page)
            if not issues:
                break

            for issue in issues:
                labels = issue["labels"]
                for label in labels:
                    label_name = label["name"]
                    labels_count[label_name] = labels_count.get(label_name, 0) + 1

            page += 1

        labels_result = [{"label": label, "value": count} for label, count in labels_count.items()]

        save_data_to_redis(redis_client, "labels_stats", labels_result, 4 * 3600)

    await send_data_to_nats("labels_stats", json.dumps(labels_result))

if __name__ == '__main__':
    asyncio.run(main())
