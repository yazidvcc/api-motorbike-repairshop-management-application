import request from "supertest"
import { web } from "../application/web.js"
import { register, userRegister } from "./test-util.js"
import prismaClient from "../application/database.js"
import { logger } from "../application/logging.js"

describe("POST /api/users/login", () => {

    beforeEach(async () => {
        await userRegister()
    })

    afterEach(async () => {
        await prismaClient.user.deleteMany()
    })

    it("should success login", async () => {
        const response = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()

        logger.info(response.body.data)
    })

    it("should reject login if request is invalid", async () => {
        const response = await request(web).post("/api/users/login").send({
            username: "",
            password: ""
        })

        expect(response.status).toBe(400)
        expect(response.body.error)
    })
})

describe("POST /api/users/logout", () => {

    beforeEach(async () => {
        await userRegister()
    })

    afterEach(async () => {
        await prismaClient.user.deleteMany()
    })

    it("should success logout", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        logger.info(loginResponse.body.data.token)

        const response = await request(web).post("/api/users/logout").set("Authorization", "Bearer " + loginResponse.body.data.token)

        logger.info(response.body.errors)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
    })

})