import type supertest from "supertest";
import { ObjectId } from "mongodb";

export const testInvalidID = (
  request: supertest.SuperTest<supertest.Test>,
  method: string,
  endPoint: string,
): void => {
  it("should return 400 for invalid id", async () => {
    const invalidID = "invalidID";
    const response = await (request as any)[method](
      `/api/${endPoint}/${invalidID}`,
    );
    expect(response.status).toBe(400);
  });
};

export const testExistingID = (
  request: supertest.SuperTest<supertest.Test>,
  method: string,
  endPoint: string,
): void => {
  it("should return 404 for not existing id", async () => {
    const validId = new ObjectId() as unknown as string;
    const response = await (request as any)[method](
      `/api/${endPoint}/${validId}`,
    );
    console.log(response.status);
    expect(response.status).toBe(404);
  });
};
