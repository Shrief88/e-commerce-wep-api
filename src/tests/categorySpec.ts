import app from "../app";
import supertest from "supertest";
import * as db from "./config/db";
import { testCreateDocument, testUpdateDocument } from "./utils/bodyTesting";
import { testInvalidID, testExistingID } from "./utils/idTesting";

const request = supertest(app);

const insertData = async (): Promise<string> => {
  const response = await request.post("/api/category").send({
    name: "test",
  });
  return response.body.data._id;
};

fdescribe("Test category", () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe("GET/api/category/:id", () => {
    let validID: string;
    beforeAll(async () => {
      validID = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "get", "category");
    testExistingID(request, "get", "category");

    it("should return 200 for valid ID", async () => {
      const response = await request.get(`/api/category/${validID}`);
      expect(response.status).toBe(200);
    });
  });

  describe("POST/api/category", () => {
    beforeAll(async () => {
      await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testCreateDocument(request, "missing name", "category", { name: "" });
    testCreateDocument(request, "number as name", "category", { name: 123 });
    testCreateDocument(request, "white space string", "category", {
      name: "     ",
    });
    testCreateDocument(request, "name less than 3 characters", "category", {
      name: "hd",
    });
    testCreateDocument(request, "name more than 32 characters", "category", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });

    it("should return 201 for valid name", async () => {
      const response = await request
        .post("/api/category")
        .send({ name: "test2" });
      expect(response.status).toBe(201);
    });

    it("should return 409 for duplicate name", async () => {
      const response = await request
        .post("/api/category")
        .send({ name: "test" });
      expect(response.status).toBe(409);
      expect(response.body.message).toBe("category already exists");
    });
  });

  describe("PUT/api/category/:id", () => {
    let validID: string;
    beforeAll(async () => {
      validID = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "put", "category");
    testExistingID(request, "put", "category");
    testUpdateDocument(request, "number as name", "category", { name: 123 });
    testUpdateDocument(request, "white space string", "category", {
      name: "     ",
    });
    testUpdateDocument(request, "name less than 3 characters", "category", {
      name: "hd",
    });
    testUpdateDocument(request, "name more than 32 characters", "category", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
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
      validID = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "delete", "category");
    testExistingID(request, "delete", "category");

    it("should return 204 for valid ID", async () => {
      const response = await request.delete(`/api/category/${validID}`);
      expect(response.status).toBe(204);
    });
  });
});
