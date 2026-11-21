import { test, expect } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";
import { SearchResultsPage } from "../../src/pages/SearchResultsPage";

test("should search hotels with the required filters", async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);

  await page.goto("https://www.booking.com/");
  await homePage.handlePopups();

  await homePage.changeCurrency("TRY");
  await homePage.selectDestination("London");
  await homePage.selectFlexibleDates();
  await homePage.setAdults(8);
  await homePage.enableTravelingWithPets();
  await homePage.closeOccupancyPopup();
  await homePage.search();

  await searchResultsPage.waitForHotelResults();
  const hotelPage = await searchResultsPage.openThirdHotel();

  await expect(hotelPage).toHaveURL(/hotel/i);
});
