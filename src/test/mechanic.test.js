import request from "supertest"
import prismaClient from "../application/database"
import { web } from "../application/web"
import { logger } from "../application/logging"
import { mechanicRegister, userRegister, createManyMechanic, getMechanic } from "./test-util"
import { depth } from "../application/depht"



describe("POST /api/mechanics", () => {
    beforeEach(async () => {
        await userRegister()
    })
    afterEach(async () => {
        await prismaClient.mechanic.deleteMany()
        await prismaClient.user.deleteMany()
    })

    it("should success create mechanic", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).post("/api/mechanics")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test"
            })

        expect(response.status).toBe(201)
        expect(response.body.data).toBeDefined()
    })

    it("should reject with invalid phone", async (params) => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).post("/api/mechanics")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test",
                phone: "jefwfwng",
                address: "fefjiejfe"
            })

        expect(response.status).toBe(400)
        expect(response.body.error).toBeDefined()
    })
})

describe("POST /api/mechanics/mechanicId/photo", () => {
    
    beforeEach(async () => {
        await userRegister()
    })
    afterEach(async () => {
        await prismaClient.mechanic.deleteMany()
        await prismaClient.user.deleteMany()
    })

    it("should can be success add photo profile", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const mechanic = await mechanicRegister()

        const response = await request(web).post(`/api/mechanics/${mechanic.id}/photo`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "multipart/form-data")
            .attach("photo", __dirname + "/filetest/ayampenyet.jpeg")

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.photo).toBeDefined()
    })

    it("should reject if mechanic not found", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).post(`/api/mechanics/12345/photo`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "multipart/form-data")
            .attach("photo", __dirname + "/filetest/ayampenyet.jpeg")

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject if file is not image", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const mechanic = await mechanicRegister()

        const response = await request(web).post(`/api/mechanics/${mechanic.id}/photo`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "multipart/form-data")
            .attach("photo", __dirname + "/filetest/text.txt")

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
    
    it("should reject if user is not authorization", async () => {
        const mechanic = await mechanicRegister()

        const response = await request(web).post(`/api/mechanics/${mechanic.id}/photo`)
            .set("Content-Type", "multipart/form-data")
            .attach("photo", __dirname + "/filetest/ayampenyet.jpeg")

        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()
    })
})

describe("GET /api/mechanics", () => {

    afterEach(async () => {
        await prismaClient.mechanic.deleteMany()
    })

    it("should success search mechanics", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        await createManyMechanic()

        const response = await request(web).get("/api/mechanics")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .query({
                name: "test",
            })

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.paging.total_item).toBe(12)
    })

    it("should success with paging", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        await createManyMechanic()

        const response = await request(web).get("/api/mechanics")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .query({
                name: "test",
                page: 2,
                size: 10
            })

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.length).toBe(2)
        expect(response.body.paging.total_item).toBe(12)
        expect(response.body.paging.total_page).toBe(2)
    })

    it("should reject if value page invalid", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        await createManyMechanic()

        const response = await request(web).get("/api/mechanics")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .query({
                name: "test",
                page: "test",
                size: 10
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe("PUT /api/mechanics/mechanicId", () => {

    beforeEach(async () => {
        await createManyMechanic()
    })
    
    afterEach(async () => {
        await prismaClient.mechanic.deleteMany()
    })

    it("should success update mechanic", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const mechanic = await getMechanic()

        const response = await request(web).put(`/api/mechanics/${mechanic.id}`)
        .set("Authorization", "Bearer " + loginResponse.body.data.token)
        .set("Content-Type", "application/json")
        .send({ 
            name: "test nol",
            phone: "0895600436140",
            address: "Jalan nol"
        })

        depth(response.body.errors)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test nol")
        expect(response.body.data.phone).toBe("0895600436140")
        expect(response.body.data.address).toBe("Jalan nol")
    })

    it("should reject if mechanic not founds", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        depth(loginResponse.body)

        const response = await request(web).put(`/api/mechanics/12345`)
        .set("Authorization", "Bearer " + loginResponse.body.data.token)
        .set("Content-Type", "application/json")
        .send({ 
            name: "test nol",
            phone: "0895600436140",
            address: "Jalan nol"
        })

        depth(response.body.errors)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})


