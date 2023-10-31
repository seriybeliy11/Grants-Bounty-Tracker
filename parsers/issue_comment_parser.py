import requests
import asyncio
import nats
import redis
import json


def get_issues(GITHUB_TOKEN, url, params, page):
    HEADERS = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    params["page"] = page
    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    return response.json()

async def get_comment_count(GITHUB_TOKEN, issue_url):
    HEADERS = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    comments_url = issue_url + "/comments"
    response = await asyncio.to_thread(requests.get, comments_url, headers=HEADERS)
    response.raise_for_status()
    return len(response.json())

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

async def main(GITHUB_TOKEN):
    url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"
    params = {
        "per_page": 100,
        "state": "all"
    }

    redis_conn = redis.StrictRedis(host='redis', port=6379, db=0)

    cached_data = get_data_from_redis(redis_conn, 'issue_comments')
    
    if cached_data:
        result = cached_data
    else:
        issues_with_comments = {}

        page = 1
        while True:
            issues = get_issues(GITHUB_TOKEN, url, params, page)
            if not issues:
                break

            tasks = []
            for issue in issues:
                issue_url = issue["url"]
                tasks.append(get_comment_count(GITHUB_TOKEN, issue_url))

            comment_counts = await asyncio.gather(*tasks)

            for i, issue in enumerate(issues):
                issue_number = issue["number"]
                comments_count = comment_counts[i]
                created_at = issue["created_at"][:4]  # Извлекаем год из даты
                if created_at not in issues_with_comments:
                    issues_with_comments[created_at] = []
                issues_with_comments[created_at].append({"issue": str(issue_number), "Comments": comments_count})

            page += 1

        save_data_to_redis(redis_conn, 'issue_comments', issues_with_comments, 4 * 60 * 60)

        result = issues_with_comments

    await send_data_to_nats("issue_comments", json.dumps(result))

if __name__ == '__main__':
    GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
    asyncio.run(main())
