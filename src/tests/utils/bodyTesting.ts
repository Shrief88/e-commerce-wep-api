import type supertest from "supertest";
import { ObjectId } from "mongodb";

export const testCreateDocument = (
  request: supertest.SuperTest<supertest.Test>,
  testTitle: string,
  endPoint: string,
  sendBody?: Record<string, unknown>,
): void => {
  it(`should return 400 for ${testTitle}`, async () => {
    const response = await request
      .post(`/api/${endPoint}`)
      .send(sendBody ?? {});
    expect(response.status).toBe(400);
  });
};

export const testUpdateDocument = (
  request: supertest.SuperTest<supertest.Test>,
  testTitle: string,
  endPoint: string,
  sendBody?: Record<string, unknown>,
): void => {
  const validId = new ObjectId() as unknown as string;
  it(`should return 400 for ${testTitle}`, async () => {
    const response = await request
      .put(`/api/${endPoint}/${validId}`)
      .send(sendBody ?? {});
    console.log(response.status);
    expect(response.status).toBe(400);
  });
};
