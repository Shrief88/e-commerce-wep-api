import app from "../app";
import supertest from "supertest";
import * as db from "./db";
import { ObjectId } from "mongodb";

const request = supertest(app);

const insertData = async (): Promise<string> => {
  const response = await request.post("/api/brand").send({
    name: "test",
  });
  return response.body.data._id;
};

const testCreateBrand = (
  request: supertest.SuperTest<supertest.Test>,
  testTitle: string,
  sendBody?: Record<string, unknown>,
): void => {
  it(testTitle, async () => {
    const response = await request.post("/api/brand").send(sendBody ?? {});
    expect(response.status).toBe(400);
  });
};

const testUpdateBrand = (
  request: supertest.SuperTest<supertest.Test>,
  testTitle: string,
  sendBody?: Record<string, unknown>,
): void => {
  const validId = new ObjectId() as unknown as string;
  it(testTitle, async () => {
    const response = await request
      .put(`/api/brand/${validId}`)
      .send(sendBody ?? {});
    console.log(response.status);
    expect(response.status).toBe(400);
  });
};

describe("Test brand", () => {
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

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.get(`/api/brand/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    it("should return 404 for non-existing ID", async () => {
      const objectId = new ObjectId();
      const response = await request.get(
        `/api/brand/${objectId._id as unknown as string}`,
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("brand not found");
    });

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

    testCreateBrand(request, "should return 400 for missing name", {
      name: "",
    });

    testCreateBrand(request, "should return 400 for number as name", {
      name: 123,
    });

    testCreateBrand(request, "should return 400 for white space string", {
      name: "    ",
    });

    testCreateBrand(request, "should return 400 if name < 2 characters", {
      name: "h",
    });

    testCreateBrand(request, "should return 400 if name > 32 characters", {
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

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.put(`/api/brand/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    testUpdateBrand(request, "should return 400 for number as name", {
      name: 123,
    });

    testUpdateBrand(request, "should return 400 for white space string", {
      name: "    ",
    });

    testUpdateBrand(request, "should return 400 if name < 3 characters", {
      name: "h",
    });

    testUpdateBrand(request, "should return 400 if name > 32 characters", {
      name: "loremipsum fdf df sgg dg fhfh fhfh",
    });

    it("should return 404 for non-existing ID", async () => {
      const objectId = new ObjectId();
      const response = await request.put(
        `/api/brand/${objectId._id as unknown as string}`,
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("brand not found");
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

    it("should return 400 for invalid ID", async () => {
      const invalidID = "invalidID";
      const response = await request.delete(`/api/brand/${invalidID}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid ID");
    });

    it("should return 404 for non-existing ID", async () => {
      const objectId = new ObjectId();
      const response = await request.delete(
        `/api/brand/${objectId._id as unknown as string}`,
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("brand not found");
    });

    it("should return 204 for valid ID", async () => {
      const response = await request.delete(`/api/brand/${validID}`);
      expect(response.status).toBe(204);
    });
  });
});
