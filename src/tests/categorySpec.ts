import app from "../app";
import supertest from "supertest";
import * as db from "./db";
import { ObjectId } from "mongodb";

const request = supertest(app);

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe("GET/api/category/:id", () => {
  let validID: string;
  beforeAll(async () => {
    const response = await request.post("/api/category").send({
      name: "test",
    });
    validID = response.body.data._id;
  });

  afterAll(async () => {
    await db.clearDatabase();
  });

  it("should return 400 for invalid ID", async () => {
    const invalidID = "invalidID";
    const response = await request.get(`/api/category/${invalidID}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID");
  });

  it("should return 404 for non-existing ID", async () => {
    const objectId = new ObjectId();
    const response = await request.get(
      `/api/category/${objectId._id as unknown as string}`,
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("category not found");
  });

  it("should return 200 for valid ID", async () => {
    const response = await request.get(`/api/category/${validID}`);
    expect(response.status).toBe(200);
  });
});

describe("POST/api/category", () => {
  afterAll(async () => {
    await db.clearDatabase();
  });

  it("should return 400 for missing name", async () => {
    const response = await request.post("/api/category");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("name is required");
  });

  it("should return 400 for number as name", async () => {
    const response = await request.post("/api/category").send({ name: 123 });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("name must be a string");
  });

  it("should return 400 for white space string", async () => {
    const response = await request
      .post("/api/category")
      .send({ name: "      " });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be at least 3 characters long",
    );
  });

  it("should return 400 if name less than 3 characters", async () => {
    const response = await request.post("/api/category").send({ name: "hd" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be at least 3 characters long",
    );
  });

  it("should return 400 if name more than 32 characters", async () => {
    const response = await request.post("/api/category").send({
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be at most 32 characters long",
    );
  });

  it("should return 201 for valid name", async () => {
    const response = await request.post("/api/category").send({ name: "test" });
    expect(response.status).toBe(201);
  });
});

describe("PUT/api/category/:id", () => {
  let validID: string;
  beforeAll(async () => {
    const response = await request.post("/api/category").send({
      name: "test",
    });
    validID = response.body.data._id;
  });

  afterAll(async () => {
    await db.clearDatabase();
  });

  it("should return 400 for invalid ID", async () => {
    const invalidID = "invalidID";
    const response = await request.put(`/api/category/${invalidID}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID");
  });

  it("should return 400 for number as name", async () => {
    const response = await request
      .put(`/api/category/${validID}`)
      .send({ name: 123 });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("name must be a string");
  });

  it("should return 400 for white space string", async () => {
    const response = await request
      .put(`/api/category/${validID}`)
      .send({ name: "      " });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be at least 3 characters long",
    );
  });

  it("should return 400 if name less than 3 characters", async () => {
    const response = await request
      .put(`/api/category/${validID}`)
      .send({ name: "hd" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be at least 3 characters long",
    );
  });

  it("should return 400 if name more than 32 characters", async () => {
    const response = await request.put(`/api/category/${validID}`).send({
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be at most 32 characters long",
    );
  });

  it("should return 404 for non-existing ID", async () => {
    const objectId = new ObjectId();
    const response = await request.put(
      `/api/category/${objectId._id as unknown as string}`,
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("category not found");
  });

  it("should return 200 with valid ID even if name is not provided", async () => {
    const response = await request.put(`/api/category/${validID}`);
    expect(response.status).toBe(200);
  });

  it("should return 200 with valid ID and name", async () => {
    const response = await request
      .put(`/api/category/${validID}`)
      .send({ name: "test2" });
    expect(response.status).toBe(200);
  });
});

describe("DELETE/api/category/:id", () => {
  let validID: string;
  beforeAll(async () => {
    const response = await request.post("/api/category").send({
      name: "test",
    });
    validID = response.body.data._id;
  });

  afterAll(async () => {
    await db.clearDatabase();
  });

  it("should return 400 for invalid ID", async () => {
    const invalidID = "invalidID";
    const response = await request.delete(`/api/category/${invalidID}`);
    expect(response.status).toBe(400);
  });

  it("should return 404 for non-existing ID", async () => {
    const objectId = new ObjectId();
    const response = await request.get(
      `/api/category/${objectId._id as unknown as string}`,
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("category not found");
  });

  it("should return 204 for valid ID", async () => {
    const response = await request.delete(`/api/category/${validID}`);
    expect(response.status).toBe(204);
  });
});
