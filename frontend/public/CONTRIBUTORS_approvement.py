import requests
import json
from plate import token
import os

github_token = token

def get_contributors(repo):
    url = f'https://api.github.com/repos/{repo}/contributors'
    headers = {'Authorization': f'token {github_token}'}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        contributors = response.json()
        return contributors
    else:
        print(f"Failed to retrieve contributors. Status code: {response.status_code}")
        return []

def format_contributors(contributors):
    formatted_contributors = []

    for contributor in contributors:
        login = contributor.get('login')
        contributions = contributor.get('contributions', 0)
        formatted_contributors.append({"login": login, "contributions": float(contributions)})

    return formatted_contributors

def main():
    repo = 'ton-society/grants-and-bounties'
    contributors = get_contributors(repo)

    if contributors:
        formatted_contributors = format_contributors(contributors)
        result_json = json.dumps(formatted_contributors, indent=2, ensure_ascii=False)

        output_file_path = 'data_contributors.json'

        with open(output_file_path, 'w') as json_file:
            json_file.write(result_json)
    else:
        print("No contributors found.")

if __name__ == '__main__':
    main()
