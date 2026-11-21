import { Page, Locator, expect } from "@playwright/test";

export class SearchResultsPage {
  private readonly hotelCards: Locator;

  constructor(private readonly page: Page) {
    this.hotelCards = page.getByTestId("availability-cta");
  }

  async waitForHotelResults(): Promise<void> {
    await expect(this.hotelCards.nth(2)).toBeVisible({ timeout: 30000 });
  }

  async openThirdHotel(): Promise<Page> {
    const thirdHotelButton = this.hotelCards
      .nth(2)
      .getByTestId("availability-cta-btn");

    const [hotelPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      thirdHotelButton.click(),
    ]);

    await hotelPage.waitForLoadState("domcontentloaded");

    return hotelPage;
  }
}
