# Contributing to CodeAtlas

Thank you for your interest in contributing to **CodeAtlas**! We welcome contributions from developers of all skill levels to help make open-source codebases more accessible.

---

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Setting Up the Project Locally](#setting-up-the-project-locally)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct
We aim to cultivate a welcoming, inclusive, and harassment-free community. Please treat all contributors with respect, constructiveness, and kindness.

---

## How to Contribute
You can contribute in several ways:
1. **Reporting Bugs:** Create an issue describing any bugs or unexpected behavior.
2. **Requesting Features:** Pitch new concepts or suggest workflow improvements.
3. **Improving Documentation:** Fix typos, clean up explanations, or add guides.
4. **Submitting Pull Requests:** Claim open issues and submit code fixes.

---

## Setting Up the Project Locally

### Prerequisites
- Node.js (version 18 or higher)
- MongoDB running locally or a MongoDB Atlas cloud cluster URI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env` (especially `MONGO_URI`, `GITHUB_TOKEN`, and `AI_API_KEY`).
5. Launch the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

## Pull Request Guidelines
- Always create a new feature branch for your changes:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Write clean, documented code and keep commits concise.
- Ensure your code does not break the build.
- Submit your pull request targeting the `main` branch.
- Include a descriptive summary of the changes and link the relevant issue.

---

## Reporting Issues
- Use the repository **Issues** tab.
- Describe the bug clearly, including the steps to reproduce, the expected results, and any relevant logs or screenshots.
