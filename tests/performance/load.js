import http from "k6/http";
import { check, sleep } from "k6";

const URL = "https://automationexercise.com/api/searchProduct";
const SEARCH_TERMS = ["top", "tshirt", "jean"];

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "3m", target: 10 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};

export default function () {
  const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];

  const response = http.post(URL, {
    search_product: term,
  });

  check(response, {
    "HTTP status is 200": (r) => r.status === 200,
    "API responseCode is 200": (r) => {
      try {
        return JSON.parse(r.body).responseCode === 200;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
