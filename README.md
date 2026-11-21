# QA Technical Assessment

Automated testing project developed for the Mohaymen Automation Test Developer technical assessment.

The project covers three main areas:

- UI Automation using Playwright and TypeScript.
- API Testing using Playwright API Client.
- Performance Testing using k6.

## Project Structure

```text
qa-technical-assessment/
├── src/
│   └── pages/
│       ├── BasePage.ts
│       ├── HomePage.ts
│       └── SearchResultsPage.ts
├── tests/
│   ├── ui/
│   │   └── booking.spec.ts
│   ├── api/
│   │   └── products.spec.ts
│   └── performance/
│       ├── load.js
│       ├── spike.js
│       └── scenarios.md
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## 1. UI Automation – Booking.com

**Tools:** Playwright, TypeScript, Page Object Model (POM)

### Test Scenario

The UI test automates the following steps:

1. Open https://www.booking.com/.
2. Dismiss cookie and sign-in popups.
3. Change the currency to TRY (Turkish Lira).
4. Enter London and select the first suggestion.
5. Select flexible dates:
   - I'm flexible
   - A month
   - Current month
   - Select dates
6. Set the number of adults to 8.
7. Enable Travelling with pets.
8. Click Search.
9. Open the third hotel's availability page in a new tab.
10. Verify that the hotel page opens successfully.

### Page Object Model

The UI automation follows the Page Object Model pattern to separate page interactions from test scenarios.

- `BasePage.ts`: Common functionality, including cookie and popup handling.
- `HomePage.ts`: Homepage actions such as changing currency, selecting a destination and dates, setting guests, enabling pets, and searching.
- `SearchResultsPage.ts`: Hotel result handling and opening the third hotel in a new tab.

**Implementation details:**

- Locators are defined in the page objects.
- Page methods perform individual user actions and relevant assertions.
- The test file focuses on readable scenario steps rather than directly defining selectors.
- `HomePage` extends `BasePage` to reuse common popup-handling functionality.
- `openThirdHotel()` returns the new browser tab because the hotel opens in a separate tab.

---

## 2. API Testing – AutomationExercise

**Tool:** Playwright built-in API Client

**API Documentation:** https://automationexercise.com/api_list

Two API test scenarios were implemented according to the assessment requirements.

### Scenario 1: Get Products by Polo Brand

- Send a GET request to `/api/productsList`.
- Parse the JSON response.
- Filter products where `brand === 'Polo'`.
- Verify that at least one matching product exists.
- Print the matching product names in the terminal.

### Scenario 2: Search T-shirt Products

- Identify the required input parameter and its type from the API documentation.
- Send a POST request to `/api/searchProduct`.
- Use the form parameter `search_product=tshirt`.
- Parse the JSON response.
- Filter products where `category.category === 'Tshirts'`.
- Verify that at least one matching product exists.
- Print the matching product information in the terminal.

**Implementation details:**

- Playwright's built-in `request` fixture is used for API calls.
- TypeScript interfaces define the product and response structures.
- A helper function parses the API response.
- Assertions validate the response code and filtered results.

**Note:** The actual category value in the API response is `Tshirts` (without a hyphen), although the assessment describes it as T-shirts.

---

## 3. Performance Testing – AutomationExercise

**Tool:** k6

The performance tests target the product search API:

`POST https://automationexercise.com/api/searchProduct`

Two performance scenarios were implemented.

### 3.1 Load Test

**Goal:** Evaluate API performance under normal and sustained traffic.

**Configuration:**

- Ramp up to 10 virtual users over 30 seconds.
- Maintain 10 virtual users for 3 minutes.
- Ramp down to 0 users over 30 seconds.

**Thresholds:**

- HTTP request failure rate below 1%.
- 95th percentile response time below 2 seconds.

**Execution Results:**

| Metric                |    Result |
| --------------------- | --------: |
| Total requests        |     1,474 |
| Average response time | 429.86 ms |
| Median response time  | 354.64 ms |
| 95th percentile       | 791.79 ms |
| Failed request rate   |        0% |
| Successful checks     |      100% |

**Result:** Both configured thresholds passed. All checks were successful.

### 3.2 Spike Test

**Goal:** Evaluate API behavior during a sudden increase in traffic and observe its behavior after the load decreases.

**Configuration:**

- Start with 2 virtual users over 30 seconds.
- Increase to 40 users over 10 seconds.
- Maintain 40 users for 1 minute.
- Drop back to 2 users over 10 seconds.
- Maintain 2 users for 1 minute.
- Ramp down to 0 users over 10 seconds.

