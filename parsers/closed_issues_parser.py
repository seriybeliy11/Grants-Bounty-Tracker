import requests
import asyncio
import nats
import json
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
        return data.decode('utf-8')
    return None

async def send_data_to_nats(topic, data):
    nc = await nats.connect("nats")
    await nc.publish(topic, json.dumps(data).encode())
    await nc.close()

def process_closed_issues(url, params, headers, redis_client):
    closed_issues_by_year = {}
    page = 1

    while True:
        issues = get_issues(url, params, headers, page)
        if not issues:
            break

        for issue in issues:
            closed_at = issue["closed_at"]
            if closed_at:
                year = closed_at[:4]
                closed_issues_by_year[year] = closed_issues_by_year.get(year, 0) + 1

        page += 1

    result = [{"Dates": year, "Closed Issues": count} for year, count in closed_issues_by_year.items()]

    save_data_to_redis(redis_client, "closed_issues", result, 4 * 60 * 60)
    return result

async def main(GITHUB_TOKEN):
    HEADERS = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"
    params = {
        "per_page": 100,
        "state": "closed"
    }

    redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

    redis_data = get_data_from_redis(redis_client, "closed_issues")

    if redis_data:
        result = redis_data
    else:
        result = process_closed_issues(url, params, HEADERS, redis_client)

    await send_data_to_nats("closed_issues", result)

if __name__ == '__main__':
    GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
