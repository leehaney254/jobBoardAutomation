import { chromium } from "playwright";

export interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  description?: string;
}

/**
 * Scrapes Jooble search results
 */
export async function scrapeJobs(
  keyword: string,
  location: string,
  pages: number = 1,
): Promise<Job[]> {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100, // slow down operation to allow follow along
  });
  const page = await browser.newPage();

  const encodedKeyword = encodeURIComponent(keyword);
  const encodedLocation = encodeURIComponent(location);

  const searchUrl = `https://jooble.org/SearchResult?rgns=${encodedLocation}&ukw=${encodedKeyword}`;

  await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

  await closeJooblePopup(page);

  const jobs: Job[] = [];

  for (let i = 0; i < pages; i++) {
    // Wait for job cards to load
    await page.waitForTimeout(3000);

    await page.waitForSelector('[data-test-name="_jobCard"]');

    const jobCards = page.locator('[data-test-name="_jobCard"]');
    const count = await jobCards.count();

    console.log(`Found ${count} jobs`);

    for (let i = 0; i <5 ; i++) { // For scaling we will use count
      const card = jobCards.nth(i);

      try {
        const title = await card.locator("h2 a").innerText();
        const link = await card.locator("h2 a").getAttribute("href");

        const company = await card
          .locator('[data-test-name="_companyName"]')
          .innerText()
          .catch(() => "Unknown");

        if (!link) continue;

        jobs.push({
          title: title.trim(),
          company: company.trim(),
          location,
          url: link.startsWith("http") ? link : `https://jooble.org${link}`,
        });
      } catch (err) {
        console.log(`Skipping card ${i}`);
        continue;
      }
    }

    // Attempt pagination
    const nextButton = page.locator("text=Next");
    if ((await nextButton.count()) > 0) {
      await nextButton.click();
    } else {
      break;
    }
  }

  await browser.close();
  return jobs;
}

/**
 * Extracts full job description from job page
 */
export async function extractDescription(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await closePaidJobsModal(page);

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);

  // Simple + safe: extract entire body text
  const description = await page.locator('[data-test-name="_jobDescriptionBlock"] p').first().innerText();

  await browser.close();
  return description;
}

/**
 * Close pop-up
 */
async function closeJooblePopup(page: any) {
  try {
    // Wait briefly in case popup loads slightly after DOM ready
    await page.waitForTimeout(2000);

    const popup = page.locator('[data-test-name="_crazyPopUp"]');

    if ((await popup.count()) > 0) {
      console.log("Popup detected. Closing it...");

      const noButton = page.locator('[data-test-name="_crazyPopUpNoButton"]');

      if ((await noButton.count()) > 0) {
        await noButton.click();
        console.log("Popup closed by clicking 'No'");
      }

      // Wait for popup to disappear
      await popup.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
    }
  } catch (err) {
    console.log("Popup handling error:", err);
  }
}

async function closePaidJobsModal(page: any) {
  try {
    // Wait a short time for modal to appear
    await page.waitForTimeout(2000);

    const modalCloseButton = page.locator('[aria-labelledby="paid-job-modal-title"]');

    if (await modalCloseButton.count() > 0) {
      console.log("Paid jobs modal detected. Closing it...");

      await modalCloseButton.click();

      // Optional: wait for modal to disappear
      await page.locator('[data-test-name="_crossSign"]').waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
      
      console.log("Modal closed successfully");
    }
  } catch (err) {
    console.log("No paid jobs modal detected or failed to close:", err.message);
  }
}

