import { Job } from "./scraper";

export function isValidJob(job: Job, description: string): boolean {

  const title = job.title.toLowerCase();
  const desc = description.toLowerCase();

  const roleMatch = [
    "executive assistant",
    "admin assistant",
    "administrative assistant"
  ].some(role => title.includes(role));

  if (!roleMatch) return false;

  if (!desc.includes("remote")) return false;

  const englishMatch = [
    "english",
    "communication",
    "fluent"
  ].some(word => desc.includes(word));

  if (!englishMatch) return false;

  return true;
}
