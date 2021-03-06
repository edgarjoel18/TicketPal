import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/ticket";

jest.mock('../../__mocks__/nats-wrapper.ts');

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("it can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").set('Cookie', global.signin())send({});

  expect(response.status).not.toEqual(401);
});

it("has a route handler listening to /api/tickets for put requests", async () => {});

it("returns an error if an invalid title is provided", async () => {});

it("it returns an error if an invalid price is provided", async () => {});

it("it creates a ticket with valid inputs", async () => {
  // check to see if the ticket was save to our db
  // find() lets us query all the existing ticket collections inside the ticket database
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const title = "some title";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 20 })
    .expect(201);

  tickets = new Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});
