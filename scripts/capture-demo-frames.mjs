import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);
const width = 1280;
const height = 800;
const frameDir = path.join(rootDir, "tmp", "linkedin-demo-frames");

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Users\\bobcumulus\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error("Could not find a Chrome executable.");
}

function startServer() {
  const scriptPath = path.join(rootDir, "scripts", "serve-dist.mjs");
  const child = spawn(process.execPath, [scriptPath], {
    cwd: rootDir,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");

  const ready = new Promise((resolve, reject) => {
    let resolved = false;

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
      if (!resolved && chunk.includes(`http://127.0.0.1:${port}`)) {
        resolved = true;
        resolve();
      }
    });

    child.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    child.on("exit", (code) => {
      if (!resolved) {
        reject(new Error(`Preview server exited before it became ready (code ${code})`));
      }
    });
  });

  return { child, ready };
}

async function clickButtonByText(page, text) {
  await page.evaluate((needle) => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const button = buttons.find((el) => {
      const label = (el.textContent || "").replace(/\s+/g, " ").trim();
      return label.includes(needle);
    });
    if (!button) {
      throw new Error(`Could not find button containing: ${needle}`);
    }
    button.click();
  }, text);
}

async function clickGuideStep(page, index) {
  await page.evaluate((stepIndex) => {
    const cards = document.querySelectorAll(".guide-step-card");
    const card = cards[stepIndex];
    if (!card) {
      throw new Error(`Could not find guide step at index ${stepIndex}`);
    }
    card.click();
  }, index);
}

async function blurActiveElement(page) {
  await page.evaluate(() => {
    const active = document.activeElement;
    if (active && typeof active.blur === "function") {
      active.blur();
    }
  });
}

async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function scrollToSection(page, sectionTitle, offset = 140) {
  await page.evaluate(
    ({ needle, topOffset }) => {
      const headings = Array.from(document.querySelectorAll(".editor-section summary strong"));
      const heading = headings.find((el) => (el.textContent || "").replace(/\s+/g, " ").trim().includes(needle));
      if (!heading) {
        throw new Error(`Could not find section heading: ${needle}`);
      }

      const section = heading.closest(".editor-section");
      if (!section) {
        throw new Error(`Could not find section wrapper for: ${needle}`);
      }

      section.scrollIntoView({ block: "start" });
      window.scrollBy(0, -topOffset);
    },
    { needle: sectionTitle, topOffset: offset },
  );
}

async function focusFieldByLabel(page, labelText) {
  await page.evaluate((needle) => {
    const labels = Array.from(document.querySelectorAll("label.field, label.toggle-row"));
    const label = labels.find((el) => (el.textContent || "").replace(/\s+/g, " ").trim().includes(needle));
    if (!label) {
      throw new Error(`Could not find field label: ${needle}`);
    }

    const control = label.querySelector("input, textarea, select");
    if (!control) {
      throw new Error(`Could not find a control for: ${needle}`);
    }

    control.scrollIntoView({ block: "center" });
    control.focus();

    if (typeof control.select === "function") {
      control.select();
    }
  }, labelText);
}

async function typeFieldText(page, labelText, text, { clear = true, delayMs = 24 } = {}) {
  await focusFieldByLabel(page, labelText);

  if (clear) {
    await page.keyboard.down("Control");
    await page.keyboard.press("A");
    await page.keyboard.up("Control");
  }

  await page.keyboard.type(text, { delay: delayMs });
}

function killTree(pid) {
  if (!pid) return;
  spawn("taskkill", ["/PID", String(pid), "/T", "/F"], {
    stdio: "ignore",
    windowsHide: true,
  });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  if (!fs.existsSync(path.join(rootDir, "dist", "index.html"))) {
    throw new Error("dist/ is missing. Run the build first.");
  }

  fs.rmSync(frameDir, { recursive: true, force: true });
  fs.mkdirSync(frameDir, { recursive: true });

  const chrome = findChrome();
  const { child: server, ready } = startServer();

  let browser;
  try {
    console.log("Waiting for preview server...");
    await ready;
    console.log("Preview server ready.");

    browser = await puppeteer.launch({
      executablePath: chrome,
      headless: true,
      args: ["--disable-dev-shm-usage", "--no-first-run", "--no-default-browser-check"],
      defaultViewport: { width, height, deviceScaleFactor: 1 },
    });

    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle2" });
    await page.waitForSelector(".editor-panel");

    const frames = [
      {
        name: "frame-01-top.png",
        run: async () => {
          await clickButtonByText(page, "Load sample");
          await delay(500);
        },
      },
      {
        name: "frame-02-name.png",
        run: async () => {
          await typeFieldText(page, "Full name", "Alex Example");
          await blurActiveElement(page);
          await delay(350);
        },
      },
      {
        name: "frame-03-contact.png",
        run: async () => {
          await typeFieldText(page, "Professional title / role", "Privacy Systems Engineer");
          await typeFieldText(page, "Website / portfolio", "https://example.com");
          await blurActiveElement(page);
          await delay(350);
        },
      },
      {
        name: "frame-04-statement.png",
        run: async () => {
          await scrollToSection(page, "Personal Statement / Objective");
          await typeFieldText(
            page,
            "Statement text",
            "I build privacy tools that are easy to use and hard to misuse.",
          );
          await blurActiveElement(page);
          await delay(400);
        },
      },
      {
        name: "frame-05-interests.png",
        run: async () => {
          await scrollToSection(page, "Research Interests");
          await typeFieldText(
            page,
            "Topics (one per line)",
            "Web security\nPrivacy-preserving systems\nUsable security",
          );
          await blurActiveElement(page);
          await delay(400);
        },
      },
      {
        name: "frame-06-projects.png",
        run: async () => {
          await scrollToSection(page, "Projects");
          await typeFieldText(page, "Project name", "Example Privacy Tool");
          await typeFieldText(
            page,
            "Summary (one line)",
            "A sample project that turns privacy ideas into a working browser demo.",
          );
          await blurActiveElement(page);
          await delay(400);
        },
      },
      {
        name: "frame-07-theme.png",
        run: async () => {
          await scrollToSection(page, "Custom Theme (Advanced)");
          await typeFieldText(page, "Theme JSON", '{"layout":"two-column","spacing":"compact"}');
          await blurActiveElement(page);
          await delay(400);
        },
      },
      {
        name: "frame-08-preview-open.png",
        run: async () => {
          await scrollToTop(page);
          await clickButtonByText(page, "Compile & Preview");
          await delay(650);
        },
      },
      {
        name: "frame-09-preview.png",
        run: async () => {
          await page.waitForSelector(".preview-panel");
          await delay(500);
        },
      },
    ];

    for (const [index, frame] of frames.entries()) {
      await frame.run();
      const targetPath = path.join(frameDir, frame.name);
      await page.screenshot({ path: targetPath, type: "png" });
      console.log(`Saved ${String(index + 1).padStart(2, "0")}: ${frame.name}`);
    }

    console.log(`Frame capture complete: ${frameDir}`);
  } finally {
    if (browser && browser.process()) {
      killTree(browser.process().pid);
    }
    killTree(server.pid);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
