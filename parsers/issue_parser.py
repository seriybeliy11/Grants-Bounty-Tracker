import aiohttp
import asyncio
import ujson
from redis import asyncio as aioredis

async def get_issues(url, params, headers, page):
    async with aiohttp.ClientSession() as session:
        params["page"] = page
        async with session.get(url, headers=headers, params=params) as response:
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
        "state": "all"
    }

    redis_client = await aioredis.from_url("redis://redis")

    cached_data = await get_data_from_redis(redis_client, "count_issues")

    if not cached_data:
        issues_by_year = {}
        page = 1
        while True:
            issues = await get_issues(url, params, HEADERS, page)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                issues_by_year[created_at] = issues_by_year.get(created_at, 0) + 1

            page += 1

        sorted_years = sorted(issues_by_year.keys())

        result = [{"Dates": year, "All Issues": issues_by_year[year]} for year in sorted_years]

        await save_data_to_redis(redis_client, "count_issues", result, 60)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
