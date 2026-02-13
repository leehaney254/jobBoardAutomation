<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📗 Table of Contents](#-table-of-contents)
- [📖 Job Board Automation ](#Job board automation-)
  - [🛠 Built With ](#-built-with-)
    - [Tech Stack ](#tech-stack-)
    - [Documentation ](#documentation-)
    - [Key Features ](#key-features-)
  - [💻 Getting Started ](#-getting-started-)
    - [Prerequisites](#prerequisites)
  - [👥 Author ](#-author-)
  - [🔭 Future Features ](#-future-features-)
  - [🤝 Contributing ](#-contributing-)
  - [⭐️ Show your support ](#️-show-your-support-)
  - [📝 License ](#-license-)

<!-- PROJECT DESCRIPTION -->

# 📖 Job board automation <a name="about-project"></a>

**Job board automation** is an application that automatically scrapes job listings from online job boards, processes each listing using a large language model (LLM), and stores structured job data in a spreadsheet. It extracts key details such as company, role, location, and summarized descriptions, enabling organized tracking of opportunities and supporting streamlined applications, personalized outreach, and future analysis.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
<summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.org/">Node.js</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://playwright.dev/">Playwright</a></li>
    <li><a href="https://platform.openai.com/">OpenAI</a></li>
    <li><a href="https://developers.google.com/sheets/api">Google Sheets API</a></li>
  </ul>
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Documentation <a name="Documentation"></a>

The apps documentation can be found [here.](https://www.notion.so/Documentation-305975f7b086806c9008f3514d1b31cd)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Features -->

### Key Features <a name="key-features"></a>

- **Dynamic Job Scraping**
- **Popup Handling**
- **Job Data Extraction**
- **Job Data Extraction**
- **Modular Design**
- **Customizable cronjob**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps:

- Create a local directory where you can clone the project
- Clone the project to your directory by running
  - `https://github.com/leehaney254/jobBoardAutomation.git`
- Install Node.js if you do not have it installed [globally.](https://nodejs.org/en)
- Navigate to the project directory:
  - `cd jobBoardAutomation`
- Install project dependencies: -`npm install`
- Install Playwright browsers:
  - `npx playwright install`
- Create a .env file in the project root and add your keys:
  - `OPENAI_API_KEY=your_openai_api_key`
  - `SHEET_ID=your_google_sheet_id`
  - `GOOGLE_APPLICATION_CREDENTIALS=./credentials.json`
- Set up Google Sheets API:
- Enable Google Sheets API in Google Cloud
- Create a service account and download credentials.json
- Place credentials.json in the project root
- Share your spreadsheet with the service account email
- Run the scraper:
- `npm run start`
- Open your Google Sheet to see the scraped jobs and generated messages

## 💻 Automatic scheduling <a name="getting-started"></a>
- The cronjob has already been configured under `.github/workflows/cron.yml`
- Go to your repository on GitHub
- Navigate to: Settings → Secrets and variables → Actions
- Click New repository secret
- Add the following secrets:
  - `OPENAI_API_KEY` → Your OpenAI API key
  - `SHEET_ID` → Your Google Sheet ID
- Note the cronjob runs at UTC adjust as needed.

### Prerequisites

To run the app you need:

- **Node.js** – Version 18+ recommended (Download Node.js)
- **npm** – Comes with Node.js, used to install dependencies
- **Playwright** – Installed via `npm install playwright` and browsers via `npx playwright install`
- **TypeScript** – Installed via `npm install -D typescript` (if not globally available)
- **Google Cloud Account** – To create a service account and enable Google Sheets API
- **Google Sheets** – A spreadsheet to store scraped jobs
- **OpenAI Account** – To get an API key for LLM message generation
- **.env file** – To store sensitive keys (OPENAI_API_KEY, SHEET_ID, GOOGLE_APPLICATION_CREDENTIALS)
- **Credentials JSON** – Service account file downloaded from Google Cloud for Sheets API access

### Usage

To run the project, execute the following command:

```sh
 npm run start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 👥 Author <a name="authors"></a>

👤 **Leehaney George**

- GitHub: [@githubhandle](https://github.com/leehaney254)
- Twitter: [@twitterhandle](https://twitter.com/Lee06785586)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/leehaney-george-0a4a51178/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

- [ ] **Duplication handling**
- [ ] **Better Rate limiter**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

If you like this project kindly leave a ⭐

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
