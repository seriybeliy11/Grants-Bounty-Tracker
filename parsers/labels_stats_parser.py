import os
import requests
import asyncio
import json
import nats
import redis

async def main():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("issue_type")

    HEADERS = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    url = "https://api.github.com/repos/ton-society/grants-and-bounties/issues"

    params = {
        "per_page": 100,
        "state": "all"
    }

    redis_host = "redis"
    redis_port = 6379
    redis_db = redis.StrictRedis(host=redis_host, port=redis_port, db=0, decode_responses=True)

    cached_data = redis_db.get("labels_stats")

    if cached_data:
        labels_result = json.loads(cached_data)
    else:
        labels_count = {}

        def get_issues(page):
            params["page"] = page
            response = requests.get(url, headers=HEADERS, params=params)
            response.raise_for_status()
            issues = response.json()

            for issue in issues:
                labels = issue["labels"]
                for label in labels:
                    label_name = label["name"]
                    labels_count[label_name] = labels_count.get(label_name, 0) + 1

            return issues

        page = 1
        while True:
            issues = get_issues(page)
            if not issues:
                break

            page += 1

        labels_result = [{"label": label, "value": count} for label, count in labels_count.items()]

        redis_db.setex("labels_stats", 4 * 3600, json.dumps(labels_result))


    nc = await nats.connect("nats")

    await nc.publish("labels_stats", labels_result.encode())

    await nc.close()

if __name__ == '__main__':
    asyncio.run(main())
