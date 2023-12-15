import app from "../app";
import supertest from "supertest";
import * as db from "./config/db";
import { testCreateDocument, testUpdateDocument } from "./utils/bodyTesting";
import { testInvalidID, testExistingID } from "./utils/idTesting";

const request = supertest(app);

const insertData = async (): Promise<string> => {
  const response = await request.post("/api/brand").send({
    name: "test",
  });
  return response.body.data._id;
};

fdescribe("Test brand", () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe("GET/api/brand/:id", () => {
    let validID: string;
    beforeAll(async () => {
      validID = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "get", "brand");
    testExistingID(request, "get", "brand");

    it("should return 200 for valid ID", async () => {
      const response = await request.get(`/api/brand/${validID}`);
      expect(response.status).toBe(200);
    });
  });

  describe("POST/api/brand", () => {
    beforeAll(async () => {
      await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testCreateDocument(request, "missing name", "brand", { name: "" });
    testCreateDocument(request, "number as name", "brand", { name: 123 });
    testCreateDocument(request, "white space string", "brand", {
      name: "     ",
    });
    testCreateDocument(request, "name less than 2 characters", "brand", {
      name: "h",
    });
    testCreateDocument(request, "name more than 32 characters", "brand", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });

    it("should return 201 for valid name", async () => {
      const response = await request.post("/api/brand").send({ name: "test2" });
      expect(response.status).toBe(201);
    });

    it("should return 409 for duplicate name", async () => {
      const response = await request.post("/api/brand").send({ name: "test" });
      expect(response.status).toBe(409);
      expect(response.body.message).toBe("brand already exists");
    });
  });

  describe("PUT/api/brand/:id", () => {
    let validID: string;
    beforeAll(async () => {
      validID = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "put", "brand");
    testExistingID(request, "put", "brand");
    testUpdateDocument(request, "number as name", "brand", { name: 123 });
    testUpdateDocument(request, "white space string", "brand", {
      name: "     ",
    });
    testUpdateDocument(request, "name less than 2 characters", "brand", {
      name: "h",
    });
    testUpdateDocument(request, "name more than 32 characters", "brand", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });

    it("should return 200 with valid ID even if name is not provided", async () => {
      const response = await request.put(`/api/brand/${validID}`);
      expect(response.status).toBe(200);
    });

    it("should return 200 with valid ID and name", async () => {
      const response = await request
        .put(`/api/brand/${validID}`)
        .send({ name: "test2" });
      expect(response.status).toBe(200);
    });
  });

  describe("DELETE/api/brand/:id", () => {
    let validID: string;
    beforeAll(async () => {
      validID = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "delete", "brand");
    testExistingID(request, "delete", "brand");

    it("should return 204 for valid ID", async () => {
      const response = await request.delete(`/api/brand/${validID}`);
      expect(response.status).toBe(204);
    });
  });
});
