import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["", "time-machine/", "proposal/", "es/", "es/time-machine/"];

function watch(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => { const why = r.failure()?.errorText ?? ""; if (!/ERR_ABORTED/.test(why)) errors.push(`requestfailed: ${r.url()} (${why})`); });
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  return errors;
}

for (const route of ROUTES) {
  test(`route /${route} renders clean`, async ({ page }) => {
    const errors = watch(page);
    const res = await page.goto(route, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    await expect(page.locator("nav")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("unknown path serves the lost page with a 404", async ({ page }) => {
  const res = await page.goto("nope/this-panel/", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("isn’t wrapped yet");
});

test("dark by default, light before first paint when stored", async ({ browser }) => {
  // record the <html> class at DOMContentLoaded, before any React code has run
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => { (window as unknown as { __early: boolean }).__early = document.documentElement.classList.contains("dark"); }); });
  const page = await ctx.newPage();
  await page.goto("", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => (window as unknown as { __early: boolean }).__early)).toBe(true);
  await page.evaluate(() => localStorage.setItem("tw-theme", "light"));
  await page.goto("", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => (window as unknown as { __early: boolean }).__early)).toBe(false);
  expect(await page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(false);
  await ctx.close();
});

test("psyclone persists and lives on <html>, never <body>", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("switch", { name: /Psyclone/ }).click();
  expect(await page.evaluate(() => [document.documentElement.classList.contains("psyclone"), document.body.classList.contains("psyclone"), localStorage.getItem("tw-psyclone")])).toEqual([true, false, "true"]);
});

test("settings drawer traps focus and restores it on Escape", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  const gear = page.getByRole("button", { name: "Settings" });
  await gear.click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#settings-drawer"))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => document.activeElement?.textContent?.includes("Settings"))).toBe(true);
});

test("no emoji anywhere in the rendered home", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  const text = await page.evaluate(() => document.body.innerText);
  expect(/(?![©®™])\p{Extended_Pictographic}/u.test(text)).toBe(false);
});

test("hero stage picks the right tier for this browser", async ({ page }, testInfo) => {
  await page.goto("", { waitUntil: "networkidle" });
  const stage = page.locator("[data-tier]");
  await expect(stage).not.toHaveAttribute("data-tier", "pending");
  const tier = await stage.getAttribute("data-tier");
  if (testInfo.project.name === "no-webgl") expect(["peel2d", "still"]).toContain(tier);
  else if (testInfo.project.name === "mobile") expect(tier).toBe("peel2d"); // phones start 2D; the 3D lab is opt-in
  else await expect(stage).toHaveAttribute("data-tier", "webgl", { timeout: 15_000 }); // desktop upgrades once idle
  const finalTier = await stage.getAttribute("data-tier");
  await expect(page.locator(`canvas[data-engine="${finalTier === "webgl" ? "webgl" : "peel2d"}"]`)).toBeVisible();
  if (testInfo.project.name === "mobile") { await page.getByRole("button", { name: "Open the 3D lab" }).click(); await expect(stage).toHaveAttribute("data-tier", "webgl"); }
  if (testInfo.project.name === "chromium-reduced") await expect(page.getByText("Wrapped. Get Taylor")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("status", { name: "Loading" })).toHaveCount(0, { timeout: 8_000 });
});

test("the booth wraps the shell and sends a real build to the counter", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await page.locator("#visualizer").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Drum kit", exact: true }).last().click();
  await page.getByRole("button", { name: "Film: Spectra-Psyclone" }).click();
  await page.getByLabel("Your lettering").fill("MOM");
  await expect(page.getByRole("img", { name: /Lettering: MOM/ })).toBeVisible();
  await page.waitForTimeout(600);
  const colored = await page.evaluate(() => {
    const c = document.querySelector<HTMLCanvasElement>('canvas[data-layer="wrap"]')!;
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let n = 0, hit = 0;
    for (let i = 0; i < d.length; i += 4 * 97) { n++; const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]); if (mx - mn > 60) hit++; }
    return hit / n;
  });
  expect(colored).toBeGreaterThan(0.05);
  await page.getByRole("button", { name: "Send this build to the shop" }).click();
  const order = await page.evaluate(() => JSON.parse(sessionStorage.getItem("tw-workorder") || "{}"));
  expect(order.step).toBe(4);
  expect(order.body).toBe("Something Else");
  expect(order.service).toBe("Lettering / Decals");
  expect(order.film).toBe("Color-Shift / Iridescent");
  expect(order.notes).toContain('lettering "MOM"');
});

test("a #build= link opens the booth to that build", async ({ page }) => {
  const spec = Buffer.from(JSON.stringify({ v: 1, body: "bus", film: "lime", finish: "matte", text: "HI", from: "carshow" })).toString("base64url");
  await page.goto(`#visualizer&build=${spec}`, { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "School bus" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Film: Lime Riot" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Your lettering")).toHaveValue("HI");
});

