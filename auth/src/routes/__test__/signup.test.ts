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
    .send({ email: "testEmail", password: "somePassword" })
    .expect(400);
});
