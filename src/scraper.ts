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
  

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  
  await closePaidModal(page);
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

async function closePaidModal(page: any) {
  try {
    // Wait briefly to allow modal to appear
    await page.waitForTimeout(2000);

    const modal = page.locator('[role="dialog"][aria-modal="true"]');

    if (await modal.count() === 0) {
      console.log("No modal detected");
      return;
    }

    console.log("Modal detected");

    // Try clicking the Skip button first (more reliable)
    const skipButton = page.locator('[data-test-name="_skipPopup"]');

    if (await skipButton.count() > 0) {
      await skipButton.click({ force: true });
      await modal.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
      console.log("Closed modal using Skip button");
      return;
    }

    // Fallback: click the X button
    const closeButton = page.locator('[data-test-name="_crossSign"]');

    if (await closeButton.count() > 0) {
      await closeButton.click({ force: true });
      await modal.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
      console.log("Closed modal using X button");
    }

  } catch (err) {
    console.log("Modal close attempt failed:", err.message);
  }
}

