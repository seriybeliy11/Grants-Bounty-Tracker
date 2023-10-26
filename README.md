![egw](https://github.com/seriybeliy11/Grants-Bounty-Tracker/assets/129196368/90a85183-1f25-4982-8db4-4f99fe9a8aaf)



# Grants & Bounties Tracker

**GitHub Analytics Dashboard**

## Description

GitHub Analytics Dashboard is a web application and analytical tool designed for tracking various metrics of a TON "Grants & Bounties", particularly those related to crowdsourced development. The metrics include rewards, the number of resolved and closed issues, participant counts, and the quantity of comments on issues.

## Functional
Our tool shows many key metrics for an organization, including:
- 👨‍👨‍👦‍👦Contributor's Value
- 🔥Best Contributor
- 📌Issue's Value
- ⌚Average task completion time
- 📍Biggest award received
- 👀Highest number of comments

Graphs visualize the following data:
- Contributors Data (The graph presents information about the number of actions of the named contributors)
- Issue's Data (The task duration graph is a visualization of the time taken to complete each task in the project)
- Issue's States Data
- Label's Data
- Closed Approved Issues Timeline
- Just Closed Issues Timeline
- All Issues Timeline
- Reward's Data
- Commenters Data

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation
To get started with the tool, you need to install node.js. Download the installer according to your operating system and install - https://nodejs.org/en

1. Clone the repository:

   ```bash
   git clone https://github.com/seriybeliy11/Grants-Bounty-Tracking.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Grants-Bounty-Tracking
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

1. Run the application:

   ```bash
   python Tracking.py
   ```

   This will start the development server, and you can access the dashboard at [http://localhost:5173](http://localhost:5173).

2. Explore the GitHub project metrics with the provided visualizations.

## Configuration

1. Create a `.env` file in the root of the project.

2. Add your GitHub API token as a virtual variable:

   ```env
   TOKEN=your-github-token-here
   ```

   Replace `your-github-token-here` with your actual GitHub API token.

## Contributing

If you would like to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

Please adhere to the project's coding standards and guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
