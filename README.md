![image](https://github.com/seriybeliy11/Grants-Bounty-Tracker/assets/129196368/2bf89dd0-acc7-44eb-8164-58755982b55e)


# Grants & Bounties Tracker

**GitHub Analytics Dashboard**

## Description

GitHub Analytics Dashboard is a web application and analytical tool designed for tracking various metrics of a GitHub project, particularly those related to crowdsourced development. The metrics include rewards, the number of resolved and closed issues, participant counts, and the quantity of comments on issues.

## Functional
- the best countertributer 
- number of tasks recorded
- number of contributors 
- status ratio for tasks 
- task label ratio 
- financial line chart 
- number of comments 
- task duration 

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
   cd Grants-Bounty-Tracker
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
