FROM python:latest

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
RUN apt-get update && apt-get -y install cron

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

COPY cron-job /etc/cron.d/cron-job
RUN chmod 0644 /etc/cron.d/cron-job

CMD ["sh", "-c", "python /app/run_parsers.py && cron -f"]
