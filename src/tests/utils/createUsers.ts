import type supertest from "supertest";

const createUsers = async (
  request: supertest.SuperTest<supertest.Test>,
): Promise<string[]> => {
  const admin = await request.post("/api/v1/user").send({
    name: "admin",
    email: "shriefessam1999@gmail.com",
    role: "admin",
    password: 123456,
    passwordConfirm: 123456,
  });
  const manager = await request.post("/api/v1/user").send({
    name: "manager",
    email: "shriefessam1998@gmail.com",
    role: "manager",
    password: 123456,
    passwordConfirm: 123456,
  });

  const user = await request.post("/api/v1/user").send({
    name: "user",
    email: "shriefessam1997@gmail.com",
    role: "user",
    password: 123456,
    passwordConfirm: 123456,
  });
  return [admin.body.token, manager.body.token, user.body.token];
};

export default createUsers;
