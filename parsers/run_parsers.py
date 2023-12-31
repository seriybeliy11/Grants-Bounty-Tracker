import os
import asyncio
import logging
import approved_issues_parser
import closed_issues_parser
import contributors_parser
import issue_comment_parser
import issue_parser
import issue_rewards_parser
import issue_stats_parser
import issue_type_parser
import labels_stats_parser
import redis
import schedule
import time

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

if GITHUB_TOKEN == "YOUR_GITHUB_TOKEN":
    raise ValueError("Environment variable GITHUB_TOKEN is not set.")

redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

redis_client.set('parsers_completed', 'incomplete')

async def run_parsers():
    parsers = [
        approved_issues_parser,
        closed_issues_parser,
        contributors_parser,
        issue_comment_parser,
        issue_parser,
        issue_rewards_parser,
        issue_stats_parser,
        issue_type_parser,
        labels_stats_parser,
    ]

    total_parsers = len(parsers)
    completed_parsers = 0

    for parser in parsers:
        logger = logging.getLogger(parser.__name__)
        try:
            logger.info(f"Starting {parser.__name__} ({completed_parsers}/{total_parsers})")
            await parser.main(GITHUB_TOKEN)
            completed_parsers += 1
            logger.info(f"Finished {parser.__name__} ({completed_parsers}/{total_parsers})")
        except Exception as e:
            logger.error(f"Error in {parser.__name__}: {str(e)}")

    redis_client.set('parsers_completed', 'completed')

def schedule_run_parsers():
    asyncio.run(run_parsers())

if __name__ == '__main__':
    asyncio.run(run_parsers())

    schedule.every(15).minutes.do(schedule_run_parsers)

    while True:
        schedule.run_pending()
        time.sleep(1)
