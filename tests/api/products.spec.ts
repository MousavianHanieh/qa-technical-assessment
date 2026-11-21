import { test, expect, APIResponse } from "@playwright/test";

const BASE_URL = "https://automationexercise.com/api";

interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

interface ProductsResponse {
  responseCode: number;
  products: Product[];
}

// The API returns JSON with a text/html content-type, so parse the text manually.
async function parseProducts(response: APIResponse): Promise<ProductsResponse> {
  return JSON.parse(await response.text());
}

test.describe("Products API", () => {
  test("Step 1: get all products and print Polo brand product names", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/productsList`);
    expect(response.status()).toBe(200);

    const body = await parseProducts(response);
    expect(body.responseCode).toBe(200);

    const poloProducts = body.products.filter(
      (product) => product.brand === "Polo"
    );
    expect(poloProducts.length).toBeGreaterThan(0);

    console.log("Polo products:");
    poloProducts.forEach((product) => console.log(`- ${product.name}`));
  });

  test("Step 2: search 'tshirt' and print products in the Tshirts category", async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/searchProduct`, {
      form: { search_product: "tshirt" },
    });
    expect(response.status()).toBe(200);

    const body = await parseProducts(response);
    expect(body.responseCode).toBe(200);

    const tshirts = body.products.filter(
      (product) => product.category.category === "Tshirts"
    );
    expect(tshirts.length).toBeGreaterThan(0);

    console.log("T-shirts products:");
    console.log(JSON.stringify(tshirts, null, 2));
  });
});
