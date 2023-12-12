import app from "../app";
import supertest from "supertest";
import * as db from "./db";
import { ObjectId } from "mongodb";

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

describe("Test subcategory", () => {
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

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.get(`/api/subcategory/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    it("should return 404 for non-existing ID", async () => {
      const objectId = new ObjectId();
      const response = await request.get(
        `/api/subcategory/${objectId._id as unknown as string}`,
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("subcategory not found");
    });

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

    it("should return 400 for missing name", async () => {
      const response = await request.post("/api/subcategory");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("name is required");
    });

    it("should return 400 for number as name", async () => {
      const response = await request
        .post("/api/subcategory")
        .send({ name: 123 });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("name must be a string");
    });

    it("should return 400 for white space string", async () => {
      const response = await request
        .post("/api/subcategory")
        .send({ name: "      " });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "name must be at least 3 characters long",
      );
    });

    it("should return 400 if name less than 3 characters", async () => {
      const response = await request
        .post("/api/subcategory")
        .send({ name: "hd" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "name must be at least 3 characters long",
      );
    });

    it("should return 400 if name more than 32 characters", async () => {
      const response = await request.post("/api/subcategory").send({
        name: "loremipsum fdf df sgg dg fhfh fhfh",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "name must be at most 32 characters long",
      );
    });

    it("should return 400 if category is missing", async () => {
      const response = await request.post("/api/subcategory").send({
        name: "test",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("category is required");
    });

    it("should return 400 if category is invalid", async () => {
      const response = await request
        .post("/api/subcategory")
        .send({ name: "test", category: "invalidID" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid category ID");
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

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.put(`/api/subcategory/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    it("should return 400 for number as name", async () => {
      const response = await request
        .put(`/api/subcategory/${subcategoryID}`)
        .send({ name: 123 });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("name must be a string");
    });

    it("should return 400 for white space string", async () => {
      const response = await request
        .put(`/api/subcategory/${subcategoryID}`)
        .send({ name: "      " });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "name must be at least 3 characters long",
      );
    });

    it("should return 400 if name less than 3 characters", async () => {
      const response = await request
        .put(`/api/subcategory/${subcategoryID}`)
        .send({ name: "hd" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "name must be at least 3 characters long",
      );
    });

    it("should return 400 if name more than 32 characters", async () => {
      const response = await request
        .put(`/api/subcategory/${subcategoryID}`)
        .send({
          name: "loremipsum fdf df sgg dg fhfh fhfh",
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "name must be at most 32 characters long",
      );
    });

    it("should return 400 if category is invalid", async () => {
      const response = await request
        .put(`/api/subcategory/${subcategoryID}`)
        .send({ name: "test", category: "invalidID" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid category ID");
    });

    it("should return 404 for non-existing subcategory", async () => {
      const objectId = new ObjectId();
      const response = await request
        .put(`/api/subcategory/${objectId._id as unknown as string}`)
        .send({ name: "test", category: categoryID });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("subcategory not found");
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

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.delete(`/api/subcategory/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    it("should return 404 for non-existing ID", async () => {
      const objectId = new ObjectId();
      const response = await request.delete(
        `/api/subcategory/${objectId._id as unknown as string}`,
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("subcategory not found");
    });

    it("should return 204 for valid ID", async () => {
      const response = await request.delete(
        `/api/subcategory/${subcategoryID}`,
      );
      expect(response.status).toBe(204);
    });
  });
});
