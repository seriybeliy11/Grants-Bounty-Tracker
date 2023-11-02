import requests
from plate import token
import json

def get_all_issues_with_comments(repo_owner, repo_name, output_file='commentators.json'):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    headers = {'Authorization': token}

    params = {'per_page': 120}
    all_comments = []
    page = 1

    while True:
        params['page'] = page
        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            data = json.loads(response.text)
            if data:
                for issue in data:
                    comments_count = issue['comments']
                    issue_number = issue['number']
                    all_comments.append({"issue": str(issue_number), "Comments": comments_count})
            else:
                break

            page += 1
        else:
            print(f"Failed to retrieve data. Status code: {response.status_code}")
            break

    output_file = 'commentators.json'

    with open(output_file, 'w') as json_file:
        json.dump(all_comments, json_file, indent=2)

    print(f"Data written to {output_file}")

get_all_issues_with_comments('ton-society', 'grants-and-bounties')
