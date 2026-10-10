import { chromium } from "playwright";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  await page.goto(pathToFileURL(resolve(root, "resume.html")).href, { waitUntil: "networkidle" });
  await page.pdf({
    path: resolve(root, "resume.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false
  });
  console.log("Generated resume.pdf");
} finally {
  await browser.close();
}
