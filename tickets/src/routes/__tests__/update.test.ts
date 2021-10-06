import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

// apply some integration tests
it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "some title",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "some title",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own a ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "some title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "new title",
      price: 25,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookieOfSameUser = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookieOfSameUser)
    .send({ title: "some title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookieOfSameUser)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookieOfSameUser)
    .send({
      title: "some title",
      price: -10,
    })
    .expect(400);
});

it("it updates the ticket", () => {
  const cookieOfSameUser = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookieOfSameUser)
    .send({ title: "some title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookieOfSameUser)
    .send({
      title: "new title",
      price: 25,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(25);
});
