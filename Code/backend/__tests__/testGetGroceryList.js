const request = require("supertest")("http://localhost:1000/api/v1");
const expect = require("chai").expect;

describe("GET /recipes/getGroceryList", function () {
  
  it("API should return status 200", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    expect(response.status).to.eql(200);
  });

  it("API should return a list", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    expect(response.body).to.have.property("groceryList").that.is.an("array");
  });

  it("API should return specific grocery items", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    expect(response.body.groceryList).to.include("tomato");
    expect(response.body.groceryList).to.include("salt");
  });

  it("API should return a non-empty grocery list", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    expect(response.body.groceryList.length).to.be.greaterThan(0);
  });

  it("API should return unique grocery items", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    const uniqueItems = new Set(response.body.groceryList);
    expect(uniqueItems.size).to.eql(response.body.groceryList.length);
  });

  it("API should return an empty list for an unknown user", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=unknownUser");
    expect(response.body.groceryList).to.be.an("array").that.is.empty;
  });

  it("API should not return duplicate grocery items", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    const groceryList = response.body.groceryList;
    const duplicateCheck = groceryList.some((item, index) => groceryList.indexOf(item) !== index);
    expect(duplicateCheck).to.be.false;
  });

  it("API should return all expected items", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    const expectedItems = ["tomato", "salt", "boneless chicken", "ginger garlic paste"];
    expectedItems.forEach(item => {
      expect(response.body.groceryList).to.include(item);
    });
  });

  it("API should return a JSON response", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    expect(response.type).to.eql("application/json");
  });

  it("API should return a 400 status when userName is missing", async function () {
    const response = await request.get("/recipes/getGroceryList");
    expect(response.status).to.eql(400);
  });

  it("API should return an error message when userName is missing", async function () {
    const response = await request.get("/recipes/getGroceryList");
    expect(response.body).to.eql("Username not given");
  });

  it("API should support large grocery lists", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=largeUser");
    expect(response.body.groceryList.length).to.be.greaterThan(50);
  });

  it("API should handle special characters in grocery items", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=specialCharUser");
    expect(response.body.groceryList).to.include("kasuri methi (dried fenugreek leaves)");
  });

  it("API should return lowercase grocery items", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    response.body.groceryList.forEach(item => {
      expect(item).to.eql(item.toLowerCase());
    });
  });

  it("API should not return null values in the list", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    expect(response.body.groceryList).to.not.include(null);
  });

  it("API should return a properly formatted list", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    response.body.groceryList.forEach(item => {
      expect(item).to.be.a("string");
    });
  });

  it("API should be performant (respond within 1s)", async function () {
    const start = Date.now();
    await request.get("/recipes/getGroceryList?userName=testUser");
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(1000);
  });

  it("API should return correct items for a different user", async function () {
    const response1 = await request.get("/recipes/getGroceryList?userName=testUser1");
    const response2 = await request.get("/recipes/getGroceryList?userName=testUser2");
    expect(response1.body.groceryList).to.not.eql(response2.body.groceryList);
  });

  it("API should return only strings in the grocery list", async function () {
    const response = await request.get("/recipes/getGroceryList?userName=testUser");
    response.body.groceryList.forEach(item => {
      expect(typeof item).to.equal("string");
    });
  });

});
