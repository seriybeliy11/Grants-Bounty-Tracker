# User Guide

Welcome to the user guide for the "Grants & Bounties Tracker". In this guide, you will find instructions on how to install, run, and use the application, as well as descriptions of available metrics and functionality.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Usage](#usage)
   - [Key Metrics](#key-metrics)
   - [Changing the Theme](#changing-the-theme)
5. [Documentation](#documentation)
6. [Contact Developers](#contact-developers)
7. [Shutting Down](#shutting-down)

## Introduction

"Grants & Bounties Tracker" is a web application developed using React and Vite to display metrics and charts related to activity in the TON Society organization. The application includes various metrics that allow you to track different aspects of activity.

## Installation

To install the application, you will need Docker, which provides containerization and simplifies dependency installation. Follow the instructions below:

1. Make sure Docker is installed on your computer.

2. Clone the project repository to your computer:

   ```bash
   git clone https://github.com/seriybeliy11/Grants-Bounty-Tracker.git
   ```

3. Navigate to the project's root folder:

   ```bash
   cd Grants-Bounty-Tracker
   ```

4. Start the application using Docker Compose:

   ```bash
   docker compose up
   ```

This will start all the project components, including Redis, the API server, the frontend, and parsers. Wait for the process to complete.

## Running the Application

After successful installation, the application will be accessible in your web browser at [http://localhost:5173](http://localhost:5173). You can also use [http://localhost:3000](http://localhost:3000) to directly access the API server.

## Usage

### Key Metrics

The application displays various metrics and charts, allowing you to track activity within the organization. Key metrics include:

- **GitHub Contributor Count**: The number of contributors in the organization on GitHub.
- **Best Agent**: The top contributor in the organization on GitHub.
- **Issue Count**: The number of issues in the organization on GitHub.
- **All Issues Timeline**: A chart showing the count of issues over time.

### Changing the Theme

The application supports light and dark themes. You can switch themes by clicking the theme button (sun and moon icon) in the top right corner of the application.

## Documentation

In the project repository, you will find additional documentation, including:

- [Administrator's Guide](./admin_guide.md): Instructions for administrators on configuring and managing the project.
- [Installation Guide](./installation.md): Instructions for installing the application and its dependencies.

## Contact Developers

If you have questions, suggestions, or issues, feel free to contact the project developers:

- Telegram: [@acaedb](https://t.me/acaedb)
- Telegram: [@delovoyhomie](https://t.me/delovoyhomie)

## Shutting Down

When you're done using the application, remember to shut it down with the following command:

```bash
docker compose down
```

This will stop all containers and free up resources.

Thank you for choosing "Grants & Bounties Tracker"! We hope this application proves to be useful for tracking activity in your organization.
