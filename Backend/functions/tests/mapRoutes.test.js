const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app.js");
const startDB = require("../database/database.js");

beforeAll(() => {
  return startDB();
}, 20000);

afterAll((done) => {
  done();
});

describe("Get public maps", () => {
  it("should be able to retrieve the public map list", async () => {
    const res = await request(app)
      .get("/map/public?sort=date&page=1&limit=2")
      .expect(200);

    expect(res.type).toEqual("application/json");
  });
});

describe("Get searched maps", () => {
  it("should be able to search the public map list", async () => {
    const res = await request(app)
      .get("/map/public/search?query=map&sort=date&page=1&limit=2")
      .expect(200);

    expect(res.type).toEqual("application/json");
    expect(res.body[0].title.includes("map"));
  });
});

describe("Publish map", () => {
  it("should be able to publish then delete a map", async () => {

    const agent = request.agent(app);

    const authRes = await agent
      .post("/User/login")
      .send({email: "John@Lemon.com", password: "Password"})
      .expect(200);

    const header = authRes.headers['set-cookie'][0];
    const match = header.match(/authentication=([^;]+)/);
    const authenticationCookie = match ? match[1] : null;

    const pubRes = await agent
      .post("/map/create")
      .set('Cookie', [`authentication=${authenticationCookie}`])
      .send({
        mapData:{
          _id: 0,
          mapType: "ArrowMap",
          title: "Test map",
          description: "Automated test map",
          avgRate: 0,
          comment: [],
          mapFile: "",
          date: "2023-11-23T00:53:16.000+00:00",
          public: 0
        }, 
        graphicData:{
            "MapID": "1234TEST1234",
            "Maxpin": 5,
            "Location": [
              {
                "Name": "Gershwin Theater",
                "Longitude": -73.9852,
                "Lattitude": 40.7624,
                "Order": 1,
                "Date": "11-10-2023"
              },
              {
                "Name": "Time Square",
                "Longitude": -73.9853,
                "Lattitude": 40.7581,
                "Order": 2,
                "Date": "11-11-2023"
              },
              {
                "Name": "MoMA",
                "Longitude": -73.9776,
                "Lattitude": 40.7615,
                "Order": 3,
                "Date": "11-11-2023"
              }
            ]        
        }
    })
    .expect(200);

    const id = pubRes.body.graphicData.MapID;
    console.log(id);

    await agent
      .delete(`/map/delete/${id}`)
      .set('Cookie', [`authentication=${authenticationCookie}`])
      .expect(200);
  })
});