**Thresholds:**

- HTTP request failure rate below 5%.
- 95th percentile response time below 3 seconds.

**Execution Results:**

| Metric                |    Result |
| --------------------- | --------: |
| Total requests        |     1,754 |
| Average response time | 754.78 ms |
| Median response time  | 501.66 ms |
| 95th percentile       |    1.21 s |
| Failed request rate   |     0.85% |
| Successful checks     |    99.14% |

**Result:** Both configured thresholds passed.

Some requests timed out during execution. Although the overall failure rate remained below the defined threshold, these timeouts indicate occasional delays under spike load.

### Additional Performance Testing Scenarios

The following testing types were also considered:

- Smoke Testing
- Stress Testing
- Soak Testing

These scenarios were not implemented as part of the current project.

---

## 4. Challenges and Debugging

### 4.1 Booking.com Search and Navigation

One of the main challenges was that the automated search flow sometimes navigated to a London city page instead of displaying the expected hotel search results.

To investigate the issue:

- Ran the test in headed mode to observe browser behavior.
- Checked navigation and page state during execution.
- Reviewed browser launch and configuration settings.
- Tested different browser configurations.
- Verified the relevant locators and search results.

The test eventually passed after browser configuration adjustments.

The exact cause of the initial redirect was not conclusively identified.

**Relevant browser configuration settings:**

| Setting                                         | Purpose                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| `channel: "chrome"`                             | Uses the installed Google Chrome browser.      |
| `headless: false`                               | Runs the browser in headed mode.               |
| `--disable-blink-features=AutomationControlled` | Changes an automation-related Blink feature.   |
| `ignoreDefaultArgs: ["--enable-automation"]`    | Excludes a default automation launch argument. |
| `locale`, `timezoneId`, `viewport`              | Configures the browser context.                |

Several settings were adjusted during debugging, so the exact setting responsible for the improvement was not isolated.

### 4.2 Destination Autocomplete

Using `fill()` did not reliably update the destination suggestion list. The autocomplete sometimes continued displaying the default destination (Paris) instead of London.

**Solution:**

- Used `pressSequentially()` to simulate sequential keyboard input.
- Added a retry mechanism with `expect(...).toPass()` to verify that the suggestion contains the requested destination before selecting it.

### 4.3 Timeouts

The default 30-second test timeout was insufficient for some runs against the live website. Execution time varied depending on network conditions.

**Solution:**

- Increased the test timeout to 90 seconds.
- Set the assertion timeout to 10 seconds.
- Used condition-based waits instead of fixed delays.

Timeouts are maximum limits; a test that finishes earlier does not wait unnecessarily.

---

## 5. Known Limitations

- Tests run against live external websites, so results may vary depending on network speed, VPN availability, website changes, and browser behavior.
- Booking.com currency and hotel availability depend on the website at execution time.
- The Spike test experienced occasional request timeouts, although both configured thresholds passed.
- Smoke, Stress, and Soak performance scenarios were not implemented.
- Performance results reflect the test environment and should not be interpreted as production service-level guarantees.

---

## 6. Installation and Execution

### Prerequisites

- Node.js and npm
- Google Chrome
- k6

### Install Project Dependencies

```bash
npm install
npx playwright install chrome
```

Google Chrome must also be installed on the machine because the Playwright configuration uses the Chrome channel.

To install k6 on macOS with Homebrew:

```bash
brew install k6
```

### Run UI Automation

```bash
npx playwright test tests/ui/booking.spec.ts --project=chrome --headed
```

### Run API Tests

```bash
npx playwright test tests/api/products.spec.ts
```

### Run Load Test

```bash
k6 run tests/performance/load.js
```

### Run Spike Test

```bash
k6 run tests/performance/spike.js
```

### View Playwright HTML Report

```bash
npx playwright show-report
```

---

## 7. Debugging Tools

Run Playwright tests in headed mode with tracing:

```bash
npx playwright test --headed --trace on
```

View a trace:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

Screenshots and videos of failed tests are saved in `test-results/`.

Failure screenshots were particularly useful during debugging because they showed the exact page state at the moment of failure, such as an incorrect autocomplete suggestion or a popup covering an element.

---

## Project Summary

This project demonstrates practical experience with UI automation, API testing, and performance testing.

The implementation focuses on readable test scenarios, reusable page objects, API response validation, performance thresholds, and systematic debugging.
