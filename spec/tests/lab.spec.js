const request = require("supertest");
const app = require("../..");
const { clearDatabase } = require("../../db.connection");

const req = request(app);

describe("lab testing:", () => {


describe("Test users routes:", () => {
    let fakeUser;
    beforeAll(() => {
        fakeUser = { name: "Mohamed", email: "medo@gmail.com", password: "Medo@12345" };
    });
    afterAll(async () => {
        await new Promise((resolve) => server.close(resolve));
        await clearDatabase();
    });

    it("req to get(/user/search) ,expect to get the correct user with his name", async () => {
        const res = await req.get("/user/search").query({ name: fakeUser.name });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.name).toBe(fakeUser.name);
    });

    it("req to get(/user/search) with invalid name ,expect res status and res message", async () => {
        const res = await req.get("/user/search").query({ name: "invalidname" });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toContain("User not found");
    });
    });


describe("Test Todos routes:", () => {
    let token;
    let todoId;
    let fakeUser;

    beforeAll(async () => {
        fakeUser = {
        name: "todouser",
        email: "todo@example.com",
        password: "password123",
        };
        await req.post("/user/signup").send(fakeUser);
        const loginRes = await req
        .post("/user/login")
        .send({ email: fakeUser.email, password: fakeUser.password });
        token = loginRes.body.data;
        const todoRes = await req
        .post("/todo")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Initial Todo" });
        todoId = todoRes.body.data._id;
    });
    afterAll(async () => {
        await new Promise((resolve) => server.close(resolve));
        await clearDatabase();
    });

    it("req to patch( /todo/) with id only ,expect res status and res message", async () => {
        const res = await req
        .patch("/todo")
        .set("Authorization", `Bearer ${token}`)
        .send({ id: todoId });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain(
        "Provide at least one field to update"
        );
    });

    it("req to patch( /todo/) with id and title ,expect res status and res to be as expected", async () => {
        const newTitle = "Updated Todo Title";
        const res = await req
        .patch("/todo")
        .set("Authorization", `Bearer ${token}`)
        .send({ id: todoId, title: newTitle });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.title).toBe(newTitle);
    });

    it("req to get( /todo/user) ,expect to get all user's todos", async () => {
        const res = await req
        .get("/todo/user")
        .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.some((todo) => todo._id === todoId)).toBe(true);
    });

    it("req to get( /todo/user) ,expect to not get any todos for user hasn't any todo", async () => {
        const newUser = {
        name: "newuser",
        email: "new@example.com",
        password: "password123",
        };
        await req.post("/user/signup").send(newUser);
        const loginRes = await req
        .post("/user/login")
        .send({ email: newUser.email, password: newUser.password });
        const newToken = loginRes.body.data;

        const res = await req
        .get("/todo/user")
        .set("Authorization", `Bearer ${newToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual([]);
    });
    });

    // afterAll(async () => {
    //     await clearDatabase()
    // })
})