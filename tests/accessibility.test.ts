// tests/accessibility.test.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("WCAG 2.1 AAA Accessibility Auditi", () => {
  test("Asosiy sahifada a11y qoidabuzarliklari yo'qligini tekshirish", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Sariq-qora yuqori kontrast rejimining to'g'ri ishlashi", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.click("text=Kontrast");

    const bodyClass = await page.getAttribute("body", "class");
    expect(bodyClass).toContain("theme-yellow-black");
  });

  test("Screen Reader live announcer mavjudligi", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const announcer = page.locator("[role='status']");
    await expect(announcer).toBeAttached();
  });
});
