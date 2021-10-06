import request from "supertest";
import { app } from "../../app";

/* Creating automating testing for our APIs*/

/* Test the signup route with a post request to /api/users/signup */
it("returns a 201 on succesful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "newTest@mail.com", password: "password" })
    .expect(201);
});

/* Test for invalid inputs to sign up */
it("returns 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "testEmail", password: "somePassword" })
    .expect(400);
});

it("returns 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "testEmail@mail.com", password: "1" })
    .expect(400);
});

it("returns 400 with an invalid  ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "testEmail@mail.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "password123_" })
    .expect(400);
});

/* disallow duplicate emails */
it("disallow duplicate emails", () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password123_" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password123_" })
    .expect(400);
});

/*  Make sure our headers contain a cookie session */
it("sets a cookie after successful signup ", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password123_" })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
