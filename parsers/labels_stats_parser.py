import aiohttp
import asyncio
import ujson
from redis import asyncio as aioredis
from collections import OrderedDict

async def get_issues(session, url, params, headers, page):
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

    cached_data = await get_data_from_redis(redis_client, "labels_stats")

    if not cached_data:
        labels_by_year = OrderedDict()

        page = 1
        async with aiohttp.ClientSession() as session:
            while True:
                issues = await get_issues(session, url, params, HEADERS, page)
                if not issues:
                    break

                for issue in issues:
                    labels = issue["labels"]
                    created_at = issue["created_at"][:4]
                    if created_at not in labels_by_year:
                        labels_by_year[created_at] = {}
                    for label in labels:
                        label_name = label["name"]
                        labels_by_year[created_at][label_name] = labels_by_year[created_at].get(label_name, 0) + 1

                page += 1

        labels_result = OrderedDict({
            year: [{"label": label, "value": count} for label, count in labels_by_year[year].items()]
            for year in labels_by_year
        })

        await save_data_to_redis(redis_client, "labels_stats", labels_result, 10 * 60)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
