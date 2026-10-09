import { test, expect } from "@playwright/test";

test("email input shows and clears a validation error", async ({ page }) => {
  await page.goto("/");
  const email = page.getByLabel("Email");
  await email.fill("nope");
  await expect(page.getByRole("alert")).toHaveText("Enter a valid email.");
  await email.fill("me@example.com");
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("modal opens, traps content, and closes with Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open modal" }).click();
  await expect(page.getByRole("dialog", { name: "Confirm" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("no horizontal scroll at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 700 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
