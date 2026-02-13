import { scrapeJobs, extractDescription } from "./scraper";
import { isValidJob } from "./validator";
import { generateMessage } from "./llm";
import { appendToSheet } from "./sheets";

async function main() {
  
  const jobs = await scrapeJobs("Executive Assistant", "Remote", 1);

  let processedCount = 0;
  const MAX_JOBS = 5;

  for (const job of jobs) {

    if (processedCount >= MAX_JOBS) break;

    console.log(`Processing: ${job.title}`);

    const description = await extractDescription(job.url);

    const message = await generateMessage(
      job.company,
      job.title,
      description
    );

    await appendToSheet([
      job.url,
      job.title,
      job.company,
      job.location,
      description.slice(0, 1000),
      message,
      new Date().toISOString()
    ]);

    processedCount++;
    console.log(`Saved to sheet (${processedCount}/${MAX_JOBS})`);
  }
}


main();
