import asyncio
import approved_issues_parser
import closed_issues_parser
import contributors_parser
import issue_comment_parser
import issue_parser
import issue_rewards_parser
import issue_stats_parser
import issue_type_parser
import labels_stats_parser

async def run_parsers():
    await asyncio.gather(
        approved_issues_parser.main(),
        closed_issues_parser.main(),
        contributors_parser.main(),
        issue_comment_parser.main(),
        issue_parser.main(),
        issue_rewards_parser.main(),
        issue_stats_parser.main(),
        issue_type_parser.main(),
        labels_stats_parser.main()
    )

if __name__ == '__main__':
    asyncio.run(run_parsers())
