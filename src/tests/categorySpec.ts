import app from "../app";
import supertest from "supertest";
import * as db from "./db";
import { ObjectId } from "mongodb";

const request = supertest(app);

const insertData = async (): Promise<string> => {
  const response = await request.post("/api/category").send({
    name: "test",
  });
  return response.body.data._id;
};

const testCreateCategory = (
  request: supertest.SuperTest<supertest.Test>,
  testTitle: string,
  sendBody?: Record<string, unknown>,
): void => {
  it(testTitle, async () => {
    const response = await request.post("/api/category").send(sendBody ?? {});
    expect(response.status).toBe(400);
  });
};

const testUpdateCategory = (
  request: supertest.SuperTest<supertest.Test>,
  testTitle: string,
  sendBody?: Record<string, unknown>,
): void => {
  const validId = new ObjectId() as unknown as string;
  it(testTitle, async () => {
    const response = await request
      .put(`/api/category/${validId}`)
      .send(sendBody ?? {});
    console.log(response.status);
    expect(response.status).toBe(400);
  });
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
    beforeAll(async () => {
      await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    testCreateCategory(request, "should return 400 for missing name", {
      name: "",
    });

    testCreateCategory(request, "should return 400 for number as name", {
      name: 123,
    });

    testCreateCategory(request, "should return 400 for white space string", {
      name: "    ",
    });

    testCreateCategory(request, "should return 400 if name < 3 characters", {
      name: "hd",
    });

    testCreateCategory(request, "should return 400 if name > 32 characters", {
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

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.put(`/api/category/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    testUpdateCategory(request, "should return 400 for number as name", {
      name: 123,
    });

    testUpdateCategory(request, "should return 400 for white space string", {
      name: "    ",
    });

    testUpdateCategory(request, "should return 400 if name < 3 characters", {
      name: "hd",
    });

    testUpdateCategory(request, "should return 400 if name > 32 characters", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
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
      validID = await insertData();
    });
    afterAll(async () => {
      await db.clearDatabase();
    });

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.delete(`/api/category/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    it("should return 404 for non-existing ID", async () => {
      const objectId = new ObjectId();
      const response = await request.delete(
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
});
