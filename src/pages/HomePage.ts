import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  private readonly currencyPickerTrigger: Locator;
  private readonly destinationInput: Locator;
  private readonly destinationSuggestions: Locator;
  private readonly flexibleDatePicker: Locator;
  private readonly flexibleTab: Locator;
  private readonly aMonthOption: Locator;
  private readonly monthOptions: Locator;
  private readonly occupancyButton: Locator;
  private readonly adultsInput: Locator;
  private readonly increaseAdultsButton: Locator;
  private readonly petsCheckbox: Locator;
  private readonly petsLabel: Locator;
  private readonly occupancyDoneButton: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);

    this.currencyPickerTrigger = page.getByTestId(
      "header-currency-picker-trigger"
    );

    this.destinationInput = page.locator(
      "#searchbox-horizontal-destination-input"
    );
    this.destinationSuggestions = page.locator(
      '#autocomplete-results [role="option"]'
    );

    this.flexibleDatePicker = page.getByTestId(
      "searchbox-datepicker-flexible-dates-container"
    );
    this.flexibleTab = page.locator(
      "#flexible-searchboxdatepicker-tab-trigger"
    );
    this.aMonthOption = page.getByText("A month", { exact: true });
    this.monthOptions = page.getByTestId("flexible-dates-month");

    this.occupancyButton = page.getByTestId("occupancy-config");
    this.adultsInput = page.locator("#group_adults");
    this.increaseAdultsButton = this.adultsInput.locator(
      "xpath=following-sibling::button[2]"
    );
    this.petsCheckbox = page.locator("#pets");
    this.petsLabel = page.locator('label[for="pets"]');
    this.occupancyDoneButton = page.getByRole("button", { name: "Done" });

    this.searchButton = page.getByRole("button", {
      name: "Search",
      exact: true,
    });
  }

  async changeCurrency(currencyCode = "TRY"): Promise<void> {
    await this.currencyPickerTrigger.click();
    await this.page
      .getByTestId("selection-item")
      .filter({ hasText: currencyCode })
      .click();

    await expect(this.currencyPickerTrigger).toContainText(currencyCode);
  }

  async selectDestination(destination: string): Promise<void> {
    const firstSuggestion = this.destinationSuggestions.first();

    await expect(async () => {
      await this.destinationInput.click();
      await this.destinationInput.clear();
      await this.destinationInput.pressSequentially(destination, {
        delay: 100,
      });

      await expect(firstSuggestion).toContainText(destination, {
        ignoreCase: true,
        timeout: 5000,
      });
    }).toPass({ timeout: 30000 });

    await firstSuggestion.click();

    await expect(this.destinationInput).toHaveValue(
      new RegExp(destination, "i")
    );
  }

  async selectFlexibleDates(): Promise<void> {
    await this.flexibleTab.click();
    await this.aMonthOption.click();

    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear().toString();

    const currentMonthOption = this.monthOptions
      .filter({ has: this.page.getByText(month, { exact: true }) })
      .filter({ has: this.page.getByText(year, { exact: true }) });

    await currentMonthOption.click();
    await this.flexibleDatePicker
      .getByRole("button", { name: "Select dates" })
      .click();

    await expect(this.flexibleDatePicker).toBeHidden();
  }

  async setAdults(targetAdults: number): Promise<void> {
    await this.occupancyButton.click();

    let current = Number(await this.adultsInput.getAttribute("aria-valuenow"));
    while (current < targetAdults) {
      await this.increaseAdultsButton.click();
      current = Number(await this.adultsInput.getAttribute("aria-valuenow"));
    }

    await expect(this.adultsInput).toHaveAttribute(
      "aria-valuenow",
      targetAdults.toString()
    );
  }

  async enableTravelingWithPets(): Promise<void> {
    await this.petsLabel.click();
    await expect(this.petsCheckbox).toBeChecked();
  }

  async closeOccupancyPopup(): Promise<void> {
    await this.occupancyDoneButton.click();
  }

  async search(): Promise<void> {
    await this.searchButton.click();
  }
}
