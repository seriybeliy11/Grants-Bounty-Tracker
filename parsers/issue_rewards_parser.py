import os
import requests
import asyncio
import json
import nats
import redis

redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

if GITHUB_TOKEN is None:
    raise ValueError("Environment variable GITHUB_TOKEN is not set.")

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"

params = {
    "per_page": 100,
    "state": "all"
}

def get_issues(page):
    params["page"] = page
    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    return response.json()

async def main():
    cached_data = redis_client.get("issue_rewards")
    if cached_data:
        issue_rewards = eval(cached_data.decode())
    else:
        issue_rewards = []

        page = 1
        while True:
            issues = get_issues(page)
            if not issues:
                break

            for issue in issues:
                body = issue.get("body")
                if body:
                    reward_info = body.split('$')
                    if len(reward_info) >= 2:
                        try:
                            reward = int(reward_info[1].split(' ')[0])
                            issue_rewards.append({"Issue Number": str(issue["number"]), "Rewards (th. $)": reward})
                        except ValueError:
                            pass

            page += 1

        redis_client.setex("issue_rewards", 14400, json.dumps(issue_rewards))

    nc = await nats.connect("nats")

    await nc.publish("issue_rewards", issue_rewards.encode())

    await nc.close()

if __name__ == '__main__':
    asyncio.run(main())
