import request from "supertest";
import { app } from "../../app";

/* Test the signup route with a post request to /api/users/signup */
it("returns a 201 on succesful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "newTest@mail.com", password: "password" })
    .expect(201);
});
