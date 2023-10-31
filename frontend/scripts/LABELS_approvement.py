import requests
import json
from plate import token
import os

github_token = token

def get_all_issues(repo):
    url = f'https://api.github.com/repos/{repo}/issues'
    headers = {'Authorization': f'token {github_token}'}

    all_issues = []
    page = 1

    while True:
        params = {'page': page}
        response = requests.get(url, params=params, headers=headers)

        if response.status_code == 200:
            issues = response.json()
            if not issues:
                break

            all_issues.extend(issues)
            page += 1
        else:
            print(f"Failed to retrieve data. Status code: {response.status_code}")
            break

    return all_issues

def collect_labels(issues):
    labels_count = {}

    for issue in issues:
        for label in issue.get('labels', []):
            label_name = label['name']
            labels_count[label_name] = labels_count.get(label_name, 0) + 1

    return labels_count

def main():
    repo = 'ton-society/grants-and-bounties'

    all_issues = get_all_issues(repo)

    all_labels_count = collect_labels(all_issues)

    result_json = [{"label": label, "value": count} for label, count in all_labels_count.items()]

    output_filename = 'label_counts.json'
    output_file_path = os.path.join('..', 'public', output_filename)

    with open(output_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(result_json, json_file, indent=2, ensure_ascii=False)

    print(f"JSON data written to '../public/{output_filename}'.")

if __name__ == '__main__':
    main()
