import requests
import asyncio
import nats
import redis
import json


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

    redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

    saved_data = get_data_from_redis(redis_client, "issue_type")

    if saved_data:
        result = saved_data
    else:
        issue_counts = {}  # Теперь используем словарь для хранения информации о количестве по годам

        with requests.Session() as session:
            page = 1
            while True:
                issues = await get_issues(session, url, params, page, HEADERS)
                if not issues:
                    break

                for issue in issues:
                    state = issue["state"]
                    created_at = issue["created_at"][:4]  # Получаем год из даты создания
                    if created_at not in issue_counts:
                        issue_counts[created_at] = {"open": 0, "closed": 0}
                    issue_counts[created_at][state] += 1

                page += 1

            result = {
                year: [{"state": state, "value": count} for state, count in issue_counts[year].items()]
                for year in issue_counts
            }        
            save_data_to_redis(redis_client, "issue_type", result, 14400)

    await send_data_to_nats("issue_type", result)

if __name__ == '__main__':
    GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
