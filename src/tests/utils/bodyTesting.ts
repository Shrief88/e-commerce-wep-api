import type supertest from "supertest";
import { ObjectId } from "mongodb";

export const testCreateDocument = (
  request: supertest.SuperTest<supertest.Test>,
  token: string,
  testTitle: string,
  endPoint: string,
  field: string,
  value: string,
): void => {
  it(`should return 400 for ${testTitle}`, async () => {
    console.log(token);
    const response = await request
      .post(`/api/v1/${endPoint}`)
      .field(field, value)
      .attach("image", "src/tests/testImage.jpg")
      .set({
        Authorization: `Bearer ${token}`,
      });
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
      .put(`/api/v1/${endPoint}/${validId}`)
      .send(sendBody ?? {});
    expect(response.status).toBe(400);
  });
};
