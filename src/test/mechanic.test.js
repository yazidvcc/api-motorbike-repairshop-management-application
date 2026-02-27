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



