import asyncio
import aiohttp
import ujson
from redis import asyncio as aioredis

async def get_issues(url, params, headers, page):
    params["page"] = page
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(url, params=params) as response:
            response.raise_for_status()
            return await response.json(loads=ujson.loads)

async def save_data_to_redis(redis_client, key, data, expiration):
    await redis_client.setex(key, expiration, ujson.dumps(data))

async def get_data_from_redis(redis_client, key):
    data = await redis_client.get(key)
    if data:
        return ujson.loads(data)
    return None

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

    redis = await aioredis.from_url("redis://redis")

    closed_issues_by_year = {}
    page = 1

    while True:
        issues = await get_issues(url, params, HEADERS, page)
        if not issues:
            break

        for issue in issues:
            closed_at = issue["closed_at"]
            if closed_at:
                year = closed_at[:4]
                closed_issues_by_year[year] = closed_issues_by_year.get(year, 0) + 1

        page += 1

    sorted_years = sorted(closed_issues_by_year.keys())

    result = [{"Date": year, "Closed Issues": closed_issues_by_year[year]} for year in sorted_years]

    redis_data = await get_data_from_redis(redis, "closed_issues")

    if not redis_data:
        await save_data_to_redis(redis, "closed_issues", result, 10 * 60)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
