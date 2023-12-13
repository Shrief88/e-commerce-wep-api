import app from "../app";
import supertest from "supertest";
import * as db from "./config/db";
import { ObjectId } from "mongodb";
import { testCreateDocument, testUpdateDocument } from "./utils/bodyTesting";
import { testInvalidID, testExistingID } from "./utils/idTesting";

const request = supertest(app);

const insertData = async (): Promise<string[]> => {
  const categoryResponse = await request.post("/api/category").send({
    name: "category",
  });
  const subcategoryResponse = await request.post("/api/subcategory").send({
    name: "test",
    category: categoryResponse.body.data._id,
  });
  return [subcategoryResponse.body.data._id, categoryResponse.body.data._id];
};

fdescribe("Test subcategory", () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe("GET/api/subcategory/:id", () => {
    let subcategoryID: string;
    beforeAll(async () => {
      [subcategoryID] = await insertData();
    });

    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "get", "subcategory");
    testExistingID(request, "get", "subcategory");

    it("should return 200 for valid ID", async () => {
      const response = await request.get(`/api/subcategory/${subcategoryID}`);
      expect(response.status).toBe(200);
    });
  });

  describe("POST/api/subcategory", () => {
    let categoryID: string;
    beforeAll(async () => {
      [, categoryID] = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testCreateDocument(request, "missing name", "subcategory", { name: "" });
    testCreateDocument(request, "number as name", "subcategory", { name: "" });
    testCreateDocument(request, "white space string", "subcategory", {
      name: "   ",
    });
    testCreateDocument(request, "name less than 3 characters", "subcategory", {
      name: "hd",
    });

    testCreateDocument(request, "name more than 32 characters", "subcategory", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });

    testCreateDocument(request, "category is missing", "subcategory", {
      name: "test",
    });

    testCreateDocument(request, "category is invalid", "subcategory", {
      name: "test",
      category: "invalidID",
    });

    it("should return 201 for valid name", async () => {
      const response = await request
        .post("/api/subcategory")
        .send({ name: "test2", category: categoryID });
      expect(response.status).toBe(201);
    });

    it("should return 409 for duplicate name", async () => {
      const response = await request
        .post("/api/subcategory")
        .send({ name: "test", category: categoryID });
      expect(response.status).toBe(409);
      expect(response.body.message).toBe("subcategory already exists");
    });
  });

  describe("PUT/api/subcategory/:id", () => {
    let subcategoryID: string;
    let categoryID: string;
    beforeAll(async () => {
      [subcategoryID, categoryID] = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "put", "subcategory");
    testExistingID(request, "put", "subcategory");
    testUpdateDocument(request, "number as name", "subcategory", { name: "" });
    testUpdateDocument(request, "white space string", "subcategory", {
      name: "   ",
    });
    testUpdateDocument(request, "name less than 3 characters", "subcategory", {
      name: "hd",
    });

    testUpdateDocument(request, "name more than 32 characters", "subcategory", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });

    testUpdateDocument(request, "category is invalid", "subcategory", {
      name: "test",
      category: "invalidID",
    });

    it("should return 404 for non-existing category", async () => {
      const objectId = new ObjectId();
      const response = await request
        .put(`/api/subcategory/${subcategoryID}`)
        .send({
          name: "test",
          category: objectId._id as unknown as string,
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("category not found");
    });

    it("should return 200 with valid ID even if body is not provided", async () => {
      const response = await request.put(`/api/subcategory/${subcategoryID}`);
      expect(response.status).toBe(200);
    });

    it("should return 200 with valid ID and name", async () => {
      const response = await request
        .put(`/api/subcategory/${subcategoryID}`)
        .send({ name: "test", category: categoryID });
      expect(response.status).toBe(200);
    });
  });

  describe("DELETE/api/subcategory/:id", () => {
    let subcategoryID: string;
    beforeAll(async () => {
      [subcategoryID] = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testInvalidID(request, "delete", "subcategory");
    testExistingID(request, "delete", "subcategory");

    it("should return 204 for valid ID", async () => {
      const response = await request.delete(
        `/api/subcategory/${subcategoryID}`,
      );
      expect(response.status).toBe(204);
    });
  });
});
