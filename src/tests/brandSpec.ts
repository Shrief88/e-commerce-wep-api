import supertest from "supertest";

import app from "../app";
import * as db from "./config/db";
import { testInvalidID, testExistingID } from "./utils/idTesting";
import createUsers from "./utils/createUsers";

const request = supertest(app);

const insertData = async (adminToken: string): Promise<string> => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  const response = await request
    .post("/api/v1/brand")
    .field("name", "testBrand")
    .attach("image", "src/tests/testImage.jpg")
    .set({
      Authorization: `Bearer ${adminToken}`,
    });
  return response.body.data._id;
};

fdescribe("Test brand", () => {
  let adminToken = "";
  let managerToken = "";
  let userToken = "";
  beforeAll(async () => {
    await db.connect();
    [adminToken, managerToken, userToken] = await createUsers(request);
  });

  afterAll(async () => {
    await db.clearDatabase();
    await db.closeDatabase();
  });

  describe("GET/api/v1/brand/:id", () => {
    let validID: string;
    beforeAll(async () => {
      validID = await insertData(adminToken);
    });
    afterAll(async () => {
      await db.clearDatabaseExpectUsers();
    });

    testInvalidID(request, "get", "brand");
    testExistingID(request, "get", "brand");

    it("should return 200 for valid ID", async () => {
      const response = await request.get(`/api/v1/brand/${validID}`);
      expect(response.status).toBe(200);
    });
  });

  describe("POST/api/v1/brand", () => {
    beforeAll(async () => {
      await insertData(adminToken);
    });
    afterAll(async () => {
      await db.clearDatabaseExpectUsers();
    });

    it("should return 401 for unauthorized user", async () => {
      const response = await request
        .post("/api/v1/brand")
        .field("name", "testBrand2")
        .attach("image", "src/tests/testImage.jpg");
      expect(response.status).toBe(401);
    });

    it("should return 403 for user", async () => {
      const response = await request
        .post("/api/v1/brand")
        .field("name", "testBrand2")
        .set({
          Authorization: `Bearer ${userToken}`,
        });
      expect(response.status).toBe(403);
    });

    it("should return 400 for missing name", async () => {
      const response = await request
        .post("/api/v1/brand")
        .attach("image", "src/tests/testImage.jpg")
        .set({
          Authorization: `Bearer ${adminToken}`,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for missing image", async () => {
      const response = await request
        .post("/api/v1/brand")
        .field("name", "testBrand2")
        .set({
          Authorization: `Bearer ${adminToken}`,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for empty name", async () => {
      const response = await request
        .post("/api/v1/brand")
        .attach("image", "src/tests/testImage.jpg")
        .field("name", "    ")
        .set({
          Authorization: `Bearer ${adminToken}`,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for name less than 3 characters", async () => {
      const response = await request
        .post("/api/v1/brand")
        .attach("image", "src/tests/testImage.jpg")
        .field("name", "h")
        .set({
          Authorization: `Bearer ${adminToken}`,
        });
      expect(response.status).toBe(400);
    });

    it("should return 400 for name more than 32 characters", async () => {
      const response = await request
        .post("/api/v1/brand")
        .attach("image", "src/tests/testImage.jpg")
        .field("name", "loremipsum fdf df sgg dg fhfh fhfh")
        .set({
          Authorization: `Bearer ${adminToken}`,
        });
      expect(response.status).toBe(400);
    });

    it("should return 409 for existing name", async () => {
      const response = await request
        .post("/api/v1/brand")
        .attach("image", "src/tests/testImage.jpg")
        .field("name", "testBrand")
        .set({
          Authorization: `Bearer ${adminToken}`,
        });
      expect(response.status).toBe(409);
    });

    it("should return 201 for name valid input with admin token", async () => {
      const response = await request
        .post("/api/v1/brand")
        .attach("image", "src/tests/testImage.jpg")
        .field("name", "testBrand2")
        .set({
          Authorization: `Bearer ${adminToken}`,
        });
      expect(response.status).toBe(201);
    });

    it("should return 201 for name valid input with manager token", async () => {
      const response = await request
        .post("/api/v1/brand")
        .attach("image", "src/tests/testImage.jpg")
        .field("name", "testBrand")
        .set({
          Authorization: `Bearer ${managerToken}`,
        });
      expect(response.status).toBe(201);
    });
  });

  // describe("PUT/api/brand/:id", () => {
  //   let validID: string;
  //   beforeAll(async () => {
  //     validID = await insertData();
  //   });
  //   afterAll(async () => {
  //     await db.clearDatabase();
  //   });

  //   testInvalidID(request, "put", "brand");
  //   testExistingID(request, "put", "brand");
  //   testUpdateDocument(request, "number as name", "brand", { name: 123 });
  //   testUpdateDocument(request, "white space string", "brand", {
  //     name: "     ",
  //   });
  //   testUpdateDocument(request, "name less than 2 characters", "brand", {
  //     name: "h",
  //   });
  //   testUpdateDocument(request, "name more than 32 characters", "brand", {
  //     name: "loremipsum fdf df sgg dg fhfh fhfh",
  //   });

  //   it("should return 200 with valid ID even if name is not provided", async () => {
  //     const response = await request.put(`/api/brand/${validID}`);
  //     expect(response.status).toBe(200);
  //   });

  //   it("should return 200 with valid ID and name", async () => {
  //     const response = await request
  //       .put(`/api/brand/${validID}`)
  //       .send({ name: "test2" });
  //     expect(response.status).toBe(200);
  //   });
  // });

  // describe("DELETE/api/brand/:id", () => {
  //   let validID: string;
  //   beforeAll(async () => {
  //     validID = await insertData();
  //   });
  //   afterAll(async () => {
  //     await db.clearDatabase();
  //   });

  //   testInvalidID(request, "delete", "brand");
  //   testExistingID(request, "delete", "brand");

  //   it("should return 204 for valid ID", async () => {
  //     const response = await request.delete(`/api/brand/${validID}`);
  //     expect(response.status).toBe(204);
  //   });
  // });
});
