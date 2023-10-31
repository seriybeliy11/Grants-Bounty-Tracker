import requests
import asyncio
import nats
import json
import redis


def get_issues(url, params, headers, page):
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
    await nc.publish(topic, json.dumps(data).encode())
    await nc.close()

async def main(GITHUB_TOKEN):
    redis_client = redis.StrictRedis(host='redis', port=6379, db=0)
    cached_data = get_data_from_redis(redis_client, 'approved_issues')
    
    if cached_data:
        result = cached_data
    else:
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

        response = requests.get(labels_url, headers=HEADERS)
        response.raise_for_status()
        labels = response.json()

        for label in labels:
            if label["name"] == "Approved":
                approved_label = label
                break

        page = 1
        while True:
            issues = get_issues(url, params, HEADERS, page)
            if not issues:
                break

            for issue in issues:
                created_at = issue["created_at"][:4]
                year_data = issues_by_year.setdefault(created_at, {"ClosedApprovedIssues": 0, "ClosedTotalIssues": 0})

                if issue["state"] == "closed":
                    year_data["ClosedTotalIssues"] += 1

                    if approved_label and approved_label in issue["labels"]:
                        year_data["ClosedApprovedIssues"] += 1

            page += 1

        result = [{"Date": year, "ClosedApprovedIssues": str(data["ClosedApprovedIssues"]), "ClosedTotalIssues": str(data["ClosedTotalIssues"])} for year, data in issues_by_year.items()]

        save_data_to_redis(redis_client, 'approved_issues', result, 4 * 60 * 60)

    await send_data_to_nats("approved_issues", result)

if __name__ == '__main__':
    GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
    asyncio.run(main(GITHUB_TOKEN))
