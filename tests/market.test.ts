import app from "../src/index";
import supertest from "supertest";
import httpStatus from "http-status";

const server = supertest(app);

describe("fruits suite", () => {
  it("should return fruits", async () => {
    const result = await server.get("/fruits");
    expect(result.status).toBe(httpStatus.OK);
  });

  it("should return specific fruit", async () => {
    const fruit = {
      name: "Morango",
      price: 123,
    };

    await server.post("/fruits").send(fruit);
    const result = await server.get("/fruits/1");
    expect(result.status).toBe(httpStatus.OK);
    expect(result.body).toEqual({ ...fruit, id: 1 });
  });

  it("should return 404 when params is not relatable to anything", async () => {
    const result = await server.get("/fruits/xx");
    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 422 when passed an invalid body", async () => {
    const fruit = {
      name: null,
      price: "aposdpasld",
    };

    const result = await server.post("/fruits").send(fruit);

    expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should return 201 when passed a valid body", async () => {
    const fruit = {
      name: "Goiaba",
      price: 123,
    };

    const result = await server.post("/fruits").send(fruit);

    expect(result.status).toBe(httpStatus.CREATED);
  });

  it("should return 409 when passing an existing name ", async () => {
    const fruit = {
      name: "Goiaba",
      price: 123,
    };

    const result = await server.post("/fruits").send(fruit);

    expect(result.status).toBe(httpStatus.CONFLICT);
  });
});
