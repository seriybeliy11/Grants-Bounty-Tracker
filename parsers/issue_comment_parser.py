import aiohttp
import ujson
import asyncio
from redis import asyncio as aioredis
from collections import OrderedDict

async def get_issues(session, url, params, page):
    params["page"] = page
    async with session.get(url, params=params) as response:
        response.raise_for_status()
        return await response.json(loads=ujson.loads)

async def get_comment_count(session, GITHUB_TOKEN, issue_url):
    async with session.get(issue_url + "/comments", headers={"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}) as response:
        response.raise_for_status()
        return len(await response.json(loads=ujson.loads))

async def save_data_to_redis(redis_client, key, data, expiration):
    await redis_client.setex(key, expiration, ujson.dumps(data))

async def get_data_from_redis(redis_client, key):
    data = await redis_client.get(key)
    return ujson.loads(data) if data else None

async def main(GITHUB_TOKEN):
    url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"
    params = {
        "per_page": 100,
        "state": "all"
    }

    redis_conn = await aioredis.from_url("redis://redis")

    cached_data = await get_data_from_redis(redis_conn, 'issue_comments')

    if not cached_data:
        issues_with_comments = OrderedDict()

        async with aiohttp.ClientSession() as session:
            page = 1
            while True:
                issues = await get_issues(session, url, params, page)
                if not issues:
                    break

                tasks = []
                for issue in issues:
                    issue_url = issue["url"]
                    tasks.append(get_comment_count(session, GITHUB_TOKEN, issue_url))

                comment_counts = await asyncio.gather(*tasks)

                for i, issue in enumerate(issues):
                    issue_number = issue["number"]
                    comments_count = comment_counts[i]
                    created_at = issue["created_at"][:4]
                    if created_at not in issues_with_comments:
                        issues_with_comments[created_at] = []
                    issues_with_comments[created_at].append({"issue": str(issue_number), "Comments": comments_count})

                page += 1

        result = issues_with_comments

        await save_data_to_redis(redis_conn, 'issue_comments', result, 10 * 60)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
