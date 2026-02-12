import { chromium } from 'playwright';

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
  pages: number = 1
): Promise<Job[]> {

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const encodedKeyword = encodeURIComponent(keyword);
  const encodedLocation = encodeURIComponent(location);

  const searchUrl = `https://jooble.org/SearchResult?rgns=${encodedLocation}&ukw=${encodedKeyword}`;

  await page.goto(searchUrl, { waitUntil: 'networkidle' });

  const jobs: Job[] = [];

  for (let i = 0; i < pages; i++) {

    // Wait for job cards to load
    await page.waitForTimeout(3000);

    const jobCards = await page.locator('article').all();

    for (const card of jobCards) {
      try {

        const title = await card.locator('h2').innerText();
        const link = await card.locator('a').first().getAttribute('href');

        const company = await card.locator('span').first().innerText().catch(() => "Unknown");

        if (!link) continue;

        jobs.push({
          title,
          company,
          location,
          url: link.startsWith('http') ? link : `https://jooble.org${link}`
        });

      } catch {
        continue;
      }
    }

    // Attempt pagination
    const nextButton = page.locator('text=Next');
    if (await nextButton.count() > 0) {
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

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Simple + safe: extract entire body text
  const description = await page.locator('body').innerText();

  await browser.close();
  return description;
}
