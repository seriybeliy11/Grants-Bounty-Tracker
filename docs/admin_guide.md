## Administrator's Guide

Welcome to the administrator's guide for the "Grants & Bounties Tracker". In this guide, you will find detailed instructions on how to install, configure, and manage the project. The project is a web application that includes a frontend, an API server, GitHub data parsers, and a Redis database.

### Table of Contents:
1. [Installation and Project Setup](#1-installation-and-project-setup)
2. [Environment Configuration](#2-environment-configuration)
3. [Managing Parsers](#3-managing-parsers)
4. [Data Updates](#4-data-updates)
5. [Shutdown](#5-shutdown)

### 1. Installation and Project Setup

To successfully deploy the project, follow these steps:

#### 1.1. Clone the Repository

Clone the project repository using Git:

```bash
git clone https://github.com/seriybeliy11/Grants-Bounty-Tracker.git
cd Grants-Bounty-Tracker
```

#### 1.2. Start Docker Compose

Make sure you have Docker and Docker Compose installed. Start the project using Docker Compose:

```bash
docker compose up
```

After the project is launched, the frontend will be accessible at `http://localhost:5173`.

### 2. Environment Configuration

#### 2.1. Configure Environment Variables

The project requires setting some environment variables, including:

- `GITHUB_TOKEN`: Token for accessing the GitHub API. Specify your personal token in the `.env` file located in the project's root directory.

#### 2.2. Redis Environment

The application uses a Redis server for data storage. It is automatically configured within the Docker container, but you can modify Redis settings if needed.

### 3. Managing Parsers

Parsers in the project operate autonomously and asynchronously, collecting data from GitHub and storing it in Redis. Here's how to manage them:

#### 3.1. Starting Parsers

Parsers start automatically when the `parsers` container is launched. They work asynchronously and perform data collection tasks from GitHub.

#### 3.2. Stopping Parsers

To stop the parsers, simply halt the `parsers` container:

```bash
docker compose stop parsers
```

### 4. Data Updates

Data in the project is updated automatically by parsers, but you can also manually trigger updates:

#### 4.1. Manually Updating Data

To forcibly update the data, follow these steps:

1. Start the `parsers` container if it was stopped:

   ```bash
   docker compose start parsers
   ```

2. The parsers will begin working and updating the data.

### 5. Shutdown

To shut down the project, follow these steps:

1. Stop the project using Docker Compose:

   ```bash
   docker compose down
   ```

2. The project will be completely stopped, and containers will be removed.

This concludes the administrator's guide for the "Grants & Bounties Tracker" project. You can start using the application by visiting `http://localhost:5173`. If you have any questions or issues, refer to the documentation in the `docs` folder or contact the project developers.
