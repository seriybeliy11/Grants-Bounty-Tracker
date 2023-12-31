import asyncio
import aiohttp
import ujson
from redis import asyncio as aioredis

async def save_data_to_redis(redis_client, key, data):
    await redis_client.set(key, ujson.dumps(data))

async def get_contributors(url, headers, page):
    async with aiohttp.ClientSession() as session:
        params = {"page": page, "per_page": 100}
        async with session.get(url, headers=headers, params=params) as response:
            response.raise_for_status()
            return await response.json()

async def main(GITHUB_TOKEN):
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    url = "https://api.github.com/repos/ton-society/grants-and-bounties/contributors"

    redis_conn = await aioredis.from_url("redis://redis")

    contributors_data = []
    page = 1
    while True:
        contributors = await get_contributors(url, headers, page)
        if not contributors:
            break
        contributors_data.extend([
            {
                "login": contributor["login"],
                "Contributions": float(contributor["contributions"])
            }
            for contributor in contributors
        ])
        page += 1
    await save_data_to_redis(redis_conn, 'github_contributors', contributors_data)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
