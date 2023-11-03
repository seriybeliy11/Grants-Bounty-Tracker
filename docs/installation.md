# Installation and Project Setup Guide

This guide provides a step-by-step instruction on how to install and run the Grant's & Bounties Tracker on your local computer. The project includes a frontend, an API server, and data parsers that work with GitHub and Redis.

## Requirements

Before getting started, make sure you have the following components installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Installation

1. Clone the project repository from GitHub:

   ```bash
   git clone https://github.com/seriybeliy11/Grants-Bounty-Tracker.git
   cd Grants-Bounty-Tracker
   ```

2. Create a `.env` file in the project's root directory and add your GitHub token to it (replace `YOUR_GITHUB_TOKEN` with your token):

   ```
   GITHUB_TOKEN=YOUR_GITHUB_TOKEN
   ```

3. Navigate to the project's root directory and run the following command to start the project using Docker Compose:

   ```bash
   docker-compose up
   ```

   This will start containers for Redis, the frontend, and the data parser container. The parsers will begin gathering data from GitHub and storing it in Redis.

4. After a successful launch, the frontend will be accessible at [http://localhost:5173](http://localhost:5173).

## Shutdown

To shut down the project, run the following command in the project's root directory:

```bash
docker-compose down
```

This will stop the containers and free up resources.

## Using the API

The API server is available on port 3000 of your local host. You can interact with it to retrieve data about GitHub contributors and other metrics. Here are examples of available routes:

- [http://localhost:3000/github_contributors](http://localhost:3000/github_contributors)
- [http://localhost:3000/issue_comments](http://localhost:3000/issue_comments)
- [http://localhost:3000/closed_issues](http://localhost:3000/closed_issues)
- [http://localhost:3000/approved_issues](http://localhost:3000/approved_issues)
- [http://localhost:3000/issue_type](http://localhost:3000/issue_type)
- [http://localhost:3000/issue_stats](http://localhost:3000/issue_stats)
- [http://localhost:3000/labels_stats](http://localhost:3000/labels_stats)
- [http://localhost:3000/issue_rewards](http://localhost:3000/issue_rewards)
- [http://localhost:3000/count_issues](http://localhost:3000/count_issues)

## Recommendations

- Ensure your computer has sufficient resources to run Docker containers.
- Before using the project, make sure your GitHub token has access to the necessary data.
- When finished with the project, don't forget to shut it down to free up resources.

This concludes the installation and setup of the Grant's & Bounties Tracker. You can use it to track and visualize GitHub contributors' metrics and other data.
