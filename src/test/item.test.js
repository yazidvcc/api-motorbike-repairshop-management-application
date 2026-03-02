import request from "supertest"
import { web } from "../application/web"
import { depth } from "../application/depht"
import prismaClient from "../application/database"
import { createItem } from "./test-util"

describe("POST /api/items", () => {


    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success create new item", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })
        
        const response = await request(web).post("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test",
                price: 10000,
                stock: 10
            })

        depth(response.body)

        expect(response.status).toBe(201)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)
    })

    it("should reject if item is already exist", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        await createItem()

        const response = await request(web).post("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test",
                price: 10000,
                stock: 10
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject is request is invalid", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).post("/api/items")
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "oli",
                price: null,
                stock: null
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

})

describe("PUT /api/items/itemId", () => {

    afterEach(async () => {
        await prismaClient.item.deleteMany()
    })

    it("should success update item", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).put(`/api/items/${item.id}`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update",
                price: 10000,
                stock: 10
            })

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test update")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)

    })

    it("should success update item only name", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const item = await createItem()

        const response = await request(web).put(`/api/items/${item.id}`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update"
            })

        depth(response.body)

        expect(response.status).toBe(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toBe("test update")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)
    })

    it("should reject if item is not found", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).put(`/api/items/123`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update"
            })

        depth(response.body)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it("should reject if request is invalid", async () => {
        const loginResponse = await request(web).post("/api/users/login").send({
            username: "test",
            password: "test"
        })

        const response = await request(web).put(`/api/items/123`)
            .set("Authorization", "Bearer " + loginResponse.body.data.token)
            .set("Content-Type", "application/json")
            .send({
                name: "test update",
                price: null,
                stock: null
            })

        depth(response.body)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})
