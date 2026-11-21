import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  private readonly cookieContainer: Locator;
  private readonly cookieDecline: Locator;
  private readonly popups: Array<{ closeButton: Locator; container: Locator }>;

  constructor(page: Page) {
    this.page = page;

    this.cookieContainer = page.locator("#onetrust-group-container");
    this.cookieDecline = page.locator("#onetrust-reject-all-handler");

    this.popups = [
      {
        closeButton: page.getByRole("button", {
          name: "Dismiss sign-in info.",
        }),
        container: page.getByRole("dialog", {
          name: "Window offering discounts of 10% or more when you sign in to Booking.com",
        }),
      },
      {
        closeButton: page.getByRole("button", { name: "Close sheet" }),
        container: page.getByRole("dialog", {
          name: "Black Friday Deals are live",
        }),
      },
    ];
  }

  private async dismissIfVisible(
    closeButton: Locator,
    container: Locator,
    timeout = 3000
  ): Promise<void> {
    try {
      await closeButton.waitFor({ state: "visible", timeout });
    } catch {
      return;
    }

    await closeButton.click();
    await expect(container).toBeHidden({ timeout: 5000 });
  }

  async handlePopups(): Promise<void> {
    await this.dismissIfVisible(this.cookieDecline, this.cookieContainer, 8000);

    for (const { closeButton, container } of this.popups) {
      await this.dismissIfVisible(closeButton, container);
    }
  }
}
