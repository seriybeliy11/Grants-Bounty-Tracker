# Используем базовый образ Python
FROM python:latest

# Устанавливаем необходимые зависимости
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
RUN apt-get update && apt-get -y install cron

# Копируем исходный код парсеров в контейнер
COPY approved_issues_parser.py /app/
COPY contributors_parser.py /app/
COPY issue_comment_parser.py /app/
COPY issue_rewards_parser.py /app/
COPY issue_type_parser.py /app/
COPY closed_issues_parser.py /app/
COPY issue_parser.py /app/
COPY issue_stats_parser.py /app/
COPY labels_stats_parser.py /app/
COPY run_parsers.py /app/

# Копируем файл cron-job в контейнер
COPY cron-job /etc/cron.d/cron-job
RUN chmod 0644 /etc/cron.d/cron-job

# Запускаем crond (демон cron)
CMD ["cron", "-f"]
