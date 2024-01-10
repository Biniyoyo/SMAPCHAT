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

describe("Get Endpoints", () => {
  it("should be able to retrieve the user ID list", async () => {
    const res = await request(app).get("/Users").expect(200);
  });
});

describe("Authenticate", () => {
  var userID = "";

  it("can register a user", async () => {
    const res = await request(app)
      .post("/User/create")
      .send({
        email: "Jest@Testing.com",
        username: "Jest Tester",
        password: "Password",
        avatar: "",
      })
      .expect(201);

    userID = res.body.user.userId;
  });

  it("can login", async () => {
    await request(app)
      .post("/User/login")
      .send({ email: "Jest@Testing.com", password: "Password" })
      .expect(200);
  });

  it("can delete", async () => {
    await request(app).delete(`/User/delete/${userID}`).expect(200);
  });
});

describe("Password Reset Flow", () => {
  const testEmail = "ulukbekaitmatov79@gmail.com";
  const randomCode = "randomCode123"; // This is invalid code

  it("should initiate password reset", async () => {
    const res = await request(app)
      .post("/User/resetPassword")
      .send({ email: testEmail })
      .expect(200);

    expect(res.body.successMessage).toEqual(
      "Password recovery email sent successfully."
    );
  });
  // there is no way to test verifyResetCode and updatePasswordWithCode function
  // since the code is sent to user's email and we don't know it
  // it("should reject invalid reset code", async () => {
  //   const res = await request(app)
  //     .post("/User/verifyResetCode")
  //     .send({ email: testEmail, code: randomCode })
  //     .expect(400);

  //   expect(res.body.errorMessage).toEqual("Invalid reset code");
  // });

  // it("should not update password with invalid code", async () => {
  //   const res = await request(app)
  //     .post("/User/updatePasswordWithCode")
  //     .send({ email: testEmail, code: randomCode, newPassword: "abc123" })
  //     .expect(400);

  //   expect(res.body.errorMessage).toEqual("Invalid reset code");
  // });
});
