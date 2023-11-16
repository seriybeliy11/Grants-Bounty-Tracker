import aiohttp
import asyncio
import ujson
from redis import asyncio as aioredis
from collections import OrderedDict

async def get_issues(session, page, url, params, headers):
    params["page"] = page
    async with session.get(url, headers=headers, params=params) as response:
        response.raise_for_status()
        return await response.json(loads=ujson.loads)

async def save_data_to_redis(redis_client, key, data):
    await redis_client.set(key, ujson.dumps(data))

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

    issue_rewards = OrderedDict()

    async with aiohttp.ClientSession() as session:
        page = 1
        while True:
            issues = await get_issues(session, page, url, params, HEADERS)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                body = issue.get("body")
                if body:
                    reward_info = body.split('$')
                    if len(reward_info) >= 2:
                        try:
                            reward = int(reward_info[1].split(' ')[0])
                            issue_info = {"Issue Number": str(issue["number"]), "Rewards (th. $)": reward}
                            issue_rewards.setdefault(created_at, []).append(issue_info)
                        except ValueError:
                            pass

            page += 1

    await save_data_to_redis(redis_client, "issue_rewards", issue_rewards)

if __name__ == '__main__':
    GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
