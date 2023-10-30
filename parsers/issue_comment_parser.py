import os
import requests
import asyncio
import nats
import redis
import json

async def main():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("The environment variable GITHUB_TOKEN is not set.")

    HEADERS = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"

    params = {
        "per_page": 100,
        "state": "all"
    }

    redis_conn = redis.StrictRedis(host='redis', port=6379, db=0)

    async def get_issues(page):
        params["page"] = page
        response = await asyncio.to_thread(requests.get, url, headers=HEADERS, params=params)
        response.raise_for_status()
        return response.json()

    async def get_comment_count(issue_url):
        comments_url = issue_url + "/comments"
        response = await asyncio.to_thread(requests.get, comments_url, headers=HEADERS)
        response.raise_for_status()
        return len(response.json())

    async def collect_issue_comments():
        cached_data = redis_conn.get('issue_comments')
        if cached_data:
            return json.loads(cached_data)

        issues_with_comments = []

        page = 1
        while True:
            issues = await get_issues(page)
            if not issues:
                break

            tasks = []
            for issue in issues:
                issue_url = issue["url"]
                tasks.append(get_comment_count(issue_url))

            comment_counts = await asyncio.gather(*tasks)

            for i, issue in enumerate(issues):
                issue_number = issue["number"]
                comments_count = comment_counts[i]
                issues_with_comments.append({"issue": str(issue_number), "Comments": comments_count})

            page += 1

        redis_conn.setex('issue_comments', 4 * 60 * 60, json.dumps(issues_with_comments))

        return issues_with_comments

    async def send_result_to_nats(result):
        nc = await nats.connect("nats")

        await nc.publish("issue_comments", result.encode())

        await nc.close()

    issues_result = await collect_issue_comments()
    await send_result_to_nats(issues_result)

if __name__ == '__main__':
    asyncio.run(main())
