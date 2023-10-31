import requests
import asyncio
import json
import nats
import redis


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

async def main(GITHUB_TOKEN):
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
        labels_by_year = {}

        page = 1
        while True:
            issues = get_issues(url, params, HEADERS, page)
            if not issues:
                break

            for issue in issues:
                labels = issue["labels"]
                created_at = issue["created_at"][:4]  # Извлекаем год
                if created_at not in labels_by_year:
                    labels_by_year[created_at] = {}
                for label in labels:
                    label_name = label["name"]
                    if label_name not in labels_by_year[created_at]:
                        labels_by_year[created_at][label_name] = 1
                    else:
                        labels_by_year[created_at][label_name] += 1

            page += 1

        labels_result = {
            year: [{"label": label, "value": count} for label, count in labels_by_year[year].items()]
            for year in labels_by_year
            }

        save_data_to_redis(redis_client, "labels_stats", labels_result, 4 * 3600)

    await send_data_to_nats("labels_stats", json.dumps(labels_result))

if __name__ == '__main__':
    GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
