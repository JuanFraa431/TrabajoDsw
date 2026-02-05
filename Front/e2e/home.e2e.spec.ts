import { test, expect } from "@playwright/test";

test("home page loads and shows header", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Hoteles" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Paquetes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Excursiones" })).toBeVisible();
});
