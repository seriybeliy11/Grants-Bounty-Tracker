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

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

def get_github_token():
    GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

    if GITHUB_TOKEN is None:
        raise ValueError("Environment variable GITHUB_TOKEN is not set.")
    
    return GITHUB_TOKEN

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
            await parser.main(get_github_token())
            completed_parsers += 1
            logger.info(f"Finished {parser.__name__} ({completed_parsers}/{total_parsers})")
        except Exception as e:
            logger.error(f"Error in {parser.__name__}: {str(e)}")

if __name__ == '__main__':
    asyncio.run(run_parsers())
