import aiohttp
import asyncio
import ujson
from redis import asyncio as aioredis
from collections import OrderedDict

async def get_issues(session, url, params, page, headers):
    params["page"] = page
    async with session.get(url, params=params, headers=headers) as response:
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

    saved_data = await get_data_from_redis(redis_client, "issue_type")

    if not saved_data:
        issue_counts = OrderedDict()

        async with aiohttp.ClientSession() as session:
            page = 1
            while True:
                issues = await get_issues(session, url, params, page, HEADERS)
                if not issues:
                    break

                for issue in issues:
                    state = issue["state"]
                    created_at = issue["created_at"][:4]
                    if created_at not in issue_counts:
                        issue_counts[created_at] = {"open": 0, "closed": 0}
                    issue_counts[created_at][state] += 1

                page += 1

        result = {
            year: [{"state": state, "value": count} for state, count in sorted(issue_counts[year].items())]
            for year in sorted(issue_counts)
        }

        await save_data_to_redis(redis_client, "issue_type", result, 10 * 60)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
