import { expect, test } from "@playwright/test";

test("login, create task, see it in list", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("candidate@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();

  await page.getByRole("link", { name: "Tasks" }).click();
  await page.getByRole("button", { name: "Create task" }).click();
  await page.getByLabel("Title").fill("Playwright verification task");
  await page.getByRole("button", { name: "Create task" }).last().click();

  await expect(page.getByText("Playwright verification task")).toBeVisible();
});
