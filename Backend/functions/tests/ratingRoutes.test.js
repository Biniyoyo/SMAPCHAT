const request = require("supertest");
const app = require("../app.js");
const startDB = require("../database/database.js");

beforeAll(() => {
  return startDB();
}, 20000);

afterAll((done) => {
  done();
});

describe("Rating Tests", () => {
  let avgRateBeforeDelete;

  it("should create a rating with userId '657e7d6def4da688fce1e247' and mapId '657e80eeef4da688fce1e278'", async () => {
    await request(app)
      .post("/rate/create")
      .send({
        userId: "657e7d6def4da688fce1e247",
        mapId: "657e80eeef4da688fce1e278",
        rate: 5,
      })
      .expect(200);
  });

  it("should create another rating with a different userId and the same mapId '657e80eeef4da688fce1e278'", async () => {
    await request(app)
      .post("/rate/create")
      .send({
        userId: "657e068dc50ed724a7516f5c",
        mapId: "657e80eeef4da688fce1e278",
        rate: 5,
      })
      .expect(200);
  });

  it("should update the rating for userId '657e7d6def4da688fce1e247' to 3 and check if avgRate is now 4", async () => {
    const res = await request(app)
      .post("/rate/create")
      .send({
        userId: "657e7d6def4da688fce1e247",
        mapId: "657e80eeef4da688fce1e278",
        rate: 3,
      })
      .expect(200);

    const avgRateRes = await request(app)
      .get("/rate/657e80eeef4da688fce1e278") // Updated endpoint to fetch average rate
      .expect(200);

    expect(avgRateRes.body.avgRate).toEqual(4);
  });

  it("should delete the rating for userId '657e7d6def4da688fce1e247' and check if avgRate is now 5", async () => {
    await request(app)
      .delete("/rate/delete/657e7d6def4da688fce1e247")
      .expect(200);

    // Fetch the average rate for the map to check the new average rate
    const avgRateRes = await request(app)
      .get("/rate/657e80eeef4da688fce1e278") // Updated endpoint to fetch average rate
      .expect(200);

    expect(avgRateRes.body.avgRate).toEqual(5);
  });
});