test("the counter: four steps to a ticket with the name on the email", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await page.locator("#quote").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Food truck/ }).click();
  await page.getByRole("button", { name: /Full custom wrap/ }).click();
  await page.getByRole("button", { name: /Color-shift/ }).click();
  await expect(page.locator("[data-progress]")).toHaveText("Step 4 of 4");
  await page.getByLabel("Your name").fill("Chris");
  await page.getByLabel("Phone or email").fill("215-555-0100");
  await page.getByRole("button", { name: "Build the work order" }).click();
  const ticket = page.locator("[data-ticket]");
  await expect(ticket).toBeVisible();
  await expect(ticket).toContainText(/#TW-\d{4}/);
  const href = await page.getByRole("link", { name: /Email it to the shop/ }).getAttribute("href");
  expect(decodeURIComponent(href ?? "")).toContain("Name: Chris");
  expect(decodeURIComponent(href ?? "")).toContain("Body: Food Truck");
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("tw-workorder") || "{}").ticket)).toMatch(/#TW-\d{4}/);
  await expect(page.getByRole("button", { name: "Next" })).toHaveCount(0);
});

test("receipts: the certificate hashes in the browser and verifies against the manifest", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await page.locator("#receipts").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-hash-state="verified"]').first()).toBeVisible({ timeout: 15_000 });
  const slider = page.getByRole("slider", { name: /The shop van: reveal/ });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  expect(Number(await slider.inputValue())).toBeGreaterThan(42);
});

test("the lab: a demo wallet opens the vault and says it is a demo", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await page.locator("#lab").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-vault]")).toHaveAttribute("data-vault", "closed");
  await page.locator("[data-wallet-connect]").click();
  await expect(page.locator("[data-wallet-mode]")).toHaveAttribute("data-wallet-mode", "demo");
  await expect(page.locator("[data-vault]")).toHaveAttribute("data-vault", "open");
});

test("the arrival kit switches the language and <html lang>", async ({ page }) => {
  await page.goto("", { waitUntil: "networkidle" });
  await page.locator("#arrival").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Bienvenidos/ }).click();
  await expect(page.getByText("Antes de llegar")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("es");
  expect(await page.evaluate(() => localStorage.getItem("tw-lang"))).toBe("es");
  await expect(page.getByRole("link", { name: "Los recibos" }).first()).toBeVisible();
});

test("the Spanish twin serves with lang=es", async ({ page }) => {
  const res = await page.goto("es/", { waitUntil: "networkidle" });
  expect(res?.status()).toBe(200);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("es");
  await expect(page.getByText("Antes de llegar")).toBeVisible();
});

test("toolbox paints only while the pointer is down, on its own canvas", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop rail only");
  await page.goto("", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("switch", { name: /Toolbox/ }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Film #a855f7" }).click();
  await expect(page.locator('canvas[data-layer="paint"]')).toHaveCount(1);
  const painted = async () => page.evaluate(() => { const c = document.querySelector<HTMLCanvasElement>('canvas[data-layer="paint"]')!; const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4 * 53) if (d[i] > 0) n++; return n; });
  const para = page.locator("#manifesto p").first();
  await para.scrollIntoViewIfNeeded();
  const b = (await para.boundingBox())!;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.move(x, y); await page.mouse.move(x + 60, y + 10); await page.mouse.move(x + 120, y + 20);
  expect(await painted()).toBe(0);
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 60, y + 10, { steps: 6 }); await page.mouse.move(x + 120, y + 20, { steps: 6 }); await page.mouse.up();
  expect(await painted()).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Undo last stroke" }).click();
  expect(await painted()).toBe(0);
  const layers = await page.evaluate(() => [...document.querySelectorAll("canvas[data-layer]")].map((c) => c.getAttribute("data-layer")));
  expect(new Set(layers).size).toBe(layers.length);
});

test("proposal sheet: blank prices, totals from what you type, remembered only on this device", async ({ page }) => {
  await page.goto("proposal/", { waitUntil: "networkidle" });
  const prices = page.locator('input[aria-label$=" price"]');
  expect(await prices.evaluateAll((els) => els.every((e) => (e as HTMLInputElement).value === ""))).toBe(true);
  await page.getByLabel("Full color-change wrap", { exact: true }).check();
  await page.getByLabel("Full color-change wrap price").fill("3200");
  await expect(page.locator("[data-sheet] tr.tot td.amt")).toHaveText("$3,200");
  expect(await page.evaluate(() => localStorage.getItem("tw-ratecard"))).toBeNull();
  await page.getByLabel(/Remember my prices/).check();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("tw-ratecard") || "{}").lines?.["Full color-change wrap"])).toBe("3200");
});
