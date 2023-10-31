import os
import requests
import asyncio
import json
import nats
import redis

def get_github_token():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("Environment variable GITHUB_TOKEN is not set.")
    
    return GITHUB_TOKEN

def get_issues(page, url, params, headers):
    params["page"] = page
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def save_data_to_redis(redis_client, key, data, expiration):
    redis_client.setex(key, expiration, json.dumps(data))

def get_data_from_redis(redis_client, key):
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None

async def send_data_to_nats(topic, data):
    nc = await nats.connect("nats")
    await nc.publish(topic, data.encode())
    await nc.close()

async def main():
    GITHUB_TOKEN = get_github_token()
    HEADERS = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"
    params = {
        "per_page": 100,
        "state": "all"
    }

    redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

    cached_data = get_data_from_redis(redis_client, "issue_rewards")
    
    if cached_data:
        issue_rewards = cached_data
    else:
        issue_rewards = []

        page = 1
        while True:
            issues = get_issues(page, url, params, HEADERS)
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

        save_data_to_redis(redis_client, "issue_rewards", issue_rewards, 14400)

    await send_data_to_nats("issue_rewards", json.dumps(issue_rewards))

if __name__ == '__main__':
    asyncio.run(main())
