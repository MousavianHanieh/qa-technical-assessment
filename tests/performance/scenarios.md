# Performance Testing Scenarios

**Target API:** `POST https://automationexercise.com/api/searchProduct`

**Tool:** k6

This document describes five performance testing scenarios considered for the product search API.

## 1. Smoke Test

**Goal:** Verify that the API and performance test script work correctly under minimal load.

- Virtual users: 1
- Purpose: Basic API availability and response validation.
- Status: Not implemented.

## 2. Load Test

**Goal:** Evaluate API performance under normal and sustained traffic.

- Ramp up to 10 virtual users over 30 seconds.
- Maintain 10 virtual users for 3 minutes.
- Ramp down to 0 users over 30 seconds.

**Thresholds:**

- HTTP request failure rate below 1%.
- 95th percentile response time below 2 seconds.

**Status:** Implemented and executed successfully.

**Results:**

- Total requests: 1,474
- Average response time: 429.86 ms
- p95 response time: 791.79 ms
- Failed request rate: 0%
- Successful checks: 100%

## 3. Stress Test

**Goal:** Gradually increase the load to identify the API's performance limits.

Proposed stages:

- 10 virtual users
- 30 virtual users
- 60 virtual users
- 100 virtual users

**Status:** Not implemented.

## 4. Spike Test

**Goal:** Evaluate API behavior during a sudden increase in traffic and observe its behavior after the load decreases.

**Stages:**

- Start with 2 virtual users over 30 seconds.
- Increase to 40 users over 10 seconds.
- Maintain 40 users for 1 minute.
- Drop back to 2 users over 10 seconds.
- Maintain 2 users for 1 minute.
- Ramp down to 0 users over 10 seconds.

**Thresholds:**

- HTTP request failure rate below 5%.
- 95th percentile response time below 3 seconds.

**Status:** Implemented and executed.

**Results:**

- Total requests: 1,754
- Average response time: 754.78 ms
- p95 response time: 1.21 seconds
- Failed request rate: 0.85%
- Successful checks: 99.14%

Some requests timed out during execution, although both configured thresholds passed.

## 5. Soak Test

**Goal:** Identify gradual performance degradation during prolonged execution.

- Virtual users: 10
- Duration: 1–2 hours
- Purpose: Observe response times, failures, and performance stability over time.

**Status:** Not implemented.

---

## Summary

| Scenario | Status                   |
| -------- | ------------------------ |
| Smoke    | Not implemented          |
| Load     | Implemented and executed |
| Stress   | Not implemented          |
| Spike    | Implemented and executed |
| Soak     | Not implemented          |

Only the Load and Spike scenarios were implemented and executed in this assessment project.
