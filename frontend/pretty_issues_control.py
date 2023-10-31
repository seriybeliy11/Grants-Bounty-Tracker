import requests
import openai
import json

def get_issue_titles(repo_owner, repo_name, limit=12):
    issues_url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/issues'
    issues_response = requests.get(issues_url)

    if issues_response.status_code != 200:
        print(f"Error fetching issues. Status code: {issues_response.status_code}")
        return []

    issues = issues_response.json()

    issue_titles = [issue['title'] for issue in issues[:limit]]

    return issue_titles

# Запрос к GitHub API для получения заголовков issue (с лимитом)
repo_owner = 'ton-society'
repo_name = 'grants-and-bounties'
limit_of_titles = 12
issue_titles = get_issue_titles(repo_owner, repo_name, limit_of_titles)

# Формирование запроса к чат-модели
user_prompt = "system, tell us what we have achieved by completing these tasks?"
for title in issue_titles:
    user_prompt += f"\n- {title}"

# Установка ключа OpenAI API
openai_api_key = "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"
openai.api_key = openai_api_key

# Запрос к чат-модели
completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You're an automated system for monitoring Github community activity, with a good sense of humor and a great sense of love for all the contributors to this organization"},
        {"role": "user", "content": user_prompt}
    ]
)

# Вывод ответа чат-модели
print(f"Response for achievement question:\n{completion.choices[0].message}")
