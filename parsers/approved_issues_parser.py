import asyncio
import aiohttp
import ujson
from redis import asyncio as aioredis

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
    redis_client = await aioredis.from_url("redis://redis")
    cached_data = await get_data_from_redis(redis_client, 'approved_issues')
    
    if not cached_data:
        HEADERS = {
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        }

        url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"

        params = {
            "per_page": 100,
            "state": "all"
        }

        issues_by_year = {}

        approved_label = None
        labels_url = "https://api.github.com/repos/ton-society/grants-and-bounties/labels"

        async with aiohttp.ClientSession(headers=HEADERS) as session:
            async with session.get(labels_url) as response:
                response.raise_for_status()
                labels = await response.json(loads=ujson.loads)

                for label in labels:
                    if label["name"] == "Approved":
                        approved_label = label
                        break

            page = 1
            while True:
                issues = await get_issues(session, url, params, HEADERS, page)
                if not issues:
                    break

                for issue in issues:
                    created_at = issue["created_at"][:4]
                    year_data = issues_by_year.setdefault(created_at, {"Closed Approved Issues": 0})

                    if issue["state"] == "closed" and approved_label and approved_label in issue["labels"]:
                        year_data["Closed Approved Issues"] += 1

                page += 1

        sorted_years = sorted(issues_by_year.keys())

        result = [{"Date": year, "Closed Approved Issues": issues_by_year[year]["Closed Approved Issues"]} for year in sorted_years]
        
        await save_data_to_redis(redis_client, 'approved_issues', result, 60)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
