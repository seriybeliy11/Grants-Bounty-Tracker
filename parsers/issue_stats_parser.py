import asyncio
import ujson as json
import aiohttp
from redis import asyncio as aioredis
from datetime import datetime, timedelta
from collections import OrderedDict

async def get_issues(page, url, params, headers):
    params["page"] = page
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, params=params) as response:
            response.raise_for_status()
            return await response.json(loads=json.loads)

def calculate_duration(issue):
    if issue["state"] == "open":
        created_at = datetime.fromisoformat(issue["created_at"][:-1])
        now = datetime.now()
        duration = (now - created_at).days
    else:
        duration = 0.0
    return duration

async def save_data_to_redis(redis_client, key, data, expiration):
    await redis_client.setex(key, expiration, json.dumps(data))

async def get_data_from_redis(redis_client, key):
    data = await redis_client.get(key)
    if data:
        return json.loads(data)
    return None

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

    redis_client = await aioredis.from_url("redis://redis")

    cached_result = await get_data_from_redis(redis_client, "issue_stats")
    if cached_result is not None:
        result = cached_result
    else:
        page = 1
        duration_by_year = OrderedDict()

        while True:
            issues = await get_issues(page, url, params, HEADERS)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                duration = calculate_duration(issue)

                if created_at not in duration_by_year:
                    duration_by_year[created_at] = []

                duration_by_year[created_at].append({"number": str(issue["number"]), "Duration": duration})

            page += 1

        result = duration_by_year
        await save_data_to_redis(redis_client, "issue_stats", result, timedelta(minutes=5))

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
